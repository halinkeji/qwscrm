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
      :loading="loading"
      separator="cell"
    >
      <template v-slot:top="props">
        <div class="row q-col-gutter-x-md q-col-gutter-y-xs full-width">
          <div class="col-auto q-pl-none q-gutter-sm no-wrap">
            <q-btn dense color="primary" @click="openEditDialog" icon="add" />
            <q-btn dense color="primary" icon="edit" :disable="selected.length !== 1" @click="openEditDialog(selected[0].id)" />
            <q-btn dense color="primary" icon="delete" @click="deleteData()" :disable="selected.length === 0" />
          </div>

          <q-space />

          <q-input v-model="textSearch" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="应用名称" />

          <q-space />

          <q-btn-group flat rounded class="col-auto">
            <q-btn color="grey-3" @click="getDataList" text-color="dark" icon="search" />
            <q-btn color="grey-3" text-color="dark" :icon="searchToggle ? 'zoom_out' : 'zoom_in'" @click="searchToggle = !searchToggle" />
            <q-btn color="grey-3" text-color="dark" icon="las la-search-minus" @click="resetSearch" />
          </q-btn-group>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="selected" size="sm" :val="props.row" />
          </q-td>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="corpid" :props="props">
            {{ props.row.corpid }}
          </q-td>
          <!-- <q-td key="type" :props="props">
            {{ typeObject[props.row.type]  }}
          </q-td> -->
          <q-td key="agentid" :props="props">
            {{ props.row.agentid }}
          </q-td>

          <q-td key="secret" :props="props">
            {{ props.row.secret }}
          </q-td>

          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>

          <q-td key="is_sync" :props="props">
            <q-toggle v-model="props.row.is_sync" @input="changeSyncStatus(props.row.id,$event)" true-value="1" false-value="0" color="green" />
          </q-td>

          <!-- <q-td key="close" :props="props">
            {{ props.row.close }}
          </q-td> -->
          <q-td key="home_url" :props="props">
            {{ props.row.home_url }}
            <q-btn outline round color="primary" size="sm" dense @click="doCopy(props.row.home_url)" icon="las la-copy" />
          </q-td>

          <q-td key="operate" :props="props">
            <q-btn outline color="orange" label="更新" @click="cloudSyncGet(props.row)" class="q-mr-xs" />

            <q-btn outline color="negative" label="删除" @click="deleteData(props.row.id)" class="q-mr-xs" />
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
    <edit-agent v-if="editDialogStatus" ref="editDialogRef" @closeDialog="getDataList" />
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'
import EditAgent from './EditAgent.vue'
export default {
  name: 'agentManage',
  components: {
    EditAgent
  },
  data () {
    return {
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      textSearch: '',
      searchToggle: false,
      loading: false,
      dialogForm: {
        order: 0, // 排序
        name: '' // 名称
      },
      selected: [],
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left' },
        { name: 'corpid', label: '企业微信ID', field: 'corpid', align: 'left' },
        // { name: 'type', label: '应用类型', field: 'type', align: 'left' },
        { name: 'agentid', label: '企业应用id', field: 'agentid', align: 'left' },
        { name: 'secret', label: '应用Secret', field: 'secret', align: 'left' },
        { name: 'name', label: '企业应用名称', field: 'name', align: 'left' },
        { name: 'is_sync', label: '同步支持', field: 'is_sync', align: 'left' },
        // { name: 'close', label: '企业应用是否被停用', field: 'close', align: 'left' },
        { name: 'home_url', label: '应用主页url', field: 'home_url', align: 'left' },
        { name: 'operate', label: '操作', field: 'id', align: 'left' }
      ],
      dataList: [], // 列表数据
      editDialogStatus: false, // 弹窗开关
      typeObject: {
        1: '应用主页',
        2: '收发消息',
        3: '授权登录'
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    console.log('pageTable created')
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
    doCopy (val) {
      copyToClipboard(val)
        .then(() => {
          this.$q.notify({
            color: 'positive',
            textColor: 'white',
            position: 'top-right',
            icon: 'ion-checkmark-circle-outline',
            message: '复制成功'
          })
        })
        .catch(() => {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: '复制失败.'
          })
        })
    },
    // 加载列表
    getDataList () {
      this.loading = true
      this.editDialogStatus = false
      const payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        name: this.textSearch
      }
      this.$store
        .dispatch('agent/getData', payload)
        .then((res) => {
          if (res.code == 200) {
            // 判断返回值是否为真
            this.dataList = res.data ? res.data.list : []

            // 给分页组件传总数量
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

    // 重置搜索项
    resetSearch () {
      const that = this
      this.textSearch = ''
      // 等待搜索项清空 执行查询列表
      this.$nextTick(() => {
        that.getDataList()
      })
    },

    // 删除列表数据
    deleteData (id) {
      let delIds = []
      if (id) {
        delIds = [{ id }]
      } else {
        delIds = this.selected.map((item) => {
          return {
            id: item.id
          }
        })
      }
      this.loading = true
      this.$store
        .dispatch('agent/deleteData', { delIds })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.getDataList()
            this.$q.notify({
              message: '成功',
              caption: `已删除 ${res.data} 条应用信息`,
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.selected = []
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

    // 新增弹出框
    openEditDialog (agentId) {
      this.editDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editDialogRef.init(agentId)
      })
    },

    changeSyncStatus (agentId, status) {
      if (agentId) {
        const obj = {
          agentId,
          status
        }
        this.$store
          .dispatch('agent/openSyncData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '更新成功！',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green'
              })
              this.getDataList()
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
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
      }
    },

    cloudSyncGet (item) {
      if (item) {
        const obj = {
          AgentId: item.agentid,
          Secret: item.secret
        }
        this.$store
          .dispatch('agent/cloudSyncGet', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '更新成功！',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green'
              })
              this.getDataList()
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
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
      }
    }
  }
}
</script>
