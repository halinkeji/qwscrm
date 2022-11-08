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
            <q-btn dense color="primary" icon="delete" @click="deleteData(0)" :disable="selected.length === 0" />
          </div>

          <q-space />

          <q-input v-model="textSearch" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="应用ID" />

          <q-space />

          <q-btn-group flat rounded class="col-auto">
            <q-btn color="grey-3" @click="getDataList" text-color="dark" icon="search" />
            <!-- <q-btn color="grey-3" text-color="dark" :icon="searchToggle ? 'zoom_out' : 'zoom_in'" @click="searchToggle = !searchToggle" /> -->
            <q-btn color="grey-3" text-color="dark" icon="las la-search-minus" @click="resetSearch" />
          </q-btn-group>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox v-model="selected" size="sm" :val="props.row" />
          </q-td>
          <q-td key="aid" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="corpid" :props="props">
            {{ props.row.corpid }}
          </q-td>
          <q-td key="suite_id" :props="props">
            {{ props.row.suite_id }}
          </q-td>
            <q-td key="suite_secret" :props="props">
            {{ props.row.suite_secret }}
          </q-td>
            <q-td key="token" :props="props">
            {{ props.row.token }}
          </q-td>
            <q-td key="encodingAesKey" :props="props">
            {{ props.row.encodingAesKey }}
          </q-td>
             <q-td key="type" :props="props">
            {{ typeObject[props.row.type]  }}
          </q-td>
            <q-td key="redirect_uri_data" :props="props">
            {{ props.row.redirect_uri_data }}
          </q-td>
            <q-td key="redirect_uri_do" :props="props">
            {{ props.row.redirect_uri_do }}
          </q-td>

          <q-td key="suite_home_url" :props="props">
            {{ props.row.suite_home_url }}
          </q-td>

          <q-td key="redirect_uri_install" :props="props">
            {{ props.row.redirect_uri_install }}
          </q-td>
          <q-td key="redirect_uri_single" :props="props">
            {{ props.row.redirect_uri_single }}
          </q-td>

          <q-td key="redirect_uri_oauth" :props="props">
            {{ props.row.redirect_uri_oauth }}
          </q-td>

          <q-td key="operate" :props="props">
            <q-btn outline color="orange" label="API配置 " @click="openAgentApiDialog(props.row.id)" class="q-mr-xs" />

            <q-btn outline color="positive" label="授权企业 " @click="openApiDialog(props.row)" class="q-mr-xs" />

            <q-btn outline color="orange" label="编辑" @click="openEditDialog(props.row.id)" class="q-mr-xs" />

            <q-btn outline color="negative" label="删除" @click="deleteData(props.row.id)" class="q-mr-xs" />

            <q-btn outline color="primary" label="授权二维码" @click="openQrcode(props.row.id)" class="q-mr-xs" />

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
    <agent-corp v-if="editApiStatus" ref="editApiDialogRef" @closeDialog="getDataList" />
    <agent-api v-if="editAgentApiStatus" ref="editAgentApiDialogRef" @closeDialog="getDataList" />

    <q-dialog v-model="showQrcodeDialog" @hide="hideQrcode">
      <q-card>
        <q-card-section>
          <div class="text-subtitle2 text-center">授权二维码</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <qrcode-vue :value="qrcode_url" :size="'200'" level="H" />

          </q-card-section>

        <q-card-actions align="right">
          <q-btn class="full-width" label="关闭" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'
import EditAgent from './EditAgent.vue'
import AgentCorp from './AgentCorp.vue'
import AgentApi from './AgentApi.vue'

export default {
  name: 'agentManage',
  components: {
    EditAgent,
    AgentCorp,
    AgentApi
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
        { name: 'aid', label: 'id', field: 'aid', align: 'left', classes: 'ellipsis' },
        { name: 'corpid', label: '服务商的corpid', field: 'corpid', align: 'left', classes: 'ellipsis' },
        { name: 'suite_id', label: '应用ID', field: 'suite_id', align: 'left', classes: 'ellipsis' },
        { name: 'suite_secret', label: '应用secret', field: 'suite_secret', align: 'left', classes: 'ellipsis' },
        { name: 'token', label: '应用的Token', field: 'token', align: 'left', classes: 'ellipsis' },
        { name: 'encodingAesKey', label: '应用的EncodingAESKey', field: 'encodingAesKey', align: 'left', classes: 'ellipsis' },
        { name: 'type', label: '应用类型', field: 'type', align: 'left', classes: 'ellipsis' },
        { name: 'redirect_uri_data', label: '数据回调URL', field: 'redirect_uri_data', align: 'left', classes: 'ellipsis' },
        { name: 'redirect_uri_do', label: '指令回调URL', field: 'redirect_uri_do', align: 'left', classes: 'ellipsis' },
        { name: 'suite_home_url', label: '应用主页', field: 'suite_home_url', align: 'left', classes: 'ellipsis' },
        { name: 'redirect_uri_install', label: '安装应用的回调url', field: 'redirect_uri_install', align: 'left', classes: 'ellipsis' },
        { name: 'redirect_uri_single', label: '单点登录回调url', field: 'redirect_uri_single', align: 'left', classes: 'ellipsis' },
        { name: 'redirect_uri_oauth', label: '网页授权第三方回调url', field: 'redirect_uri_oauth', align: 'left', classes: 'ellipsis' },
        { name: 'operate', label: '操作', field: 'id', align: 'left' }
      ],
      dataList: [], // 列表数据
      editDialogStatus: false, // 弹窗开关
      typeObject: {
        2: '第三方代开发应用',
        3: '第三方标准应用'
      },
      editApiStatus: false,
      editAgentApiStatus: false,
      showQrcodeDialog: false,
      qrcode_url: ''
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
      this.editApiStatus = false
      this.editAgentApiStatus = false
      const payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        textSearch: this.textSearch
      }
      this.$store
        .dispatch('providerSuite/getData', payload)
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
      let ids = []
      if (id > 0) {
        ids = [id]
      } else {
        if (this.selected && this.selected.length > 0) {
          ids = this.selected.map(item => {
            return item.id
          })
        }
      }

      this.loading = true
      this.$store
        .dispatch('providerSuite/deleteData', ids)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.getDataList()
            this.selected = []
            this.$q.notify({
              message: '成功',
              caption: '删除成功！',
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

    // 新增弹出框
    openEditDialog (agentId) {
      this.editDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editDialogRef.init(agentId)
      })
    },

    openApiDialog (agentId) {
      this.editApiStatus = true
      this.$nextTick(() => {
        this.$refs.editApiDialogRef.init(agentId)
      })
    },
    openAgentApiDialog (agentId) {
      this.editAgentApiStatus = true
      this.$nextTick(() => {
        this.$refs.editAgentApiDialogRef.init(agentId)
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
    },

    hideQrcode () {
      this.showQrcodeDialog = false
      this.qrcode_url = ''
    },

    openQrcode (id) {
      if (id) {
        const obj = {
          SuiteId: id
        }
        this.$store
          .dispatch('provider/getSuiteAuthCode', obj)
          .then((res) => {
            if (res.code == 200) {
              this.showQrcodeDialog = true
              this.qrcode_url = res.data.qrcode_url
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
