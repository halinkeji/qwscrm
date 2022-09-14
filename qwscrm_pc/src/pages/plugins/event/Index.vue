<template>
  <div>
    <hl-table
      row-key="id"
      dense
      stickyHeader
      :data="dataList"
      :columns="columns"
      selection="multiple"
      :selected.sync="selected"
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

          <q-input v-model="conditionForm.name" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="事件" />
          <q-select
            v-model="conditionForm.status"
            :options="options_status"
            label="请选择状态"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            dense
            class="col-6 col-sm-4 col-md-3 col-lg-2"
          >
            <template v-if="conditionForm.status" v-slot:append>
              <q-icon name="cancel" @click.stop="conditionForm.status = null" class="cursor-pointer" />
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
                      <q-btn v-close-popup label="确定"  color="primary" flat />
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
            <q-btn color="grey-3" @click="getDataList" text-color="dark" icon="search" />
            <q-btn color="grey-3" text-color="dark" icon="las la-search-minus" @click="resetSearch" />
          </q-btn-group>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="selected" size="sm" :val="props.row.id" />
          </q-td>
          <q-td key="name" :props="props" class="text-center">
            {{ props.row.name }}
          </q-td>
          <q-td key="created_at" :props="props" class="text-center">
            {{ formatDate(props.row.created_at) }}
          </q-td>
          <q-td key="updated_at" :props="props" class="text-center">
            {{ formatDate(props.row.updated_at) }}
          </q-td>
          <q-td key="complete_time" :props="props" class="text-center">
            <span v-if="parseInt(props.row.status) == 5">
              {{ formatDate(props.row.updated_at) }}
            </span>
            <span>
              未归档
            </span>
          </q-td>
          <q-td key="status" :props="props" class="text-center">
            {{ eventStatusObject[props.row.status] }}
          </q-td>
          <q-td key="id" :props="props" class="text-center">
            <q-btn outline color="orange" label="查看详情" @click="getLogData(props.row.id,props.row.contact_id)" class="q-mr-xs"  />
          </q-td>
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
    <event-log-detail v-if="openDetailStatus" ref="detailDialogRef" @closeDialog="closeDialog" />
  </div>
</template>

<script>
import { date } from 'quasar'
import eventLogDetail from './Detail.vue'
export default {
  name: 'ContactField',
  components: {
    eventLogDetail
  },
  data () {
    return {
      textSearch: null,
      statusSearch: null,
      contactAuthSearch: null,
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      loading: false,

      selected: [],
      tableFullscreen: null,
      columns: [
        {
          name: 'name',
          label: '事件',
          field: 'name',
          align: 'cneter'
        },
        {
          name: 'created_at',
          field: 'created_at',
          label: '添加时间',
          align: 'cneter'
        },
        {
          name: 'updated_at',
          label: '最近一次处理时间',
          field: 'updated_at',
          align: 'cneter'
        },
        {
          name: 'complete_time',
          label: '处理完成时间',
          field: 'complete_time',
          align: 'cneter'
        },
        {
          name: 'status',
          label: '状态',
          field: 'status',
          align: 'cneter'
        },
        {
          name: 'id',
          label: '操作',
          field: 'id',
          align: 'cneter'
        }
      ],
      dataList: [], // 列表数据

      syncDate: '',
      eventStatusObject: this.$store.state.eventManage.eventStatusObject,
      eventStatusArr: this.$store.state.eventManage.eventStatusArr,
      options_status: [
        {
          label: '展示',
          value: '1'
        },
        {
          label: '不展示',
          value: '0'
        }
      ],

      conditionForm: {
        status: '',
        name: '',
        dateTime: null
      },
      openDetailStatus: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDataList()
  },
  mounted () {
    console.log('pageTable mounted')
  },
  activated () {
    console.log('pageTable activated')
  },
  deactivated () {
    console.log('pageTable deactivated')
  },
  destroyed () {
    console.log('pageTable destroyed')
  },
  methods: {
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return ''
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDataList()
    },

    // 加载列表
    getDataList () {
      this.loading = true
      const payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        ...this.conditionForm
      }
      this.$store
        .dispatch('eventManage/getData', payload)
        .then((res) => {
          if (res.code == 200) {
            // 给分页组件传总数量
            this.dataList = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
          this.loading = false
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    getLogData (eventId, contact_id) {
      this.openDetailStatus = true
      this.$nextTick(() => {
        this.$refs.detailDialogRef.init(eventId, contact_id)
      })
    },

    // 重置搜索项
    resetSearch () {
      const that = this
      this.conditionForm = {
        status: '',
        name: '',
        dateTime: null
      }

      // 等待搜索项清空 执行查询列表
      this.$nextTick(() => {
        that.getDataList()
      })
    },

    // 删除列表数据
    deleteData (id) {
      let delIds = []
      if (id) {
        delIds = [id]
      } else {
        delIds = this.selected
      }

      this.loading = true
      this.$store
        .dispatch('contactField/deteleField', { delIds })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.getDataList()
            this.$q.notify({
              message: '成功',
              caption: `已删除 ${res.data} 条字段信息`,
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    closeDialog () {
      this.openDetailStatus = false
      this.getDataList()
    }
  }
}
</script>
