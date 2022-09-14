<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs"> 开具发票 </q-toolbar-title>

        <q-btn color="grey-7" round flat icon="more_vert">
          <q-menu cover auto-close>
            <q-list>
              <q-item clickable :to="{ name: 'memberReceiptTitle' }">
                <q-item-section>发票抬头</q-item-section>
              </q-item>
              <q-item clickable :to="{ name: 'memberReceiptRecrod' }">
                <q-item-section>开票记录</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <div class="row">
        <q-expansion-item label="根据条件筛选" class="full-width text-dark bg-white">
          <div class="col q-pa-sm">
            <q-input
              outlined
              bottom-slots
              clearable
              v-model="searchFrom.searchSerm"
              dense
              @change="getDatalist"
              @clear="getDatalist"
              class="q-pb-none"
              label="单据号"
            >
              <template v-slot:append>
                <q-icon name="search" @click="getDatalist" />
              </template>
            </q-input>
          </div>
          <div class="col-12 q-pa-sm">
            <q-select
              outlined
              dense
              v-model="searchFrom.sc_consumeType"
              option-value="value"
              option-label="label"
              :options="consumeTypeData"
              label="请选择消费方式"
              clearable
              @input="getDatalist"
              emit-value
              map-options
            >
              <template v-slot:append>
                <q-icon name="search" @click="getDatalist" />
              </template>
            </q-select>
          </div>
          <div class="col-12 q-pa-sm">
            <q-select
              outlined
              dense
              v-model="searchFrom.consumePayType"
              option-value="value"
              option-label="text"
              :options="type"
              label="选择支付方式"
              clearable
              @input="getDatalist"
              emit-value
              map-options
            >
              <template v-slot:append>
                <q-icon name="search" @click="getDatalist" />
              </template>
            </q-select>
          </div>
          <div class="col-12 q-pa-sm">
            <q-input square outlined readonly dense v-model="startTime" label="开始日期">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="startTime" minimal mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getDatalist" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon v-if="startTime !== ''" name="close" @click="chearTimeStart" class="cursor-pointer" />
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getDatalist" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 q-pa-sm">
            <q-input square outlined readonly dense label="结束日期" clearable v-model="endTime">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="endTime" minimal mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getDatalist" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon v-if="endTime !== ''" name="close" @click="chearTimeEnd" class="cursor-pointer" />
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getDatalist" color="primary" flat />
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

    <div class="q-px-sm" v-if="invoiceListData.length > 0" v-for="(item, key) in invoiceListData" :key="key">
      <q-list bordered separator class="q-mt-sm">
        <q-card class="q-mt-xs q-mx-xs no-shadow">
          <q-item>
            <q-item-section side>
              <q-checkbox size="xs" v-model="selectedData[key].state" @input="total" keep-color color="blue" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="2"> 订单号：{{ item.sc_invoiceCode }} </q-item-label>
            </q-item-section>
            <q-item-section side @click="$router.push({ name: 'memberInvoiceDetail', query: { invId: item.id } })">
              <q-item-label caption>
                <div class="row text-subtitle1 text-weight-bolder">
                  {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}{{ item.sc_realMoneyCount }}
                </div>
              </q-item-label>
              <q-item-label caption class="text-grey text-right"> 查看详情 ></q-item-label>
            </q-item-section>
          </q-item>
        </q-card>
      </q-list>
    </div>
    <div class="bg-white text-h6 text-grey text-center" style="padding-top: 50px" v-if="invoiceListData.length == 0">
      <q-icon name="fas fa-box-open" size="58px" class="text-grey-8" />
      <div class="q-pt-md">暂无可开票单据</div>
    </div>

    <q-footer class="bg-white border-foot-card">
      <q-toolbar class="text-center text-grey-8 q-pr-none">
        <q-checkbox v-model="val" color="blue" keep-color size="xs" @input="allSelete" />
        <q-toolbar-title class="text-subtitle1 text-left">
          已选：<span class="text-bold">{{ number }}</span>
          <span class="q-mr-md">
            总金额：
            <span class="text-blue text-bold"> {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}{{ money }} </span>
          </span>
        </q-toolbar-title>
        <q-btn unelevated color="positive" @click="opendInvoice" class="q-mr-sm" :disable="money > 0 ? false : true" label="开 票" />
      </q-toolbar>
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.totalCount"
      ></hl-pagination>
    </q-footer>
  </q-page>
</template>
<script>
export default {
  name: 'receiptIndex',
  components: {},
  data () {
    return {
      invoiceListData: [],
      page: {
        pageIndex: 1,
        pSize: 10,
        totalCount: 0
      },
      selectedData: [],
      selectedInvoice: [],
      val: false,
      openCheckoutPageIf: false,
      money: 0,
      number: 0,
      memberId: 0,
      showNoData: false,
      startTime: '',
      endTime: '',
      searchFrom: {
        sc_consumeType: [],
        consumePayType: '',
        userId: '',
        searchSerm: '',
        created_at: '',
        updated_at: ''
      },
      type: this.$store.state.member.consumePayType,
      consumeTypeData: this.$store.state.member.consumeTypeData,
      member_id: ''
    }
  },
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
  mounted () {

  },
  computed: {},
  methods: {
    closeCheckoutPopup () {
      this.openCheckoutPageIf = false
    },
    clearBtn () {
      this.memberId = 0
      this.getDatalist()
    },
    getDatalist () {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.searchFrom.created_at = startTime
      this.searchFrom.updated_at = endTime
      const obj = {
        page: this.page.pageIndex,
        ...this.searchFrom,
        pSize: this.page.pSize,
        do: 'getReceiptInvoiceData',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
            this.invoiceListData = res.data ? res.data.list : []
            if (res.data && res.data.list && res.data.list.length > 0) {
              res.data.list.forEach((element) => {
                this.selectedData.push({ state: false, id: element.id })
              })
            }
          }
        })
        .catch((error) => {})
    },
    allSelete () {
      if (this.val) {
        this.invoiceListData.forEach((i, index) => {
          this.selectedData[index].state = true
        })
      } else {
        this.invoiceListData.forEach((i, index) => {
          this.selectedData[index].state = false
        })
      }
      this.total()
    },
    total () {
      this.selectedInvoice = []
      let money = 0
      let dataLength = 0
      this.invoiceListData.forEach((i, index) => {
        if (this.selectedData[index].state) {
          dataLength += 1
          money += this.formatAmount(this.invoiceListData[index].sc_realMoneyCount)
          this.selectedInvoice.push(i)
        }
      })
      if (dataLength != this.invoiceListData.length) {
        this.val = false
      } else {
        this.val = true
      }
      this.number = dataLength
      this.money = this.formatAmount(money)
    },
    opendInvoice () {
      const mainInvoice = this.selectedInvoice.map((item) => {
        return item.id
      })
      this.$router.push({ name: 'memberOpenReceipt', params: { money: this.money, invoice: mainInvoice, memberId: this.memberId } })
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getDatalist()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDatalist()
    },
    chearTimeStart () {
      this.startTime = ''
      this.getDatalist()
    },
    chearTimeEnd () {
      this.endTime = ''
      this.getDatalist()
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
