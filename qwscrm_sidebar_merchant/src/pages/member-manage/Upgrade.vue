<template>
  <q-page class="bg-grey-2">
<q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          会员级别
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div v-for="(item, key) in LevelData">
      <q-card class="my-card q-mx-sm q-mt-md" flat>
        <q-ribbon position="top-right" type="corner" v-if="$route.query.level == item.id" glow>当前级别</q-ribbon>
        <q-img
          :ratio="16 / 9"
          :src="`${$store.state.member.cdn_url + item.mcl_cover_image}`"
          basic
          height="100px"
        >
        </q-img>

        <q-tabs v-model="tab" class="text-primary">
          <q-tab :label="item.mcl_level_name" name="1" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="1">
            <div class="text-weight-bold">
              有效期: <span class="q-ml-xs">{{ endTimeFormat(item) }}</span>
            </div>
            <div class="text-subtitle2">
              售卡金额:<span class="q-ml-xs">{{ item.mcl_card_price }}</span>
            </div>
            <div class="text-subtitle2 ">
              会员权益:<span class="q-ml-xs">{{ item.mcl_explanation }}</span>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <q-card-actions v-if="$route.query.level != item.id">
          <q-btn class="full-width" unelevated color="primary" :disable="addButtonDisabled" @click="level(item)" label="立即升级" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'memberUpgrade',
  data () {
    return {
      tab: '1',
      addButtonDisabled: false,

      LevelData: [],
      timeOptions: [
        {
          label: '年',
          value: 1
        },
        {
          label: '季度',
          value: 2
        },
        {
          label: '月',
          value: 3
        },
        {
          label: '周',
          value: 4
        },
        {
          label: '日',
          value: 5
        }
      ],
      member_id: ''
    }
  },
  mounted () {},
  created () {
    if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
      this.member_id = this.$store.state.oauth.memberRelation.member_id

      this.$nextTick(() => {
        this.getMemberLevel()
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
  computed: {},
  methods: {
    getMemberLevel () {
      this.$store
        .dispatch('member/postApi', { do: 'getLevelData' })
        .then((res) => {
          if (res.code == 200) {
            this.LevelData = res.data && res.data ? res.data : []
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
    // 修改等级
    level (item) {
      this.addButtonDisabled = true

      const data = {
        newLevelId: item.id,
        do: 'changeLevel',
        member_id: this.member_id
      }
      this.$store
        .dispatch('member/postApi', data)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '升级成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.addButtonDisabled = false
          } else {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
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
    // 时间戳显示对应格式
    endTimeFormat (item) {
      const timeOptions = this.timeOptions
      switch (parseInt(item.mcl_time_type)) {
        case 1:
          return '永久有效'
        case 2:
          return (
            '从' +
            this.$q_date.formatDate(item.mcl_start_time * 1000, 'YYYY-MM-DD  HH:mm') +
            '到' +
            this.$q_date.formatDate(item.mcl_end_time * 1000, 'YYYY-MM-DD  HH:mm') +
            '有效'
          )

        case 3:
          const time_index = _.findIndex(timeOptions, function (o) {
            return parseInt(o.value) == parseInt(item.mcl_end_time)
          })

          return '购买后' + item.mcl_start_time + timeOptions[time_index].label + '内有效'
        default:
          return '参数错误'
      }
    }
  }
}
</script>
