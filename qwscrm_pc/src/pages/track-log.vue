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
        <!-- <div class="col-auto q-pl-none q-gutter-sm no-wrap">
            <q-btn dense @click="openEditDialog" color="primary" icon="add" />
            <q-btn
              dense
              @click="openEditDialog(selected[0])"
              color="primary"
              icon="edit"
              :disable="selected && selected.length == 1 ? false : true"
            />
            <q-btn dense color="primary" @click="deleteData()" icon="delete" :disable="selected && selected.length > 0 ? false : true" />
          </div> -->
        <!-- <q-space /> -->

        <q-input v-model="conditionForm.content" clearable class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="内容" />
        <!-- <q-input v-model="conditionForm.onlyId" clearable class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="企业微信成员UserID|外部联系人的userid|企微群ID" /> -->

        <q-select
          v-model="conditionForm.type"
          :options="eventArr"
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
          {{ eventObject[props.row.type]  }}
        </q-td>

        <q-td key="msg" :props="props" class="text-center">
          <vue-json-viewer :expanded="true" :expand-depth="0" :value="JSON.parse(props.row.msg)"></vue-json-viewer>
        </q-td>

        <q-td key="content" :props="props" class="text-center">
          {{ props.row.content }}
        </q-td>
        <q-td key="count_num" :props="props" class="text-center">
          {{ props.row.count_num }}
        </q-td>

        <q-td key="create_time" :props="props" class="text-center">
          {{ date.formatDate(props.row.create_time * 1000,'YYYY-MM-DD HH:mm:ss')  }}

        </q-td>

        <!-- <q-td key="qw_userid" :props="props" class="text-center">
          {{ props.row.qw_userid }}
        </q-td> -->
<!--
        <q-td key="qw_external_userid" :props="props" class="text-center">
          {{ props.row.qw_external_userid }}
        </q-td>

        <q-td key="qw_chat_id" :props="props" class="text-center">
          {{ props.row.qw_chat_id }}
        </q-td> -->

      </q-tr>
    </template>

    <template v-slot:pagination>
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[15, 30, 50, 100, 200, 300, 500, 1000]"
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
        pSize: 15,
        pageTotal: 0
      },
      tableFullscreen: null,
      columns: [
        {
          name: 'type',
          label: '事件类型',
          field: 'type',
          align: 'cneter'
        },
        {
          name: 'msg',
          label: '事件JSON值',
          field: 'msg',
          align: 'cneter'
        },
        {
          name: 'content',
          label: '事件内容',
          field: 'content',
          align: 'cneter'
        },
        {
          name: 'count_num',
          field: 'count_num',
          label: '变化总数量',
          align: 'cneter'
        },
        {
          name: 'create_time',
          label: '事件创建时间',
          field: 'create_time',
          align: 'cneter'
        }
        // {
        //   name: 'qw_userid',
        //   label: '企业微信成员UserID',
        //   field: 'qw_userid',
        //   align: 'cneter'
        // }
        // {
        //   name: 'qw_external_userid',
        //   label: '外部联系人的userid',
        //   field: 'qw_external_userid',
        //   align: 'cneter'
        // },
        // {
        //   name: 'qw_chat_id',
        //   label: '企微群ID原生',
        //   field: 'qw_chat_id',
        //   align: 'cneter'
        // }

      ],
      loading: true,
      eventObject: {},
      eventArr: [],
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
      this.eventObject = systemLocal.enums.eventObjct
      this.eventArr = systemLocal.enums.eventArr
    }
  },
  methods: {
    getContactConsoleData () {
      this.$store
        .dispatch('contact/getContactConsoleData', { ...this.conditionForm, ...this.page })
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
