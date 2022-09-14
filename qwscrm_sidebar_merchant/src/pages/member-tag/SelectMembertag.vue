<template>
  <div>
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
  </div>
</template>

<script>
export default {
  name: 'SelectMembertag',
  props: ['memberId'],
  data () {
    return {
      memberTagData: [],
      haveTag: []
    }
  },
  watch: {
    haveTag (val) {
      this.$emit('getMembertag', val)
    }
  },
  created () {},
  mounted () {
    setTimeout(() => {
      this.getTag()
    }, 200)
  },
  computed: {},
  methods: {
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
    getTag () {
      const params = {
        do: 'getBindTagData'
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
    }
  }
}
</script>

<style></style>
