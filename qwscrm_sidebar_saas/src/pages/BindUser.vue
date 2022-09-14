<template>
  <q-layout view="lHr lpR lFr">
    <q-header>
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">激活用户</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="bg-color-EAE full-width column no-wrap">
        <q-form ref="regForm">
          <q-card flat bordered>
            <q-card-section>
              <q-input outlined dense v-model="regMobile" clearable @input="changePhone" :rules="[(val) => !!val || '请输入用户手机号']" label="用户手机号" />
            </q-card-section>

            <q-card-section>
              <q-input outlined dense v-model="smsCode" :rules="[(val) => !!val || '请输入验证码']" label="验证码">
                <template v-slot:after>
                  <q-btn @click="sendSmsCode" unelevated color="primary" :disable="!(bindUserType > 0 && !verifyBtnStatus)" :label="smsSendStatus" />
                </template>
              </q-input>
            </q-card-section>
          </q-card>
        </q-form>

        <q-card flat bordered class="q-mt-sm" v-if="bindUserType == 3">
          <q-card-section class="q-pa-sm">
            <q-list bordered separator class="q-mt-sm" :key="key + 'site'" v-for="(item, key) in siteData">
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ item.client_name }}</q-item-label>
                  <q-item-label caption>站点名称</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.redirect_uri }}</q-item-label>
                  <q-item-label caption>访问网址</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-sm" v-if="bindUserType == 2">
          <q-card-section class="q-pb-none">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6"><q-icon name="home_work" color="primary" /> {{ storeInfo.name }}</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-sm">
            <q-list bordered separator>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ storeInfo.apply }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>行业类型</q-item-label>
                  <q-item-label caption>{{ storeInfo.trade }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>开户时间：{{ date.formatDate(storeInfo.created_at * 1000, 'YYYY年MM月DD日 HH:mm:ss') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>授权到期时间：{{ date.formatDate(storeInfo.end_time * 1000, 'YYYY年MM月DD日 HH:mm:ss') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>{{ storeInfo.son_num }}</q-item-label>
                  <q-item-label caption>可创建门店数</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ storeInfo.account_num }}</q-item-label>
                  <q-item-label caption>可创建操作员数</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <q-footer class="bg-white">
          <div class="text-caption text-center text-grey">请输入用户手机号进行注册</div>
          <q-toolbar>
            <q-toolbar-title>
              <q-btn unelevated rounded class="full-width" :disable="!bindUserType > 0" @click="bindUserRelation" color="primary" label="激活" />
            </q-toolbar-title>
          </q-toolbar>
        </q-footer>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
const md5 = require('md5')
export default {
  name: 'BindUser',
  components: {},
  data () {
    return {
      regMobile: '',

      smsCode: '',
      siteData: [],
      storeInfo: {},
      verifyBtnStatus: false,
      smsRecordCode: '',
      smsSendStatus: '获取验证码',
      bindUserType: 0,
      countDownNumber: 60
    }
  },
  computed: {},
  mounted () {},
  created () {
    this.date = date
    if (!this.$route.query.contactUserId) {
      this.openCloseDialog()
    }
  },
  methods: {
    openCloseDialog () {
      this.$q
        .dialog({
          title: '错误',
          message: '激活邀请失效！',
          persistent: true
        })
        .onOk(() => {
          this.closeCurrentWindow()
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
    },
    closeCurrentWindow () {
      setTimeout(function () {
        document.addEventListener(
          'WeixinJSBridgeReady',
          function () {
            this.WeixinJSBridge.call('closeWindow') // 安卓手机关闭代码
          },
          false
        )
        this.WeixinJSBridge.call('closeWindow') // 苹果手机关闭代码
      }, 300)
      // 以下是普通浏览器关闭代码
      window.opener = null
      window.open('about:blank', '_top').close()
    },
    bindUserRelation () {
      this.$refs.regForm.validate().then((success) => {
        if (success && this.$route.query.contactUserId) {
          if (md5(this.smsCode) != this.smsRecordCode) {
            this.$q.notify({
              message: '失败',
              caption: '验证码错误！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 100,
              position: 'center'
            })

            return false
          }

          const obj = {
            regMobile: this.regMobile,
            qw_external_userid: this.$route.query.contactUserId
          }
          this.$store
            .dispatch('contact/bindUserRelation', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '激活成功！',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.push({
                  name: 'bindSuccess'
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
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
      })
    },
    changePhone () {
      this.$nextTick(() => {
        if (this.regMobile.length == 11) {
          this.verifyUserPhone()
        } else {
          this.bindUserType = 0
          this.siteData = []
        }
      })
    },
    verifyUserPhone () {
      const obj = {
        regMobile: this.regMobile
      }
      this.$store
        .dispatch('contact/verifyUserPhone', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '手机号验证成功，请仔细核对站点信息！',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            const data = res.data

            if (data && parseInt(data.type) == 3) {
              this.bindUserType = parseInt(data.type)
              this.siteData = data.siteInfoList
            } else if (data && parseInt(data.type) == 2) {
              this.bindUserType = parseInt(data.type)
              this.storeInfo = data.storeInfo
            }
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
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
    },
    sendSmsCode () {
      const obj = {
        regPhone: this.regMobile
      }
      this.$store
        .dispatch('contact/sendSms', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.smsRecordCode = res.data
            this.verifyBtnStatus = true

            this.clockDown = window.setInterval(() => {
              this.countDownNumber--
              this.smsSendStatus = this.countDownNumber + '秒后重新发送'
              if (this.countDownNumber < 0) {
                window.clearInterval(this.clockDown)
                this.smsSendStatus = '重新发送验证码'
                this.countDownNumber = 60
                this.verifyBtnStatus = false
              }
            }, 1000)
          } else {
            this.$q.notify({
              message: '失败',
              caption: '发送验证码失败！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'center'
            })
          }
        })
        .catch((error) => {})
    },
    plusXing (str, frontLen, endLen) {
      const len = str.length - frontLen - endLen
      let xing = ''
      for (let i = 0; i < len; i++) {
        xing += '*'
      }
      return str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
    }
  }
}
</script>
<style lang="scss">
.q-menu-list-width {
  min-width: 100px;
}
.q-item__section--main ~ .q-item__section--side {
  align-items: flex-end;
  padding-right: 0;
  padding-left: 0px;
}
.q-btn--fab .q-btn__wrapper {
  padding: 6px;
  min-height: 40px;
  min-width: 40px;
}
</style>
