<template>
  <div>
    <q-dialog
      v-model="editDialogStatus"
      :style="{
        width: this.$q.screen.width * 0.3,
      }"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">{{ dialogForm.id ? '编辑' : '修改' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="dialogForm.name" outlined autofocus @keyup.enter="editData" />
        </q-card-section>
        <q-card-actions align="right" class="bg-white ">
          <q-btn unelevated label="保存" @click="editData" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="analysisDialogStatus" persistent>
      <q-card
        :style="{
          'min-width': this.$q.screen.width * 0.6 + 'px',
        }"
      >
        <q-card-section>
          <div class="text-h6">{{ analysisData.name }} - 工作统计汇总</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-pa-md row items-start q-gutter-md">
            <q-card class="my-card" v-for="i in app" :key="`app-${i}`">
              <q-card-actions vertical align="center">
                <div class="text-h3">333</div>
              </q-card-actions>
              <q-card-section class="bg-primary text-white">
                <div class="text-h6 text-center">发起申请数</div>
                <div class="text-caption text-weight-thin">成员通过「搜索手机号」、「扫一扫」等渠道主动向客户发起的好友申请数量。</div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-actions align="center" class="bg-white ">
          <q-btn unelevated label="关闭" @click="resetAnalysisData" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="sync.showProgress" persistent>
      <q-card class="text-center  transparent no-shadow" style="width:100%;height:50%">
        <q-card-section>
          <q-circular-progress
            show-value
            font-size="10px"
            class="q-ma-md"
            :value="sync.progress"
            size="200px"
            :thickness="0.25"
            color="primary"
            track-color="grey-3"
          >
            <q-avatar size="100px">
              <img src="https://cdn.halin.net/download/logo-300-shadow-2.png" />
            </q-avatar>
          </q-circular-progress>
          <div class="text-negative">正在同步数据，请勿关闭当前页面......</div>
        </q-card-section>
      </q-card>
    </q-dialog>

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
          <div class="col-auto q-pl-none q-gutter-sm no-wrap">
            <q-btn dense color="primary" icon="las la-sync" @click="refreshData" />
            <q-btn flat :label="`最后一次同步时间：${syncDate}`" />
          </div>

          <q-space />

          <q-input v-model="textSearch" clearable @clear="getDataList" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="姓名" />
          <!-- <q-select
            v-model="statusSearch"
            :options="options_status"
            label="请选择状态"
            dense
            class="col-6 col-sm-4 col-md-3 col-lg-2"
          >
            <template v-if="statusSearch" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop="statusSearch = null"
                class="cursor-pointer"
              />
            </template>
          </q-select> -->
          <!-- <q-select
              v-model="contactAuthSearch"
              :options="options_contact_auth"
              label="是否外部联系人权限"
              dense
              class="col-6 col-sm-4 col-md-3 col-lg-2"
            >
              <template v-if="contactAuthSearch" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop="contactAuthSearch = null"
                  class="cursor-pointer"
                />
              </template>
          </q-select> -->
          <!-- <template v-if="searchToggle" >
            <q-input v-model="textSearch" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="姓名"/>
            <q-input v-model="textSearch" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="姓名"/>
            <q-input v-model="textSearch" class="col-6 col-sm-4 col-md-3 col-lg-2" dense placeholder="姓名"/>
          </template> -->
          <q-space />

          <q-btn-group flat rounded class="col-auto">
            <q-btn color="grey-3" @click="getDataList" text-color="dark" icon="search" />
            <q-btn color="grey-3" text-color="dark" :icon="searchToggle ? 'zoom_out' : 'zoom_in'" @click="searchToggle = !searchToggle" />
            <q-btn color="grey-3" text-color="dark" icon="find_replace" @click="resetSearch" />
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
          <q-td key="contact_info" :props="props">
            <q-item clickable v-ripple>
              <q-item-section side>
                <q-avatar rounded size="48px">
                  <img :src="props.row.avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-btn color="blue" flat>
                    {{ props.row.nick_name }} <span class="text-weight-light text-positive q-ml-xs">@{{ viewContactType(props.row.type) }}</span>
                    <q-icon class="q-ml-sm" :name="viewIcon(parseInt(props.row.gender))" :class="viewIconColor(parseInt(props.row.gender))" />
                  </q-btn>
                </q-item-label>
                <q-item-label caption>编号:{{ props.row.business_no }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ props.row.qw_external_userid }}
                <q-badge :color="props.row.position ? 'teal' : 'grey'" :label="props.row.position ? props.row.position : '暂无'" />
                {{ props.row.corp_name }}
              </q-item-section>
            </q-item>
          </q-td>
          <q-td key="add_way" :props="props">
            <div class="text-weight-bold ellipsis-2-lines">
              {{ viewAddWay(parseInt(props.row.relationWorker ? props.row.relationWorker.add_way : 0)) }}
            </div>
          </q-td>
          <q-td key="tags" :props="props">
            <span v-for="tag in props.row.relationTag">
              <q-badge
              outline
              color="primary"
              v-if="tag.tag"
              :label="`${tag.tag.name}`"
              :key="`tag-${tag.tag.id}`"
              class="float-left"
            />
            </span>

          </q-td>
          <q-td key="worker" :props="props">

             <!-- <q-badge
              outline
              color="primary"
              v-for="work in props.row.relationWorker"
              v-if="work.work"
              :label="`${work.work.name}`"
              :key="`work-${work.work.id}`"
              class="float-left"
            /> -->

            <q-badge outline color="teal" :label="`${props.row.relationWorker && props.row.relationWorker.worker ? props.row.relationWorker.worker.name : ''}`" class="text-caption" />
          </q-td>
          <q-td key="createtime" :props="props">
            {{ viewDate(props.row.relationWorker ? props.row.relationWorker.createtime : '') }}
          </q-td>
          <q-td key="follow_status" :props="props">
            <q-btn size="sm" unelevated :color="viewFollowStatusColor(parseInt(props.row.follow_status))">
              {{ viewFollowStatus(parseInt(props.row.follow_status)) }}
            </q-btn>
          </q-td>
          <q-td key="status" :props="props">
            <q-btn size="sm" outline :color="viewStatusColor(parseInt(props.row.relationWorker ? props.row.relationWorker.status : 0))">
              {{ viewStatus(parseInt(props.row.relationWorker ? props.row.relationWorker.status : 0)) }}
            </q-btn>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              outline
              color="orange"
              label="查看详情"
              :to="{ name: 'contactDetail', query: { contactId: props.row.id } }"
              class="q-mr-xs"
            />
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
    <!-- <contact-detail v-if="detailDialogStatus" ref="detailDialogRef" @closeDialog="closeDialog" /> -->
  </div>
</template>

<script>
// import ContactDetail from './components/Detail.vue'
import { date } from 'quasar'
export default {
  name: 'Contact',
  components: {
    // ContactDetail
  },
  data () {
    return {
      options_status: [
        {
          label: '正常',
          value: '1'
        },
        {
          label: '删除',
          value: '2'
        },
        {
          label: '拉黑',
          value: '3'
        }
      ],
      options_contact_auth: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ],
      textSearch: null,
      statusSearch: null,
      contactAuthSearch: null,
      page: {
        pageIndex: 1,
        pSize: 15,
        totalCount: 0
      },
      searchToggle: false,
      loading: false,
      dialogForm: {
        name: '' // 文本框名称
      },
      selected: [],
      tableFullscreen: null,
      columns: [
        { name: 'id', label: 'ID', field: 'id' },
        {
          name: 'contact_info',
          field: 'contact_info',
          required: true,
          label: '客户信息',
          align: 'left',
          format: (val) => `${val}`,
          sortable: true
        },
        { name: 'add_way', label: '来源', field: 'add_way' },
        { name: 'tags', label: '标签', field: 'tags' },
        { name: 'worker', label: '所属员工', field: 'worker' },
        { name: 'createtime', label: '添加时间', field: 'createtime' },
        { name: 'follow_status', label: '跟进状态', field: 'follow_status' },
        { name: 'status', label: '客户状态', field: 'status' },
        { name: 'action', label: '操作', align: 'center' }
      ],
      dataList: [], // 列表数据
      editDialogStatus: false, // 弹窗开关
      analysisDialogStatus: false, // 弹窗开关
      analysisData: {},
      app: [
        {
          icon: 'las la-chalkboard',
          title: 'PC端WEB应用',
          color: 'cyan',
          release: true
        },
        {
          icon: 'las la-tv',
          title: '桌面版安装应用程序',
          color: 'yellow',
          release: true
        },
        {
          icon: 'lab la-weixin',
          title: '微信公众号',
          color: 'green',
          release: true
        },
        {
          icon: 'lab la-weixin',
          title: '微信小程序',
          color: 'green',
          note: '即将发布...'
        },
        {
          icon: 'lab la-android',
          title: '安卓Android APP应用',
          color: 'pink',
          note: '正在开发中...'
        },
        {
          icon: 'lab la-apple',
          title: '苹果IOS',
          color: 'red',
          note: '正在开发中...'
        },

        {
          icon: 'las la-mobile',
          title: 'H5移动端应用',
          color: 'green',
          note: '正在开发中...'
        },

        {
          icon: 'las la-comment',
          title: '企业微信',
          color: 'blue',
          note: '正在开发中...'
        },
        {
          icon: ' perm_device_information',
          title: '支付宝小程序',
          color: 'primary',
          note: '正在开发中...'
        },
        {
          icon: 'perm_device_information',
          title: '抖音小程序',
          color: 'purple',
          note: '正在开发中...'
        }
      ],
      syncDate: '',
      sync: {
        showProgress: false,
        progress: 0,
        count: 0,
        userId: '',
        current_count: 0,
        cursor: '',
        follow_user: [],
        follow_user_count: 0,
        follow_user_index: 0
      },
      detailDialogStatus: false
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

    // 加载列表
    getDataList () {
      this.loading = true
      const payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        name: this.textSearch
        // status: this.statusSearch ? this.statusSearch.value : null,
        // contact_auth: this.contactAuthSearch ? this.contactAuthSearch.value : null,
      }
      this.$store
        .dispatch('contact/getList', payload)
        .then((res) => {
          if (res.code == 200) {
            // 最后同步时间
            this.syncDate = this.viewDate(res.data.sync_date)
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

    // 同步外部联系人客户信息
    refreshData () {
      this.sync.showProgress = true
      const item = {
        count: this.sync.count,
        userId: this.sync.userId,
        follow_user_index: this.sync.follow_user_index,
        current_count: this.sync.current_count,
        cursor: this.sync.cursor
      }
      this.$store
        .dispatch('contact/refreshData', item)
        .then((res) => {
          if (res.code == 200) {
            const data = res.data
            // 首次赋值参数
            if (!this.sync.userId) {
              this.sync.count = data.count
              this.sync.follow_user = data.follow_user
              this.sync.follow_user_count = data.follow_user.length
              this.sync.userId = this.sync.follow_user
            }
            // 判断是否需要执行
            if (this.sync.count <= data.current_count && !data.cursor) {
              this.sync.current_count = data.current_count
              this.sync.progress = (this.sync.current_count / this.sync.count) * 100
              this.$q.notify({
                message: '成功',
                caption: '同步成功！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              setTimeout(() => {
                this.sync = {
                  showProgress: false,
                  progress: 0,
                  count: 0,
                  userId: [],
                  current_count: 0,
                  cursor: '',
                  follow_user: [],
                  follow_user_count: 0,
                  follow_user_index: 0
                }
              }, 1500)
              this.getDataList()
            } else {
              this.sync.current_count = data.current_count
              this.sync.progress = (this.sync.current_count / this.sync.count) * 100
              this.sync.follow_user_index = data.follow_user_index
              this.sync.cursor = data.cursor
              if (!data.cursor) {
                this.sync.follow_user_index++
                this.sync.userId = this.sync.follow_user
              }
              this.refreshData()
            }
          } else {
            this.$q.notify({
              message: '失败',
              caption: '同步失败！',
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

    // 更新或修改成员信息
    editData () {
      const item = {
        ...this.dialogForm
      }
      this.$store
        .dispatch('workerDepartment/editData', item)
        .then((res) => {
          if (res.code == 200) {
            this.getDataList()
            this.loading = false
            this.$q.notify({
              message: '成功',
              caption: `${this.dialogForm.id ? '编辑' : '修改'}成功！`,
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            this.editDialogStatus = false
          } else {
            this.$q.notify({
              message: '失败',
              caption: `${this.dialogForm.id ? '编辑' : '修改'}失败，请联系管理员1`,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
          this.dialogForm = {}
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
          this.editDialogStatus = false
        })
    },

    // 重置搜索项
    resetSearch () {
      const that = this
      this.textSearch = ''
      this.statusSearch = ''
      this.contactAuthSearch = ''
      // 等待搜索项清空 执行查询列表
      this.$nextTick(() => {
        that.getDataList()
      })
    },

    // 新增弹出框
    openEditDialog () {
      this.editDialogStatus = true

      this.dialogForm = {}
    },
    // 获取成员统计分析数据
    getContactData (data) {
      this.detailDialogStatus = true
      this.$nextTick(() => {
        this.$refs.detailDialogRef.init(data)
      })
    },
    // 重置成员统计分析数据
    resetAnalysisData () {
      this.analysisData = {}
    },
    // 显示图标
    viewIcon (val) {
      switch (val) {
        case 0:
          return 'las la-genderless'
          break
        case 1:
          return 'las la-mars'
          break
        case 2:
          return 'las la-venus'
          break
      }
    },
    // 显示颜色
    viewIconColor (val) {
      switch (val) {
        case 0:
          return 'text-red'
          break
        case 1:
          return 'text-primary'
          break
        case 2:
          return 'text-pink'
          break
      }
    },
    // 显示状态
    viewStatus (val) {
      switch (val) {
        case 1:
          return '正常状态'
          break
        case 2:
          return '已删除'
          break
        case 3:
          return '已拉黑'
          break
      }
    },
    // 显示状态颜色
    viewStatusColor (val) {
      switch (val) {
        case 1:
          return 'positive'
          break
        case 2:
          return 'negative'
          break
        case 3:
          return 'warning'
          break
      }
    },
    // 显示跟进状态
    viewFollowStatus (val) {
      switch (val) {
        case 1:
          return '未跟进'
          break
        case 2:
          return '跟进中'
          break
        case 3:
          return '已拒绝'
          break
        case 4:
          return '已成交'
          break
        case 5:
          return '已复购'
          break
      }
    },
    // 显示跟进状态颜色
    viewFollowStatusColor (val) {
      switch (val) {
        case 1:
          return 'negative'
          break
        case 2:
          return 'positive'
          break
        case 3:
          return 'dark'
          break
        case 4:
          return 'accent'
          break
        case 5:
          return 'warning'
          break
      }
    },
    // 显示外部联系人的类型
    viewContactType (val) {
      switch (parseInt(val)) {
        case 1:
          return '微信用户'
          break
        case 2:
          return '企业微信用户'
          break
      }
    },
    // 显示来源类型
    viewAddWay (val) {
      switch (val) {
        case 0:
          return '未知来源'
          break
        case 1:
          return '扫描二维码'
          break
        case 2:
          return '搜索手机号'
          break
        case 3:
          return '名片分享'
          break
        case 4:
          return '群聊'
          break
        case 5:
          return '手机通讯录'
          break
        case 6:
          return '微信联系人'
          break
        case 7:
          return '来自微信的添加好友申请'
          break
        case 8:
          return '安装第三方应用时自动添加的客服人员'
          break
        case 9:
          return '搜索邮箱'
          break
        case 201:
          return '内部成员共享'
          break
        case 202:
          return '管理员/负责人分配'
          break
      }
    },
    // 显示日期格式
    viewDate (val) {
      return val ? date.formatDate(val * 1000, 'YYYY-MM-DD  HH:mm:ss') : '暂无时间'
    },
    closeDialog () {
      this.detailDialogStatus = false

      this.getDataList()
    }
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 260px
</style>
