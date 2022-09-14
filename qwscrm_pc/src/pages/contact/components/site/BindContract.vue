<template>
  <q-dialog v-model="logDialogStatus">
    <q-card class="full-width">
      <div class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">合同信息</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </div>

      <q-form ref="applyAuthorizeForm" class="row">
        <q-card flat bordered class="col-12 q-mb-md q-pa-sm">
          <q-select
            dense
            map-options
            outlined
            option-label="no"
            option-value="id"
            emit-value
            label="合同"
            v-model="contractData"
            :options="contractDataList"
            :rules="[(val) => !!val || '请选择合同']"
            multiple
          />
        </q-card>
      </q-form>
      <q-card-actions>
        <q-btn unelevated rounded color="primary" @click="saveLog" label="保存" class="q-px-xl full-width" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'AddServiceLog',
  components: {},
  data () {
    return {
      logDialogStatus: false,

      date: null,
      status: '',
      applyDataList: [],
      currenApplyInfo: {},
      contractData: [],
      contractDataList: [],
      siteInfo: {}
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (siteInfo) {
      this.logDialogStatus = true
      this.siteInfo = siteInfo

      this.contact_id = this.$route.query.contactId
      this.getWorkerData()
    },
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return '未授权'
    },

    closeDialog () {
      this.logDialogStatus = false
      this.$emit('closeDialog')
    },

    getWorkerData () {
      this.$store
        .dispatch('contract/getAllData', {
          contact_id: this.contact_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.contractDataList = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    saveLog () {
      this.$refs.applyAuthorizeForm.validate().then((success) => {
        if (success) {
          const obj = {
            contact_id: this.contact_id,
            site_id: this.siteInfo.id,
            site_app_id: this.siteInfo.client_id,
            contractData: this.contractData
            // worker_id: 1
          }
          this.$store
            .dispatch('siteManage/bindContractData', obj)
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
