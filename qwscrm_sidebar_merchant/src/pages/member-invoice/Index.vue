<template>
  <q-page class=" bg-grey-1">
    <!-- 顶部导航 -->
    <q-header class="bg-white" bordered>
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)"  />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          业务消费记录
        </q-toolbar-title>
      </q-toolbar>

      <div class="row bg-white full-width">
        <q-expansion-item label="根据条件筛选" class="full-width text-dark">
          <q-input
            outlined
            bottom-slots
            v-model="searchFrom.searchSerm"
            clearable
            @change="getDatalistType()"
            @clear="getDatalistType()"
            dense
            class="col-12 q-pa-sm"
            label="单据号"
          >
            <template v-slot:append>
              <q-icon name="search" @click="getDatalistType()" />
            </template>
          </q-input>
          <div class="col-12 q-pa-sm">
            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              clearable
              @clear="getDatalistType"
              map-options
              :options="consumeTypeData"
              multiple
              v-model="searchFrom.sc_consumeType"
              dense
              label="请选择消费方式"
            >
              <template v-slot:append>
                <q-icon name="search" @click="getDatalistType()" />
              </template>
            </q-select>
          </div>
          <div class="col-12 q-pa-sm">
            <q-select
              clearable
              outlined
              @input="getDatalistType()"
              dense
              v-model="searchFrom.consumePayType"
              :options="type"
              label="请选择收款类型"
              option-value="value"
              option-label="text"
              emit-value
              map-options
            >
              <template v-slot:append>
                <q-icon name="search" @click="getDatalistType()" />
              </template>
            </q-select>
          </div>
          <div class="col-12 q-pa-sm">
            <q-select
              outlined
              clearable
              option-value="value"
              option-label="text"
              @input="getDatalistType()"
              emit-value
              map-options
              :options="payStatusData"
              v-model="searchFrom.payStatus"
              dense
              label="选择支付状态"
            >
              <template v-slot:append>
                <q-icon name="search" @click="getDatalistType()" />
              </template>
            </q-select>
          </div>
          <div class="col-12 q-pa-sm">
            <q-input square outlined readonly dense v-model="created_at" label="开始日期">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="created_at" minimal mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getDatalistType" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon v-if="created_at !== ''" name="close" @click="chearTimeStart" class="cursor-pointer" />
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="created_at" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getDatalistType" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 q-pa-sm">
            <q-input square outlined readonly dense label="结束日期" clearable v-model="updated_at">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="updated_at" minimal mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getDatalistType" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon v-if="updated_at !== ''" name="close" @click="chearTimeEnd" class="cursor-pointer" />
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="updated_at" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getDatalistType" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-expansion-item>
      </div>
    </q-header>
    <div class="q-px-md q-pt-md full-height">
      <div
        class="row"
        @click="$router.push({ name: 'memberInvoiceDetail', query: { invId: item.id } })"
        v-for="(item, key) in invoiceListData"
        :key="key"
      >
        <div class="col-2 text-center q-pt-md">
          <q-avatar size="md" :color="changeColor()" text-color="white"> {{ sliceString(item.sc_consumeTypeName) }} </q-avatar>
        </div>
        <div class="col-8 q-pl-sm">
          <div class="text-subtitle1">{{ item.sc_invoiceCode }}</div>
          <div class="text-caption text-grey">
            {{ item.sc_consumeTypeName }}
          </div>
          <div class="text-caption text-grey">
            {{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss') }}
          </div>
        </div>
        <div class="col-2 text-subtitle1 text-red" v-if="item.sc_consumeType == 'deductMoney'">
          {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}{{ item.sc_rechargePaymentCount }}
        </div>
        <div class="col-2 text-subtitle1 text-red" v-else-if="item.sc_consumeType == 'deductCount'"></div>
        <div class="col-2 text-subtitle1 text-red" v-else>
          {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}{{ item.sc_realMoneyCount }}
        </div>
        <q-separator inset />
        <q-separator class="full-width" />
      </div>
    </div>
    <q-footer class="text-black bg-white" bordered>
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </q-footer>
  </q-page>
</template>

<script>
export default {
  name: 'memberConsumeInvoice',
  data () {
    return {
      dividerShow: false,
      position: 'top',
      invoiceListData: [],
      pointsDetailsList: [],
      balanceDetailsList: [],
      searchFrom: {
        sc_consumeType: [],
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        memberText: '',
        created_at: '',
        updated_at: ''
      },
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      fixedTime: '',
      created_at: '',
      updated_at: '',
      type: this.$store.state.member.consumePayType,
      consumeTypeData: this.$store.state.member.consumeTypeData,
      payStatusData: this.$store.state.member.payStatusData
    }
  },
  mounted () {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getDatalist()
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
    getDatalistType () {
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.invoiceListData = []
      this.getDatalist()
    },
    changeColor () {
      const items = ['primary', 'secondary', 'accent', 'positive', 'negative', 'info', 'warning']
      return items[Math.floor(Math.random() * items.length)]
    },
    sliceString (val) {
      if (val) {
        return val.slice(0, 1)
      }
      return '消'
    },
    getDatalist () {
      const startTime = this.$q_date.formatDate(this.created_at, 'X')
      const endTime = this.$q_date.formatDate(this.updated_at, 'X')
      this.searchFrom.created_at = startTime
      this.searchFrom.updated_at = endTime
      const obj = {
        ...this.searchFrom,
        noMember: 1,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        do: 'getConsumeList',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.list) {
              this.invoiceListData = res.data.list
              this.page.pageIndex = res.data.page.pageIndex
              this.page.pageTotal = parseInt(res.data.page.totalCount)
            } else {
              this.dividerShow = true
            }
          }
        })
        .catch((error) => {})
      // }
    },
    resetSearchFrom () {
      this.consumeType = ''
      this.searchFrom = {
        sc_consumeType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        created_at: '',
        updated_at: '',
        memberText: ''
      }
      this.created_at = ''
      this.updated_at = ''
      this.invoiceListData = []
      this.pointsDetailsList = []
      this.balanceDetailsList = []
      this.page = {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      }
      this.getDatalist()
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getDatalist()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDatalist()
    },
    chearTimeEnd () {
      this.updated_at = ''
      this.getDatalist()
    },
    chearTimeStart () {
      this.created_at = ''
      this.getDatalist()
    }
  }
}
</script>
