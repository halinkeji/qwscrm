<template>
  <q-dialog @hide="hideNowPage" v-model="userInfoDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
      class="q-pa-sm fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md text-h6 q-mb-xs">用户信息</div>

        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="userDataRef" class="row">
              <div class="col-12">
                <q-input outlined dense v-model="userInfo.email" label="邮箱" lazy-rules />
              </div>
              <div class="col-12 q-mt-sm">
                <q-input outlined dense v-model="userInfo.name" label="姓名" lazy-rules />
              </div>

              <div class="col-md-12 q-mt-sm text-left ">
                <q-img
                  :src="userInfo.avatar"
                  width="100px"
                  height="100px"
                >
                  <template v-if="!userInfo.avatar">
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                      <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                    </div>
                  </template>
                  <q-btn
                    round
                    size="md"
                    color="red"
                    v-else
                    :ripple="false"
                    flat
                    class="absolute-top-right"
                    icon="delete_forever"
                    @click="userInfo.avatar = ''"
                  ></q-btn>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                      <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                    </div>
                  </template>
                </q-img>
                <div class="q-mt-sm text-grey-8">用户头像</div>
                <q-btn unelevated color="primary" @click="clickImage()" label="上传图片" />
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-py-sm text-center q-gutter-sm q-mt-xs">
          <q-btn unelevated color="primary" class="q-px-xl" @click="saveBindData" label="保存" />
          <q-btn unelevated color="grey" @click="userInfoDialogStatus = false" class="q-px-xl" label="关闭" />
        </div>
      </div>
      <upload-img v-if="uploadImgStatus" @imageData="getImageData" :multiple="multiple" @closeUpload="closeUpload"></upload-img>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  components: {},
  name: 'UserInfo',
  props: {},
  data () {
    return {
      chooseManagerStatus: false,
      userInfoDialogStatus: false,
      userInfo: {
        email: '',
        avatar: '',
        name: ''
      },
      uploadImgStatus: false,
      multiple: false
    }
  },
  computed: {},
  created () {},
  watch: {},
  mounted () {},
  methods: {
    init (userId) {
      this.userInfoDialogStatus = true
      if (userId && parseInt(userId) > 0) {
        this.user_id = userId
        this.getUserInfo()
      }
    },
    hideNowPage () {
      this.$emit('closeDialog')
    },
    getUserInfo () {
      const payload = {
        relation_user_id: parseInt(this.user_id)
      }

      this.$store
        .dispatch('user/getUserItem', payload)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.userInfo = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    saveBindData () {
      const payload = {
        relation_user_id: parseInt(this.user_id),
        ...this.userInfo
      }

      this.$store
        .dispatch('user/setUserItem', payload)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.userInfoDialogStatus = false
            this.$q.notify({
              message: '成功',
              caption: '设置成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    getImageData (v) {
      this.uploadImgStatus = false
      const that = this
      that.userInfo.avatar = v[0].base_url
    },
    clickImage () {
      this.multiple = false
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
    closeUpload (v) {
      this.uploadImgStatus = false
    }
  }
}
</script>
