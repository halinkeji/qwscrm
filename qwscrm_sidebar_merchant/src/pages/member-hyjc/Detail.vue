<template>
  <q-page >
    <!-- 顶部导航 -->
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">寄存记录详情 </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-card flat class="q-pa-sm">
      <q-timeline color="primary" class="q-ma-sm">

        <q-timeline-entry :subtitle="$q_date.formatDate(recordData.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')">
          <div>
            <q-img v-if="recordData.phr_loop_image.length <= 0" width="70px" height="70px">
              <template>
                <div class="absolute-full flex flex-center bg-grey-3  text-dark">
                  <q-icon name="wallpaper" color="grey" size="35px"> </q-icon>
                </div> </template
            ></q-img>
            <q-img
              v-for="(i, k) in recordData.phr_loop_image"
              :key="i"
              :src="`${$store.state.member.cdn_url}` + i"
              width="70px"
              height="70px"
              v-else
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3  text-dark">
                  <q-icon name="wallpaper" color="grey" size="35px"> </q-icon>
                </div>
              </template>
            </q-img>
            <q-list  separator class="q-mt-sm">
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-item-label class="text-subtitle1" lines="1"> 首次存入 - {{ recordData.phr_name }} </q-item-label>
                  <div class="row text-caption text-grey">
                    <div class="col-6" v-if="recordData.member">名称: {{ recordData.member.mem_memberName }}</div>
                    <div class="col-6" v-if="recordData.member">卡号: {{ recordData.member.mem_memberCardNum }}</div>
                    <div class="col-12">剩余数量：{{ recordData.phr_quantity }}</div>
                    <div class="col-12">备注：{{ recordData.phr_remarks }}</div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          :title="item.phd_status == 1 ? '存入' : '取出'"
          :subtitle="$q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')"
          v-for="(item, key) in recordData.detail"
          :key="key"

        >
          <div class="text-caption">
            <div>操作前数量：{{ item.phd_quantity }}</div>
            <div>操作数量：{{ item.phd_operatel_quantity }}</div>
            <div>剩余数量：{{ item.phd_last_quantity }}</div>
          </div>
          <div>备注：{{ item.phd_remarks }}</div>
        </q-timeline-entry>
      </q-timeline>
    </q-card>

  </q-page>
</template>
<script>
export default {
  name: 'hyjcDetail',
  data () {
    return {
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      recordData: {
        phr_loop_image: []
      },
      detailLists: [],
      member_id: ''
    }
  },
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        if (parseInt(this.$route.query.recordId) > 0) {
          this.init(this.$route.query.recordId)
        }
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
    // 查询寄存记录单条记录
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('member/postApi', {
            do: 'getHyjcRecordDetail',
            hyjcRecirdId: id,
            member_id: this.member_id
          })
          .then((res) => {
            if (res.code == 200) {
              this.recordData = res.data ? res.data : {}
              this.recordData.detail = res.data && res.data.detail ? res.data.detail : []
              this.recordData.phr_loop_image = res.data.phr_loop_image ? this.recordData.phr_loop_image.split(',') : []
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    }

  }
}
</script>
