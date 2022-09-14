<template>
  <q-page class="bg-white">
    <!-- 顶部导航 -->
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left"  @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs"> {{ operatingText }}会员 </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div class="q-pa-sm">
      <q-form ref="memberDataRef">
        <div class=" bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
          <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
          基础信息
        </div>
        <div class="row">
          <div class="row q-mb-lg col-12">
            <div class="col-8">
              <q-input
                outlined
                bottom-slots
                v-model="member.mem_memberCardNum"
                dense
                class="q-pb-none full-width"
                label="请输入卡号"
                lazy-rules
                :rules="[(val) => !!val || '请输入卡号']"
              >
              </q-input>
            </div>
            <div class="col-4">
              <q-btn unelevated color="warning" label="一键生成卡号" @click="oneKeyCoding()" class="full-width full-height" />
            </div>
          </div>
          <q-input
            outlined
            bottom-slots
            v-model="member.mem_memberMobile"
            dense
            class="q-pb-none q-mb-lg full-width"
            label="请输入手机号"
            lazy-rules
            :rules="[(val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '填写手机号']"
          >
          </q-input>
          <q-input
            outlined
            bottom-slots
            v-model="member.mem_memberName"
            dense
            class="q-pb-none q-mb-lg full-width"
            lazy-rules
            label="请输入昵称"
            :rules="[(val) => !!val || '请输入昵称']"
          >
          </q-input>

          <q-select
            outlined
            class="q-pb-none q-mb-lg full-width "
            dense
            v-model="member.membercardlevel_id"
            :options="memberLevelData"
            label="请选择等级"
            option-label="mcl_level_name"
            option-value="id"
            map-options
            emit-value
            lazy-rules
            :rules="[(val) => !!val || '请选择等级']"
          />
          <q-input outlined bottom-slots v-model="member.mem_memberRealName" dense class="q-pb-none q-mb-lg full-width" label="请输入真实姓名">
          </q-input>
          <q-input outlined bottom-slots v-model="member.mem_memberWechat" dense class="q-pb-none q-mb-lg full-width" label="请输入微信号"> </q-input>
          <q-input
            outlined
            bottom-slots
            v-model="member.mem_memberIdentityNum"
            dense
            class="q-pb-none q-mb-lg full-width"
            label="请输入身份证号"
            :error="cardIdVerify"
            :error-message="'身份证号格式不正确'"
          >
          </q-input>
          <q-select
            outlined
            class="q-pb-none q-mb-lg full-width"
            dense
            v-model="member.mem_memberSex"
            :options="sexOptions"
            label="选择性别"
            option-label="label"
            map-options
            emit-value
          />
          <!-- <q-select
            outlined
            class="q-pb-none q-mb-lg full-width"
            dense
            v-model="member.mem_memberBirthdayType"
            :options="birthdayTypeOptions"
            label="生日类型"
            option-label="label"
            map-options
            emit-value
          />
          <q-input v-model="member.birthday" outlined bottom-slots dense type="date" class="q-pb-none q-mb-lg full-width">
            <template v-slot:prepend>
              <q-icon name="lar la-calendar" />
            </template>
          </q-input> -->

          <div class="col-12">
            <hl-address
              :province="member.province"
              :city="member.city"
              :area="member.district"
              @province="provinceupdate"
              @city="cityupdate"
              @area="areaupdate"
            ></hl-address>
          </div>
          <q-input class="q-mt-sm full-width" outlined v-model="member.mem_memberDetailAddress" dense label="详细地址" lazy-rules />
          <q-input
            outlined
            bottom-slots
            v-model="member.mem_memberNote"
            dense
            class="q-pb-none q-my-md full-width"
            rows="3"
            label="备注"
            type="textarea"
          >
          </q-input>
          <div class="row q-mt-sm col-12 items-center">
            <div class="col-3">
              会员头像：
            </div>
            <div class="col-9">
              <hl-upload-image :multiple="true" :limitNumber="1" @imageInfo="getImageInfo" :emptyImage="false" :imageData="imageData" />
            </div>
          </div>
        </div>
        <select-membertag @getMembertag="getMembertag" :memberId="member.id" class="q-mb-sm"> </select-membertag>

        <paidreg-model ref="paidregModelRef" @getPackage="getPaidRegPackage" @asynReg="hideSubmit" @paidregSuccess="paidregSuccess" />
      </q-form>
    </div>

    <q-footer  class="text-black bg-white" bordered reveal>
      <q-toolbar class="q-pa-none bg-white footer-box q-my-xs q-px-lg">
        <q-btn label="提交" v-if="!paidRegSubmitStatus" rounded unelevated @click="addMemberData" color="primary" class="full-width" />
        <q-btn label="支付" v-if="paidRegSubmitStatus" rounded unelevated @click="payPaidregSubmit" color="warning" class="full-width" />
      </q-toolbar>
    </q-footer>
  </q-page>
</template>
<script>
import SelectMembertag from '../member-tag/SelectMembertag.vue'
import paidregModel from './PaidReg.vue'
export default {
  name: 'AddMember',
  components: {
    SelectMembertag,
    paidregModel
  },
  data () {
    return {
      operatingText: '会员登记',
      addButtonDisabled: false,
      member: {
        mem_memberCardNum: '',
        mem_memberMobile: '',
        mem_memberName: '',
        membercardlevel_id: '',
        mem_memberRealName: '',
        mem_memberWechat: '',
        mem_memberIdentityNum: '',
        mem_memberSex: '',
        mem_memberBirthdayType: '1',
        birthday: '',
        mem_memberNote: '',
        mem_memberPicture: '',
        mem_memberStatus: '1'
      },
      memberLevelData: [],
      imageData: {},
      sexOptions: [
        { label: '男', value: '1' },
        { label: '女', value: '2' },
        { label: '未知', value: '3' }
      ],
      birthdayTypeOptions: [
        { label: '公历', value: '1' },
        { label: '农历', value: '2' }
      ],
      memberTagData: [],
      nextDialogStatus: false,
      paidRegSubmitStatus: false,
      paidregPackageInfo: false

    }
  },
  mounted () {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.$q.notify({
        message: '错误',
        caption: '当前客户已激活会员！',
        icon: 'ion-close-circle-outline',
        color: 'red',
        timeout: 500,
        position: 'top-right'
      })
      this.$router.push({ name: 'home' })
      return false
    } else if (this.$store.state.oauth && this.$store.state.oauth.qw_external_userid) {
      this.getMemberLevel()
    } else {
      this.$q.notify({
        message: '错误',
        caption: '请重新登录！',
        icon: 'ion-close-circle-outline',
        color: 'red',
        timeout: 500,
        position: 'top-right'
      })
      this.$router.push({ name: 'home' })
      return false
    }
  },
  computed: {
    cardIdVerify () {
      if (
        this.member.mem_memberIdentityNum &&
        !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.member.mem_memberIdentityNum)
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    getMemberLevel () {
      this.$store
        .dispatch('member/postApi', { do: 'getLevelData' })
        .then((res) => {
          if (res.code == 200) {
            this.memberLevelData = res.data ? res.data : []
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
        .catch((err) => {
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

    addMemberData () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          const timestr = this.birthday
          if (timestr) {
            const arr = timestr.split('-')
            this.member.mem_memberBirthdayYear = arr[0]
            this.member.mem_memberBirthdayMonth = arr[1]
            this.member.mem_memberBirthdayDay = arr[2]
          }

          const obj = {
            ...this.member,
            memberTagData: this.memberTagData,
            paidregPayInfo: this.paidregPayInfo,
            do: 'saveMemberInfo',
            qywx_openid: this.$store.state.oauth.qw_external_userid
          }
          this.$store
            .dispatch('member/postApi', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '会员' + this.operatingText + '成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.$router.push({ name: 'home' })
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
      })
    },
    updateProxy () {
      this.proxyDate = this.member.birthday
    },
    save () {
      this.member.birthday = this.proxyDate
    },
    // 一键生成卡号
    oneKeyCoding () {
      this.member.mem_memberCardNum = String(new Date().getTime())
    },
    provinceupdate (a) {
      this.member.province = a.value
      this.member.province_id = a.code
    },
    cityupdate (a) {
      this.member.city = a.value
      this.member.city_id = a.code
    },
    areaupdate (a) {
      this.member.district = a.value
      this.member.district_id = a.code
    },
    getImageInfo (info, expand) {
      if (info && info.length) {
        this.member.mem_memberPicture = info[0].url
      } else {
        this.member.mem_memberPicture = ''
      }
    },
    getMembertag (val) {
      this.memberTagData = val
    },
    hideSubmit () {
      this.paidRegSubmitStatus = true
    },
    getPaidRegPackage (packageInfo) {
      this.paidRegSubmitStatus = false
      this.paidregPayInfo = {
        packageInfo
      }
    },
    payPaidregSubmit () {
      this.$refs.memberDataRef.validate().then((success) => {
        if (success) {
          const timestr = this.birthday
          if (timestr) {
            const endTime = this.$q_date.formatDate(timestr, 'X')
            const date = new Date()
            const startTime = this.$q_date.formatDate(date, 'X')
            if (endTime > startTime) {
              this.$q.notify({
                message: '失败',
                caption: '生日不能大于当前时间,请重新选择',
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
              return false
            }
          }

          this.$nextTick(() => {
            this.$refs.paidregModelRef.openCheckoutCounterPage()
          })
        }
      })
    },
    paidregSuccess (packageInfo, payInfo) {
      this.paidregPayInfo = { packageInfo, payInfo }
      this.$nextTick(() => {
        this.addMemberData()
      })
    }

  }
}
</script>
