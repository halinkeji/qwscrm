<template>
  <q-dialog v-model="dilogStatue" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.6 + 'px',
        'min-width': $q.screen.width * 0.6 + 'px',
      }"
    >
      <q-card-section class="text-body1">
        API配置
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form ref="dataFormRef" class="row q-col-gutter-sm">

          <div class="col-12 col-md-6">
            <q-input outlined v-model="dataForm.token" dense label="应用的Token"  />
          </div>
          <div class="col-12 col-md-6">
            <q-input outlined v-model="dataForm.encodingAesKey" dense label="EncodingAESKey"  />
          </div>

          <div class="col-12 col-md-6" v-if="parseInt(dataForm.type) == 3">
            <q-input outlined v-model="dataForm.redirect_uri_data" dense label="数据回调URL"  />
          </div>
          <div class="col-12 col-md-6">
            <q-input outlined v-model="dataForm.redirect_uri_do" dense label="指令回调URL" />
          </div>
          <div class="col-12 col-md-6" v-if="parseInt(dataForm.type) == 3">
            <q-input outlined v-model="dataForm.suite_home_url" dense label="应用主页"/>
          </div>

          <div class="col-12 col-md-6" v-if="parseInt(dataForm.type) == 3">
            <q-input outlined v-model="dataForm.redirect_uri_install" bottom-slots dense label="安装应用的回调url"  />
          </div>
          <div class="col-12 col-md-6" v-if="parseInt(dataForm.type) == 3">
            <q-input outlined v-model="dataForm.redirect_uri_single" bottom-slots dense label="单点登录回调url"  />
          </div>
          <div class="col-12 col-md-6" v-if="parseInt(dataForm.type) == 3">
            <q-input outlined v-model="dataForm.redirect_uri_oauth" bottom-slots dense label="网页授权第三方回调url"  />
          </div>

           <div class="col-12 col-md-6" v-if="parseInt(dataForm.type) == 3">
            <q-input outlined v-model="dataForm.reg_template_id" type="textarea" dense label="注册定制化模板ID"  />
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
      }
      // else {
      //   this.dataForm.redirect_uri_data = this.redirect_uri_data
      //   this.dataForm.redirect_uri_do = this.redirect_uri_do
      // }
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
