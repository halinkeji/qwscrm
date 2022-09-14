<template>
  <q-dialog v-model="logDialogStatus">
    <q-card class="full-width">
      <div class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">工作人员</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </div>

      <q-form ref="applyAuthorizeForm" class="row">
        <q-card flat bordered class="col-12 q-mb-md q-pa-sm">
          <q-select
            dense
            map-options
            outlined
            option-label="name"
            option-value="id"
            emit-value
            label="选择工作人员"
            v-model="worker_id"
            :options="workerDataList"
            :rules="[(val) => !!val || '请选择工作人员']"
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
  props: ['bindType'],
  data () {
    return {
      logDialogStatus: false,

      date: null,
      status: '',
      siteStatusArr: this.$store.state.siteManage.siteStatusArr,
      applyDataList: [],
      currenApplyInfo: {},
      worker_id: '',
      workerDataList: []
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (clientId) {
      this.logDialogStatus = true
      this.cerrentSite = clientId
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
        .dispatch('siteManage/getWorkerData', {})
        .then((res) => {
          if (res.code == 200) {
            this.workerDataList = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    saveLog () {
      this.$refs.applyAuthorizeForm.validate().then((success) => {
        if (success) {
          const obj = {
            relation_id: this.cerrentSite,
            type: this.bindType ? this.bindType : 'site',
            worker_id: this.worker_id
          }
          this.$store
            .dispatch('siteManage/bindWorkerData', obj)
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
