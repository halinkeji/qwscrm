<template>
  <q-page class="bg-grey-3 q-pb-sm">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          计时消费记录
        </q-toolbar-title>
      </q-toolbar>

      <q-expansion-item label="根据条件查询" class="full-width text-dark">
        <div class="row bg-white">
          <div class="col-12 q-pa-sm">
            <q-input
              outlined
              bottom-slots
              v-model="searchFrom.searchSerm"
              @change="findReceipt"
              @clear="getDatalist"
              dense
              clearable
              class="q-pb-none"
              label="请输入单据号"
            >
              <template v-slot:append>
                <q-icon name="search" @click="getDatalist" />
              </template>
            </q-input>
          </div>
          <div class="col-12 q-pa-sm">
            <q-input
              outlined
              bottom-slots
              v-model="searchFrom.goodsText"
              @change="findReceipt"
              @clear="getDatalist"
              dense
              clearable
              class="q-pb-none"
              label="商品名称"
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
        </div>
      </q-expansion-item>
    </q-header>
    <div class="q-pt-xs">
      <q-list>
        <q-card flat class="q-mx-sm text-grey-8 text-caption q-mt-sm bg-white q-pa-sm" v-for="(item, key) in invoiceListData" :key="key">
          <div class="text-left q-pl-sm">
            单据号:
            <span class="text-center text-subtitle1 text-black">
              {{ item.sc_invoiceCode }}
            </span>
          </div>
          <div class="row q-pt-xs">
            <div class="col-6 ellipsis q-pl-sm">
              <span>会员姓名：{{ item.sc_memberName }}</span>
            </div>
            <div class="col-6 ellipsis q-pl-sm">
              <span class="">会员卡号：{{ item.sc_memberCardNum }}</span>
            </div>
            <div class="col-6 ellipsis q-pl-sm">
              <span class="">商品名称：{{ item.rtd_goods_name }}</span>
            </div>
            <div class="col-6 ellipsis q-pl-sm">
              <span class="">总时长（分钟）：{{ item.rtd_duration_total }}</span>
            </div>
            <div class="col-12 ellipsis q-pl-sm">
              <span class="">添加时间：{{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
            <div class="col-6 ellipsis q-pl-sm">
              <span class=""
                >状态：
                <span v-if="item.rtd_order_status == 1">已完成</span>
                <span v-else>已撤单</span>
              </span>
            </div>
            <div class="col-6 ellipsis q-pl-sm" v-if="item.rtd_note">
              <span class="">备注：{{ item.rtd_note }}</span>
            </div>
          </div>
        </q-card>
      </q-list>
    </div>
    <q-footer class="text-black bg-white" bordered>
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </q-footer>
  </q-page>
</template>
<script>
export default {
  name: 'TimeConsumption',
  components: {},

  data () {
    return {
      context: null,
      invoiceListData: [],

      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0
      },
      startTime: '',
      endTime: '',
      searchFrom: {
        userId: '',
        searchSerm: '',
        goodsText: '',
        created_at: '',
        updated_at: '',
        memberText: ''
      },
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
  mounted () {},
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
        rtd_recharge_type: 3,
        do: 'getConsumeTimeCardRecord',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getDatalist()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDatalist()
    },

    // 重置
    resetBut () {
      this.searchFrom = {
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        created_at: '',
        updated_at: '',
        memberText: '',
        goodsText: ''
      }
      this.startTime = ''
      this.endTime = ''
      this.getDatalist()
    },
    findReceipt () {
      this.$nextTick(() => {
        this.getDatalist()
      })
    },
    chearTimeEnd () {
      this.endTime = ''
      this.getDatalist()
    },
    chearTimeStart () {
      this.startTime = ''
      this.getDatalist()
    }
  }
}
</script>
