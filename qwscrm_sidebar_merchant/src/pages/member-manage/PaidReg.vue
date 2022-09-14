<template>
  <div class="q-pa-sm fit">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
      <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
      选择开卡套餐
    </div>

      <div class="row q-col-gutter-xs">

        <div class="col-12 " v-for="(item, key) in packageList" :key="key">
          <q-card flat bordered @click="checkPackage(item)" v-if="parseInt(item.pp_type) == 1" class="cursor-pointer ">
            <q-item>
              <q-item-section>
                <q-item-label>{{ item.pp_name }} </q-item-label>
                <q-item-label caption lines="2" class="q-gutter-xs">
                  <q-badge color="blue" v-if="item.pp_give_balance">
                    {{ $q.localStorage.getItem('onlystore_system_local').storeBaseConfig.consume_base_balanceUnit }}
                  </q-badge>
                  <q-badge color="purple" v-if="item.pp_give_integral">
                    {{ $q.localStorage.getItem('onlystore_system_local').storeBaseConfig.consume_base_integralUnit }}
                  </q-badge>
                  <q-badge color="pink" v-if="item.coupon && item.coupon.length > 0">
                    卡券
                  </q-badge>
                  <q-badge color="indigo" v-if="item.count && item.count.length > 0">
                    次卡
                  </q-badge>
                  <q-badge color="teal" v-if="item.timing && item.timing.length > 0">
                    时卡
                  </q-badge>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <span class="text-h6 text-deep-orange" v-if="parseInt(item.pp_type) == 2"
                  >{{ $q.localStorage.getItem('onlystore_system_local').storeBaseConfig.consume_base_moneySymbol }} {{ item.pp_selling_price }}</span
                >
                <span v-else>
                  免费
                </span>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>
                  <q-icon size="md" v-if="item.id == packageInfo.id" name="las la-check-circle" color="primary" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-card-section class="q-pa-sm">
              <q-item class="bordered-orange-color q-mt-sm" v-if="item.pp_give_balance && item.pp_give_balance > 0">
                <q-item-section class="q-pa-xs">
                  <q-item-label class="text-subtitle1 text-red text-weight-bold">{{ item.pp_give_balance }} </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label caption class="text-primary">
                    <q-badge color="blue">
                      {{ $q.localStorage.getItem('onlystore_system_local').storeBaseConfig.consume_base_balanceUnit }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="bordered-orange-color q-mt-sm" v-if="item.pp_give_integral && item.pp_give_integral > 0">
                <q-item-section class="q-pa-xs">
                  <q-item-label class="text-subtitle1 text-red text-weight-bold">{{ item.pp_give_integral }} </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label caption class="text-primary ">
                    <q-badge color="purple">
                      {{ $q.localStorage.getItem('onlystore_system_local').storeBaseConfig.consume_base_integralUnit }}
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-list v-if="item.coupon && item.coupon.length > 0">
                <q-item class="bordered-orange-color q-mt-sm" :key="k + '-coupon'" v-for="(i, k) in item.coupon">
                  <q-item-section class="q-pa-xs">
                    <q-item-label class="text-subtitle1 text-red text-weight-bold">{{ i.cou_title }}</q-item-label>

                    <q-item-label v-if="i.cou_dateType == 1">
                      {{
                        $q_date.formatDate(i.cou_startTime * 1000, 'YYYY-MM-DD') +
                          ' 至 ' +
                          $q_date.formatDate(i.cou_endTime * 1000, 'YYYY-MM-DD') +
                          ' 有效'
                      }}
                    </q-item-label>
                    <q-item-label v-else-if="i.cou_dateType == 2">
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
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-item-label caption class="text-primary">
                      <q-badge color="pink" v-if="parseInt(i.cou_type) == 1">
                        折 扣 券
                      </q-badge>
                      <q-badge color="pink" v-if="parseInt(i.cou_type) == 2">
                        代 金 券
                      </q-badge>
                      <q-badge color="pink" v-if="parseInt(i.cou_type) == 3">
                        礼 品 券
                      </q-badge>
                      <q-badge color="pink" v-if="parseInt(i.cou_type) == 4">
                        团 购 券
                      </q-badge>
                      <q-badge color="pink" v-if="parseInt(i.cou_type) == 5">
                        优 惠 券
                      </q-badge>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-list v-if="item.count && item.count.length > 0">
                <q-item class="bordered-orange-color q-mt-sm" :key="k + '-count'" v-for="(i, k) in item.count">
                  <q-item-section class="q-pa-xs">
                    <q-item-label class="text-subtitle1 text-red text-weight-bold">{{ i.grp_name }}</q-item-label>
                    <q-item-label v-if="parseInt(i.grp_timeType) == 1">
                      永久有效
                    </q-item-label>
                    <q-item-label v-else-if="parseInt(i.grp_timeType) == 3">
                      {{ $q_date.formatDate(i.grp_startTime * 1000, 'YYYY-MM-DD HH:mm:ss') }}至{{
                        $q_date.formatDate(i.grp_endTime * 1000, 'YYYY-MM-DD HH:mm:ss')
                      }}
                    </q-item-label>
                    <q-item-label v-else-if="parseInt(i.grp_timeType) == 2">
                      领取后{{ i.grp_startTime }}<span v-if="parseInt(i.grp_endTime) == 1">年 </span
                      ><span v-else-if="parseInt(i.grp_endTime) == 2">季度 </span><span v-else-if="parseInt(i.grp_endTime) == 3">月 </span>
                      <span v-else-if="parseInt(i.grp_endTime) == 4">周 </span>
                      <span v-else-if="parseInt(i.grp_endTime) == 5">天 </span>内有效
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-badge color="red">
                      计 次 项
                    </q-badge>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-list v-if="item.timing && item.timing.length > 0">
                <q-item class="bordered-orange-color q-mt-sm" :key="k + '-tiem'" v-for="(i, k) in item.timing">
                  <q-item-section class="q-pa-xs">
                    <q-item-label class="text-subtitle1 text-red text-weight-bold">{{ i.gtg_name }}</q-item-label>
                    <q-item-label v-if="parseInt(i.gtg_time_type) == 1">
                      永久有效
                    </q-item-label>
                    <q-item-label v-else-if="parseInt(i.gtg_time_type) == 3">
                      {{ $q_date.formatDate(i.gtg_time_start * 1000, 'YYYY-MM-DD HH:mm:ss') }}至{{
                        $q_date.formatDate(i.gtg_time_end * 1000, 'YYYY-MM-DD HH:mm:ss')
                      }}
                    </q-item-label>
                    <q-item-label v-else-if="parseInt(i.gtg_time_type) == 2">
                      领取后{{ i.gtg_time_start }}<span v-if="parseInt(i.grp_endTime) == 1">年 </span
                      ><span v-else-if="parseInt(i.gtg_time_end) == 2">季度 </span><span v-else-if="parseInt(i.gtg_time_end) == 3">月 </span>
                      <span v-else-if="parseInt(i.gtg_time_end) == 4">周 </span>
                      <span v-else-if="parseInt(i.gtg_time_end) == 5">天 </span>内有效
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-badge color="info">
                      计 时 项
                    </q-badge>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

    <hl-checkout-plugin
      @paySuccessCallBack="paySuccessCallBack"
      @closeCheckoutPopup="checkoutPageReceive = false"
      ref="openCheckoutCounterPage"
      v-if="checkoutPageReceive"
    ></hl-checkout-plugin>
  </div>
</template>
<script>
export default {
  name: 'paidreg',
  components: {},
  props: ['memberInfo'],
  data () {
    return {
      packageData: {
        pp_name: ''
      },
      packageList: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      packageInfo: {},
      packageId: 0,
      detailStatus: false,
      packageDetail: {},
      checkoutPageReceive: false
    }
  },
  created () {
    this.getList()
  },
  mounted () {},
  computed: {},
  methods: {
    getNowda (item) {
      if (item.coupon && item.coupon.length > 0) {
        return 'coupon'
      } else if (item.count && item.count.length > 0) {
        return 'countCard'
      }
    },

    getList () {
      const params = {
        status: 1,
        do: ''
      }
      this.$store
        .dispatch('member/postApi', params)
        .then((res) => {
          if (res.code == 200) {
            this.packageList = res.data ? res.data : []
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

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    checkPackage (value) {
      this.packageInfo = value

      if (value && parseInt(value.pp_type) == 1) {
        this.$emit('getPackage', value, null)
      } else if (value && parseInt(value.pp_type) == 2 && this.formatAmount(value.pp_selling_price) > 0) {
        this.$emit('asynReg', 2)
      }
    },

    openDetail (value) {
      this.detailStatus = true
      this.packageDetail = value
    },

    openCheckoutCounterPage () {
      const amountsPayable = this.packageInfo.pp_selling_price
      this.checkoutPageReceive = true
      // const buffer_data = _.map(this.shoppingCartsList, 'id')
      const return_param = {
        sc_consumeType: 'paidreg',
        paidRegPackageId: this.packageInfo.id
      }

      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('paidreg', amountsPayable, 0, return_param)
      })
    },

    paySuccessCallBack (payInfo) {
      this.$q.notify({
        color: 'green',
        message: '操作成功',
        caption: '收银成功',
        icon: 'ion-checkmark-circle-outline',
        position: 'top-right',
        timeout: 500
      })
      this.$emit('paidregSuccess', this.packageInfo, payInfo)
    }
  }
}
</script>
<style scoped>
.bordered-primary-color {
  border: 1px solid #027be3;
  border-color: #027be3;
}
.bordered-grey-color {
  border: 1px solid #b3b4b5;
  border-color: #b3b4b5;
}
.bordered-orange-color {
  border: 1px solid #b3b4b5;
  border-color: #b3b4b5;
}
</style>
