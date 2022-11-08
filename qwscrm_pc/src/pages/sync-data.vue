<template>
  <hl-table
    row-key="id"
    dense
    stickyHeader
    :data="trackLogData"
    :columns="columns"
    :fullscreen.sync="tableFullscreen"
    :loading="loading"
    separator="cell"
  >
    <template v-slot:top="props">
      <div class="row q-col-gutter-x-md q-col-gutter-y-xs full-width">

        <q-select
          v-model="conditionForm.type"
          :options="syncTypeArr"
          label="请选择类型"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          dense
          class="col-6 col-sm-4 col-md-3 col-lg-2"
        >
          <template v-if="conditionForm.type" v-slot:append>
            <q-icon name="cancel" @click.stop="conditionForm.type = null" class="cursor-pointer" />
          </template>
        </q-select>

        <q-input
          readonly
          v-model="conditionForm.dateTime"
          rounded
          dense
          class="q-py-xs col-6 col-sm-4 col-md-3 col-lg-2"
          placeholder="请选择日期时间搜索"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="conditionForm.dateTime" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon v-if="!conditionForm.dateTime" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="conditionForm.dateTime = ''" />
          </template>
        </q-input>

        <q-space />

        <q-btn-group flat rounded class="col-auto">
          <q-btn color="grey-3" @click="getContactConsoleData" text-color="dark" icon="search" />
          <q-btn color="grey-3" text-color="dark" icon="las la-search-minus" @click="resetSearch" />
        </q-btn-group>
      </div>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">

        <q-td key="type" :props="props" class="text-center">
          {{ syncTypeObjct[props.row.type]  }}
        </q-td>

        <q-td key="last_sync_time" :props="props" class="text-center">
          {{ date.formatDate(props.row.last_sync_time * 1000,'YYYY-MM-DD HH:mm:ss')  }}
        </q-td>

        <q-td key="sync_msg" :props="props" class="text-center">
          {{ JSON.parse(props.row.sync_msg) }}
          <!-- <vue-json-viewer :expanded="true" :expand-depth="0" :value="JSON.parse(props.row.sync_msg)"></vue-json-viewer> -->
        </q-td>

      </q-tr>
    </template>

    <template v-slot:pagination>
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[ 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </template>
  </hl-table>
</template>

<script>
import { date, LocalStorage } from 'quasar'
export default {
  name: 'TrackLog',
  components: {},
  data () {
    return {
      trackLogData: [],
      date: null,
      page: {
        pageIndex: 1,
        pSize: 50,
        pageTotal: 0
      },
      tableFullscreen: null,
      columns: [
        {
          name: 'type',
          label: '同步类型',
          field: 'type',
          align: 'cneter'
        },
        {
          name: 'last_sync_time',
          label: '最后一次的同步时间',
          field: 'last_sync_time',
          align: 'cneter'
        },
        {
          name: 'sync_msg',
          label: '跟踪事件',
          field: 'sync_msg',
          align: 'cneter'
        }

      ],
      loading: true,
      syncTypeObjct: {},
      syncTypeArr: [],
      conditionForm: {
        dateTime: null,
        type: '',
        content: '',
        onlyId: ''

      }
    }
  },
  computed: {},
  mounted () {
    this.getContactConsoleData()
  },
  created () {
    this.date = date
    const systemLocal = LocalStorage.getItem('qwscrm_system_local')
    if (systemLocal && systemLocal.enums) {
      this.syncTypeObjct = systemLocal.enums.syncTypeObjct
      this.syncTypeArr = systemLocal.enums.syncTypeArr
    }
  },
  methods: {
    getContactConsoleData () {
      this.$store
        .dispatch('contact/getSyncData', { ...this.conditionForm, ...this.page })
        .then((res) => {
          if (res.code == 200) {
            this.loading = false
            this.trackLogData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    resetSearch () {
      const that = this
      this.conditionForm = {
        dateTime: null,
        type: '',
        content: '',
        onlyId: ''
      }
      // 等待搜索项清空 执行查询列表
      this.$nextTick(() => {
        that.getContactConsoleData()
      })
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
