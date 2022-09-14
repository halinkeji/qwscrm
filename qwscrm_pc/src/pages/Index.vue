<template>
  <div class="col-auto  self-start q-mx-sm bg-grey-2">
    <div class="row q-mb-sm q-col-gutter-md">
      <div class="col-md-2 col-lg-2 col-sm-12 col-xs-12 text-positive">
        <q-card class="shadow-1">
          <q-card-section :class="$q.dark.isActive?'theme_color':''" class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder">{{ homeHeaderCount.contact_count }}</q-item-label>
                  <q-item-label :class="!$q.dark.isActive? 'text-dark text-weight-thin text-overline':'text-white text-weight-thin text-overline'">截止当前总数据</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="las la-id-card-alt" class="text-positive" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="positive" >
                <div :class="!$q.dark.isActive? 'text-blue-1 text-subtitle1':'text-white text-subtitle1'">客户总人数</div>
              </q-ribbon>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-lg-2 col-sm-12 col-xs-12 text-cyan-10">
        <q-card class="shadow-1 q-ml-sm">
          <q-card-section :class="$q.dark.isActive?'theme_color':''" class="q-pa-none">
            <q-item class="q-pb-none q-pt-xs">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-bolder">{{ homeHeaderCount.today_add_contact_count }}</q-item-label>
                <q-item-label :class="!$q.dark.isActive? 'text-dark text-weight-thin text-overline':'text-white text-weight-thin text-overline'">今日当前总数据</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="las la-user-check" class="text-cyan-10" size="60px"></q-icon>
              </q-item-section>
            </q-item>
            <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="cyan-10" glow>
              <div :class="!$q.dark.isActive? 'text-blue-1 text-subtitle1':'text-white text-subtitle1'">新增客户总人数</div>
            </q-ribbon>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-lg-2 col-sm-12 col-xs-12 text-negative">
        <q-card class="shadow-1 q-ml-sm">
          <q-card-section :class="$q.dark.isActive?'theme_color':''" class="q-pa-none">
            <q-item class="q-pb-none q-pt-xs">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-bolder">{{ homeHeaderCount.today_del_contact_count }}</q-item-label>
                <q-item-label :class="!$q.dark.isActive? 'text-dark text-weight-thin text-overline':'text-white text-weight-thin text-overline'">今日当前总数据</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="las la-user-times" class="text-negative" size="60px"></q-icon>
              </q-item-section>
            </q-item>
            <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="negative">
              <div :class="!$q.dark.isActive? 'text-blue-1 text-subtitle1':'text-white text-subtitle1'">流失客户总人数</div>
            </q-ribbon>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-lg-2 col-sm-12 col-xs-12 text-accent">
        <q-card class="shadow-1 q-ml-sm">
          <q-card-section :class="$q.dark.isActive?'theme_color':''" class="q-pa-none">
            <q-item class="q-pb-none q-pt-xs">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-bolder">{{ homeHeaderCount.group_chat_count }}</q-item-label>
                <q-item-label :class="!$q.dark.isActive? 'text-dark text-weight-thin text-overline':'text-white text-weight-thin text-overline'">截止当前总数据</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="people" class="text-accent" size="60px"></q-icon>
              </q-item-section>
            </q-item>
            <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="accent" glow>
              <div :class="!$q.dark.isActive? 'text-blue-1 text-subtitle1':'text-white text-subtitle1'">客户群聊总个数</div>
            </q-ribbon>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-lg-2 col-sm-12 col-xs-12 text-primary">
        <q-card class="shadow-1 q-ml-sm">
          <q-card-section :class="$q.dark.isActive?'theme_color':''" class="q-pa-none">
            <q-item class="q-pb-none q-pt-xs">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-bolder">{{ homeHeaderCount.group_chat_member_count }}</q-item-label>
                <q-item-label :class="!$q.dark.isActive? 'text-dark text-weight-thin text-overline':'text-white text-weight-thin text-overline'">截止当前总数据</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="recent_actors" class="text-primary" size="60px"></q-icon>
              </q-item-section>
            </q-item>
            <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="primary" >
              <div :class="!$q.dark.isActive? 'text-blue-1 text-subtitle1':'text-white text-subtitle1'">群成员总人数</div>
            </q-ribbon>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-2 col-lg-2 col-sm-12 col-xs-12 text-deep-orange">
        <q-card class="shadow-1 q-ml-sm">
          <q-card-section :class="$q.dark.isActive?'theme_color':''" class="q-pa-none">
            <q-item class="q-pb-none q-pt-xs">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-bolder">{{ homeHeaderCount.group_chat_yesterday_del_member_count }}</q-item-label>
                <q-item-label :class="!$q.dark.isActive? 'text-dark text-weight-thin text-overline':'text-white text-weight-thin text-overline'">昨日总数据</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="las la-user-slash" class="text-deep-orange" size="60px"></q-icon>
              </q-item-section>
            </q-item>
            <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="deep-orange">
              <div :class="!$q.dark.isActive? 'text-blue-1 text-subtitle1':'text-white text-subtitle1'">退出群聊总人数</div>
            </q-ribbon>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <line-stack />
  </div>
</template>

<script>
import LineStack from './echarts/LineStack.vue'
import { QSpinnerGears } from 'quasar'
export default {
  name: 'PageIndex',
  data () {
    return {
      homeHeaderCount: {}
    }
  },
  components: {
    LineStack
  },
  created () {
    console.log('pageTable created')
    this.home()
  },
  methods: {
    home () {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'orange',
        spinnerSize: 140
      })
      this.$store.dispatch('analysis/getHomeHeader')
        .then(res => {
          if (res.code == 200) {
            this.homeHeaderCount = res.data
          } else {
            this.$q.notify({
              message: '失败',
              caption: '数据加载失败！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
          this.$q.loading.hide()
        })
        .catch(error => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    }

  }
}
</script>
<style scoped>
  .theme_color {
    background-color: #131313 !important
  }

  .progress-base {
    height: 8px;
    border-radius: 3px;
    background-color: #e9ecef;
  }

  .border-top {
    border-top: 1px solid #efefef;
  }

  .chip_pending {
    background: #ffdf40;
    background: -webkit-linear-gradient(45deg, #ffdf40, #ff8359) !important;
    background: linear-gradient(45deg, #ffdf40, #ff8359) !important;
  }

  .chip_completed {
    background: #42e695;
    background: -webkit-linear-gradient(45deg, #42e695, #3bb2b8) !important;
    background: linear-gradient(45deg, #42e695, #3bb2b8) !important;
  }
</style>
