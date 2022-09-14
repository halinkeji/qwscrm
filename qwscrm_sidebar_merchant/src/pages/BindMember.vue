<template>
  <q-layout view="lHr lpR lFr">
    <q-header>
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">激活会员</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="bg-color-EAE full-width column no-wrap">
        <q-form ref="regForm">
          <q-card flat bordered>
            <q-card-section v-if="storeList && storeList.length > 1">
              <q-select
                outlined
                dense
                v-model="StoreId"
                :options="storeList"
                label="选择绑定店铺"
                :rules="[(val) => !!val || '请选择绑定店铺']"
                emit-value
                map-options
                option-value="id"
                option-label="name"
              ></q-select>
            </q-card-section>
            <q-card-section>
              <q-input
                outlined
                dense
                v-model="regMobile"
                clearable
                @input="changePhone"
                :rules="[(val) => !!val || '请输入用户手机号']"
                label="用户手机号"
              />
            </q-card-section>
            <q-card-section v-if="verifySms">
              <q-input outlined dense v-model="smsCode" :rules="[(val) => !!val || '请输入验证码']" label="验证码">
                <template v-slot:after>
                  <q-btn @click="sendSmsCode" unelevated color="primary" :disable="!(bindUserType > 0 && !verifyBtnStatus)" :label="smsSendStatus" />
                </template>
              </q-input>
            </q-card-section>
          </q-card>
        </q-form>
        <q-card flat bordered class="q-mt-sm" v-if="bindUserType > 0">
          <q-card-section class="q-pa-sm">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section class="text-center">
                  <q-item-label>{{ mem_memberCardNum }}</q-item-label>
                  <q-item-label caption>卡号</q-item-label>
                </q-item-section>
                <q-item-section class="text-center">
                  <q-item-label>{{ mem_memberName }}</q-item-label>
                  <q-item-label caption>昵称</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <q-footer class="bg-white">
          <div class="text-caption text-center text-grey">邀请客户开卡</div>
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
import { date } from 'quasar';
const md5 = require('md5');
export default {
  name: 'BindMember',
  components: {},
  data() {
    return {
      regMobile: '',
      StoreId: '',
      smsCode: '',
      siteData: [],
      storeList: [],
      verifyBtnStatus: false,
      smsRecordCode: '',
      smsSendStatus: '获取验证码',
      bindUserType: 0,
      countDownNumber: 60,
      verifySms: false,
      mem_memberCardNum: '',
      mem_memberName: '',
    };
  },
  computed: {},
  mounted() {},
  created() {
    this.date = date;
    if (!this.$route.query.contactUserId) {
      this.openCloseDialog();
    } else {
      this.getSmsCodeStatus();
      this.getStoreList();
    }
  },
  methods: {
    openCloseDialog() {
      this.$q
        .dialog({
          title: '错误',
          message: '激活邀请失效！',
          persistent: true,
        })
        .onOk(() => {
          this.closeCurrentWindow();
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    closeCurrentWindow() {
      setTimeout(function () {
        document.addEventListener(
          'WeixinJSBridgeReady',
          function () {
            this.WeixinJSBridge.call('closeWindow'); // 安卓手机关闭代码
          },
          false
        );
        this.WeixinJSBridge.call('closeWindow'); // 苹果手机关闭代码
      }, 300);
      // 以下是普通浏览器关闭代码
      window.opener = null;
      window.open('about:blank', '_top').close();
    },
    bindUserRelation() {
      this.$refs.regForm.validate().then((success) => {
        if (success && this.$route.query.contactUserId) {
          if (this.verifySms) {
            if (md5(this.smsCode) != this.smsRecordCode) {
              this.$q.notify({
                message: '失败',
                caption: '验证码错误！',
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 100,
                position: 'center',
              });

              return false;
            }
          }

          const obj = {
            mem_memberMobile: this.regMobile,
            mem_memberCardNum: this.mem_memberCardNum,
            qywx_openid: this.$route.query.contactUserId,
            do: 'saveMemberInfo',
            member_id: this.member_id,
            CorpId: this.$route.query.corp_id,
            StoreId: this.StoreId,
          };
          this.$store
            .dispatch('member/postApi', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '激活成功！',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green',
                });
                this.$router.push({
                  name: 'bindSuccess',
                });
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red',
                });
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red',
              });
            });
        }
      });
    },
    changePhone() {
      this.$nextTick(() => {
        if (this.regMobile.length == 11) {
          this.verifyUserPhone();
        } else {
          this.bindUserType = 0;
          this.siteData = [];
        }
      });
    },
    verifyUserPhone() {
      const obj = {
        regPhone: this.regMobile,
        do: 'getMoblieMemberInfo',
        CorpId: this.$route.query.corp_id,
        with: ['clientRelation'],
      };
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            if (res.data.clientRelation && res.data.clientRelation.qywx_openid) {
              this.$q.notify({
                message: '错误',
                caption: '当前会员已激活，不能重复激活',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red',
              });
              this.regMobile = '';
              return false;
            } else {
              this.$q.notify({
                message: '成功',
                caption: '手机号验证成功！',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green',
              });
              this.bindUserType = 1;
              this.member_id = res.data.id;
              this.mem_memberCardNum = res.data.mem_memberCardNum;
              this.mem_memberName = res.data.mem_memberName;
            }
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red',
            });
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          });
        });
    },
    sendSmsCode() {
      const obj = {
        regPhone: this.regMobile,
        do: 'sendSmsPhoneCode',
        CorpId: this.$route.query.corp_id,
      };
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.smsRecordCode = res.data.result;
            this.verifyBtnStatus = true;

            this.clockDown = window.setInterval(() => {
              this.countDownNumber--;
              this.smsSendStatus = this.countDownNumber + '秒后重新发送';
              if (this.countDownNumber < 0) {
                window.clearInterval(this.clockDown);
                this.smsSendStatus = '重新发送验证码';
                this.countDownNumber = 60;
                this.verifyBtnStatus = false;
              }
            }, 1000);
          } else {
            this.$q.notify({
              message: '失败',
              caption: '发送验证码失败！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'center',
            });
          }
        })
        .catch((error) => {});
    },
    getSmsCodeStatus() {
      this.$store
        .dispatch('member/postApi', { do: 'verifySmsCodeStatus', CorpId: this.$route.query.corp_id })
        .then((res) => {
          if (res.code == 200) {
            this.verifySms = res.data && parseInt(res.data.st_templateStatus) == 1 && res.data.st_templateCode ? true : false;
            // this.verifySms = res.data && res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red',
            });
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
          });
        });
    },
    getStoreList() {
      this.$store
        .dispatch('member/postApi', { do: 'getStoreList', CorpId: this.$route.query.corp_id })
        .then((res) => {
          if (res.code == 200) {
            this.storeList = res.data ? res.data : [];
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red',
            });
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
          });
        });
    },
  },
};
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
