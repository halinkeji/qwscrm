<template>
  <q-dialog v-model="logDialogStatus" persistent>
    <q-card class="full-width">
      <div class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">合同状态</div>
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
            label="合同类型"
            v-model="contractDataForm.type"
            :options="[
              {
                label: '电子合同',
                value: '0',
              },
              {
                label: '纸质合同',
                value: '1',
              },
            ]"
            :rules="[(val) => !!val || '请选择合同类型']"
            @input="contractDataForm.status = ''"
          />
        </div>
        <div class="col-12 q-px-xs">
          <q-select
            dense
            map-options
            outlined
            option-label="label"
            option-value="value"
            emit-value
            label="合同状态"
            v-model="contractDataForm.status"
            :options="parseInt(contractDataForm.type) == 0 ? dianziContractStatus : (parseInt(contractDataForm.type) == 1 ? contractStatusArr : [])"
            :rules="[(val) => !!val || '请选择合同状态']"
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
      contractStatusArr: this.$store.state.contract.contractStatusArr,
      dianziContractStatus: this.$store.state.contract.dianziContractStatus,
      sotreId: '',
      contractDataForm: {
        status: '',
        id: '',
        type: ''
      }
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (eventId) {
      this.logDialogStatus = true
      this.contractDataForm.id = eventId
    },

    closeDialog () {
      this.logDialogStatus = false
      this.$emit('closeDialog')
    },

    saveLog () {
      this.$refs.authorizeFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.contractDataForm
          }
          this.$store
            .dispatch('contract/setData', obj)
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
