<template>
  <q-dialog v-model="logDialogStatus" persistent>
    <q-card class="full-width">
      <div class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">更改发票状态</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </div>

      <q-form ref="authorizeFormRef" class="row">
        <div class="col-12 q-px-xs">
         <q-select
            dense
            map-options
            outlined
            option-label="label"
            option-value="value"
            emit-value
            label="发票状态"
            v-model="logStatus"
            :options="successStatusArray"
          />
        </div>
      </q-form>

      <q-card-actions >
        <q-btn unelevated rounded color="primary" @click="saveLog" label="保存" class="q-px-xl full-width" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'AddServiceLog',
  components: {},
  data () {
    return {
      logDialogStatus: false,
      successStatusArray: this.$store.state.billManage.successStatusArray,
      billLogId: '',
      logStatus: ''
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (billLogId) {
      this.logDialogStatus = true

      if (billLogId > 0) {
        this.billLogId = billLogId
        // this.getBillLog()
      }
    },

    getBillLog () {
      this.$store.dispatch('billManage/getBillLog', this.billLogId)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.logStatus = res.data.status.toString()
          }
        })
        .catch((error) => {})
    },

    closeDialog () {
      this.logDialogStatus = false
      this.$emit('closeDialog')
    },

    saveLog () {
      this.$refs.authorizeFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            id: this.billLogId,
            status: this.logStatus
          }
          this.$store
            .dispatch('billManage/setBillData', obj)
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
