<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding  q-pt-xs">
          优惠券记录
        </q-toolbar-title>
      </q-toolbar>
      <div class="row bg-white">
        <div class="col q-pa-sm">
          <q-input
            label="可搜索:核销码"
            outlined
            v-model="searchQuery"
            dense
            clearable
            @change="findList"
            @clear="getNotUseCouponList"
            class="q-pb-none"
          >
            <template v-slot:append>
              <q-icon name="search" @click="getNotUseCouponList" />
            </template>
          </q-input>
        </div>
      </div>
    </q-header>
    <div class="q-pt-xs">
      <div v-for="(item, key) in notUseCouponData" :key="key">
        <q-list bordered separator class="q-mt-sm q-mx-sm">
          <q-item class="q-pa-sm">
            <q-badge color="green-6" floating v-if="parseInt(item.cmd_status) == 1">未领取</q-badge>
            <q-badge color="green" floating v-else-if="parseInt(item.cmd_status) == 2">未使用</q-badge>
            <q-badge color="grey-6" floating v-else-if="parseInt(item.cmd_status) == 3">已使用</q-badge>
            <q-item-section>
              <div class="text-subtitle2">核销码：{{ item.cmd_verificationCode }}</div>
              <div class="text-subtitle2" v-if="item.coupon">卡券名称：{{ item.coupon.cou_title }}</div>
              <q-separator />
              <div class="row q-pt-xs">
                <div class="col-12 ellipsis">
                  <span>领取时间：{{ $q_date.formatDate(item.cmd_memberreceivetime * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
                </div>
                <div class="col-12 ellipsis">
                  <span>到期时间：{{ $q_date.formatDate(item.cmd_activityendtime * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
                </div>
                <div class="col-12 ellipsis">
                  使用时间：{{ item.cmd_memberusetime ? $q_date.formatDate(item.cmd_memberusetime * 1000, 'YYYY-MM-DD HH:mm:ss') : '未使用' }}
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
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
  </q-page>
</template>
<script>
export default {
  name: 'CouponList',
  components: {},
  data () {
    return {
      startTime: '',
      endTime: '',
      notUseCouponData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      searchQuery: '',
      currentMemberId: ''
    }
  },
  computed: {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getNotUseCouponList()
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
  methods: {
    getNotUseCouponList () {
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        status: [1, 2, 3, 4],
        pageIndex: this.page.pageIndex,
        do: 'getCouponList',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            this.notUseCouponData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getNotUseCouponList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getNotUseCouponList()
    },
    clean () {
      this.searchQuery = ''
      this.startTime = ''
      this.endTime = ''
      this.getNotUseCouponList()
    },
    findList () {
      this.$nextTick(() => {
        this.getNotUseCouponList()
      })
    }
  }
}
</script>
