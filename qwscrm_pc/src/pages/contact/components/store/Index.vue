<template>
  <div class="q-pa-sm">
    <div class="q-mx-md q-mt-md q-mb-xl" v-if="showConfig">
      <q-card flat bordered class="q-mb-sm" v-if="storeInfo && storeInfo.id">
        <q-card-section class="q-py-xs q-px-md">
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-subtitle2"><q-icon name="home_work" color="primary" /> {{ storeInfo.name }}</div>
            </div>
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list class="q-menu-list-width">
                    <q-item clickable class="q-px-sm" @click="clickBindWorker(storeInfo, 'store')">
                      <q-item-section>售后人员</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>
                    <q-item clickable class="q-px-sm" @click="clickBindWorker(storeInfo, 'follow')">
                      <q-item-section>业务人员</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>
                    <q-item clickable class="q-px-sm" @click="addLogData(storeInfo)">
                      <q-item-section>售后日志</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>
                    <q-item clickable class="q-px-sm" @click="updateStoreStatus(storeInfo)">
                      <q-item-section>商家状态</q-item-section>
                      <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>
       <div class="q-px-sm">
         <q-separator />
       </div>
        <q-card-section class="q-pa-sm">
          <q-list separator>
            <q-item>
              <q-item-section>
                <q-item-label>{{ storeInfo.apply }}</q-item-label>
                <q-item-label caption lines="1">SaaS账号：{{ manageUser.username }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label >
                  <q-btn outline dense color="positive" size="sm"  v-if="parseInt(storeInfo.status) == 1">启用</q-btn>
                  <q-btn outline dense color="negative" size="sm"  v-else>禁用</q-btn>
                </q-item-label>
                <q-item-label caption>状态</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>行业类型</q-item-label>
                <q-item-label caption>{{ storeInfo.trade }}</q-item-label>
              </q-item-section>
            </q-item>

               <q-item>
              <q-item-section>
                <q-item-label>详细地址</q-item-label>
                <q-item-label caption>{{ storeInfo.province }}{{ storeInfo.city }}{{ storeInfo.district }}{{ storeInfo.address }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>手机号</q-item-label>
                <q-item-label caption>{{ storeInfo.contact_tel }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>开户时间</q-item-label>
                <q-item-label caption>{{ date.formatDate(storeInfo.created_at * 1000, 'YYYY年MM月DD日 HH:mm:ss') }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>授权到期时间</q-item-label>
                <q-item-label caption>{{ date.formatDate(storeInfo.end_time * 1000, 'YYYY年MM月DD日 HH:mm:ss') }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>{{ storeInfo.son_num }}</q-item-label>
                <q-item-label caption>可创建门店数</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ storeInfo.account_num }}</q-item-label>
                <q-item-label caption>可创建操作员数</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
               <q-item-section>
                <q-item-label>{{ storeRelation.worker && storeRelation.worker.id ? storeRelation.worker.name : '' }}</q-item-label>
                <q-item-label caption>售后技术员</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ followRelation.worker && followRelation.worker.id ? followRelation.worker.name : '' }}</q-item-label>
                <q-item-label caption>业务跟单员</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-sm" flat bordered v-if="libStoreList && libStoreList.length > 0">
        <q-card-section class="q-py-xs q-px-md">
          <q-expansion-item default-opened>
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon color="primary" name="store" />
              </q-item-section>
              <q-item-section>
                商家门店列表
              </q-item-section>
              <q-item-section side>（{{ libStoreList ? libStoreList.length : 0 }}）</q-item-section>
            </template>

            <q-list separator>
              <q-item :key="'store' + key" v-for="(item, key) in libStoreList">
                <q-item-section>
                  <q-item-label>名称：{{ item.name }}</q-item-label>
                  <q-item-label caption>详细地址：{{ item.province }}{{ item.city }}{{ item.district }}{{ item.address }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn outline dense color="positive" size="sm" class="q-ml-sm" v-if="parseInt(item.status) == 1">启用</q-btn>
                  <q-btn outline dense color="negative" size="sm" class="q-ml-sm" v-else>禁用</q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-sm" flat bordered v-if="userList && userList.length > 0">
        <q-card-section  class="q-py-xs q-px-md">
          <q-expansion-item default-opened>
            <template   v-slot:header>
              <q-item-section avatar>
                <q-icon color="primary" name="account_box" />
              </q-item-section>
              <q-item-section>
                商家账号列表
              </q-item-section>
              <q-item-section side>（{{ userList ? userList.length : 0 }}）</q-item-section>
            </template>

            <q-list separator>
              <q-item :key="'user' + key" v-for="(item, key) in userList">
                <q-item-section>
                  <q-item-label>账号：{{ item.username }}</q-item-label>
                  <q-item-label caption
                    >用户级别：
                    <span v-if="item.level == 'pm'">平台管理员</span>
                    <span v-if="item.level == 'm'">商家管理员</span>
                    <span v-if="item.level == 'o'">商家操作员</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn outline dense color="positive" size="sm" class="q-ml-sm" v-if="parseInt(item.status) == 1">启用</q-btn>
                  <q-btn outline dense color="negative" size="sm" class="q-ml-sm" v-else>禁用</q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-sm" flat bordered v-if="applyLogList && applyLogList.length > 0">
        <q-card-section class="q-py-xs q-px-md">
          <q-expansion-item default-opened>
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon color="primary" name="library_books" />
              </q-item-section>
              <q-item-section> 授权日志 </q-item-section>
            </template>
            <q-card-section>
              <q-timeline color="primary">
                <q-timeline-entry v-for="(item, key) in applyLogList" :key="key">
                  <div>
                    <div class="text-subtitle2">
                      <q-badge outline color="secondary" label="时间" /> {{ date.formatDate(item.created_at * 1000, 'YYYY-MM-DD  HH:mm') }}
                    </div>
                    <div class="text-primary text-caption" v-if="[2, 3, 6].indexOf(parseInt(item.type)) > -1">
                      自 【{{ date.formatDate(item.start_time * 1000, 'YYYY-MM-DD  HH:mm') }}】 延期至 【{{date.formatDate(item.end_time * 1000, 'YYYY-MM-DD  HH:mm')}}】
                    </div>
                    <div class="text-subtitle2"><q-badge outline color="indigo" label="操作人" />{{ item.operateUser  }}</div>
                    <div class="text-subtitle2"><q-badge outline color="negative" label="类型" /> {{ logTypeObject[item.type] }}</div>
                    <div class="text-subtitle2"><q-badge outline color="primary" label="标题" /> {{ item.title }}</div>
                    <div class="text-subtitle2" v-if="item.son_num && [2, 3, 6].indexOf(parseInt(item.type)) > -1"><q-badge outline color="positive" label="可创建门店数" /> {{ item.son_num }}</div>
                    <div class="text-subtitle2" v-if="item.account_num && [2, 3, 6].indexOf(parseInt(item.type)) > -1">
                      <q-badge outline color="info" label="可创建操作员数" /> {{ item.account_num }}
                    </div>
                    <q-badge outline color="orange" class="q-mr-xs" label="内容" />
                    <span v-html="item.content"></span>
                  </div>
                </q-timeline-entry>
              </q-timeline>
            </q-card-section>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <bind-worker ref="bindWorkerRef" :bindType="bindType" v-if="bindWorkerStatus" @closeDialog="getData" />
      <edit-log v-if="editDialogStatus" @closeDialog="getData" ref="editLogRef" />
      <set-status v-if="setStatusDialog"   ref="setStatusDialogRef" @closeDialog="getData"  />
    </div>
    <div v-else class="text-center text-grey q-mt-xl  q-pa-md">
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
  </div>
</template>

<script>
import { date } from 'quasar'
import BindWorker from '../BindWorker.vue'
import EditLog from './EditLog.vue'
import SetStatus from './SetStatus.vue'
export default {
  name: 'PageEvent',
  props: ['relationUser', 'qwExternalUserid'],
  components: {
    BindWorker,
    EditLog,
    SetStatus
  },
  data () {
    return {
      date: null,
      storeInfo: {},
      libStoreList: [],
      manageUser: {},
      userList: [],
      showConfig: true,
      regMobile: '',
      bindWorkerStatus: false,
      bindType: 'store',
      storeRelation: {},
      followRelation: {},
      applyLogList: [],
      logTypeObject: this.$store.state.storeManage.logTypeObject,
      editDialogStatus: false,
      setStatusDialog: false
    }
  },
  computed: {},
  mounted () {
    this.getData()
  },
  created () {
    if (this.relationUser && this.relationUser.relation_user_id) {
      this.getData()
    } else {
      this.showConfig = false
    }
    this.date = date
  },
  methods: {
    getData () {
      this.bindWorkerStatus = false
      this.setStatusDialog = false
      this.editDialogStatus = false
      this.$store
        .dispatch('storeManage/getData', { user_id: this.relationUser.relation_user_id })
        .then((res) => {
          if (res.code == 200) {
            this.storeInfo = res.data ? res.data.storeInfo : {}
            this.libStoreList = res.data ? res.data.libStoreList : []
            this.manageUser = res.data ? res.data.manageUser : {}
            this.userList = res.data ? res.data.userList : []
            this.applyLogList = res.data ? res.data.applyLogList : []

            this.followRelation = res.data && res.data.followRelation ? res.data.followRelation : {}
            this.storeRelation = res.data && res.data.storeRelation ? res.data.storeRelation : {}
          }
        })
        .catch((error) => {})
    },
    clickBindWorker (item, type) {
      this.bindWorkerStatus = true
      this.bindType = type
      this.$nextTick(() => {
        this.$refs.bindWorkerRef.init(item.id)
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
    },
    addLogData (item) {
      this.editDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editLogRef.init({
          currentStoreId: item.id,
          currentLibId: item.lib_id,
          currentApplyId: item.apply_id
        })
      })
    },
    updateStoreStatus (item) {
      this.setStatusDialog = true
      this.$nextTick(() => {
        this.$refs.setStatusDialogRef.init(item)
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
