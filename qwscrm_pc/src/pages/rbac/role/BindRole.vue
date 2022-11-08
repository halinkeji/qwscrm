<template>
  <div>
    <div class="col-shrink row bg-white q-px-xs q-py-md">
      <div class="col-6">
        <q-select
          option-value="id"
          option-label="name"
          emit-value
          map-options
          dense
          outlined
          v-model="role_id"
          :options="roleDataList"
          label="选择绑定角色"
          @input="changeRole"
          clearable
          @clear="clearRoleData"
        />
      </div>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey col-12"
        active-color="primary"
        indicator-color="primary"
        narrow-indicator
        :ripple="false"
        align="left"
      >
        <div v-for="(i, k) in clientMenu">
          <q-tab :name="i.type" :label="i.name" />
        </div>
      </q-tabs>
    </div>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel :name="item.type" v-for="(item, key) in clientMenu" :key="key">
        <card-checkbox
          @changeChildMetaData="changeChildMetaData"
          ref="changMenuDataRef"
          @changMenuData="changMenuData"
          :currentChildData="item.nowMenuData"
        />
      </q-tab-panel>
    </q-tab-panels>
    <q-footer class="col-shrink transparent q-pb-md text-center q-gutter-sm">
      <q-btn unelevated color="primary" class="q-px-xl" @click="saveRoleData" label="保存" />
    </q-footer>
  </div>
</template>
<script>
import CardCheckbox from './CardCheckbox.vue'
export default {
  components: {
    CardCheckbox
  },
  data () {
    return {
      tab: '',
      role_id: '',
      roleDataList: [],
      set_config: {},
      clientMenu: [],
      user_id: 0,
      memberData: {},
      metaData: [],
      menuData: [],
      roleContent: {}
    }
  },

  mounted () {
    this.getRelation()
    this.getRoleDataList()
  },
  created () {
    if (this.$route.query.user_id) {
      this.user_id = parseInt(this.$route.query.user_id)
    } else {
      this.closeCurrentPage()
    }
  },
  computed: {},
  methods: {
    getRelation () {
      const obj = {
        ...this.$route.query
      }
      this.$store
        .dispatch('role/getUserRelationList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.role_id = res.data.role_id.toString()
              setTimeout(() => {
                this.getRoleInfo({
                  id: 0,
                  ...this.$route.query
                })
              }, 500)
            }
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

    saveRoleData () {
      const payload = {
        role_id: this.role_id,
        ...this.$route.query,
        content: this.roleContent
      }

      this.$store
        .dispatch('role/setUesrRoleData', payload)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '绑定权限成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })

            this.closeCurrentPage()
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

    closeCurrentPage () {
      setTimeout(() => {
        this.$store.dispatch('tagviews/delView', {
          affix: false,
          icon: '',
          name: 'bindRole',
          path: '/rbac/role/bindRole',
          title: '权限绑定'
        })
        this.$router.go(-1)
      }, 1000)
    },

    getRoleInfo (obj) {
      this.$store
        .dispatch('role/getUserRoleData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.clientMenu = res.data.clientMenu ? res.data.clientMenu : []
              if (this.clientMenu.length > 0) {
                this.tab = this.clientMenu[0].type
              }

              this.roleContent = res.data.roleContent
            }
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

    getRoleDataList () {
      const obj = {
        ...this.$route.query
      }
      this.$store
        .dispatch('role/getApplyRoleList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.roleDataList = res.data ? res.data : []
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

    changeRole () {
      this.clearRoleData()
      this.getRoleInfo({ id: this.role_id })
    },

    clearRoleData () {
      this.clientMenu = []
      this.cateData = []
      this.metaData = []
      this.menuData = []
      this.roleContent = []
      this.roleCateData = []
      this.roleDataContent = {}
    },

    changeChildMetaData (item, meta) {
      const findIndex = _.findIndex(this.roleContent[this.tab], function (o) {
        return o.name == item.name
      })

      if (findIndex > -1 && item && item.default_meta && item.default_meta.length > 0) {
        const currentMeta = []
        item.default_meta.forEach(function (item) {
          if (meta.indexOf(item.id) > -1) {
            currentMeta.push(item)
          }
        })

        this.roleContent[this.tab][findIndex].meta = currentMeta
      }
    },

    changMenuData (value, status, currentData) {
      const that = this

      if (status > -1) {
        var findIndex = _.findIndex(that.roleContent[that.tab], function (o) {
          return o.name == value.name
        })
        if (findIndex < 0) {
          that.roleContent[that.tab].push({
            id: value.id,
            pid: value.pid,
            apply_id: value.apply_id,
            type: value.type,
            is_plugin: value.is_plugin,
            title: value.title,
            plugins_name: value.plugins_name,
            action: value.action,
            name: value.name,
            path: value.path,
            component: value.component,
            meta: value.meta,
            params: value.params,
            icon: value.icon,
            level: value.level,
            dev: value.dev,
            sort: value.sort,
            status: value.status,
            position: value.position,
            default_meta: value.default_meta,
            check_meta: value.check_meta
          })
        }
      } else {
        var findIndex = _.findIndex(that.roleContent[that.tab], function (o) {
          return o.name == value.name
        })
        that.roleContent[that.tab].splice(findIndex, 1)
      }

      // console.log('xx', that.roleContent[that.tab])
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
    }
  }
}
</script>
