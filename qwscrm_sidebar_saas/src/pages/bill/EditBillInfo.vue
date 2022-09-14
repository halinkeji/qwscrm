<template>
  <q-dialog v-model="logDialogStatus" maximized persistent>
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">商家开票基本信息</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </q-header>
      <q-page-container>
        <q-page class="q-pa-sm">
          <q-form ref="billDataRef" class="row">

            <div class="col-12 q-px-xs">
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                emit-value
                label="发票类型"
                v-model="billDataForm.type"
                :options="billTypeArray"
                :rules="[(val) => !!val || '请选择发票类型']"
              />
            </div>
            <div class="col-12 q-px-xs">
              <q-input outlined v-model="billDataForm.title" dense label="发票抬头" :rules="[(val) => !!val || '请输入发票抬头']" />
            </div>

             <div class="col-12 q-px-xs">
              <q-input outlined v-model="billDataForm.buyer_number" dense label="纳税人识别号" :rules="[(val) => !!val || '请输入纳税人识别号']" />
            </div>

             <div class="col-12 q-px-xs">
              <q-input outlined v-model="billDataForm.buyer_address_and_phone" dense label="地址、电话" :rules="[(val) => !!val || '请输入地址、电话']" />
            </div>

             <div class="col-12 q-px-xs">
              <q-input outlined v-model="billDataForm.buyer_bank_account" dense label="开户行及账号" :rules="[(val) => !!val || '请输入开户行及账号']" />
            </div>

            <div class="col-12 q-px-xs">
              <q-input outlined v-model="billDataForm.buyer_emaill" dense label="发票接收邮箱" :rules="[(val) => !!val || '请输入发票接收邮箱']" />
            </div>
            <div class="col-12 q-px-xs">
              <q-input v-model="billDataForm.remark" outlined :rows="3" label="备注" type="textarea" />
            </div>
          </q-form>
        </q-page>
      </q-page-container>

      <q-footer class="bg-white">
        <q-toolbar class="justify-center">
          <q-btn unelevated rounded color="primary" @click="saveBillData" label="保存" class="q-px-xl" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>

export default {
  name: 'AddServiceLog',
  components: {},
  data () {
    return {
      logDialogStatus: false,
      billTypeArray: this.$store.state.billManage.billTypeArray,
      date: null,
      billDataForm: {
        type: '0',
        title: '',
        buyer_number: '',
        buyer_address_and_phone: '',
        buyer_bank_account: '',
        buyer_emaill: '',
        remark: '',
        contact_id: ''
      },
      billId: ''

    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (billId, contact_id) {
      this.logDialogStatus = true
      this.billId = billId
      this.billDataForm.contact_id = contact_id

      if (billId > 0) {
        this.getBaseBill()
      }
    },
    getBaseBill () {
      this.$store.dispatch('billManage/getBaseBill', this.billId)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.billDataForm = res.data
          }
        })
        .catch((error) => {})
    },

    closeDialog () {
      this.logDialogStatus = false
      this.$emit('closeDialog')
    },

    saveBillData () {
      this.$refs.billDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.billDataForm,
            id: this.billId
          }
          this.$store
            .dispatch('billManage/setData', obj)
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
