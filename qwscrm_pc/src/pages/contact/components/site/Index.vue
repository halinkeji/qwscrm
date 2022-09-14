<template>
  <div class="q-pa-sm">
    <div v-if="showConfig">
      <!-- <q-scroll-area class="fit full-height"> -->
      <q-card flat bordered :key="'site' + key" v-for="(item, key) in siteInfoList">
        <q-card-section class="q-pb-none">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">{{ item.client_name }}</div>
              <div class="text-subtitle2">{{ item.redirect_uri }}</div>
            </div>
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list class="q-menu-list-width">
                    <q-item clickable class="q-px-sm" @click="setSiteAuthorize(item)">
                      <q-item-section>站点授权</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>
                    </q-item>
                    <q-item clickable class="q-px-sm" @click="applySiteAuthorize(item)">
                      <q-item-section>应用授权</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>
                    </q-item>

                    <q-item clickable class="q-px-sm" @click="clickBindWorker(item)">
                      <q-item-section>售后人员</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>
                    </q-item>
                    <q-item clickable class="q-px-sm" @click="clickBindContract(item)">
                      <q-item-section>合同事宜</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-sm">
          <q-list bordered separator>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>APPID：{{ item.client_id }}</q-item-label>
                <q-item-label caption lines="1">APPSECRECT：{{ plusXing(item.client_secret, 2, 10) }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>用户名</q-item-label>
                <q-item-label caption>{{ item.username }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>手机号</q-item-label>
                <q-item-label caption>{{ item.mobile }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>安装时间：{{ date.formatDate(item.created_at * 1000, 'YYYY年MM月DD日 HH:mm:ss') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple :key="'contract' + k" v-for="(i, k) in item.contractData">
              <q-item-section>
                <q-item-label lines="3">合同编号:{{ i.contract ? i.contract.no : '' }}</q-item-label>
                <q-item-label caption>关联公司:{{ i.contract ? i.contract.company : '' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn round color="negative" @click="removeLinkContract(key, k, i.id)" outline dense icon="las la-trash" />
              </q-item-section>
            </q-item>
            <q-item class="q-pa-none" dense>
              <q-item-section>
                <q-expansion-item dense header-class="bg-grey-2">
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon color="primary" name="apps" />
                    </q-item-section>

                    <q-item-section>
                      已安装应用软件产品
                    </q-item-section>
                  </template>

                  <q-card>
                    <q-card-section class="q-pa-xs">
                      <q-list bordered separator>
                        <q-item :key="'apply-' + k" v-for="(i, k) in item.clientApplyList">
                          <q-item-section>
                            <q-item-label>
                              {{ i.label }}
                              <q-badge rounded color="grey" align="middle" v-if="parseInt(i.status) == 0">
                                未授权
                              </q-badge>
                              <q-badge rounded color="primary" align="middle" v-if="parseInt(i.status) == 1">
                                已授权
                              </q-badge>
                              <q-badge rounded color="negative" align="middle" v-if="parseInt(i.status) == -1">
                                禁用
                              </q-badge>
                            </q-item-label>
                            <q-separator class="q-my-xs" />
                            <q-item-label caption>安装时间：{{ formatDate(i.install_at) }}</q-item-label>
                            <q-item-label caption>授权起始时间：{{ formatDate(i.start_at) }}</q-item-label>
                            <q-item-label caption>授权结束时间：{{ formatDate(i.end_at) }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-item-section>
            </q-item>

            <q-item class="q-pa-none" dense>
              <q-item-section>
                <q-expansion-item dense header-class="bg-grey-2">
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon color="primary" name="las la-file-alt" />
                    </q-item-section>

                    <q-item-section> 站点日志 </q-item-section>
                  </template>
                  <q-card class="my-card">
                    <q-card-section>
                      <q-timeline color="primary">
                        <q-timeline-entry
                          :key="`timeline-${key}`"
                          :subtitle="formatDate(i.created_at, 'YYYY-MM-DD HH:mm:ss')"
                          v-for="(i, key) in item.authorizeLogList"
                        >
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-subtitle2">操作人：{{ i.operateUser  }}</q-item-label>
                              <q-item-label class="text-primary" v-if="i.operate_action == 'auth'">
                                更新前为【{{ authorizeTypeObject[i.before_authorize_type] }}】版本，更新之后为 【{{
                                  authorizeTypeObject[i.after_authorize_type]
                                }}】 版本
                              </q-item-label>
                              <q-item-label> {{ i.content }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-badge :color="tagColor[i.operate_action]">
                                {{ siteOperateActionItem[i.operate_action] }}
                              </q-badge>
                            </q-item-section>
                          </q-item>
                        </q-timeline-entry>
                      </q-timeline>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="around">
          <q-btn outline dense color="deep-orange">{{ authorizeTypeObject[item.authorize_type] }}</q-btn>
          <q-btn outline dense color="positive" v-if="parseInt(item.status) == 1">正常</q-btn>
          <q-btn outline dense color="negative" v-else>关闭</q-btn>
           <q-btn outline dense v-if="item.workerInfo">{{ item.workerInfo ? item.workerInfo.name : '' }}</q-btn>
        </q-card-actions>
      </q-card>
      <!-- </q-scroll-area> -->
    </div>
    <div v-else>
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
    <bind-contract ref="bindContractRef" v-if="bindContractStatus" @closeDialog="getData" />
    <bind-worker ref="bindWorkerRef" v-if="bindWorkerStatus" @closeDialog="getData" />

    <site-authorize ref="siteAuthorizeRef" v-if="siteAuthorizeStatus" @closeDialog="getData" />
    <apply-authorize ref="applyAuthorizeRef" v-if="applyAuthorizeStatus" @closeDialog="getData" />
  </div>
</template>

<script>
import { date } from 'quasar'
import SiteAuthorize from './SiteAuthorize'
import ApplyAuthorize from './ApplyAuthorize'
import BindWorker from '../BindWorker'
import BindContract from './BindContract'
export default {
  name: 'PageSite',
  props: ['relationUser', 'qwExternalUserid'],
  components: {
    SiteAuthorize,
    ApplyAuthorize,
    BindWorker,
    BindContract
  },
  data () {
    return {
      siteInfoList: [],
      date: null,
      authorizeTypeObject: this.$store.state.siteManage.applyStatusObject,
      siteStatusObject: this.$store.state.siteManage.siteStatusObject,
      siteAuthorizeStatus: false,
      applyAuthorizeStatus: false,
      showConfig: true,
      regMobile: '',
      bindWorkerStatus: false,
      bindContractStatus: false,
      siteOperateActionItem: this.$store.state.siteManage.siteOperateActionItem,
      authorizeTypeItem: {},
      clientLogTypeItem: {},
      tagColor: {
        auth: 'primary',
        status: 'secondary',
        install: 'positive',
        upgrade: 'info',
        edit: 'warning'
      }
    }
  },
  computed: {},
  mounted () {
    if (this.relationUser && this.relationUser.relation_user_id) {
      this.getData()
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
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return '未授权'
    },
    getData () {
      this.bindContractStatus = false
      this.bindWorkerStatus = false
      this.siteAuthorizeStatus = false
      this.applyAuthorizeStatus = false
      this.$store
        .dispatch('siteManage/getData', { user_id: this.relationUser.relation_user_id })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.siteInfoList = res.data
          }
        })
        .catch((error) => {})
    },

    plusXing (str, frontLen, endLen) {
      const len = str.length - frontLen - endLen
      let xing = ''
      for (let i = 0; i < len; i++) {
        xing += '*'
      }
      return str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
    },
    setSiteAuthorize (item) {
      this.siteAuthorizeStatus = true
      this.$nextTick(() => {
        this.$refs.siteAuthorizeRef.init(item.id)
      })
    },
    clickBindWorker (item) {
      this.bindWorkerStatus = true
      this.$nextTick(() => {
        this.$refs.bindWorkerRef.init(item.id)
      })
    },
    clickBindContract (item) {
      this.bindContractStatus = true
      this.$nextTick(() => {
        this.$refs.bindContractRef.init(item)
      })
    },
    applySiteAuthorize (item) {
      this.applyAuthorizeStatus = true
      this.$nextTick(() => {
        this.$refs.applyAuthorizeRef.init(item.client_id)
      })
    },

    removeLinkContract (key, k, linkId) {
      this.$store
        .dispatch('siteManage/removeContract', linkId)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '取消关联成功！',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })

            this.siteInfoList[key].contractData.splice(k, 1)
          }
        })
        .catch((error) => {})
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
