<template>
  <q-page>
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1  q-pt-xs"> 订单详情 </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div class="bg-blue">
      <div class="row text-white q-pa-lg" v-if="orderData.jo_state == 1">
        <div class="col text-h6 text-weight-light">待付款</div>
        <div class="col text-right q-pr-xl">
          <q-icon name="las la-credit-card" size="40px" />
        </div>
      </div>
      <div class="row text-white q-pa-lg" v-if="orderData.jo_state == 2 || orderData.jo_state == 3">
        <div class="col text-h6 text-weight-light">
          {{ orderData.jo_type == '1' ? '待发货' : '待打包' }}
        </div>
        <div class="col text-right q-pr-xl">
          <q-icon name="fas fa-people-carry " size="40px" />
        </div>
      </div>
      <div class="row text-white q-pa-lg" v-if="orderData.jo_state == 4">
        <div class="col text-h6 text-weight-light">
          {{ orderData.jo_type == '1' ? '待收货' : '待自取' }}
        </div>
        <div class="col text-right q-pr-xl">
          <q-icon name="fas fa-truck" size="40px" />
        </div>
      </div>
      <div class="row text-white q-pa-lg" v-if="orderData.jo_state == 5">
        <div class="col text-h6 text-weight-light">待评价</div>
        <div class="col text-right q-pr-xl">
          <q-icon name="fas fa-pencil-alt" size="40px" />
        </div>
      </div>
      <div class="row text-white q-pa-lg" v-if="orderData.jo_state == 6">
        <div class="col text-h6 text-weight-light">已完成</div>
        <div class="col text-right q-pr-xl">
          <q-icon name="fas fa-archive" size="40px" />
        </div>
      </div>
      <div class="row text-white q-pa-lg" v-if="orderData.jo_state == 7">
        <div class="col text-h6 text-weight-light">已取消</div>
        <div class="col text-right q-pr-xl">
          <q-icon name="fas fa-paste" size="40px" />
        </div>
      </div>
    </div>

    <!-- 中部信息 -->
    <div class="bg-grey-2">
      <q-item class="bg-white q-mt-xs">
        <q-item-section>
          <q-item-label caption>订单编号：</q-item-label>
        </q-item-section>
        <q-item-section class="text-right">
          <q-item-label>{{ orderData.jo_order }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-list class="bg-white">
        <q-item-label header>订单信息</q-item-label>
        <q-item class="q-mt-xs" :key="'date-' + key" v-for="(item, key) in orderData.orderStatus">
          <q-item-section>
            <q-item-label caption>{{ item.jos_description }}</q-item-label>
            <q-item-label caption>{{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="bg-white q-mt-sm">
        <q-item v-if="parseInt(orderData.jo_type) == 2">
          <q-item-section avatar>
            <q-avatar text-color="blue" icon="las la-map-marker" />
          </q-item-section>

          <q-item-section>
            <q-item-label>自取信息</q-item-label>
            <q-item-label caption lines="2">{{ orderData.jo_name }} - {{ orderData.jo_mobile }}</q-item-label>
            <q-item-label caption lines="2">到店时间：{{ $q_date.formatDate(orderData.jo_pickup_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="parseInt(orderData.jo_type) == 1">
          <q-item-section avatar>
            <q-avatar text-color="blue" icon="las la-map-marker" />
          </q-item-section>

          <q-item-section v-if="orderData.memberAddress && orderData.address_id">
            <q-item-label>配送信息</q-item-label>
            <q-item-label caption lines="2">{{ orderData.memberAddress.ma_name }} - {{ orderData.memberAddress.ma_telephone }}</q-item-label>
            <q-item-label caption lines="2"
              >配送地址: {{ orderData.memberAddress.province }}-{{ orderData.memberAddress.city }}-{{ orderData.memberAddress.district }}
              {{ orderData.memberAddress.ma_address }}</q-item-label
            >
          </q-item-section>
        </q-item>
      </div>

      <q-card flat class="bg-white q-mt-sm" v-if="parseInt(orderData.jo_type) == 1 && logisticsData.jol_courier_number">
        <q-card-section class="text-h6"> 物流信息 </q-card-section>

        <q-item class="q-mt-xs" v-if="logisticsData.jol_courier_number">
          <q-item-section>
            <q-item-label caption>{{ logisticsData.jol_courier_number }}</q-item-label>
            <q-item-label caption>运单号</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-mt-xs" v-if="logisticsData.jol_courier_company">
          <q-item-section>
            <q-item-label caption>{{ logisticsData.jol_courier_company }}</q-item-label>
            <q-item-label caption>快递公司</q-item-label>
          </q-item-section>
        </q-item>

        <q-list class="bg-white" v-if="logisticsData && logisticsData.jol_content">
          <q-item-label header>物流信息</q-item-label>
          <q-item class="q-mt-xs" :key="'wuliu-' + key" v-for="(item, key) in logisticsData.jol_content">
            <q-item-section>
              <q-item-label caption>{{ item.status }}</q-item-label>
              <q-item-label caption>{{ item.time }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card flat class="bg-white q-mt-sm">
        <q-list bordered separator>
          <q-item-label header>商品详情</q-item-label>
          <q-separator />
          <q-item v-for="(item, key) in orderData.orderDetail" :key="key">
            <q-item-section avatar>
              <q-avatar square>
                <img :src="`${$store.state.member.cdn_url}` + item.goods_cover_image" alt="" />
              </q-avatar>
            </q-item-section>

            <q-item-section top>
              <q-item-label lines="2" class="text-subtitle1"
                >{{ item.goods_name }} {{ item.goods_specification ? '-' + item.goods_specification : '' }}
              </q-item-label>

              <q-item-label caption class="q-gutter-xs" lines="2">
                <q-badge outline color="lime-10" class="tag-font-size" v-if="formatAmount(item.goods_selling_point) > 0">
                  {{ $store.state.member.storeBaseConfig.consume_base_integralUnit }}
                  {{ formatAmount(item.goods_selling_point) }}
                </q-badge>

                <q-badge outline color="orange-10 " class="tag-font-size" v-if="formatAmount(item.goods_selling_saving) > 0">
                  {{ $store.state.member.storeBaseConfig.consume_base_balanceUnit }}
                  {{ formatAmount(item.goods_selling_saving) }}
                </q-badge>
              </q-item-label>
            </q-item-section>

            <q-item-section side top v-if="formatAmount(item.goods_selling_price) > 0">
              <span class="text-red text-h6" v-if="formatAmount(item.goods_selling_price) > 0"
                ><span class="text-caption">{{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}</span
                >{{ item.goods_selling_price * item.goods_number }}</span
              >
              <div class="text-grey q-mt-sm text-caption" v-if="item.goods_number > 0">
                数量: <span class="text-red-6 text-weight-bold text-subtitle2"> {{ item.goods_number }}</span>
              </div>
              <div class="text-grey q-mt-sm text-caption" v-if="item.goods_shipping > 0">
                运费: <span class="text-red-6 text-weight-bold text-subtitle2">{{ item.goods_shipping }}</span>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card class="q-my-xs" flat v-if="formatAmount(orderData.jo_point) > 0">
        <q-card-section class="row justify-around q-pa-sm items-center">
          <div class="col text-left">共需{{ $store.state.member.storeBaseConfig.consume_base_integralUnit }}</div>
          <div class="col text-right text-subtitle1 text-blue-9 text-weight-medium">
            {{ orderData.jo_point }}
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-my-xs" flat v-if="formatAmount(orderData.jo_saving_money) > 0">
        <q-card-section class="row justify-around text-center items-center q-pa-sm">
          <div class="col text-left">共需{{ $store.state.member.storeBaseConfig.consume_base_balanceUnit }}</div>
          <div class="col text-right text-subtitle1 text-blue-9 text-weight-medium">
            {{ orderData.jo_saving_money }}
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-my-xs" flat v-if="formatAmount(orderData.jo_shipping) > 0">
        <q-card-section class="row justify-around text-center items-center q-pa-sm">
          <div class="col text-left">运费</div>
          <div class="col text-right text-subtitle1 text-blue-9 text-weight-medium">
            {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }} {{ orderData.jo_shipping }}
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-xs text-red-6" flat v-if="formatAmount(orderData.jo_money) > 0">
        <q-card-section class="row justify-around text-center items-center q-pa-sm">
          <div class="col text-left text-red-6">实付金额：</div>
          <div class="col text-right text-subtitle1 text-blue-9 text-weight-medium">
            {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}{{ orderData.jo_money }}
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-my-md" flat>
        <div class="q-pa-md text-grey text-caption" style="max-width: 400px">备注：{{ orderData.jo_remarks }}</div>
      </q-card>

      <q-card class="q-mt-xs q-pa-xs" flat v-if="orderData.evaluation && orderData.evaluation.id">
        <div class="text-h6">订单评价</div>
        <div class="bg-white q-px-sm q-pt-sm">
          <div class="row">
            <div class="col-2 text-grey-8 q-pt-xs">物流包装</div>
            <div class="col-10 q-pl-sm">
              <q-icon
                name="star"
                :key="key"
                size="2em"
                v-for="(item, key) in parseInt(orderData.evaluation.je_package_evaluation)"
                color="red"
              ></q-icon>
            </div>
          </div>
          <div class="row q-py-sm">
            <div class="col-2 text-grey-8 q-pt-xs">物流速度</div>
            <div class="col-10 q-pl-sm">
              <q-icon
                name="star"
                :key="key"
                size="2em"
                v-for="(item, key) in parseInt(orderData.evaluation.je_speed_evaluation)"
                color="red"
              ></q-icon>
            </div>
          </div>
          <div class="row q-pb-sm">
            <div class="col-2 text-grey-8 q-pt-xs">客服服务</div>
            <div class="col-10 q-pl-sm">
              <q-icon
                name="star"
                :key="key"
                size="2em"
                v-for="(item, key) in parseInt(orderData.evaluation.je_steward_evaluation)"
                color="red"
              ></q-icon>
            </div>
          </div>
        </div>
        <div class="text-subtitle1 q-pa-sm">评价内容： {{ orderData.evaluation.je_overall_evaluation }}</div>
      </q-card>
    </div>

  </q-page>
</template>
<script>
export default {
  name: 'orderSee',
  data () {
    return {
      settingForm: {},

      recommendGoods: [],
      orderData: {},

      logisticsData: {},
      hlpayStatus: false,
      member_id: ''
    }
  },
  mounted () {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getOrderData()
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
    getOrderData () {
      this.$store
        .dispatch('member/postApi', {
          orderId: this.$route.query.id,
          do: 'getJfmallOrderDetail',
          member_id: this.member_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.orderData = res.data ? res.data : {}
            this.logisticsData = res.data && res.data.orderLogistics ? res.data.orderLogistics : {}
          }
        })
    },

    // 修改订单状态
    changeStatus (val, status) {
      let data = ''
      if (status == 5) {
        data = '是否确认收货'
      } else if (status == -1) {
        data = '是否删除订单'
      } else if (status == 7) {
        data = '是否取消订单'
      } else if (status == 2) {
        data = '是否付款'
      }
      this.$q
        .dialog({
          title: '是否确认',
          message: `${data}`,
          cancel: true
        })
        .onOk(() => {
          const obj = {
            id: val,
            state: status,
            member_id: this.member_id
          }
          this.$store
            .dispatch('jforder/setData', obj)
            .then((res) => {
              if (res.code == 200 && res.data) {
                if (res.data.jo_state == 5) {
                  this.$q.notify({
                    message: '成功',
                    caption: '收货成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.getOrderData()
                } else if (res.data.jo_state == 2) {
                  this.$q.notify({
                    message: '成功',
                    caption: '付款成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.getOrderData()
                } else if (res.data.jo_state == -1) {
                  this.$q.notify({
                    message: '成功',
                    caption: '订单删除成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.getOrderData()
                } else if (res.data.jo_state == 7) {
                  this.$q.notify({
                    message: '成功',
                    caption: '订单取消成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.getOrderData()
                }
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
        })
        .onCancel(() => {})
    },
    // 唤醒拨号盘
    callPhone (phoneNumber) {
      window.location.href = 'tel:' + phoneNumber
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }

  }
}
</script>

<style></style>
