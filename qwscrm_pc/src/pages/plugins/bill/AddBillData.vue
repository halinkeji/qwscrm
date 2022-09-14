<template>
  <q-dialog v-model="logDialogStatus"  persistent>
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">开票</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </q-header>
      <q-page-container>
        <q-page class="q-pa-sm">
          <q-form ref="billDataRef" class="row">
            <div class="col-12 q-px-xs" >
              <q-select
                dense
                map-options
                outlined
                option-label="label"
                option-value="value"
                emit-value
                label="发票状态"
                v-model="billDataForm.status"
                :options="billStatusArray"
                :rules="[(val) => !!val || '请选择发票状态']"
                @input="changeStatus"
              />
            </div>

            <div class="col-12 q-px-xs">
              <q-input outlined v-model="billDataForm.fee" dense label="开票金额" :rules="[(val) => !!val || '请输入开票金额']" />
            </div>

            <div class="col-12 q-px-xs" v-if="parseInt(billDataForm.status) > 0">
              <q-input bottom-slots outlined v-model="billDataForm.billing_time" dense label="开票时间" readonly >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date minimal v-model="billDataForm.billing_time" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-12 q-px-xs">
              <q-select
                dense
                map-options
                outlined
                option-label="name"
                option-value="id"
                emit-value
                label="关联事件"
                v-model="billDataForm.contact_follow_id"
                :options="allEevetData"
                bottom-slots
                clearable
              />
            </div>

            <div class="col-12 q-px-xs">
              <q-select
                dense
                map-options
                outlined
                option-label="no"
                option-value="id"
                emit-value
                label="关联合同"
                v-model="billDataForm.contract_id"
                :options="allContractData"
                bottom-slots
                clearable
              />
            </div>

            <div class="col-12 q-px-xs" v-if="parseInt(billDataForm.status) > 0">
              <q-input outlined v-model="billDataForm.billing_no" bottom-slots dense label="发票代码"  />
            </div>

            <div class="col-12 q-px-xs" v-if="parseInt(billDataForm.status) > 0">
              <q-input outlined v-model="billDataForm.billing_code" bottom-slots dense label="发票号码"  />
            </div>

            <!-- <div class="col-12 q-px-xs">
              <q-input outlined v-model="billDataForm.file_attach" dense label="发票附件" :rules="[(val) => !!val || '请输入发票附件']" />
            </div> -->

            <div class="col-12 q-px-xs">
              <q-input v-model="billDataForm.remarks" outlined :rows="3" label="备注" type="textarea" />
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
import { date } from 'quasar'
export default {
  name: 'AddBillData',
  components: {},
  data () {
    return {
      logDialogStatus: false,
      billStatusArray: this.$store.state.billManage.billStatusArray,
      successStatusArray: this.$store.state.billManage.successStatusArray,
      date: null,
      billDataForm: {
        bill_info_id: 0,
        contact_id: '',
        contract_id: '',
        contact_follow_id: '',
        fee: '',
        billing_time: '',
        billing_no: '',
        billing_code: '',
        status: '',
        remarks: '',
        file_attach: ''
      },
      billId: '',
      billLogId: '',
      allEevetData: [],
      allContractData: []
    }
  },
  computed: {},
  mounted () {},
  created () {},
  methods: {
    init (billLogId, billId, contact_id) {
      this.logDialogStatus = true
      this.billDataForm.bill_info_id = billId
      this.billDataForm.contact_id = contact_id
      this.getLinkData()
      if (billLogId > 0) {
        this.billLogId = billLogId
        this.getBillLog()
      }
    },
    changeStatus () {
      if (parseInt(this.billDataForm.status) == 0) {
        this.billDataForm.billing_no = ''
        this.billDataForm.billing_code = ''
      }
    },
    getLinkData () {
      this.$store
        .dispatch('billManage/getLinkData', {
          contact_id: this.billDataForm.contact_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.allEevetData = res.data && res.data.allEevet ? res.data.allEevet : []
            this.allContractData = res.data && res.data.allContract ? res.data.allContract : []
          }
        })
        .catch((error) => {})
    },
    getBillLog () {
      this.$store
        .dispatch('billManage/getBillLog', this.billLogId)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.billDataForm = res.data
            if (this.billDataForm.billing_time) {
              this.billDataForm.billing_time = date.formatDate(parseInt(this.billDataForm.billing_time) * 1000, 'YYYY-MM-DD')
            }
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
            ...this.billDataForm
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
