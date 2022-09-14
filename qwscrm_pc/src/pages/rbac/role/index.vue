<template>
  <div>
    <hl-table
      row-key="id"
      dense
      stickyHeader
      :data="roleDataList"
      :columns="columns"
      :fullscreen.sync="tableFullscreen"
      :loading="loading"
      separator="cell"
    >
      <template v-slot:top="props">
        <div class="row q-col-gutter-x-md q-col-gutter-y-xs full-width">
          <div class="col-12 col-md-3">
            <q-input label="名称" outlined v-model="searchData.name" dense />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              option-value="code"
              option-label="name"
              emit-value
              map-options
              dense
              outlined
              v-model="searchData.status"
              :options="statusList"
              label="选择状态"
            />
          </div>

          <q-space />

          <q-btn-group flat rounded class="col-auto">
            <q-btn color="grey-3" @click="getRoleDataList" text-color="dark" icon="search" />
            <q-btn color="grey-3" text-color="dark" icon="las la-search-minus" @click="resetSearch" />
            <q-btn color="grey-3" text-color="dark" icon="las la-plus-circle" :to="{ name: 'roleEdit' }" />
          </q-btn-group>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="sort" :props="props" class="text-center">
            {{ props.row.sort }}
          </q-td>

          <q-td key="name" :props="props" class="text-center">
            {{ props.row.name }}
          </q-td>

          <q-td key="status" :props="props" class="text-center">
            <q-toggle
              @input="changeStatus(props.row)"
              v-model="props.row.status"
              :true-value="'1'"
              :false-value="'0'"
              color="green"
            />
          </q-td>

          <q-td key="updated_at" :props="props" class="text-center">
            {{ agValueTime(props.row.updated_at) }}
          </q-td>

          <q-td key="id" :props="props" class="text-center">
            <q-btn outline color="orange" label="修改" :to="{ name: 'roleEdit', query: { id: props.row.id } }" class="q-mr-xs" />
            <q-btn outline color="positive" label="删除" @click="confirmDeleteRecord(props.row)" class="q-mr-xs" />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:pagination>
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 30, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </template>
    </hl-table>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data () {
    return {
      roleDataList: [],
      searchData: {
        name: '',
        status: '',
        apply: ''
      },
      statusList: [
        {
          code: '1',
          name: '开启'
        },
        {
          code: '2',
          name: '关闭'
        }
      ],
      gridApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      columns: [
        {
          name: 'sort',
          label: '排序',
          field: 'sort',
          align: 'cneter'
        },
        {
          name: 'name',
          label: '名称',
          field: 'name',
          align: 'cneter'
        },
        {
          name: 'status',
          label: '状态',
          field: 'status',
          align: 'cneter'
        },
        {
          name: 'updated_at',
          label: '更新时间',
          field: 'updated_at',
          align: 'cneter'
        },
        {
          name: 'id',
          label: '操作',
          field: 'id',
          align: 'cneter'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      tableFullscreen: null,
      context: null,
      userEditStatus: false,
      loading: true
    }
  },
  watch: {},
  computed: {},
  created () {},
  mounted () {
    this.context = this
    this.gridApi = this.gridOptions.api
    this.getRoleDataList()
  },
  methods: {
    addOrUpdate (id) {
      this.userEditStatus = true

      setTimeout(() => {
        this.$refs.userEditStatusRef.init(id)
      }, 500)
    },

    changeStatus (row) {
      const payload = {
        id: parseInt(row.id),
        status: row.status
      }
      this.$store
        .dispatch('role/updateRoleData', payload)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '角色状态更新成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          } else {
            this.$q.notify({
              message: '失败',
              caption: '角色状态更新失败，请联系管理员！',
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

    // 获取用户列表
    getRoleDataList () {
      this.userEditStatus = false
      const payload = {
        ...this.page,
        ...this.searchData
      }
      this.$store
        .dispatch('role/getRoleData', payload)
        .then((res) => {
          this.loading = false
          this.roleDataList = res.data.list ? res.data.list : []
          this.page.pageTotal = res.data.page.totalCount
        })
        .catch((error) => {})
    },
    agValueTime (date) {
      if (date) {
        return this.$q_date.formatDate(date * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getRoleDataList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getRoleDataList()
    },
    resetSearch () {
      this.searchData = {
        name: '',
        status: '',
        apply: ''
      }
      setTimeout(() => {
        this.getRoleDataList()
      }, 100)
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
    confirmDeleteRecord (params) {
      this.$q
        .dialog({
          title: '确定',
          message: `确定删除 ${params.name} 该角色?删除后不可恢复。`,
          ok: {
            push: true,
            color: 'negative'
          },
          cancel: {
            push: true,
            color: 'primary'
          },
          persistent: true
        })
        .onOk(() => {
          if (parseInt(params.id) <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '删除权限角色失败，请联系管理员！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }

          const payload = {
            id: parseInt(params.id),
            status: -1
          }

          this.$store
            .dispatch('role/delOneData', payload)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除权限角色成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.getRoleDataList()
                }, 500)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '删除权限角色失败，请联系管理员！',
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
        })
        .onCancel(() => {})
    }
  }
}
</script>
