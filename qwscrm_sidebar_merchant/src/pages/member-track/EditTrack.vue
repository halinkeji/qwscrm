<template>
  <q-page>
    <q-form ref="trackDataRef">
      <!-- 顶部导航 -->
      <q-header class="bg-white">
        <q-toolbar class="text-grey-8">
          <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
          <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs"> 售后信息 </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <div class="q-pa-sm">
        <q-input
          outlined
          bottom-slots
          v-model="trackData.ptr_title"
          dense
          label="标题"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入标题']"
        />
        <q-input
          outlined
          bottom-slots
          v-model="trackData.ptr_detail"
          dense
          rows="3"
          type="textarea"
          label="添加内容"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '请输入添加内容']"
        >
        </q-input>
        <div>
          <div>上传相关图：最多上传6张</div>
          <div>
            <hl-upload-image
              :limitNumber="6"
              :multiple="true"
              @imageInfo="getImageInfoLoop"
              :emptyImage="false"
              :deleteImg="true"
              :imageData="imageData"
            />
          </div>
        </div>
        <template-components ref="formFieldRef" @saveSuccess="saveData"></template-components>
        <div class="row q-mt-md"></div>

        <q-footer class="text-black bg-white" bordered reveal>
          <q-toolbar class="row q-pa-none bg-white footer-box q-my-xs q-px-lg">
            <q-btn rounded unelevated color="primary" label="保存" :disable="addButtonDisabled" @click="setData()" class="full-width" />
          </q-toolbar>
        </q-footer>
      </div>
    </q-form>
  </q-page>
</template>
<script>
import TemplateComponents from '../TemplateComponents.vue'
export default {
  name: 'addtrack',
  components: { TemplateComponents },
  data () {
    return {
      imageData: [],
      addButtonDisabled: false,
      trackConfigData: {},
      trackData: {
        ptr_member_id: '',
        ptr_title: '',
        ptr_detail: '',
        ptr_loop_image: '',
        prt_form_id: ''
      }
    }
  },
  mounted () {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.trackData.ptr_member_id = this.member_id
        this.trackData.id = this.$route.query.id
        // this.getStatus()
        if (this.trackData.id > 0) {
          this.getItem()
        }
      })
    } else {
      this.$q.notify({
        message: '错误',
        caption: '当前客户未激活会员！',
        icon: 'ion-close-circle-outline',
        color: 'red',
        timeout: 500,
        position: 'top-right'
      })
      this.$router.push({ name: 'home' })
      return false
    }
  },
  computed: {},
  methods: {
    getItem () {
      this.$store
        .dispatch('member/postApi', {
          do: 'getTrackDetail',
          trackId: this.trackData.id,
          member_id: this.member_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.trackData = res.data
            if (this.trackData.ptr_loop_image) {
              this.trackData.ptr_loop_image = res.data.ptr_loop_image.split(',')
              const imageData = []
              this.trackData.ptr_loop_image.forEach((val, key) => {
                this.imageData.push({ path: val })
                imageData.push(val)
              })

              this.trackData.ptr_loop_image = imageData
            } else {
              this.trackData.ptr_loop_image = []
            }
            if (this.trackData && this.trackData.prt_form_id > 0) {
              this.$nextTick(() => {
                this.$refs.formFieldRef.getList({
                  formId: this.trackConfigData.track_config_from,
                  memberId: this.trackData.ptr_member_id,
                  templateId: this.trackData.prt_form_id
                })
              })
            }
          }
        })
        .catch((err) => {})
    },
    setData () {
      this.$refs.trackDataRef.validate().then((success) => {
        if (success) {
          if (this.trackConfigData.track_config_from > 0) {
            this.$nextTick(() => {
              this.$refs.formFieldRef.setData()
            })
            return false
          } else {
            this.saveData()
          }
        }
      })
    },
    saveData (res) {
      this.addButtonDisabled = true
      this.trackData.prt_form_id = res || 0
      const data = {
        ...this.trackData,
        do: 'saveTrack',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: `${this.trackData.id > 0 ? '修改' : '新增'}` + '记录成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })

            this.$router.go(-1)
          } else {
            this.addButtonDisabled = false
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((err) => {
          this.addButtonDisabled = false
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getImageInfoLoop (info) {
      this.trackData.ptr_loop_image = []
      if (info) {
        info.forEach((val, key) => {
          if (key <= 5) {
            this.trackData.ptr_loop_image.push(val.path)
          }
        })
      }
    },
    getStatus () {
      this.$store
        .dispatch('track/getStatus')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.trackConfigData = res.data ? res.data : {}
              this.$nextTick(() => {
                this.$refs.formFieldRef.getList({ formId: this.trackConfigData.track_config_from, memberId: this.trackData.ptr_member_id })
              })
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }
  }
}
</script>
