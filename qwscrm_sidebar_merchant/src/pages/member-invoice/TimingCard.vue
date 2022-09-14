<template>
  <q-page class="bg-white">
    <!-- 顶部导航 -->
    <q-header class="bg-white" bordered>
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          会员时卡
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div class="q-mb-md q-pa-sm" v-for="(item, key) in deductTimeList" :key="key">
      <q-card bordered flat>
        <div class="bg-blue-4">
          <div class="row q-pa-sm text-white justify-between">
            <div class="text-bold text-subtitle1 ellipsis ">
              {{ item.mtr_goods_name }}
            </div>

            <!-- <q-btn flat unelevated dense label="领取" :to="{ name: 'timingCardReceive', query: { timingRecordId: item.id } }" /> -->
          </div>
          <div class="text-white text-right q-pa-sm">
            <div class="text-h4 text-bold q-mt-xs">{{ item.mtr_duration }}<span class="text-caption q-ml-xs">/分钟</span></div>
          </div>
        </div>
        <div class="bg-white q-pa-sm">
          <div class="q-py-sm">有效期：{{ endTimeFormatText(item) }}</div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'deductDuration',
  components: {},
  data () {
    return {
      printInvoiceStatus: true,
      checkoutPageReceive: false,
      deductTimeList: [],
      member_id: ''
    }
  },

  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getListData()
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
    // 获取时卡列表
    getListData () {
      const obj = {
        do: 'getUseTimingCard',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.deductTimeList = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '注意',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    endTimeFormatText (item) {
      const timeData = new Date()
      if (parseInt(item.mtr_end_time) >= 2147457847) {
        return '永久有效'
      } else if (parseInt(item.mtr_end_time) < this.$q_date.formatDate(timeData, 'X')) {
        return '已过期'
      } else {
        return this.$q_date.formatDate(item.mtr_end_time * 1000, 'YYYY-MM-DD HH:mm')
      }
    },
    alreadyEndTimeFormatText (item) {
      const timeData = new Date()
      if (parseInt(item.rtd_time_rule_end) >= 2147457847) {
        return '永久有效'
      } else if (parseInt(item.rtd_time_rule_end) < this.$q_date.formatDate(timeData, 'X')) {
        return '已过期'
      } else {
        return this.$q_date.formatDate(item.rtd_time_rule_end * 1000, 'YYYY-MM-DD HH:mm')
      }
    }
  }
}
</script>
