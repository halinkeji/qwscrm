<template>
  <div class="q-pa-sm">
    <div class="row q-gutter-xs">
      <q-btn color="positive" unelevated label="开票" @click="addBillData" :disable="!billBaseInfo.id" />
    </div>

    <q-card flat bordered class=" q-mt-sm">
      <q-card-section class="q-pa-none">
        <q-expansion-item>
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon color="primary" name="confirmation_number" />
            </q-item-section>
            <q-item-section> 商家开票基本信息 </q-item-section>
          </template>

            <q-card>
              <q-card-section class="q-pa-xs">
                <q-list  >
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>发票抬头</q-item-label>
                      <q-input v-model="billBaseInfo.title"  :disable="editStatus" dense />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>发票类型</q-item-label>
                      <q-select
                        dense
                        map-options
                        option-label="label"
                        option-value="value"
                        emit-value
                        v-model="billBaseInfo.type"
                        :options="billTypeArray"
                        :disable="editStatus"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>纳税人识别号</q-item-label>
                      <q-input v-model="billBaseInfo.buyer_number" dense :disable="editStatus" />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>地址、电话</q-item-label>
                      <q-input v-model="billBaseInfo.buyer_address_and_phone" dense :disable="editStatus" />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>开户行及账号</q-item-label>
                      <q-input v-model="billBaseInfo.buyer_bank_account" dense :disable="editStatus" />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>邮件地址</q-item-label>
                      <q-input v-model="billBaseInfo.buyer_emaill" dense :disable="editStatus" />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption lines="3">备注</q-item-label>
                      <q-input v-model="billBaseInfo.remark" :disable="editStatus" :rows="3" type="textarea" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-card-actions align="center"  v-if="editStatus">
                <q-btn outline dense @click="editStatus = false">编辑</q-btn>
              </q-card-actions>
              <q-card-actions align="center"  v-else>
                <q-btn outline dense @click="saveBillData">保存</q-btn>
              </q-card-actions>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>

    <div :key="'log-' + key" v-for="(item, key) in billLogList">

      <q-card class="q-mt-sm" bordered flat>
        <q-card-section class="q-pb-none">
          <div class="row items-center no-wrap">
            <div >
              <div class="text-subtitle1">{{ item.info ? item.info.title : '' }}</div>
            </div>
            <q-space />
            <div >
              <q-btn outline dense color="grey" v-if="parseInt(item.status) == 0">{{ billStatusObject[item.status] }}</q-btn>
              <q-btn outline dense color="primary" v-if="parseInt(item.status) == 1">{{ billStatusObject[item.status] }}</q-btn>
              <q-btn outline dense color="positive" v-if="parseInt(item.status) == 2">{{ billStatusObject[item.status] }}</q-btn>
            </div>
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert" v-if="parseInt(item.status) == 0 || parseInt(item.status) == 1">
                <q-menu cover auto-close>
                  <q-list class="q-menu-list-width">
                    <q-item clickable class="q-px-sm" @click="updateBill(item.id)">
                      <q-item-section>开票状态</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>
                    </q-item>
                    <q-item clickable @click="addBillData(item.id)" class="q-px-sm">
                      <q-item-section>信息编辑</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-sm">
          <q-list bordered separator>
              <q-item>
              <q-item-section>
                <q-item-label class="text-caption">开票金额：¥ <span class="text-negative text-h6 text-weight-bold">{{ item.fee }}</span></q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="item.contract_id > 0">
              <q-item-section >
                <q-item-label>{{ item.contract ? item.contract.no : '' }}</q-item-label>
                <q-item-label caption lines="1">关联合同编号</q-item-label>
              </q-item-section>

            </q-item>
            <q-item v-if="item.contact_follow_id > 0">
              <q-item-section >
                <q-item-label>{{ item.follow ? item.follow.name : '' }}</q-item-label>
                <q-item-label caption lines="1">关联事件</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>{{ item.billing_no }}</q-item-label>
                <q-item-label caption>发票代码</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.billing_code }}</q-item-label>
                <q-item-label caption>发票号码</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label >开票时间：{{ formatDate(item.billing_time) }}</q-item-label>
              </q-item-section>
              <q-item-section v-if="parseInt(item.status) == 3">
                <q-item-label >归档时间：{{ formatDate(item.created_at) }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption lines="3"><span class="text-dark">备注：</span>{{ item.remarks }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <add-bill-data ref="addBillDataRef" v-if="addBillStatus" @closeDialog="getData" />
    <bill-status ref="billStatusDataRef" v-if="updateBillStatus" @closeDialog="getData" />
  </div>
</template>

<script>
import AddBillData from './AddBillData.vue'

import { date } from 'quasar'
import BillStatus from './BillStatus.vue'
export default {
  name: 'PageBill',
  props: ['contact_id'],
  components: {

    AddBillData,
    BillStatus
  },
  data () {
    return {
      editBillStatus: false,
      addBillStatus: false,
      billBaseInfo: {
        type: '0',
        title: '',
        buyer_number: '',
        buyer_address_and_phone: '',
        buyer_bank_account: '',
        buyer_emaill: '',
        remark: '',
        contact_id: ''
      },
      billTypeObject: this.$store.state.billManage.billTypeObject,
      billStatusObject: this.$store.state.billManage.billStatusObject,

      billLogList: [],
      updateBillStatus: false,
      editStatus: true,
      billTypeArray: this.$store.state.billManage.billTypeArray
    }
  },
  computed: {},
  mounted () {
    this.getData()
  },
  created () {},
  methods: {
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return ''
    },
    getData () {
      this.editBillStatus = false
      this.addBillStatus = false
      this.$store
        .dispatch('billManage/getData', { contact_id: this.contact_id })
        .then((res) => {
          if (res.code == 200) {
            this.billBaseInfo = res.data && res.data.billBaseInfo ? res.data.billBaseInfo : {}
            this.billLogList = res.data && res.data.billLogList ? res.data.billLogList : []
          }
        })
        .catch((error) => {})
    },

    addBillData (billLogId) {
      this.addBillStatus = true
      this.$nextTick(() => {
        this.$refs.addBillDataRef.init(billLogId, this.billBaseInfo && this.billBaseInfo.id ? this.billBaseInfo.id : 0, this.contact_id)
      })
    },

    updateBill (billLogId) {
      this.updateBillStatus = true
      this.$nextTick(() => {
        this.$refs.billStatusDataRef.init(billLogId)
      })
    },

    saveBillData () {
      const obj = {
        ...this.billBaseInfo
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
            this.editStatus = true
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
  }
}
</script>
<style lang="scss">
.q-menu-list-width {
  min-width: 100px;
}
.q-item__section--main ~ .q-item__section--side {
  align-items: flex-end;
  padding-right: 0;
  padding-left: 0px;
}
.q-btn--fab .q-btn__wrapper {
  padding: 6px;
  min-height: 40px;
  min-width: 40px;
}
</style>
