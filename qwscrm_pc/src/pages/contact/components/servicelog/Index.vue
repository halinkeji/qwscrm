<template>
  <q-layout
    view="hhh Lpr fff"
    container
    :style="{ height: $q.screen.height * 0.8 + 'px', 'max-height': $q.screen.height * 0.8 + 'px', 'min-height': $q.screen.height * 0.8 + 'px' }"
  >
    <q-header v-if="showConfig">
      <q-toolbar class="bg-white">
        <div class="col-4">
          <q-select
            dense
            v-model="type"
            map-options
            emit-value
            option-label="label"
            option-value="value"
            :options="options"
            @input="getList"
            label="类型"
            clearable
          >
          </q-select>
        </div>
        <div class="col-6">
          <q-toolbar-title>
            <q-input readonly v-model="dateTime" rounded outlined dense class="q-py-xs" placeholder="请选择日期搜索">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="dateTime" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" @click="getList" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:append>
                <q-icon v-if="dateTime === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="dateTime = ''" />
              </template>
            </q-input>
          </q-toolbar-title>
        </div>
        <div class="col-2 text-center">
          <q-btn color="primary" unelevated label="授权" @click="addServiceLog" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container v-if="showConfig">
      <q-page class="q-mx-xs q-mt-md">
        <q-card flat class=" q-px-lg" v-if="logData && logData.length > 0">
          <q-timeline color="primary" class="q-pt-md">
            <q-timeline-entry :subtitle="formatDate(item.created_at, 'YYYY-MM-DD HH:mm:ss')" :key="'log' + key" v-for="(item, key) in logData">
              <template v-slot:title>
                <div class="text-caption">
                  站点：
                  {{ item.client ? item.client.client_url : '' }}
                </div>

                <div class="text-caption">
                  应用：
                  <q-badge color="positive">
                    {{ item.clientApply ? applyObject[item.clientApply.identity] : '' }}
                  </q-badge>
                </div>
                <div class="text-caption">
                  类别：
                  <q-badge color="blue">
                    {{ optionsObject[item.type] }}
                  </q-badge>
                </div>

                <div class="text-subtitle2">标题：{{ item.title }}</div>
                <div class="text-subtitle2">操作人：{{ item.operateUser }}</div>
                <div class="text-primary text-caption" v-if="[2, 3, 6].indexOf(parseInt(item.type)) > -1">
                  自 【{{ formatDate(item.start_time) }}】 延期至 【{{ formatDate(item.end_time) }}】
                </div>

                <div class="text-caption">内容：</div>
                <div class="text-body1"><div v-html="item.content"></div></div>
              </template>
              <template v-slot:subtitle>
                <div class="text-weight-bold">{{ $q_date.formatDate(item.created_at * 1000, 'YYYY年MM月DD日 HH:mm:ss') }}</div>
              </template>
            </q-timeline-entry>
          </q-timeline>
        </q-card>
        <q-card flat v-else class="q-px-lg">
          <q-card-section class="text-center">
            没有更多了...
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
    <q-page-container v-else>
      <div class="text-center text-grey q-mt-xl  q-pa-md q-px-lg">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2">绑定用户</div>
          </q-card-section>
          <q-card-section>
            <q-form ref="regForm">
              <q-input outlined dense v-model="regMobile" :rules="[(val) => !!val || '请输入用户电话号']" label="用户电话号" />
            </q-form>
          </q-card-section>
          <q-card-section>
            <q-btn unelevated rounded class="full-width" @click="bindUserRelation" color="primary" label="绑定" />
          </q-card-section>
        </q-card>
      </div>
    </q-page-container>
    <q-footer>
      <q-toolbar class="bg-white">
        <q-toolbar-title class="flex flex-center">
          <q-pagination @input="changePaginationHandle" v-model="page.page" :max-pages="6" :max="maxPage" input input-class="text-orange-10" />
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <add-service-log ref="serviceAddLogRef" @closeDialog="getList" v-if="serviceAddLogStatus" />
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import AddServiceLog from './AddServiceLog'
export default {
  name: 'PageServicelog',
  props: ['relationUser', 'qwExternalUserid'],
  components: {
    AddServiceLog
  },
  data () {
    return {
      options: this.$store.state.serviceLog.logTypeArr,
      optionsObject: this.$store.state.serviceLog.logTypeObject,
      applyObject: this.$store.state.serviceLog.applyObject,
      page: {
        pSize: 6,
        page: 1,
        totalCount: 0
      },
      logData: [],
      date: null,
      type: '',
      dateTime: '',
      serviceAddLogStatus: false,
      showConfig: true,
      regMobile: ''
    }
  },
  computed: {
    maxPage () {
      return Math.ceil(this.page.totalCount / this.page.pSize) && Math.ceil(this.page.totalCount / this.page.pSize) != 'Infinity'
        ? Math.ceil(this.page.totalCount / this.page.pSize)
        : 1
    }
  },
  mounted () {
    if (this.relationUser && this.relationUser.relation_user_id) {
      this.getList()
    } else {
      this.showConfig = false
    }
  },
  created () {
    this.date = date
  },
  methods: {
    formatDate (val) {
      if (val) {
        return this.$q_date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm')
      }
      return ''
    },
    getList () {
      this.serviceAddLogStatus = false
      this.$store
        .dispatch('serviceLog/getData', { ...this.page, user_id: this.relationUser.relation_user_id, type: this.type, dateTime: this.dateTime })
        .then((res) => {
          if (res.code == 200) {
            this.logData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    changePaginationHandle () {
      this.getList()
    },
    addServiceLog () {
      this.serviceAddLogStatus = true
      this.$nextTick(() => {
        this.$refs.serviceAddLogRef.init()
      })
    },
    bindUserRelation () {
      this.$refs.regForm.validate().then((success) => {
        if (success && this.qwExternalUserid) {
          const obj = {
            regMobile: this.regMobile,
            qw_external_userid: this.qwExternalUserid
          }
          this.$store
            .dispatch('contact/bindUserRelation', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '绑定成功！',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$emit('bindUserRelation')
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.q-menu-list-width {
  min-width: 100px;
}
.q-item__section--main ~ .q-item__section--side {
  align-items: flex-end;
  padding-right: 0;
  padding-left: 0px;
}
.q-btn--fab .q-btn__wrapper {
  padding: 6px;
  min-height: 40px;
  min-width: 40px;
}
</style>
