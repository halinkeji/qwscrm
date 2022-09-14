<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          发票信息
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div class="q-pa-sm">
      <q-form ref="titletemRef">
        <div class="row ">
          <div class="col-12 ">
            <span class="row justify-center text-h5">
              开票总计金额：{{ itemData.pr_invoice_amount}}{{ $store.state.member.storeBaseConfig.consume_base_moneyUnit }}</span>
          </div>
          <div class=" col-12 q-pr-sm q-mt-sm">
            <span><span class="text-red q-pl-xs">*</span>发票金额 </span>
            <q-input
              v-model="itemData.pr_total_amount"
              dense
              lazy-rules
              :rules="[(val) => !!val || '请输入开具发票金额', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '发票金额为非负两位以内小数']"
            >
            </q-input>
          </div>
          <div class="col-12">
            <q-input
              class=" q-pr-sm q-mt-xs"
              dense
              v-model="itemData.pr_invoice_code_info"
              placeholder="请输入开具发票代码"
              lazy-rules
              :rules="[(val) => (val > 0 && val <= 999999999999) || '请输入正确的发票代码,发票号码一般是10位或12位']"
            />
          </div>
          <div class="col-12">
            <q-input
              class=" q-pr-sm q-mt-xs"
              dense
              v-model="itemData.pr_invoice_number"
              placeholder="请输入开具发票发票号码"
              lazy-rules
              :rules="[(val) => (val > 0 && val <= 99999999) || '请输入正确的发票号码，发票号码一般是8位']"
            />
          </div>
        </div>
        <div class="row" v-if="titleListData.length > 0">
          <div class="col-12 q-pr-sm">

            <q-select
              dense
              v-model="titleId"
              :options="titleListData"
              label="请选择发票抬头"
              option-value="id"
              option-label="prt_name"
              emit-value
              @input="getTitleName(titleId)"
              map-options
              bottom-slots
            />

          </div>
        </div>
        <div class="row items-center q-gutter-sm">

          <q-btn
            class="col q-mx-sm"
            :color="itemData.pr_type == '1' ? 'primary' : 'grey'"
            @click="selectType('1')"
            unelevated
            label="个人/事业单位"
          />
          <q-btn
            :color="itemData.pr_type == '2' ? 'primary' : 'grey'"
            class="col q-mx-sm"
            unelevated
            @click="selectType('2')"
            label="单位"
          />

        </div>
        <div class="row">
          <div class="col-12 q-pr-sm q-mt-sm">
            <span><span class="text-red q-pl-xs">*</span>发票抬头:</span>
            <q-input
              dense
              class="text-bold text-subtitle1"
              v-model="itemData.pr_title_name"
              placeholder="请输入发票抬头（必填）"
              lazy-rules
              :rules="[(val) => !!val || '请填写发票抬头']"
            />
          </div>
        </div>
        <div class="row" v-if="itemData.pr_type == '2'">
          <div class="col-12">
            <span><span class="text-red q-pl-xs">*</span>纳税人识别号</span><span class="text-blue">(15-20位)</span>:
            <q-input
              dense
              v-model="itemData.pr_identification_number"
              placeholder="请输入纳税人识别号"
              lazy-rules
              maxlength="20"
              :rules="[(val) => !!val || '为确保开票成功请谨慎添加纳税人识别号']"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <span><span class="text-red q-pl-xs">*</span>联系电话</span>
            <q-input
              dense
              v-model="itemData.pr_phone"
              placeholder="请填写收票人联系电话"
              lazy-rules
              :rules="[
                (val) => !!val || '请填写收票人联系电话',
                (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确',
              ]"
            />
          </div>
        </div>
        <div class="row ">
          <div class="col-12">
            <span><span class="text-red q-pl-xs">*</span>收票人邮箱：</span>
            <q-input
              dense
              v-model="itemData.pr_email"
              placeholder="用于接收电子发票的邮箱（必填）"
              :rules="[
                (val) =>
                  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val) || '请输入正确的邮箱',
              ]"
            />
          </div>
        </div>
        <div v-if="itemData.pr_type == '2'">
          <div class=" row ">
            <div class="col-12">
              <span>开户银行：</span>
              <q-input dense v-model="itemData.pr_bank" placeholder="请输入开户银行（选填）" />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <span>银行账号：</span>
              <q-input
                dense
                v-model="itemData.pr_bank_number"
                placeholder="请输入银行账号（选填）"
                lazy-rules
                :error="bankNumberVerify"
                :error-message="'银行账号格式不正确'"
              />
            </div>
          </div>
          <div class="row ">
            <div class="col-12 ">
              <span>单位地址</span>
              <q-input dense v-model="itemData.pr_address" placeholder="请输入单位地址（选填）" />
            </div>
          </div>
        </div>
      </q-form>
      <q-footer class="text-black bg-white" bordered reveal>
        <q-toolbar class="q-pa-none bg-white footer-box q-my-xs q-px-lg">
          <q-btn rounded unelevated color="primary" @click="setData" label="开票" :disable="addButtonDisabled" class="full-width" />
        </q-toolbar>
      </q-footer>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'memberOpenReceipt',
  data () {
    return {
      titleId: '',
      itemData: {
        pr_member_id: 0,
        pr_total_amount: '',
        pr_invoice_amount: '',
        pr_title_name: '',
        pr_type: '1',
        pr_email: '',
        pr_phone: '',
        pr_bank: '',
        pr_bank_number: '',
        pr_address: '',
        pr_status: 0
      },
      addButtonDisabled: false,
      titleListData: [],
      invoiceListData: [],
      member_id: ''
    }
  },
  created () {},
  mounted () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id
      this.itemData.pr_member_id = this.member_id

      this.$nextTick(() => {
        if (this.$route.params.money) {
          this.init(this.$route.params.money, this.$route.params.invoice, this.$route.params.memberId)
        } else {
          this.$router.go(-1)
        }
      })
    } else {
      this.$q.notify({
        message: '错误',
        caption: '当前客户未激活会员！',
        icon: 'ion-close-circle-outline',
        color: 'red',
        timeout: 500,
        position: 'top-right'
      })
      this.$router.push({ name: 'home' })
      return false
    }
  },
  computed: {
    bankNumberVerify () {
      if (this.itemData.pr_bank_number && !/^\d{16}|\d{19}$/.test(this.itemData.pr_bank_number)) {
        return true
      }
      return false
    }
  },
  methods: {
    selectType (type) {
      this.itemData.pr_type = type
      this.itemData.pr_identification_number = ''
      this.itemData.pr_bank = ''
      this.itemData.pr_bank_number = ''
      this.itemData.pr_address = ''
    },
    init (totalAmount, data, memberId) {
      if (totalAmount > 0) {
        this.itemData.pr_invoice_amount = totalAmount
        this.itemData.pr_total_amount = totalAmount
        this.itemData.pr_member_id = memberId
        this.invoiceListData = data
      }
      const params = {
        member_id: this.member_id,
        do: 'getReceiptAllTitle'
      }
      this.$store
        .dispatch('member/postApi', params)
        .then((res) => {
          if (res.code == 200) {
            this.titleListData = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
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
    },

    setData () {
      this.$refs.titletemRef.validate().then((success) => {
        if (success) {
          this.$q
            .dialog({
              title: '提示',
              message: '确定开具发票？',
              cancel: true,
              persistent: true
            })
            .onOk(() => {
              this.addButtonDisabled = true
              this.itemData.pr_status = 1
              const data = {
                itemData: this.itemData,
                invoiceListData: this.invoiceListData,
                do: 'saveReceiptRecord',
                member_id: this.member_id
              }
              this.$store
                .dispatch('member/postApi', data)
                .then((res) => {
                  if (res.code == 200) {
                    this.$q.notify({
                      message: '成功',
                      caption: '提交成功',
                      icon: 'ion-checkmark-circle-outline',
                      timeout: 500,
                      position: 'top-right',
                      color: 'green'
                    })
                    this.$router.go(-1)
                  } else {
                    this.addButtonDisabled = false
                    this.$q.notify({
                      message: '失败',
                      caption: res.message,
                      color: 'red',
                      icon: 'ion-close-circle-outline',
                      timeout: 500,
                      position: 'top-right'
                    })
                  }
                })
                .catch((error) => {
                  this.addButtonDisabled = false
                  this.$q.notify({
                    message: '失败',
                    caption: error.message,
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'red'
                  })
                })
            })
        }
      })
    },
    getTitleName (id) {
      if (id > 0) {
        this.$store
          .dispatch('member/postApi', {
            do: 'getReceiptTitleItem',
            titleId: id
          })
          .then((res) => {
            if (res.code == 200) {
              this.itemData.pr_title_name = res.data.prt_name
              this.itemData.pr_phone = res.data.prt_phone
              this.itemData.pr_type = res.data.prt_type
              this.itemData.pr_email = res.data.prt_email
              this.itemData.pr_identification_number = res.data.prt_identification_number
              this.itemData.pr_bank = res.data.prt_bank
              this.itemData.pr_bank_number = res.data.prt_bank_number
              this.itemData.pr_address = res.data.prt_address
              this.itemData.pr_member_id = res.data.prt_member_id
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })
          .catch((err) => {})
      }
    }
  }
}
</script>
