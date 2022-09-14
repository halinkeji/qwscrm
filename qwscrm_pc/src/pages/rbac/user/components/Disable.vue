<template>
  <div>
    <hl-table
      row-key="id"
      dense
      stickyHeader
      :data="userDataList"
      :columns="columns"
      :fullscreen.sync="tableFullscreen"
      :loading="loading"
      separator="cell"
    >
      <template v-slot:top="props">
        <div class="row q-col-gutter-x-md q-col-gutter-y-xs full-width">
          <div class="col-12 col-md-3">
            <q-input label="姓名/电话" outlined v-model="searchData.userName" dense />
          </div>

          <div class="col-12 col-md-3">
            <q-select
              option-value="code"
              option-label="name"
              emit-value
              map-options
              dense
              outlined
              v-model="searchData.statusIndex"
              :options="statusList"
              label="选择状态"
            />
          </div>

          <q-space />
          <!-- :disable="storeAccountNum <= page.pageTotal" -->
          <q-btn-group flat rounded class="col-auto">
            <q-btn color="grey-3" @click="getUserList" text-color="dark" icon="search" />
            <q-btn color="grey-3" text-color="dark" icon="las la-search-minus" @click="resetSearch" />
          </q-btn-group>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="username" :props="props" class="text-center">
            {{ props.row.username }}
          </q-td>

          <q-td key="mobile" :props="props" class="text-center">
            {{ props.row.mobile }}
          </q-td>

          <q-td key="role_id" :props="props" class="text-center">
            {{ props.row.roleName }}
          </q-td>

          <q-td key="updated_at" :props="props" class="text-center">
            {{ agValueTime(props.row.updated_at) }}
          </q-td>

          <q-td key="id" :props="props" class="text-center">
            <q-btn
              class="col-auto"
              unelevated
              color="primary"
              flat
              icon="las la-edit"
              v-if="authorityMeta('edit')"
              @click="addOrUpdate(props.row.id)"
            >
              <q-tooltip :offset="[10, 10]"> 编辑 </q-tooltip>
            </q-btn>
            <q-btn unelevated color="red" icon="las la-trash-alt" v-if="props.row.status == -1 && authorityMeta('del')" flat @click="confirmDelete(props.row)">
              <q-tooltip :offset="[10, 10]"> 删除 </q-tooltip>
            </q-btn>

            <q-btn
              icon="las la-unlock"
              unelevated
              color="orange-9"
              v-if="props.row.status == -1 && authorityMeta('unlock')"
              @click="confirmRestoreUser(props.row)"
              flat
            >
              <q-tooltip :offset="[10, 10]"> 启用 </q-tooltip>
            </q-btn>
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

    <tab-user-edit
      @saveChanges="getUserList"
      :applyId="applyId"
      :storeId="$route.query.storeId"
      ref="userEditStatusRef"
      v-if="userEditStatus"
    ></tab-user-edit>
  </div>
</template>

<script>
import TabUserEdit from '../Edit'
export default {
  components: {
    TabUserEdit
  },
  props: ['storeId', 'applyId'],
  data () {
    return {
      userDataList: [],
      searchData: {
        userName: '',
        statusIndex: -1
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
      loading: true,
      tableFullscreen: null,
      columns: [
        {
          name: 'username',
          label: '用户名',
          field: 'username',
          align: 'cneter'
        },
        {
          name: 'mobile',
          label: '手机号',
          field: 'mobile',
          align: 'cneter'
        },
        {
          name: 'role_id',
          label: '绑定角色',
          field: 'role_id',
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

      userEditStatus: false,
      bindMobileStatus: false,
      editStatus: false,
      editUserInfoStatus: false,
      userCodeDialogStatus: false,
      storeAccountNum: 0
    }
  },
  watch: {},
  computed: {},
  created () {

  },
  mounted () {
    this.getUserList()
  },
  methods: {
    addOrUpdate (id) {
      this.userEditStatus = true

      this.$nextTick(() => {
        this.$refs.userEditStatusRef.init(id)
      })
    },

    setUserInfo (id) {
      this.editUserInfoStatus = true
      this.$nextTick(() => {
        this.$refs.editDialogRef.init(id)
      })
    },

    setBindClient (id) {
      this.userCodeDialogStatus = true
      this.$nextTick(() => {
        this.$refs.userBindCodeRef.init(id)
      })
    },

    // 获取用户信息
    getUserList () {
      this.userEditStatus = false
      const payload = {
        ...this.page,
        ...this.searchData
      }
      this.$store
        .dispatch('user/getUserList', payload)
        .then((res) => {
          this.loading = false
          this.userDataList = res.data.list ? res.data.list : []
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
      this.getUserList()
    },

    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getUserList()
    },

    resetSearch () {
      this.searchData = {
        userName: '',
        statusIndex: ''
      }
      setTimeout(() => {
        this.getUserList()
      }, 100)
    },

    confirmDelete (row) {
      this.$q
        .dialog({
          title: '确定',
          message: `确定删除 ${row.username} ?删除之后不可恢复！`,
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
          if (parseInt(row.id) <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '用户删除失败，请联系管理员！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }

          this.$store
            .dispatch('user/delUserInfo', parseInt(row.id))
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '用户删除成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.getUserList()
                }, 500)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '用户删除失败，请联系管理员！',
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
    },

    confirmRestoreUser (row) {
      this.$q
        .dialog({
          title: '确定',
          message: `确定恢复 ${row.username} 信息?`,
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
          if (parseInt(row.id) <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '恢复用户信息失败，请联系管理员！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }

          const payload = {
            id: parseInt(row.id),
            status: 1
          }

          this.$store
            .dispatch('user/setUserInfo', payload)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '用户恢复信息成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.getUserList()
                }, 500)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '用户恢复信息失败，请联系管理员！',
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
    },

    authorityMeta (key) {
      return true
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
