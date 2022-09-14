<template>
  <q-page class="bg-white">
    <q-header bordered class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left"  @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          会员次卡
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div class="q-px-sm q-pt-sm ful-height">
      <div class="q-mb-md" v-for="(item, key) in deductCountList">
        <q-card bordered flat>
          <div class="bg-blue-4">
            <div class="row q-pa-sm text-white">
              <div class="text-bold text-subtitle1 ellipsis ">
                {{ item.mrc_goodsName }}
              </div>
              <q-space />
            </div>

            <div class="row text-white">
              <div class="col-8 q-pt-lg q-pl-sm">
                <div class="text-caption text-bold q-mt-sm ellipsis">
                  {{ ruleFormatText(item) }}
                </div>
              </div>
              <div class="col-4 text-right q-pa-sm">
                <div class="text-h3 text-bold">{{ item.mrc_count }}<span class="text-caption q-ml-xs">/次</span></div>
              </div>
            </div>
          </div>
          <div class="bg-white q-pa-md row items-center">
            <div class="col-8">有效期：{{ endTimeFormatText(item) }}</div>
          </div>
        </q-card>
      </div>

      <div class="bg-white text-h6 text-grey text-center" style="padding-top: 50px" v-if="deductCountList.length == 0">
        <q-icon name="fas fa-box-open" size="58px" class="text-grey-8" />
        <div class="q-pt-md">暂无信息</div>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'deductCount',
  components: {},
  data () {
    return {
      printInvoiceStatus: true,
      deductCountList: [],

      member_id: ''
    }
  },

  mounted () {},
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
  watch: {},
  computed: {},
  methods: {
    // 获取次卡列表
    getListData () {
      const obj = {
        do: 'getUseCountCard',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.deductCountList = res.data
          }
        })
        .catch((error) => {})
    },
    editCount (data) {
      this.$refs.integralSetEdit.openEditDialog(data)
    },

    endTimeFormatText (item) {
      const timeData = new Date()
      if (parseInt(item.mrc_endTime) >= 2147457847) {
        return '永久有效'
      } else if (parseInt(item.mrc_endTime) < this.$q_date.formatDate(timeData, 'X')) {
        return '已过期'
      } else {
        return this.$q_date.formatDate(item.mrc_endTime * 1000, 'YYYY-MM-DD HH:mm')
      }
    },
    ruleFormatText (item) {
      if (parseInt(item.mrc_limitTime) == 1) {
        return '不限制规定时间使用次数'
      } else if (parseInt(item.mrc_limitTime) == 2) {
        return '使用限制为每年可使用' + item.mrc_limitCount + '次'
      } else if (parseInt(item.mrc_limitTime) == 3) {
        return '使用限制为每季度可使用' + item.mrc_limitCount + '次'
      } else if (parseInt(item.mrc_limitTime) == 4) {
        return '使用限制为每月可使用' + item.mrc_limitCount + '次'
      } else if (parseInt(item.mrc_limitTime) == 5) {
        return '使用限制为每周可使用' + item.mrc_limitCount + '次'
      } else {
        return '使用限制为每天可使用' + item.mrc_limitCount + '次'
      }
    }
  }
}
</script>
