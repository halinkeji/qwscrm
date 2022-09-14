<template>
  <q-page class="bg-white">
<q-header class="bg-white">
      <q-toolbar class="text-grey-8">
        <q-btn flat round dense icon="las la-angle-left" @click="$router.go(-1)" />
        <q-toolbar-title class="text-subtitle1 no-padding q-pt-xs">
          会员延期
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-form ref="extensionRef">
      <q-tabs v-model="timeTypeTab" dense align="justify" class="bg-white text-primary" :breakpoint="0">
        <q-tab :name="item.value" :label="item.label" :key="key" v-for="(item, key) in timeTypeOptions" />
      </q-tabs>

      <q-tab-panels v-model="timeTypeTab" animated class=" rounded-borders">
        <q-tab-panel name="1" class="text-center">
          <div>
            <q-icon name="timer" size="120px" color="primary"> </q-icon>
          </div>
          <div>
            无需设置，保存即可
          </div>
        </q-tab-panel>

        <q-tab-panel name="2">
          <q-input v-model="specifiedEndTime" outlined bottom-slots dense label="选择到期时间" readonly class="q-pb-none">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                  <q-date v-model="specifiedEndTime" mask="YYYY-MM-DD " today-btn>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-menu>
              </q-icon>
            </template>
          </q-input>
        </q-tab-panel>

        <q-tab-panel name="3">
          <q-input outlined bottom-slots v-model="totalCount" dense label="即日起" :rules="[(val) => /^[1-9]\d*$/.test(val) || '请输入正整数']">
            <template v-slot:hint>例:即 3 日起, 1 周内有效。</template>
          </q-input>
          <q-select outlined dense v-model="computedType" :options="endTimeTypeOptions" label="内有效" emit-value map-options />
        </q-tab-panel>
      </q-tab-panels>
    </q-form>
    <q-footer class="text-black bg-white" bordered>
      <div class="row q-mt-sm q-ma-sm">
        <q-btn unelevated color="primary" label="保存" :disable="addButtonDisabled" @click="extension" class="full-width" />
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'memberExtension',
  data () {
    return {
      totalCount: '',
      computedType: '1',
      addButtonDisabled: false,
      timeTypeTab: '2',
      memberInfo: {
        id: '',
        mem_specifiedStartTime: '',
        newEndTime: '',
        changeOperate: 'postpone'
      },
      specifiedEndTime: '',
      timeTypeOptions: [
        {
          label: '指定时间',
          value: '2'
        },
        {
          label: '相对时间',
          value: '3'
        },
        {
          label: ' 永久有效',
          value: '1'
        }
      ],
      endTimeTypeOptions: [
        { label: '年', value: '1' },
        { label: '季度', value: '2' },
        { label: '月', value: '3' },
        { label: '周', value: '4' },
        { label: '天', value: '5' }
      ],
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
    // 会员延期方法
    extension () {
      this.$refs.extensionRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true

          this.memberInfo.mem_specifiedStartTime = parseInt(new Date().getTime() / 1000)
          switch (parseInt(this.timeTypeTab)) {
            case 1:
              this.memberInfo.newEndTime = 2147457847
              break
            case 2:
              var endTime = this.$q_date.formatDate(new Date(this.specifiedEndTime), 'X')
              if (!endTime) {
                this.$q.notify({
                  message: '注意',
                  caption: '请选择结束时间！',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
                return false
              }
              this.memberInfo.newEndTime = endTime
              break
            case 3:
              const newDate = new Date()

              switch (parseInt(this.computedType)) {
                case 1:
                  this.memberInfo.newEndTime = date.formatDate(date.addToDate(newDate, { year: this.totalCount }), 'X')
                  break
                case 2:
                  this.memberInfo.newEndTime = date.formatDate(
                    date.addToDate(newDate, {
                      month: parseInt(this.totalCount * 3)
                    }),
                    'X'
                  )
                  break
                case 3:
                  this.memberInfo.newEndTime = date.formatDate(date.addToDate(newDate, { month: this.totalCount }), 'X')
                  break
                case 4:
                  this.memberInfo.newEndTime = date.formatDate(
                    date.addToDate(newDate, {
                      days: parseInt(this.totalCount * 7)
                    }),
                    'X'
                  )
                  break
                case 5:
                  this.memberInfo.newEndTime = date.formatDate(date.addToDate(newDate, { days: this.totalCount }), 'X')
                  break
              }

              break
          }

          const data = {
            ...this.memberInfo,
            no_update_end_time: 2,
            do: 'changeLevelEndTime',
            member_id: this.member_id
          }
          this.$store
            .dispatch('member/postApi', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '修改成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
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
            .catch((error) => {
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
