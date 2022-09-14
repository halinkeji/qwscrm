<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left"  @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          会员开卡
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-card class="q-ma-sm full-width " flat bordered>
      <q-card-section class="text-center q-pb-xs">
        <div class="text-subtitle2">请客户使用微信扫描下方二维码</div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="flex flex-center">
        <qrcode-vue id="mobileRegUrlRef" :value="mobileRegUrl" foreground="#027be3" :size="'200'" level="H" />
      </q-card-section>
      <q-separator inset />
      <q-card-section class="flex flex-center">
        <div class="text-subtitle2">会员自助开卡</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>

export default {
  components: {},

  data () {
    return {
      activePrompt: false,
      maxHeightLimit: '',
      mobileRegUrl: ''
    }
  },

  mounted () {},
  created () {
    this.getOpenCardUrl()
  },
  computed: {

  },
  methods: {
    getOpenCardUrl () {
      this.$store
        .dispatch('member/postApi', { do: 'openCardUrl' })
        .then((res) => {
          if (res.code == 200) {
            this.mobileRegUrl = res.data && res.data.url ? res.data.url : ''
            this.$nextTick(() => {
              this.getCode()
            })
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
    },

    getCode () {
      this.maxHeightLimit = (document.body.clientHeight - 5).toString() + 'px'
      this.activePrompt = true
    },
    closeDialog () {
      this.$router.push({ name: 'memberCate' })
    }
  }
}
</script>
