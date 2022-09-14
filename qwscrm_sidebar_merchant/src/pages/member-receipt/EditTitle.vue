<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left"  @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs"> {{ itemData.id > '0' ? '修改' : '新增' }}抬头 </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-form ref="titleDataRef">
      <div class="q-pa-md">
        <div class="row q-gutter-sm">

          <q-btn
            :color="parseInt(itemData.prt_type) == 1 ? 'primary' : 'grey'"
            @click="selectType('1')"
            unelevated
            label="个人/事业单位"
            class="col"
          />
          <q-btn
            :color="parseInt(itemData.prt_type) == 2 ? 'primary' : 'grey'"
            unelevated
            @click="selectType('2')"
            label="单位"
            class="col"
          />
        </div>
        <div class="row q-mt-md">
          <span class="text-red q-pl-xs">*</span>
          <q-input
            bottom-slots
            v-model="itemData.prt_name"
            dense
            class="q-pb-none full-width"
            label="请填写发票抬头（必填）"
            :rules="[(val) => !!val || '请填写发票抬头']"
          >
          </q-input>
        </div>
        <div class="row q-mt-lg" v-if="itemData.prt_type == '2'">
          <span class="text-red q-pl-xs">*</span>
          <q-input
            bottom-slots
            v-model="itemData.prt_identification_number"
            dense
            class="q-pb-none full-width"
            maxlength="20"
            label="请填写购买方纳税人识别号（必填）"
            :rules="[(val) => !!val || '为确保开票成功请谨慎添加纳税人识别号']"
          >
          </q-input>
        </div>

        <div class="row q-mt-lg">
          <span class="text-red q-pl-xs">*</span>
          <q-input
            bottom-slots
            v-model="itemData.prt_phone"
            dense
            class="q-pb-none full-width"
            label="请填写收票人联系电话"
            :rules="[
              (val) => !!val || '请填写收票人联系电话',
              (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确',
            ]"
          >
          </q-input>
        </div>
        <div class="row q-mt-lg">
          <span class="text-red q-pl-xs">*</span>
          <q-input
            bottom-slots
            v-model="itemData.prt_email"
            dense
            class="q-pb-none full-width"
            label="用于接收电子发票的邮箱（必填）"
            :rules="[
              (val) => /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(val) || '请填写正确的邮箱',
            ]"
          >
          </q-input>
        </div>
        <div class="row q-mt-lg" v-if="itemData.prt_type == '2'">
          <q-input bottom-slots v-model="itemData.prt_bank" dense class="q-pb-none full-width" label="请填写购买方开户行（选填）"> </q-input>
        </div>
        <div class="row q-mt-lg" v-if="itemData.prt_type == '2'">
          <q-input bottom-slots v-model="itemData.prt_bank_number" dense class="q-pb-none full-width" label="请填写购买方银行账号（选填）"> </q-input>
        </div>
        <div class="row q-mt-lg" v-if="itemData.prt_type == '2'">
          <q-input bottom-slots v-model="itemData.prt_address" dense class="q-pb-none full-width" label="请填写单位地址（选填）"> </q-input>
        </div>
      </div>
    </q-form>
    <q-footer class="text-black bg-white" bordered reveal>
      <q-toolbar class="q-pa-none bg-white footer-box q-my-xs q-px-lg">
        <q-btn unelevated rounded color="blue" label="保存" :disable="addButtonDisabled" class="full-width" @click="submitData" />
      </q-toolbar>
    </q-footer>
  </q-page>
</template>
<script>
export default {
  name: 'memberReceiptEditTitle',
  components: {},
  data () {
    return {
      addButtonDisabled: false,
      openCheckoutPageIf: false,
      itemData: {
        prt_member_id: 0,
        prt_name: '',
        prt_phone: '',
        prt_type: '1',
        prt_email: '',
        prt_identification_number: '',
        prt_bank: '',
        prt_bank_number: '',
        prt_address: ''
      },
      users: '',
      titleId: ''
    }
  },
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.itemData.prt_member_id = this.member_id

      this.$nextTick(() => {
        if (this.$route.query.id > 0) {
          this.titleId = this.$route.query.id
          this.getTitle()
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
  mounted () {

  },
  computed: {},
  methods: {
    selectType (type) {
      this.itemData.prt_type = type
      this.itemData.prt_identification_number = ''
      this.itemData.prt_bank = ''
      this.itemData.prt_bank_number = ''
      this.itemData.prt_address = ''
    },
    submitData () {
      this.$refs.titleDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const data = {
            ...this.itemData,
            do: 'saveReceiptTitleData',
            member_id: this.member_id
          }
          this.$store
            .dispatch('member/postApi', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.itemData.id > 0 ? '修改' : '新增'}` + '发票抬头成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$router.go(-1)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
              this.addButtonDisabled = false
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    getTitle () {
      this.$store
        .dispatch('member/postApi', {
          do: 'getReceiptTitleItem',
          titleId: this.titleId,
          member_id: this.member_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.itemData = res.data ? res.data : this.itemData
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }

  }
}
</script>
