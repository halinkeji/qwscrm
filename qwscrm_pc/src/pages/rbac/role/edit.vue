<template>
  <div>
      <q-form ref="roleDataRef">
        <div class="row">
          <div class="col-12 col-md-3 q-mr-sm">
            <q-input outlined v-model="roleDataForm.name" :rules="[(val) => (val && val.length > 0) || '请输入角色名称']" dense label="名称" />
          </div>
          <div class="col-12 col-md-2 q-mr-sm">
            <q-select
              option-value="value"
              option-label="label"
              emit-value
              map-options
              dense
              outlined
              v-model="roleDataForm.status"
              :options="[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]"
              label="角色状态"
            />
          </div>
          <div class="col-12 col-md-2 q-mr-sm">
            <q-input outlined v-model="roleDataForm.sort" :rules="[(val) => /^[0-9]\d*$/.test(val) || '输入正确的排序']" dense label="排序" />
          </div>
        </div>
      </q-form>

    <q-separator />

    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" narrow-indicator :ripple="false" align="left">
      <div v-for="(i, k) in clientMenu">
        <q-tab :name="i.type" :label="i.name" />
      </div>
    </q-tabs>

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
      <q-btn unelevated color="primary" @click="saveRoleData" class="q-px-xl" label="保存" />
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
      roleDataForm: {
        apply_id: '',
        status: 1,
        sort: '0',
        name: ''
      },
      clientMenu: [],
      currentClientMenu: [],

      metaData: [],
      menuData: [],
      roleContent: {}
    }
  },

  mounted () {
    this.getRoleInfo(this.$route.query.id)
  },
  created () {},
  computed: {},
  methods: {
    saveRoleData () {
      this.$refs.roleDataRef.validate().then((success) => {
        if (success) {
          const payload = {
            ...this.roleDataForm,
            content: this.roleContent
          }

          this.$store
            .dispatch('role/setData', payload)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '角色信息保存成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.$store.dispatch('tagviews/delView', {
                    affix: false,
                    icon: '',
                    name: 'roleEdit',
                    path: '/rbac/role/edit',
                    title: '角色编辑'
                  })
                  this.$router.go(-1)
                }, 1000)
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
        }
      })
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

    getRoleInfo (id) {
      const obj = {
        id
      }
      this.$store
        .dispatch('role/getRoleOneData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            if (res.data.info && res.data.info.id) {
              this.roleDataForm = res.data.info.id ? res.data.info : {}
            }

            this.clientMenu = res.data.clientMenu ? res.data.clientMenu : []

            if (this.clientMenu.length > 0) {
              this.tab = this.clientMenu[0].type
            }
            this.roleContent = res.data.roleContent ? res.data.roleContent : []
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

    getApplyMenu () {
      const obj = {
        apply_id: this.roleDataForm.apply_id
      }
      this.$store
        .dispatch('role/getApplyMenuData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.clientMenu = res.data.clientMenu ? res.data.clientMenu : []

            if (this.clientMenu.length > 0) {
              this.tab = this.clientMenu[0].type
            }
            this.roleContent = res.data.roleContent
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
    }
  }
}
</script>
