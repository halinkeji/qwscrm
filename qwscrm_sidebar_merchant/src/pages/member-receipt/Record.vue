<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs"> 开票历史 </q-toolbar-title>
      </q-toolbar>
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
            label="发票单据号|发票代码|发票号码"
          >
            <template v-slot:append>
              <q-icon name="search" @click="getDatalist" />
            </template>
          </q-input>
        </div>
        <div class="col q-pa-sm">
          <q-input
            outlined
            bottom-slots
            clearable
            v-model="searchFrom.memberText"
            dense
            @change="getDatalist"
            @clear="getDatalist"
            class="q-pb-none"
            label="发票抬头|邮箱|联系电话"
          >
            <template v-slot:append>
              <q-icon name="search" @click="getDatalist" />
            </template>
          </q-input>
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
    </q-header>
    <div class="q-ma-sm" v-if="invoiceListData.length > 0" v-for="(item, key) in invoiceListData" :key="key">
      <q-list bordered separator>
        <q-card class="my-card q-mt-sm q-ma-sm no-shadow">
          <q-item>
            <q-item-section side>
              <span class="text-primary"> 电子发票 </span>
            </q-item-section>
            <q-item-section>
              {{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}
            </q-item-section>
            <q-item-section side>
              <span v-if="item.pr_status == 0">
                <q-btn @click="buttonShow(item)" color="secondary" class="q-mr-sm" label="开票" unelevated> </q-btn>
              </span>
              <span v-if="item.pr_status == 1"> 已开票 </span>
            </q-item-section>
          </q-item>
          <q-separator />
          <div @click="$router.push({ name: 'memberReceiptDetail', params: { id: item.id } })">
            <q-item>
              <q-item-section class="q-mt-none">
                <span> 发票单据号： {{ item.pr_invoice_code }}</span>
              </q-item-section>
              <q-item-section class="q-mt-none text-bold text-subtitle1">
                {{ item.pr_title_name }}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption> 发票代码 </q-item-label>
                <q-item-label>{{ item.pr_status == 0 ? '开票中' : item.pr_invoice_code_info }} </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption> 发票号码 </q-item-label>
                <q-item-label>{{ item.pr_status == 0 ? '开票中' : item.pr_invoice_number }} </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <div class="row text-h6 text-weight-bold text-right text-primary">
                    {{ $store.state.member.storeBaseConfig.consume_base_moneySymbol }}{{ item.pr_total_amount }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="text-bold text-subtitle1">
                  类型： <span v-if="item.pr_type == 1">个人/事业单位</span> <span v-if="item.pr_type == 2">单位</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption class="text-grey text-right"> 查看详情 ></q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-card>
      </q-list>
    </div>
    <div class="bg-white text-h6 text-grey text-center" style="padding-top: 50px" v-if="invoiceListData.length == 0">
      <q-icon name="fas fa-box-open" size="58px" class="text-grey-8" />
      <div class="q-pt-md">暂无开票信息</div>
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

  </q-page>
</template>
<script>
export default {
  name: 'ReceiptRecord',
  components: {},
  data () {
    return {
      invoiceListData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      selectedData: [],
      selectedInvoice: [],
      val: false,
      showNoData: false,
      startTime: '',
      endTime: '',
      searchFrom: {
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        created_at: '',
        updated_at: ''
      },
      itemData: {},
      member_id: ''
    }
  },
  mounted () {
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
  created () {},
  computed: {},
  methods: {
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
        ...this.searchFrom,
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        member_id: this.member_id,
        do: 'getOpenReceiptRecord'
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceListData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
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
    buttonShow (item) {
      this.dialogShow = true
      this.itemData = item
    },
    clearFields () {
      this.dialogShow = false
      this.itemData = {}
    }

    // 下拉刷新
    // onLoad(index, done) {
    //   this.showNoData = false;
    //   setTimeout(() => {
    //     if (this.invoiceListData.length == this.page.totalCount) {
    //       this.$refs.infiniteScroll.stop();
    //       this.showNoData = true;
    //     } else {
    //       this.page.pageIndex = index + 1;
    //       this.getDatalist();
    //       done();
    //     }
    //   }, 2000);
    // },
  }
}
</script>
