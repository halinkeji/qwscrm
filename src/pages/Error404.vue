<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
     <img
        alt="Quasar logo"
        src="/pics/404.png"
      >

      <div class="text-h2" style="opacity:.6">
       出错啦...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="返回主站"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
