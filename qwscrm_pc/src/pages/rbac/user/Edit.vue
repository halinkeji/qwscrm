<template>
  <q-dialog @hide="closePopup" v-model="accountPopupStatus">
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
      flat
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md row q-pa-xs">
          <div class="text-h6">{{ operatingText }}用户</div>
        </div>

        <div class="col-shrink q-px-sm full-height">
          <q-form ref="userDataRef">
            <q-select
              outlined
              v-model="user_data.status"
              map-options
              emit-value
              dense
              option-label="label"
              option-value="value"
              :options="[
                { value: 1, label: '启用' },
                { value: 0, label: '禁用' },
                { value: -1, label: '停用' },
              ]"
              label="账号状态"
              :rules="[(val) => !!val || '请选择账号状态']"
            />

            <q-input outlined dense v-model="user_data.username" label="用户名称" lazy-rules :rules="[(val) => !!val || '用户名称为必填项']" />

            <q-input
              outlined
              dense
              v-model="user_data.mobile"
              label="手机号"
              lazy-rules
              :rules="[(val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '电话号不正确']"
            />

            <q-input outlined dense v-model="user_data.password" label="密码" type="password" lazy-rules :error="confirmPassword" :error-message="'密码二次输入有误'" />
            <q-input outlined dense v-model="user_data.confirmPassword" label="确认密码" type="password" lazy-rules :error="confirmPassword" :error-message="'密码二次输入有误'" />
          </q-form>
        </div>

        <div class="col-shrink bg-white q-pb-md  q-gutter-sm text-center">
          <q-btn label="保存" unelevated :disable="clickBtnDisabled" @click="saveChanges" color="primary" class="q-px-xl" />
          <q-btn label="关闭" v-close-popup color="grey" unelevated class="q-px-xl" />
        </div>

      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  components: {},
  props: ['storeId', 'applyId'],
  data () {
    return {
      user_data: {
        username: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        status: 1,
        id: 0
      },
      statusList: [
        {
          code: 1,
          name: '启用'
        },
        {
          code: 0,
          name: '禁用'
        },
        {
          code: -1,
          name: '停用'
        }
      ],
      operatingText: '新增',
      accountPopupStatus: false,
      selectModel: 'select',
      clickBtnDisabled: false,
      dialogWidth: '500px'
    }
  },
  created () {},
  computed: {
    confirmPassword () {
      if (this.user_data.password != this.user_data.confirmPassword) {
        return true
      }
      return false
    }
  },
  mounted () {},
  methods: {
    init (id) {
      if (this.$q.screen.width) {
        this.dialogWidth = parseInt(this.$q.screen.width - this.$q.screen.width * 0.7) + 'px'
      }
      this.accountPopupStatus = true
      this.getUserInfo(id)
    },
    getUserInfo (id) {
      if (id) {
        this.operatingText = '修改'
        this.$store
          .dispatch('user/getUserInfo', parseInt(id))
          .then((res) => {
            if (res.code == 200 && res.data) {
              this.user_data = res.data
            } else {
              this.$q.notify({
                message: '失败',
                caption: '信息获取异常！',
                icon: 'ion-close-circle-outline',
                color: 'red',
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
      }
    },
    saveChanges () {
      this.$refs.userDataRef.validate().then((success) => {
        if (success) {
          if (this.user_data.confirmPassword != this.user_data.password) {
            this.$q.notify({
              message: '失败',
              caption: '两次输入的的密码不一致！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          const payload = {
            ...this.user_data,
            set_config: {
              store_id: this.storeId,
              lib_id: this.storeId,
              apply_id: this.applyId
            }
          }

          this.clickBtnDisabled = true

          this.$store
            .dispatch('user/setUserInfo', payload)
            .then((res) => {
              if (res.code == 200) {
                if (!res.data.id) {
                  setTimeout(() => {
                    this.$q.notify({
                      message: '失败',
                      caption: res.data.message,
                      icon: 'ion-close-circle-outline',
                      color: 'red',
                      timeout: 500,
                      position: 'top-right'
                    })
                  }, 100)

                  return false
                }

                this.$q.notify({
                  message: '成功',
                  caption: '用户信息' + this.operatingText + '成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.clickBtnDisabled = false
                    this.accountPopupStatus = false
                    this.closePopup()
                  }, 500)
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.clickBtnDisabled = false
                }, 500)
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
              setTimeout(() => {
                this.clickBtnDisabled = false
              }, 500)
            })
        }
      })
    },
    resetData () {
      this.user_data = {
        username: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        status: '',
        id: 0
      }
    },
    closePopup () {
      this.$emit('saveChanges')
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
