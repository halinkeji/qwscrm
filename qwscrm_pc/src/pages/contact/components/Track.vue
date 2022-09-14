<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll" :style="{ height: $q.screen.height * 0.8 + 'px', 'max-height': $q.screen.height * 0.8 + 'px', 'min-height': $q.screen.height * 0.8 + 'px' }">
    <div class="col-shrink q-pa-sm full-height">
      <!-- <q-scroll-area class="fit full-height"> -->
        <q-timeline color="primary" class="q-px-md full-height">
          <q-timeline-entry :key="`key${key}`" icon="las la-tag" v-for="(item, key) in trackLogData">
            <!-- <template v-slot:title>
              <div class="text-subtitle2">{{ item. }}</div>
            </template> -->
            <template v-slot:subtitle>
              <div class="text-weight-bold">{{ date.formatDate(item.created_at * 1000, 'YYYY年MM月DD日 HH:mm:ss') }}</div>
            </template>
            <div>
              {{ item.content }}
            </div>
          </q-timeline-entry>
        </q-timeline>
      <!-- </q-scroll-area> -->
    </div>

    <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[15, 30, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'PageTrack',
  components: {},
  props: ['qwExternalUserid'],
  data () {
    return {
      trackLogData: [],

      page: {
        pageIndex: 1,
        pSize: 15,
        pageTotal: 0
      }
    }
  },
  computed: {},
  mounted () {
    this.getContactConsoleData()
  },
  created () {
    this.date = date
  },
  methods: {
    getContactConsoleData () {
      this.$store
        .dispatch('contact/getContactConsoleData', { dateTime: this.dateTime, ...this.page, contactUser: this.qwExternalUserid })
        .then((res) => {
          if (res.code == 200) {
            this.trackLogData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getContactConsoleData()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getContactConsoleData()
    }
  }
}
</script>
