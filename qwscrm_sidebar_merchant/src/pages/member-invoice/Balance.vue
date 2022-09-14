<template>
  <q-page class=" bg-grey-1">
    <!-- 顶部导航 -->
    <q-header class="bg-white" bordered>
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          {{ $store.state.member.storeBaseConfig.consume_base_balanceUnit }}记录
        </q-toolbar-title>
      </q-toolbar>
      <div class="row bg-white full-width">
        <q-expansion-item label="根据条件筛选" class="full-width text-dark">
          <q-input
            outlined
            bottom-slots
            v-model="searchFrom.searchSerm"
            @change="getBalanceDetailsList()"
            @clear="getBalanceDetailsList()"
            clearable
            dense
            class="col-12 q-pa-sm"
            label="单据号"
          >
            <template v-slot:append>
              <q-icon name="search" @click="getBalanceDetailsList()" />
            </template>
          </q-input>
          <div class="col-12 q-pa-sm">
            <q-input square outlined readonly dense v-model="created_at" label="开始日期">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="created_at" minimal mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getBalanceDetailsList" color="primary" flat />
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
                        <q-btn v-close-popup label="确定" @click="getBalanceDetailsList" color="primary" flat />
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
                        <q-btn v-close-popup label="确定" @click="getBalanceDetailsList" color="primary" flat />
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
                        <q-btn v-close-popup label="确定" @click="getBalanceDetailsList" color="primary" flat />
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
    <div class="q-px-md q-pt-md ful-height">
      <div v-for="(item, index) in balanceDetailsList" :key="index">
        <q-item clickable>
          <q-item-section avatar style="margin-bottom: 6%">
            <q-avatar size="md" color="blue-10" text-color="white" icon="las la-wallet" />
          </q-item-section>
          <q-item-section>
            <q-item-label v-if="!item.sc_invoiceCode">{{ item.mcr_invoiceCode }}</q-item-label>
            <q-item-label v-else>{{ item.sc_invoiceCode }}</q-item-label>
            <q-item-label caption lines="2">{{ item.mcr_operatingBehavior }}</q-item-label>
            <q-item-label caption lines="2">{{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss') }}</q-item-label>
          </q-item-section>

          <q-item-section side style="margin-bottom: 8%">
            <q-item-label caption style="font-size: 15px; color: black">
              <div v-if="item.mcr_moneyCountStatus == 1">+ {{ item.mcr_moneyCount }}</div>
              <div v-else>-{{ item.mcr_moneyCount }}</div>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset />
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
      djhText: '',
      dialog: false,
      inquireTypeDialog: false,
      dividerShow: false,
      position: 'top',
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
      updated_at: ''

    }
  },
  mounted () {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getBalanceDetailsList()
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

    getBalanceDetailsList () {
      const startTime = this.$q_date.formatDate(this.created_at, 'X')
      const endTime = this.$q_date.formatDate(this.updated_at, 'X')
      this.searchFrom.created_at = startTime
      this.searchFrom.updated_at = endTime
      const obj = {
        ...this.searchFrom,
        sc_consumeType: 'moneyRecord',
        noMember: 1,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        do: 'getBalanceList',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.list) {
              this.balanceDetailsList = res.data.list

              this.page.pageTotal = parseInt(res.data.page.totalCount)
            } else {
              this.dividerShow = true
            }
          }
        })
        .catch((error) => {})
    },

    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getBalanceDetailsList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getBalanceDetailsList()
    },
    chearTimeEnd () {
      this.updated_at = ''
      this.getBalanceDetailsList()
    },
    chearTimeStart () {
      this.created_at = ''
      this.getBalanceDetailsList()
    }
  }
}
</script>
