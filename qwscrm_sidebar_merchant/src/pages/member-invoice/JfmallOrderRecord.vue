<template>
  <q-page>
    <!-- 顶部tab -->
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 q-pt-xs"> 订单列表 </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- 中部商品栏 -->
    <div>
      <div class="bg-grey-2" v-for="item in orderList" v-if="orderList.length > 0">
        <div class="bg-white">
          <div class="row q-pa-md q-mt-sm" style="border-bottom: 1px solid #f2f2f2">
            <div v-if="item.jo_state == 4 && item.jo_type == 2" class="col-8 text-grey-9">取货码：{{ item.jo_pickup_code }}</div>
            <div v-else class="col-8 text-grey-9">下单时间：{{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</div>
            <div class="col-4 text-blue-8 text-right" v-if="item.jo_state == 1">待付款</div>
            <div class="col-4 text-blue-8 text-right" v-else-if="item.jo_state == 2">待确认</div>
            <div class="col-4 text-blue-8 text-right" v-else-if="item.jo_state == 3">
              {{ item.jo_type == 1 ? '待出库' : '待打包' }}
            </div>
            <div class="col-4 text-deep-orange text-right" v-else-if="item.jo_state == 4">
              {{ item.jo_type == 1 ? '待收货' : '待自取' }}
            </div>
            <div class="col-4 text-green text-right" v-else-if="item.jo_state == 5">待评价</div>
            <div class="col-4 text-green text-right" v-else-if="item.jo_state == 6">已完成</div>
            <div class="col-4 text-right text-red" v-else-if="item.jo_state == 7">已取消</div>
          </div>
          <div class="row q-pa-md q-py-md" style="border-bottom: 1px solid #f2f2f2"
          @click="$router.push({
                name: 'memberJfmallOrderDetail',
                query: { id: item.id },
              })"
          >
            <div class="col-2" v-for="value in item.orderDetail">
              <img :src="`${$store.state.member.cdn_url}` + value.goods_cover_image" alt="" style="width: 95%; height: 50px" />
            </div>
            <q-space />
            <div class="col-2 text-right">
              <div class="text-grey q-mt-sm text-right">
                <q-icon name="keyboard_arrow_right" size="30px" class="text-grey" />
              </div>
            </div>
          </div>
          <div class="row q-pa-md">
            <div class="col-4 text-grey-8 q-mt-sm">共 {{ item.jo_total }} 件商品</div>
            <div class="col-8 text-grey-8 text-right">
              实付金额：
              <span class="text-h6 text-weight-light text-red">
                {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }} {{ item.jo_money }}
              </span>
            </div>
          </div>
          <div class="row q-pr-md q-pb-md">
            <div class="col text-right">
              <q-btn
                label="确认订单"
                outline
                v-if="item.jo_state == 2"
                color="primary"
                class="q-mr-md"
                size="12px"
                @click="changeStatus(item.id, 3)"
              />
              <q-btn
                label="商品出库"
                v-if="item.jo_state == 3 && item.jo_type == 1"
                outline
                color="primary"
                class="q-mr-md"
                size="12px"
                @click="addCourier(item)"
              />
              <q-btn
                label="商品打包"
                v-if="item.jo_state == 3 && item.jo_type == 2"
                outline
                color="primary"
                class="q-mr-md"
                size="12px"
                @click="changeStatus(item.id, 4)"
              />
              <q-btn
                label="自取核销"
                v-if="item.jo_state == 4 && item.jo_type == 2"
                outline
                color="negative"
                class="q-mr-md"
                size="12px"
                @click="getCheck(item)"
              />
              <q-btn
                label="取消订单"
                v-if="item.jo_state < 3 && item.jo_state != -1"
                outline
                color="red"
                class="q-mr-md"
                size="12px"
                @click="changeStatus(item.id, 7)"
              />
              <q-btn
                label="查看详情"
                outline
                color="amber-6"
                class="q-mr-md"
                size="12px"
                :to="{
                  name: 'memberJfmallOrderDetail',
                  query: {
                    id: item.id,
                    show: 1,
                  },
                }"
              />
            </div>
          </div>
        </div>
        <q-footer class="text-black bg-white" bordered>
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pSize"
            :total="page.totalCount"
          ></hl-pagination>
        </q-footer>
      </div>
      <div class="bg-grey-3 text-h6 text-grey text-center" v-else>
        <q-icon name="fas fa-box-open" size="58px" class="text-grey-8" />
        <div class="q-pt-md">暂无订单</div>
      </div>
      <!-- 快递信息 -->
      <q-dialog v-model="popUp" persistent>
        <q-card style="width: 700px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-subtitle2">提交快递信息</div>
            <q-space />
            <q-btn icon="close" flat round dense @click="popUp = false" />
          </q-card-section>
          <q-form ref="courierDataRef" class="q-my-md">
            <q-select
              class="q-px-sm q-mt-lg"
              outlined
              dense
              emit-label
              map-options
              v-model="courier.jol_courier_company"
              :options="company"
              label="快递公司"
            >
            </q-select>

            <q-input
              outlined
              class="q-px-sm q-mt-lg"
              v-model="courier.jol_courier_number"
              label="快递单号"
              dense
              :rules="[(val) => !!val || '快递单号是必填的']"
            >
            </q-input>
            <q-select
              class="q-px-sm q-mt-xs"
              outlined
              v-model="courier.deliver_id"
              :options="deliverData"
              dense
              option-value="id"
              option-label="dm_name"
              label="派送员"
              emit-value
              map-options
            />

            <div class="row q-mt-sm q-mb-sm">
              <q-space />
              <q-btn outline unelevated color="grey-7" label="关闭" @click="popUp = false" />
              <q-btn unelevated color="blue-6" label="提交" @click="submitCourier" class="q-ml-sm q-mr-sm" />
            </div>
          </q-form>
        </q-card>
      </q-dialog>
      <!-- 核销 -->
      <q-dialog v-model="code" persistent>
        <q-card style="width: 700px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">自取订单核销</div>
            <q-space />
            <q-btn icon="close" flat round dense @click="code = false" />
          </q-card-section>
          <q-form ref="courierDataRef" class="q-my-md">
            <q-input dense outlined class="q-px-sm q-mt-lg" v-model="pickupCode" label="核销码"> </q-input>
            <div class="row q-mt-sm q-mb-sm">
              <q-space />
              <q-btn outline unelevated color="grey-7" label="关闭" @click="code = false" />
              <q-btn unelevated color="blue-6" label="提交" @click="pickup()" class="q-ml-sm q-mr-sm" />
            </div>
          </q-form>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'order',
  data () {
    return {
      orderType: 0,
      recommendGoods: [],
      orderList: [],
      page: {
        pageIndex: 1,
        pSize: 10,
        totalCount: 0
      },
      courier: {
        jol_courier_company: '',
        jol_courier_number: ''
      },
      evaluationData: {},
      evaluation: false,
      code: false,
      popUp: false,
      pickupCode: '',
      company: [
        {
          value: 1,
          label: '圆通速递'
        },
        {
          value: 2,
          label: '韵达速递'
        },
        {
          value: 3,
          label: '顺丰速递'
        },
        {
          value: 4,
          label: '中通速递'
        },
        {
          value: 5,
          label: '申通速递'
        },
        {
          value: 6,
          label: 'EMS'
        },
        {
          value: 7,
          label: '百世快递'
        },
        {
          value: 8,
          label: '天天快递'
        },
        {
          value: 9,
          label: '全峰快递'
        },
        {
          value: 10,
          label: '宅急送'
        },
        {
          value: 11,
          label: '京东快递'
        }
      ],
      deliverData: [],
      checkOrderItem: {},
      member_id: ''
    }
  },
  mounted () {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getOrderList(this.$route.query.status)
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
    addCourier (item) {
      this.getDeliverData()

      this.$nextTick(() => {
        this.popUp = true
        this.currentOrderId = item.id
        this.courier.jol_courier_number = ''
        this.courier.jol_courier_company = ''
      })
    },
    getDeliverData () {
      this.$store
        .dispatch('member/postApi', {
          do: 'getDeliveryData',
          member_id: this.member_id
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.deliverData = res.data
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

    submitCourier () {
      this.$refs.courierDataRef.validate().then(success => {
        if (success) {
          this.$q
            .dialog({
              title: '提示',
              message: '确认提交物流信息',
              cancel: true
            })
            .onOk(() => {
              const obj = {
                orderId: this.currentOrderId,
                state: 4,
                jol_courier_number: this.courier.jol_courier_number,
                jol_courier_company: this.courier.jol_courier_company.label,
                deliver_id: this.courier.deliver_id,
                do: 'updateJfmallOrder',
                member_id: this.member_id
              }
              this.$store
                .dispatch('member/postApi', obj)
                .then((res) => {
                  if (res.code == 200) {
                    this.currentOrderId = ''
                    this.popUp = false
                    this.courier.jol_courier_number = ''
                    this.courier.jol_courier_company = ''
                    this.$q.notify({
                      message: '成功',
                      caption: '订单出库成功',
                      icon: 'ion-checkmark-circle-outline',
                      color: 'green',
                      timeout: 500,
                      position: 'top-right'
                    })
                    this.getOrderList()
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
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },

    // 获取订单信息
    getOrderList (val) {
      this.orderType = val
      const obj = {
        text: this.text,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        state: this.stateId,
        do: 'getJfmallOrderList',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            this.orderList = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top'
          })
        })
    },

    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getOrderList()
    },

    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getOrderList()
    },

    // 修改订单状态
    changeStatus (val, status) {
      let data = ''
      if (status == 5) {
        data = '是否确认收货'
      } else if (status == 7) {
        data = '是否取消订单'
      } else if (status == -1) {
        data = '是否删除订单'
      } else if (status == 3) {
        data = '是否要确认订单'
      } else if (status == 6) {
        data = '是否要取消订单'
      } else if (status == 5) {
        data = '是否核销订单'
      }
      this.$q
        .dialog({
          title: '提示',
          message: `${data}`,
          cancel: true
        })
        .onOk(() => {
          const obj = {
            orderId: val,
            state: status,
            do: 'updateJfmallOrder',
            member_id: this.member_id
          }
          this.$store
            .dispatch('member/postApi', obj)
            .then((res) => {
              if (res.code == 200 && res.data) {
                if (res.data.jo_state == 5) {
                  this.$q.notify({
                    message: '成功',
                    caption: '收货成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top'
                  })
                  this.getOrderList(5)
                  this.stateId = 5
                } else if (res.data.jo_state == 7) {
                  this.$q.notify({
                    message: '成功',
                    caption: '订单取消成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top'
                  })
                  this.getOrderList(6)
                  this.stateId = 6
                } else if (res.data.jo_state == -1) {
                  this.$q.notify({
                    message: '成功',
                    caption: '订单删除成功！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top'
                  })
                  this.getOrderList(6)
                  this.stateId = 6
                } else {
                  this.getOrderList()
                }
              } else if (res.code == 400 && res.data) {
                this.$q.notify({
                  message: '失败',
                  caption: `${res.data}`,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top'
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
                position: 'top'
              })
            })
        })
        .onCancel(() => {})
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    getCheck (item) {
      if (item && item.id) {
        this.code = true
        this.checkOrderItem = item
      }
    },

    pickup (item) {
      if (this.pickupCode == this.checkOrderItem.jo_pickup_code) {
        this.changeStatus(this.checkOrderItem.id, 5)
        this.code = false
        this.checkOrderItem = {}
      } else {
        this.$q.notify({
          message: '失败',
          caption: '请输入正确的核销码',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
      }
    }
  }
}
</script>
