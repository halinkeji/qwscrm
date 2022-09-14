<template>
  <q-page>
    <div class="row q-mt-md">
      <div class="col-12 q-px-sm">
        <q-input outlined bottom-slots v-model="searchQuery" dense class="q-pb-none" @change="getList" @clear="getList" clearable label="可搜索:标题">
          <template v-slot:append>
            <q-icon name="search" @click="getList" />
          </template>
          <template v-slot:after>
            <q-btn flat round dense label="新增" color="primary" :to="{ name: 'memberEditTrack' }" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-pa-sm">
      <q-list bordered separator class="q-mb-sm">
        <div v-for="(item, key) in trackData" :key="key">
          <q-item>
            <q-item-section>
              <q-item-label>{{ item.ptr_title }}</q-item-label>
              <q-item-label lines="3" caption>描述：{{ item.ptr_detail }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>时间：{{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD  HH:mm') }}</q-item-label>
            </q-item-section>
          </q-item>

          <div class="row q-pa-sm">
            <div class="col">
              <div class="row items-center" v-if="item.ptr_loop_image">
                <img
                  v-for="i in item.ptr_loop_image.split(',')"
                  :src="$store.state.member.cdn_url + i"
                  style="width: 50px; height: 50px"
                  class="q-ml-md"
                  @click="showImgStatus(i)"
                />
              </div>
            </div>
          </div>

          <q-item-section>
            <q-item-label caption v-for="(i, k) in columnDefs" :key="k">{{ i.headerName }}:{{ item[i.field] }}</q-item-label>
          </q-item-section>

          <q-separator />

          <div class="row text-center q-my-sm">
            <div class="col">
               <q-btn outline color="primary" :to="{ name: 'memberEditTrack', query: { id: item.id }}"  label="编辑" />
            </div>
            <div class="col">
              <q-btn outline @click="del(item)" color="negative" label="删除" />
            </div>
          </div>

        </div>
      </q-list>
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

    <q-dialog v-model="imgPopup" maximized persistent>
      <q-card class="z-top">
        <div class="q-pa-sm q-mt-md">
          <q-img class="fixed-center full-width" :src="imgUrl"> </q-img>
        </div>

        <q-page-sticky position="bottom" :offset="[0, 18]">
          <q-btn round color="primary" unelevated icon="close" @click="imgPopup = false" />
        </q-page-sticky>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'tracking',
  data () {
    return {
      imgPopup: false,
      imgUrl: '',
      trackData: [],
      name: '',
      searchQuery: '',
      trackConfigData: {},
      columnDefs: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      member_id: ''
    }
  },
  mounted () {
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
  created () {
    // this.getStatus()
  },
  computed: {},
  methods: {
    getStatus () {
      this.$store
        .dispatch('track/getStatus')
        .then((res) => {
          if (res.code == 200) {
            this.trackConfigData = res.data ? res.data : {}
            this.getColumnDefs(res.data)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    getColumnDefs (val) {
      if (val && parseInt(val.track_config_from) > 0) {
        const params = {
          formId: parseInt(val.track_config_from),
          page: this.page.pageIndex,
          pSize: this.page.pageSize
        }
        this.$store
          .dispatch('formfield/getTemplateList', params)
          .then((res) => {
            if (res.code == 200) {
              this.columnDefs = res.data.columnDefs ? res.data.columnDefs : 0
            }
          })
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },

    getList () {
      const obj = {
        name: this.name,
        text: this.searchQuery,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        overtime: 1,
        do: 'getTrackList',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', obj)
        .then((res) => {
          if (res.code == 200) {
            this.trackData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    del (item) {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${item.ptr_title}"的记录吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            trackId: item.id,
            do: 'deteleTrackData'
          }
          this.$store
            .dispatch('member/postApi', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除记录!',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getList()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
        .onCancel((err) => {})
    },
    showImgStatus (val) {
      this.imgPopup = true
      this.imgUrl = this.$store.state.member.cdn_url + val
    }
  }
}
</script>
