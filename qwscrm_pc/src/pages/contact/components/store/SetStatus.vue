<template>
  <q-dialog v-model="logDialogStatus" persistent>
    <q-card class="full-width">
      <div class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">站点授权</div>
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
            label="商家状态"
            v-model="storeForm.status"
            :options="[
              { label: '启用', value: '1' },
              { label: '关闭', value: '0' },
            ]"
          />
        </div>
      </q-form>

      <q-card-actions>
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

      authorize_type: '',
      applyStatusArr: this.$store.state.siteManage.applyStatusArr,
      sotreId: '',
      storeForm: {
        status: '1'
      }
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (storeInfo) {
      this.logDialogStatus = true
      this.sotreId = storeInfo.id
    },

    closeDialog () {
      this.logDialogStatus = false
      this.$emit('closeDialog')
    },

    saveLog () {
      this.$refs.authorizeFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            sotreId: this.sotreId,
            ...this.storeForm
          }
          this.$store
            .dispatch('storeManage/setStoreData', obj)
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
