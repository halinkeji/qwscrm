<template>
  <q-page class="bg-color-EAE full-width column no-wrap">
    <q-infinite-scroll @load="onLoad" :offset="250" ref="infiniteScroll">
      <div class="q-mx-xs">
        <q-card class="shadow-box q-px-lg" v-if="trackLogData && trackLogData.length > 0">
          <q-timeline color="secondary" class="q-pt-md">
            <q-timeline-entry :key="`key${key}`" v-for="(item, key) in trackLogData">
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
        </q-card>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>

      <div class="row text-center q-mt-md q-px-md" v-show="dividerShow">
        <div class="col-4">
          <q-separator class="q-my-sm" />
        </div>
        <div class="col-4">我是有底线的</div>
        <div class="col-4">
          <q-separator class="q-my-sm" />
        </div>
      </div>
    </q-infinite-scroll>
    <q-footer bordered class="bg-grey-2 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-input readonly v-model="dateTime" rounded outlined dense class="q-py-xs" placeholder="请选择日期搜索">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date minimal v-model="dateTime" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" @click="getTimeData" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon v-if="dateTime === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="dateTime = ''" />
            </template>
          </q-input>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <q-page-scroller expand position="top" :scroll-offset="150" :offset="[0, 0]">
      <div class="col cursor-pointer q-pa-sm bg-primary text-white text-center">点击返回顶部...</div>
    </q-page-scroller>
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'PageTrack',
  components: {},
  data () {
    return {
      dateTime: '',
      date: null,
      trackLogData: [],
      dividerShow: false,
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0
      },
      contact_id: ''
    }
  },
  computed: {},
  mounted () {
    this.getContactConsoleData()
  },
  created () {
    this.date = date
    if (this.$store.state.oauth.qw_external_userid) {
      this.contact_id = this.$store.state.oauth.qw_external_userid
    } else {
      this.$router.push({ name: 'home' })
    }
  },
  methods: {
    getTimeData () {
      this.trackLogData = []
      this.page.totalCount = 0
      this.$refs.infiniteScroll.reset()
      this.$nextTick(() => {
        this.getContactConsoleData()
      })
    },
    getContactConsoleData () {
      this.$store
        .dispatch('contact/getContactConsoleData', { dateTime: this.dateTime, ...this.page, contactUser: this.contact_id })
        .then((res) => {
          if (res.code == 200) {
            this.trackLogData = res.data ? this.trackLogData.concat(res.data.list) : this.trackLogData
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    onLoad (index, done) {
      this.dividerShow = false
      setTimeout(() => {
        if (this.trackLogData.length == this.page.totalCount) {
          this.$refs.infiniteScroll.stop()
          this.dividerShow = true
        } else {
          this.page.pageIndex = index + 1
          this.getContactConsoleData()
          done()
        }
      }, 2000)
    }
  }
}
</script>
<style lang="scss"></style>
