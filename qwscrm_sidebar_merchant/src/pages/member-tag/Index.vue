<template>
  <q-page class="bg-white">
    <q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          会员标签
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-card flat class="q-ma-sm">
      <q-card-section class="q-px-sm"> <q-icon name="las la-tag" color="blue-8" class="q-mr-sm"></q-icon>当前标签 </q-card-section>
      <q-card-section class="q-pt-none" v-if="haveTag.length > 0">
        <q-btn outline rounded class="q-mr-sm q-mb-sm" v-for="(item, key) in haveTag" :key="key" @click="handleClose(item)" color="blue-8">
          <div class="text-blue-8">{{ item.mti_name }}</div>
        </q-btn>
      </q-card-section>
      <q-card-section class="q-pt-none text-center text-blue-8" v-else>--暂无标签--</q-card-section>
    </q-card>

    <q-card flat class="q-ma-sm">
      <q-card-section class="q-px-sm"> <q-icon name="las la-tags" color="orange" class="q-mr-sm"></q-icon>可贴标签 </q-card-section>
      <q-card-section class="q-pt-none" v-if="memberTagData.length > 0">
        <q-btn outline rounded class="q-mr-sm q-mb-sm" v-for="(item, key) in memberTagData" :key="key" @click="addTag(item)" color="orange">
          <div class="text-orange">{{ item.mti_name }}</div>
        </q-btn>
      </q-card-section>
      <q-card-section class="q-pt-none text-center text-orange" v-else>--暂无可贴标签--</q-card-section>
    </q-card>
    <q-footer class="text-black bg-white" bordered reveal>
      <div class="row q-mt-sm q-ma-sm">
        <q-btn rounded unelevated color="primary" label="保存" @click="saveButton" class="full-width" />
      </div>
    </q-footer>
  </q-page>
</template>
<script>
export default {
  name: 'memberTag',
  components: {},
  data () {
    return {
      memberTagData: [],
      haveTag: [],
      member_id: ''

    }
  },
  watch: {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getTag()
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
    getTag () {
      const params = {
        do: 'getBindTagData',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', params)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.memberTagData = res.data.notTag
            this.haveTag = res.data.haveTag
          }
        })
        .catch((error) => {
          this.$q.notify({
            color: 'red',
            message: '失败',
            caption: error.message,
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    addTag (val) {
      if (val) {
        this.haveTag.push(val)
        this.memberTagData.splice(this.memberTagData.indexOf(val), 1)
      }
    },
    handleClose (val) {
      if (val) {
        this.haveTag.splice(this.haveTag.indexOf(val), 1)
        this.memberTagData.push(val)
      }
    },
    saveButton () {
      const params = {
        memberTagData: this.haveTag,
        do: 'setBindTagData',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            // this.getTag()
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: res.message,
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            color: 'red',
            message: '失败',
            caption: error.message,
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>

<style></style>
