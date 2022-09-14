<template>
  <q-page>
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left"  @click="$router.go(-1)"/>
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs"> {{ parseInt(recordData.id) > 0 ? '修改' : '新增' }}寄存记录 </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-card flat>
      <q-form ref="addRecordRef">
        <div class="q-pa-sm">
          <div>
            <q-input outlined dense v-model="recordData.phr_name" label="物品名称" :rules="[(val) => (val && val.length > 0) || '请填写名称']" />
          </div>
          <div class="q-mt-xs">
            <q-select
              outlined
              dense
              v-model="recordData.phr_type_id"
              option-value="id"
              option-label="pht_name"
              :options="typeOptions"
              label="请选择分类"
              emit-value
              map-options
              :rules="[(val) => (val && val.length > 0) || '请选择分类']"
            />
          </div>
          <div class="q-mt-xs">
            <q-input
              outlined
              dense
              :disable="quantityDisable"
              v-model="recordData.phr_quantity"
              label="存入数量"
              :rules="[(val) => /^[1-9]\d*$/.test(val) || '存入数量为正整数']"
            />
          </div>
          <div class="q-mt-xs">
            <q-input v-model="recordData.phr_remarks" outlined class="q-mt-xs" type="textarea" label="备注" dense />
          </div>
          <div class="q-mt-md q-px-sm">
            <div>详情图片</div>
            <hl-upload-image
              :limitNumber="5"
              :multiple="true"
              @imageInfo="getImageInfoLoop"
              :emptyImage="false"
              :deleteImg="true"
              :imageData="imageData"
            />
          </div>
        </div>
      </q-form>
    </q-card>

    <q-footer class="text-black bg-white" bordered reveal>
      <q-toolbar class="q-pa-none bg-white footer-box q-my-xs q-px-lg">
        <q-btn rounded unelevated color="primary" @click="setData" label="确定" :disable="addButtonDisabled" class="full-width" />
      </q-toolbar>
    </q-footer>
  </q-page>
</template>
<script>
export default {
  name: 'addRecord',
  components: {},
  data () {
    return {
      addButtonDisabled: false,
      quantityDisable: false,
      cardReaderStatus: true,
      recordData: {
        phr_member_id: '',
        phr_name: '',
        phr_type_id: '',
        phr_quantity: '',
        phr_remarks: '',
        phr_loop_image: []
      },
      typeOptions: [],
      imageData: [],
      hyjcRecirdId: ''
    }
  },
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getTypeList()
        if (parseInt(this.$route.query.recordId) > 0) {
          this.init(this.$route.query.recordId)
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
  mounted () {

  },
  computed: {},
  methods: {

    getTypeList () {
      this.$store
        .dispatch('member/postApi', {
          do: 'getHyjcType',
          member_id: this.member_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.typeOptions = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 查询寄存记录单条记录
    init (id) {
      if (id > 0) {
        this.quantityDisable = true
        this.$store
          .dispatch('member/postApi', {
            do: 'getHyjcRecordDetail',
            hyjcRecirdId: id,
            member_id: this.member_id
          })
          .then((res) => {
            if (res.code == 200) {
              this.recordData = res.data ? res.data : this.recordData

              if (this.recordData.phr_loop_image) {
                this.recordData.phr_loop_image = this.recordData.phr_loop_image.split(',')
                this.recordData.phr_loop_image.forEach((val, key) => {
                  this.imageData.push({ url: `${this.$store.state.member.cdn_url}` + val, path: val })
                })
              } else {
                this.recordData.phr_loop_image = []
              }
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    // 新增或修改寄存记录
    setData () {
      this.$refs.addRecordRef.validate().then((success) => {
        if (success) {
          const data = {
            ...this.recordData,
            do: 'saveHyjcRecord',
            member_id: this.member_id
          }
          this.addButtonDisabled = true
          this.$store
            .dispatch('member/postApi', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.recordData.id > 0 ? '修改' : '新增'}` + '寄存记录成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.go(-1)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    getImageInfoLoop (info) {
      if (info) {
        this.recordData.phr_loop_image = []
        info.forEach((val, key) => {
          this.recordData.phr_loop_image.push(val.path)
        })
      }
    }
  }
}
</script>
