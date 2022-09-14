<template>
  <q-page class="bg-white q-pa-sm">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 text-center q-pl-none">卡密登记</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-form ref="kmjhDataRef">
      <q-input
        outlined
        bottom-slots
        v-model="kmjhData.pkl_card_secret"
        dense
        @clear="clearCard"
        :disable="cardSecretData.package ? true : false"
        clearable
        class="q-pb-none q-mb-lg full-width"
        label="请输入卡密"
        :rules="[(val) => /^\d+$/.test(val) || '请输入正确的卡密']"
      >

      </q-input>

      <q-input
        outlined
        bottom-slots
        v-model="member.mem_memberMobile"
        dense
        class="q-pb-none q-mb-lg full-width"
        :disable="cardSecretData.package ? false : true"
        label="请输入手机号"
        lazy-rules
        :rules="[(val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '填写手机号']"
      >
      </q-input>
      <q-input
        outlined
        bottom-slots
        v-model="member.mem_memberName"
        :disable="cardSecretData.package ? false : true"
        dense
        class="q-pb-none q-mb-lg full-width"
        lazy-rules
        label="请输入昵称"
        :rules="[(val) => !!val || '请输入昵称']"
      >
      </q-input>
    </q-form>
    <!-- 卡密详情 -->
    <q-card flat bordered class="q-mt-lg q-pa-sm" v-if="cardSecretData.package">
      <div class="bg-white ">
        <div class="text-subtitle1">卡内权益</div>
        <q-separator />
        <div class="row q-pa-sm bg-grey-3 text-center q-mt-xs">
          <div class="col">赠送{{ $store.state.member.storeBaseConfig.consume_base_integralUnit }}</div>
          <div class="col">赠送{{ $store.state.member.storeBaseConfig.consume_base_balanceUnit }}</div>
        </div>
        <div
          class="row q-pa-sm  text-center"
          v-if="cardSecretData.package"
          style="border-left:1px solid #d2d2d2;border-bottom:1px solid #d2d2d2;border-right:1px solid #d2d2d2;"
        >
          <div class="col text-grey">
            {{ cardSecretData.package.pkp_give_balance }}
          </div>
          <div class="col text-grey">{{ cardSecretData.package.pkp_give_integral }}</div>
        </div>
      </div>
      <!-- 赠送次数 -->
      <div v-if="cardSecretData.count">
        <div class="q-mb-xs q-mt-md"><q-icon color="primary" name="las la-square-full" size="16px" />赠送次数</div>
        <q-card flat>
          <div>
            <div v-if="cardSecretData.count.length > 0">
              <div class="q-mt-sm" v-for="(item, key) in cardSecretData.count" :key="key">
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>名称：{{ item.grp_name }}</q-item-label>
                      <q-item-label>
                        价格：
                        <span class="text-orange">
                          {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}
                        </span>
                        <span class="text-h6 text-orange text-weight-bold">{{ item.grp_packagePrice }}</span>
                      </q-item-label>
                      <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                        有效期：
                        <q-badge color="red"> 永久有效</q-badge>
                      </q-item-label>
                      <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                        有效期：
                        <q-badge color="red">
                          {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                          至
                          {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                        </q-badge>
                      </q-item-label>
                      <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
                        有效期：
                        <q-badge color="red">
                          领取后{{ item.grp_startTime }}
                          <span v-if="item.grp_endTime == 1">年 </span>
                          <span v-if="item.grp_endTime == 2">季度 </span>
                          <span v-if="item.grp_endTime == 3">月 </span>
                          <span v-if="item.grp_endTime == 4">周 </span>
                          <span v-if="item.grp_endTime == 5">天 </span>内有效
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-expansion-item expand-separator icon="payment" label="详情">
                    <q-list v-if="item.rechargeDetail">
                      <q-item v-for="(i, k) in item.rechargeDetail" :key="k">
                        <q-item-section>
                          <q-item-label>
                            {{ i.grc_goodsName }}
                            {{ i.grc_speName ? '-' + i.grc_speName : '' }}
                            ({{ i.grc_count }})
                          </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                          <q-item-label caption>
                            <span v-if="parseInt(i.grc_limitTime) == 1">无限制</span>
                            <span v-if="parseInt(i.grc_limitTime) == 2">使用限制为{{ i.grc_limitCount }}次/年</span>
                            <span v-if="parseInt(i.grc_limitTime) == 3">使用限制为{{ i.grc_limitCount }}次/季度</span>
                            <span v-if="parseInt(i.grc_limitTime) == 4">使用限制为{{ i.grc_limitCount }}次/月</span>
                            <span v-if="parseInt(i.grc_limitTime) == 5">使用限制为{{ i.grc_limitCount }}次/周</span>
                            <span v-if="parseInt(i.grc_limitTime) == 6">使用限制为{{ i.grc_limitCount }}次/天</span>

                            <q-icon name="las la-archive" color="red" />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-expansion-item>
                </q-list>
              </div>
            </div>
          </div>
        </q-card>
      </div>
      <!-- 赠送计时 -->
      <div v-if="cardSecretData.timing">
        <div class="q-mb-xs q-mt-md"><q-icon color="primary" name="las la-square-full" size="16px" />赠送计时</div>
        <q-card flat>
          <div>
            <div v-if="cardSecretData.timing.length > 0">
              <div class="q-mt-sm" v-for="(item, key) in cardSecretData.timing" :key="key">
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label>名称：{{ item.gtg_name }}</q-item-label>
                      <q-item-label>
                        价格：
                        <span class="text-orange">
                          {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}
                        </span>
                        <span class="text-h6 text-orange text-weight-bold">{{ item.gtg_selling_price }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-expansion-item expand-separator icon="access_time" label="详情">
                    <q-list v-if="item.detail">
                      <q-item v-for="(i, k) in item.detail" :key="k">
                        <q-item-section>
                          <q-item-label>{{ i.tgd_goods_name }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                          <q-item-label caption>({{ i.tgd_time_compute_duration }}分钟) <q-icon name="star" color="yellow"/></q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-expansion-item>
                </q-list>
              </div>
            </div>
          </div>
        </q-card>
      </div>
      <!-- 赠送优惠券 -->
      <div v-if="cardSecretData.coupon">
        <div class="q-mb-xs q-mt-sm"><q-icon color="primary" name="las la-square-full" size="16px" />赠送优惠券</div>
        <q-card flat>
          <div class="">
            <div bordered separator v-if="cardSecretData.coupon.length > 0">
              <div class="q-mt-sm" v-for="(item, key) in cardSecretData.coupon" :key="key">
                <q-list bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-h6">{{ item.cou_title }}</q-item-label>
                      <q-separator class="q-my-sm" />
                      <q-item-label caption lines="3">
                        <q-badge outline color="red" class="q-mx-xs">
                          {{ couponTypeItem[parseInt(item.cou_type)] }}
                        </q-badge>
                      </q-item-label>
                      <q-item-label caption lines="3">
                        <span v-if="parseInt(item.cou_dateType) == 1"
                          >有效期：{{ $q_date.formatDate(item.cou_startTime * 1000, 'YYYY-MM-DD HH:mm:ss') }} 至
                          {{ $q_date.formatDate(item.cou_endTime * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span
                        >

                        <q-badge outline color="teal" class="q-ma-xs" v-else-if="parseInt(item.cou_dateType) == 2">
                          领取后{{ item.cou_startDay }}
                          <span v-if="parseInt(item.cou_endDay) == 1">
                            年
                          </span>
                          <span v-else-if="parseInt(item.cou_endDay) == 2">
                            季
                          </span>
                          <span v-else-if="parseInt(item.cou_endDay) == 3">
                            月
                          </span>
                          <span v-else-if="parseInt(item.cou_endDay) == 4">
                            周
                          </span>
                          <span v-else-if="parseInt(item.cou_endDay) == 5">
                            天
                          </span>
                          内有效
                        </q-badge>
                      </q-item-label>
                      <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 1">
                        <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_rebate * 0.1 }} </span>
                        <span class="text-caption">折</span>
                      </q-item-label>
                      <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 2">
                        <span class="text-caption"> 满 </span>
                        <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ item.cou_fill }}</span>
                        <span class="text-caption"> 减 </span>
                        <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ item.cou_minus }} </span>
                      </q-item-label>
                      <q-item-label caption lines="3" v-if="[3, 4, 5].indexOf(parseInt(item.cou_type))">
                        {{ item.cou_extra }}
                      </q-item-label>
                      <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 6">
                        兑换 <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_give_integral }} </span>
                        {{ $store.state.member.storeBaseConfig.consume_base_integralUnit }}
                      </q-item-label>
                      <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 7">
                        兑换 <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_give_balance }} </span>
                        {{ $store.state.member.storeBaseConfig.consume_base_balanceUnit }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </q-card>
    <!-- 底部按钮 -->
    <q-footer class="text-black bg-white" bordered>
      <q-toolbar class="text-center row justify-around">
        <q-btn
          rounded
          unelevated
          color="green"
          label="验证"
          :disable="addButtonDisabled || cardSecretData.package ? true : false"
          class="col-4"
          @click="getList"
        />
        <q-btn rounded unelevated color="primary" label="登记" :disable="cardSecretData.package ? false : true" class="col-4" @click="setData()" />
      </q-toolbar>
    </q-footer>
  </q-page>
</template>
<script>

export default {
  name: 'CardSecret',
  components: {},
  data () {
    return {
      showCard: false,
      addButtonDisabled: false,
      invoiceData: [],
      cardSecret: '',
      cardSecretData: {},
      kmjhData: {
        pkl_card_secret: '',
        memberId: ''
      },
      member: {
        mem_memberMobile: '',
        mem_memberName: ''
      },
      headerLocal: {},
      couponTypeItem: this.$store.state.member.typeItem,
      couponPropertyItem: this.$store.state.member.propertyItem

    }
  },
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
    } else if (!this.$store.state.oauth && !this.$store.state.oauth.qw_external_userid) {
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
  mounted () {},
  computed: {},
  methods: {
    clearCard () {
      this.cardSecret = ''
      this.cardSecretData = {}
    },
    getList () {
      this.$refs.kmjhDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            cardSecret: this.kmjhData.pkl_card_secret,
            do: 'verifyCardSecret'
          }
          this.$store
            .dispatch('member/postApi', obj)
            .then((res) => {
              if (res.code == 200) {
                this.cardSecretData = res.data ? res.data : []
              } else {
                this.$q.notify({
                  message: '查找失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.kmjhData.pkl_card_secret = ''
              }
              this.cardSecretData = res.data ? res.data : []
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    setData () {
      this.$refs.kmjhDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.kmjhData,
            ...this.member,
            do: 'cardSecretReg',
            qywx_openid: this.$store.state.oauth.qw_external_userid
          }
          this.$store
            .dispatch('member/postApi', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '激活成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.push({ name: 'home' })
              } else {
                this.$q.notify({
                  message: '激活失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
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
        }
      })
    }

  }
}
</script>
