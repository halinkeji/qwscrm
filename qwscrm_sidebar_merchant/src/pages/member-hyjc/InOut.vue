<template>
  <q-page class="bg-grey-3 q-pa-sm">
    <!-- 顶部导航 -->
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          存取
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-form ref="addDetailRef">
      <q-card flat class="q-pa-sm">
        <div>
          <!-- class="text-center" -->
          <div class="text-h6 q-mt-sm">{{ recordData.phr_name }}</div>
          <q-separator />
          <div class="row " v-if="recordData.member">
            <div class="col-6">名称: {{ recordData.member.mem_memberName }}</div>
            <div class="col-12">卡号: {{ recordData.member.mem_memberCardNum }}</div>
            <div class="col-12">手机号: {{ recordData.member.mem_memberMobile }}</div>
          </div>
          <div class="q-mb-sm">
            剩余数量：<span class="text-red text-subtitle1">{{ recordData.phr_quantity }}</span>
          </div>

          <div class="q-mt-sm">
            <q-input
              outlined
              v-model="operatelQuantity"
              dense
              clearable
              class="q-pb-md"
              label="操作数量"
              :rules="[(val) => /^[1-9]\d*$/.test(val) || '操作数量为正整数']"
            />
          </div>
          <div class="q-mb-sm">
            <q-input outlined v-model="detailRemarks" dense rows="3" class="full-width" label="备注" type="textarea"> </q-input>
          </div>
        </div>
      </q-card>
    </q-form>
    <q-footer class="text-black bg-white" bordered reveal>
      <q-toolbar class="row q-pa-none bg-white footer-box q-my-xs q-px-lg">
        <q-btn color="primary" rounded unelevated @click="setData('in')" class="col-6 q-mx-sm" label="存入" :disable="addButtonDisabled" />
        <q-btn color="red" rounded unelevated class="col-6 " @click="setData('out')" label="取出" :disable="addButtonDisabled" />
      </q-toolbar>
    </q-footer>
  </q-page>
</template>
<script>

export default {
  name: 'hyjcInOut',
  components: {},
  data () {
    return {
      addButtonDisabled: false,
      operatelQuantity: '',
      detailRemarks: '',
      recordData: {},
      member_id: ''
    }
  },
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        if (parseInt(this.$route.query.recordId) > 0) {
          this.init(this.$route.query.recordId)
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
  mounted () {},
  computed: {},
  methods: {
    // 查询寄存单条记录
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('member/postApi', {
            do: 'getHyjcRecordDetail',
            hyjcRecirdId: id,
            member_id: this.member_id
          })
          .then((res) => {
            if (res.code == 200) {
              this.recordData = res.data ? res.data : {}
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
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    setData (type) {
      this.$refs.addDetailRef.validate().then((success) => {
        if (success) {
          this.$q
            .dialog({
              title: '提示',
              message: `${type == 'in' ? '确定添加储存数量？' : '确定取出？'}`,
              cancel: true,
              persistent: true
            })
            .onOk(() => {
              if (type == 'in') {
                this.recordData.inQuantity = this.operatelQuantity
              } else {
                if (parseInt(this.operatelQuantity) > parseInt(this.recordData.phr_quantity)) {
                  this.$q.notify({
                    message: '提示',
                    caption: '数量不足',
                    color: 'red',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.operatelQuantity = ''
                  return false
                }
                this.recordData.outQuantity = this.operatelQuantity
              }
              this.recordData = [this.recordData]
              const data = {
                datailData: this.recordData,
                detailRemarks: this.detailRemarks,
                do: 'inOutHyjcDetail',
                member_id: this.member_id

              }
              this.addButtonDisabled = true
              this.$store
                .dispatch('member/postApi', data)
                .then((res) => {
                  if (res.code == 200) {
                    this.$q.notify({
                      message: '成功',
                      caption: `${type == 'in' ? '存入' : '取出'}` + '成功',
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
                    this.addButtonDisabled = false
                  }
                })
                .catch((error) => {
                  this.$q.notify({
                    message: '失败',
                    caption: error.message,
                    color: 'red',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                })
            })
            .onCancel(() => {})
        }
      })
    }
  }
}
</script>
