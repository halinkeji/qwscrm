<template>
  <q-layout view="lHr lpR lFr">
    <q-header>
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">激活成功</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="full-width column no-wrap justify-start fixed">
        <div class="fixed-center full-width">
          <div class="btn-num-box-center">
            <q-icon name="fa-solid fa-circle-check" color="positive" size="64px" />
          </div>
          <div class="btn-num-box-center text-h5 text-weight-bolder q-mt-lg text-positive">激活成功</div>
          <q-item class="items-center full-width q-mt-md">
            <q-btn size="lg" class="full-width btn-submit-box" @click="closeCurrentWindow" color="primary"> 关闭 </q-btn>
          </q-item>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'Success',
  components: {},
  data () {
    return {}
  },
  methods: {
    closeCurrentWindow () {
      setTimeout(function () {
        document.addEventListener(
          'WeixinJSBridgeReady',
          function () {
            this.WeixinJSBridge.call('closeWindow') // 安卓手机关闭代码
          },
          false
        )
        this.WeixinJSBridge.call('closeWindow') // 苹果手机关闭代码
      }, 300)
      // 以下是普通浏览器关闭代码
      window.opener = null
      window.open('about:blank', '_top').close()
    }
  }
}
</script>

<style lang="scss">
.btn-num-box-center {
  text-align: center;
}
.btn-submit-box {
  /* Gradient */

  background: radial-gradient(122.27% 198.92% at -22.27% -27.38%, #0070ba 0%, #1546a0 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  box-shadow: 0px 24px 48px -18px rgba(21, 70, 160, 0.5);
  border-radius: 20px;
}
</style>
