<template>
  <q-dialog v-model="dilogStatue" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.6 + 'px',
        'min-width': $q.screen.width * 0.6 + 'px',
      }"
    >
      <q-card-section class="text-body1">
        {{ dataForm.id ? '修改' : '新增' }}应用
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form ref="dataFormRef" class="row q-col-gutter-sm">

          <div class="col-12 col-md-6">
            <q-input outlined v-model="dataForm.corpid" dense label="服务商的corpid"  />
          </div>

          <div class="col-12 col-md-6">
            <q-input outlined v-model="dataForm.suite_id" dense label="应用ID"  />
          </div>

          <div class="col-12 col-md-6">
          <q-select
              v-model="dataForm.type"
              :options="typeArr"
              label="请选择应用类型"
              dense
              map-options
              emit-value
              outlined
            >
          </q-select>
          </div>
          <div class="col-12 col-md-6">
            <q-input outlined v-model="dataForm.suite_secret" dense label="应用secret"  />
          </div>

        </q-form>
      </q-card-section>
      <q-separator />
      <q-card-section class="text-center q-gutter-sm">
        <q-btn color="primary" class="q-px-md" unelevated @click="saveLog" label="保存" />
        <q-btn color="grey" class="q-px-md" unelevated @click="closeDialog" label="关闭" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { parse } from 'path-to-regexp'
export default {
  name: 'EditAgent',
  components: {},
  data () {
    return {
      dilogStatue: false,
      agentId: '',
      dataForm: {
        id: '',
        suite_id: '',
        suite_secret: '',
        token: '',
        encodingAesKey: '',
        type: '',
        redirect_uri_data: '',
        redirect_uri_do: '',
        suite_home_url: '',
        reg_template_id: '',
        redirect_uri_install: '',
        redirect_uri_single: '',
        redirect_domain: '',
        report_location_flag: '',
        redirect_uri_oauth: ''

      },

      typeArr: [
        {
          label: '第三方代开发应用',
          value: '2'
        },
        {
          label: '第三方标准应用',
          value: '3'
        }

      ],

      uploadImgStatus: false,
      contactDialogStatus: false
    }
  },
  computed: {
    redirect_uri_data () {
      const system_local = this.$q.localStorage.getItem('qwscrm_system_local')
      if (system_local) {
        if (parseInt(this.dataForm.type) == 3) {
          return system_local.info.site_url + '/qwscrm/v1/provider/suite-data-callback?SuiteId='
        }
      }

      return ''
    },
    redirect_uri_do () {
      const system_local = this.$q.localStorage.getItem('qwscrm_system_local')
      if (system_local) {
        if (parseInt(this.dataForm.type) == 3) {
          return system_local.info.site_url + '/qwscrm/v1/provider/suite-do-callback?SuiteId='
        } else {
          return system_local.info.site_url + '/qwscrm/v1/provider/suite-replace-callback?SuiteId='
        }
      }

      return ''
    }
  },
  mounted () {},
  created () {},
  methods: {
    init (agentId) {
      this.dilogStatue = true
      if (agentId > 0) {
        this.agentId = agentId
        this.getData()
      } else {
        this.dataForm.redirect_uri_data = this.redirect_uri_data
        this.dataForm.redirect_uri_do = this.redirect_uri_do
      }
    },
    getData () {
      this.$store
        .dispatch('providerSuite/getItem', this.agentId)
        .then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data ? res.data : {}
            if (res.data && res.data.reg_template_id) {
              this.dataForm.reg_template_id = JSON.parse(res.data.reg_template_id)
            }
          }
        })
        .catch((error) => {})
    },
    getImageData (info) {
      this.uploadImgStatus = false
      this.dataForm.square_logo_url = info[0].base_url
    },

    closeDialog () {
      this.dilogStatue = false
      this.$emit('closeDialog')
    },
    closeUpload () {
      this.uploadImgStatus = false
    },
    openSelectWorker () {
      this.contactDialogStatus = true
      this.$nextTick(() => {
        this.$refs.contactListsRef.init()
      })
    },

    deleteUserInfos (key) {
      this.dataForm.allow_userinfos.splice(key, 1)
    },

    saveLog () {
      this.$refs.dataFormRef.validate().then((success) => {
        if (success) {
          if (!this.agentId) {
            this.dataForm.redirect_uri_data = this.redirect_uri_data
            this.dataForm.redirect_uri_do = this.redirect_uri_do
          }
          const obj = {
            ...this.dataForm
          }
          this.$store
            .dispatch('providerSuite/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功！',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })

                this.closeDialog()
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
      })
    }
  }
}
</script>
