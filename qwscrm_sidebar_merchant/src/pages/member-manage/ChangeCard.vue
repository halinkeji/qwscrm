<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs"> 会员换卡 </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- 顶部导航 -->
    <q-form ref="changeRef">
      <div class="q-pa-sm">

        <q-input v-model="$store.state.member.memberInfo.mem_memberCardNum" class="q-pb-none" label="原卡号：" disable dense outlined> </q-input>
      </div>
      <div class="q-pa-sm">
        <q-input
          v-model="memberInfo.newCardNumber"
          class="q-pb-none"
          label="新卡号："
          lazy-rules
          dense
          outlined
          :rules="[(val) => /^\d{1,11}$/.test(val) || '请输入卡号']"
        >
          <template v-slot:after>
            <q-btn unelevated color="amber-8" label="一键生成卡号" class="full-width" @click="generateCardNumber" />
          </template>
        </q-input>
      </div>
    </q-form>
    <q-footer class="text-black bg-white" bordered>
      <div class="row q-mt-sm q-ma-sm">
        <q-btn unelevated color="primary" label="确定" :disable="addButtonDisabled" @click="changeCard" class="full-width" />
      </div>
    </q-footer>
  </q-page>
</template>
<script>
export default {
  name: 'changeMemberCard',
  data () {
    return {
      addButtonDisabled: false,
      memberInfo: {
        id: '',
        newCardNumber: ''
      },
      member_id: ''
    }
  },
  mounted () {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id
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
  computed: {},
  methods: {
    generateCardNumber () {
      this.memberInfo.newCardNumber = String(Math.ceil((Math.random() + 1) * 10000000000))
    },
    // 换卡号方法
    changeCard () {
      this.$refs.changeRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const data = {
            ...this.memberInfo,
            do: 'changeCardNumber',
            member_id: this.member_id
          }
          this.$store
            .dispatch('member/postApi', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '更换卡号成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.addButtonDisabled = false
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
              this.addButtonDisabled = false
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    }
  }
}
</script>
