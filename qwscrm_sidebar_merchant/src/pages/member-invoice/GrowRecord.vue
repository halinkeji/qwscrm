<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          成长值变更记录
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div class="q-pa-sm">
      <div v-for="(item, key) in growRecordData" v-if="growRecordData.length > 0">
        <q-list bordered separator class="q-mt-xs">
          <q-card flat class="q-mx-sm text-grey-8 text-caption bg-white">
            <div class="row q-pt-sm q-pl-sm">
              <div class="col-6 ellipsis">
                <span>变更备注：{{ item.grr_source_note }}</span>
              </div>
              <div class="col-6 ellipsis">
                变更类型：
                <span v-if="item.grr_change_type == 1">增加</span>
                <span v-if="item.grr_change_type == 2">减少</span>
              </div>
              <div class="col-6 ellipsis">
                <span>成长值：{{ item.grr_change_value }}</span>
              </div>
              <div class="col-12 ellipsis">
                <span>添加时间：{{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span>
              </div>
            </div>
          </q-card>
        </q-list>
      </div>
      <div class="bg-white text-h6 text-grey text-center" style="padding-top: 50px" v-if="growRecordData.length == 0">
        <q-icon name="fas fa-box-open" size="58px" class="text-grey-8" />
        <div class="q-pt-md">暂无信息</div>
      </div>
    </div>
    <q-footer class="text-black bg-white" bordered>
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </q-footer>
  </q-page>
</template>
<script>
export default {
  name: 'GrowRecord',
  components: {},
  data () {
    return {
      growRecordData: [],
      searchQuery: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      member_id: ''
    }
  },
  mounted () {},
  computed: {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getList()
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
  methods: {
    getList () {
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        do: 'getGrowRecord',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            this.growRecordData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    clearnBut () {
      this.searchQuery = ''
      this.getList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }

  }
}
</script>
