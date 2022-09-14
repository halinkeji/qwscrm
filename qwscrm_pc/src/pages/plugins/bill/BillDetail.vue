<template>
  <q-dialog v-model="logDialogStatus" persistent>
    <q-card>
      <div class="row q-pa-sm items-center bg-white text-dark">
        <div class="text-subtitle">开票详情</div>
        <q-space />
        <q-btn dense @click="closeDialog" flat icon="close" />
      </div>
      <q-list bordered separator>
        <q-item>
          <q-item-section>
            <q-item-label class="text-caption"
              >开票金额：¥ <span class="text-negative text-h6 text-weight-bold">{{ billDataForm.fee }}</span></q-item-label
            >
          </q-item-section>
        </q-item>
        <q-item v-if="billDataForm.contract_id > 0">
          <q-item-section>
            <q-item-label>{{ billDataForm.contract ? billDataForm.contract.no : '' }}</q-item-label>
            <q-item-label caption lines="1">关联合同编号</q-item-label>
          </q-item-section>
          <q-item-section v-if="billDataForm.contact_follow_id > 0">
            <q-item-label>{{ billDataForm.follow ? billDataForm.follow.name : '' }}</q-item-label>
            <q-item-label caption lines="1">关联事件</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>{{ billDataForm.billing_no }}</q-item-label>
            <q-item-label caption>发票代码</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ billDataForm.billing_code }}</q-item-label>
            <q-item-label caption>发票号码</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>开票时间：{{ billDataForm.billing_time }}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>入档时间：{{ formatDate(billDataForm.created_at) }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label caption lines="3"><span class="text-dark">备注：</span>{{ billDataForm.remarks }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
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
    init (billLogId) {
      this.logDialogStatus = true

      if (billLogId > 0) {
        this.billLogId = billLogId
        this.getBillLog()
      }
    },
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return ''
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
    }
  }
}
</script>
