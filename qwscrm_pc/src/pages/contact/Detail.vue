<template>
  <div class="fit row q-col-gutter-sm ">
    <div class="col-6">
      <q-card flat bordered square class="row">
        <div class="col-2 row">
          <q-card-section class="col-12 text-center">
            <q-avatar rounded size="56px">
              <img :src="contactData.avatar" />
            </q-avatar>
            <div class="col-12 text-center q-mt-sm">
              <span class="text-orange" v-if="parseInt(contactData.type) == 2">@企业微信联系人</span>
              <span class="text-positive" v-if="parseInt(contactData.type) == 1">@微信</span>
            </div>
            <div class="col-12 text-center q-mt-sm">
              <q-badge outline color="grey" label="未跟进" v-if="parseInt(contactData.follow_status) == 1" />
              <q-badge outline color="secondary" label="跟进中" v-if="parseInt(contactData.follow_status) == 2" />
              <q-badge outline color="red" label="已拒绝" v-if="parseInt(contactData.follow_status) == 3" />
              <q-badge outline color="green" label="已成交" v-if="parseInt(contactData.follow_status) == 4" />
              <q-badge outline color="primary" label="已复购" v-if="parseInt(contactData.follow_status) == 5" />
            </div>
          </q-card-section>
        </div>
        <div class="col-10 row">
          <div class="col-4">
            <q-item class="list-item-min-height q-py-none">
              <q-item-section avatar>
                <q-item-label class="text-caption">编号：</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2">{{ contactData.business_no }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-4">
            <q-item class="list-item-min-height q-py-none">
              <q-item-section avatar>
                <q-item-label class="text-caption">昵称：</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-body2"
                  >{{ contactData.nick_name }}<span class="text-positive" v-if="parseInt(contactData.type) == 2">@企业微信联系人</span></q-item-label
                >
              </q-item-section>
            </q-item>
          </div>
          <div class="col-4">
            <q-item class="list-item-min-height q-py-none">
              <q-item-section avatar>
                <q-item-label class="text-caption">性别：</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2">{{ genderText[contactData.gender] }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-4">
            <q-item class="list-item-min-height q-py-none">
              <q-item-section avatar>
                <q-item-label class="text-caption">企业简称：</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2">{{ contactData.corp_name }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-4">
            <q-item class="list-item-min-height q-py-none">
              <q-item-section avatar>
                <q-item-label class="text-caption">企业职位：</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2 text-left">{{ contactData.position }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-4">
            <q-item class="list-item-min-height q-py-none">
              <q-item-section avatar>
                <q-item-label class="text-caption">企业全称：</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2">{{ contactData.corp_full_name }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-4">
            <q-item class="list-item-min-height q-py-none">
              <q-item-section avatar>
                <q-item-label class="text-caption">客户来源：</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2">{{ contactData.add_way ? contactData.add_way : '' }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-12">
            <q-item class="list-item-min-height q-py-none text-left">
              <q-item-section avatar>
                <q-item-label class="text-caption">添加时间：</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2 ">{{ formatDate(contactData.created_at) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card>

      <q-card flat bordered square class=" q-mt-sm">
        <div class="full-width  q-mx-xs">
          <q-tabs
            v-model="tabOne"
            @input="changeTab"
            dense
            class="bg-grey-2 text-grey-10"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <!-- <q-tab name="tag" label="标签" /> -->
            <q-tab name="group" label="企微群" />
            <q-tab name="relation" label="关联客户" />
          </q-tabs>
          <q-tab-panels v-model="tabOne" animated class="bg-white text-primary">
            <!-- <q-tab-panel name="tag">
              <div class="q-gutter-sm" v-if="contactData && contactData.relationTag && contactData.relationTag.length > 0">
                <q-btn
                  outline
                  dense
                  color="primary"
                  :key="`tag${k}`"
                  v-for="(i, k) in contactData.relationTag"
                  :label="i && i.tag ? i.tag.name : ''"
                />
              </div>
            </q-tab-panel> -->

            <q-tab-panel name="group">
              <q-list bordered separator v-if="contactData && contactData.relationGroupChat && contactData.relationGroupChat.length > 0">
                <q-item clickable v-ripple :key="`group${k}`" v-for="(i, k) in contactData.relationGroupChat">
                  <q-item-section avatar>
                    <q-icon name="people_outline" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ i.groupChat ? i.groupChat.name : '' }}</q-item-label>
                    <q-item-label caption>
                      成员状态：
                      <q-badge :color="groupContactObjectColor[i.status]" class="q-mx-sm"> {{ groupContactObject[i.status] }} </q-badge>群状态：
                      <q-badge :color="groupObjectColor[i.groupChat.status]" text-color="white" v-if="i.groupChat">{{
                        groupObject[i.groupChat.status]
                      }}</q-badge>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side><q-icon name="navigate_next"/></q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="relation">
              <div class="text-right">
                <q-btn flat color="primary" dense icon-right="las la-angle-right" @click="openSelectContactDialog" label="绑定关联客户" />
              </div>

              <q-list bordered separator v-if="relationContact && relationContact.length > 0">
                <q-item clickable :key="`rcontact${key}`" v-for="(item, key) in relationContact">
                  <q-item-section avatar>
                    <q-avatar>
                      <q-img ratio="1" :src="item.avatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.name }}</q-item-label>
                    <q-item-label caption lines="1">
                      昵称：{{ item.nick_name }}
                      <span class="text-orange" v-if="parseInt(item.type) == 2">@企业微信联系人</span>
                      <span class="text-positive" v-if="parseInt(item.type) == 1">@微信</span>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn round color="negative" @click="removeRelation(item)" flat dense icon="remove_circle" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-card>

      <q-card flat bordered square class="q-mt-sm">
        <q-card-section class="text-caption">
          客户资料卡
        </q-card-section>
        <q-separator />
        <div class="row q-col-gutter-sm">
          <div class="col-6" :key="`field-${key}`" v-for="(item, key) in contactFieldData">
            <q-item clickable @click="setFieldValue(item)">
              <q-item-section avatar>
                <q-item-label class="text-caption"> {{ item.label }} ： </q-item-label>
              </q-item-section>

              <q-item-section class="q-px-md">
                <q-item-label class="text-subtitle2 text-right">
                  <span v-if="parseInt(item.type) == 2">
                    <span v-if="item.value" class="q-gutter-xs">
                      <q-badge color="blue" :key="`badge${k}`" v-for="(i, k) in JSON.parse(item.value)">
                        {{ i }}
                      </q-badge>
                    </span>
                  </span>
                  <span v-else-if="parseInt(item.type) == 4">
                    <span v-if="item.value" class="q-gutter-xs">
                      <span color="blue" :key="`url-${k}`" v-for="(i, k) in JSON.parse(item.value)"> <q-icon name="attach_file" />{{ i.name }} </span>
                    </span>
                  </span>
                  <span v-else>
                    {{ item.value }}
                  </span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="arrow_forward_ios" color="dark" size="10px"></q-icon>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card>
    </div>

    <div class="col-6 full-height">
      <q-card flat bordered class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-xs text-subtitle2">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            align="left"
            active-color="primary"
            indicator-color="primary"
            narrow-indicator
            @input="changeTab"
          >
            <q-tab name="worker" label="客户资料" />
            <q-tab name="console" label="互动轨迹" />
            <q-tab name="event" label="跟进事件" />
            <q-tab name="contract" label="合同事宜" />
            <q-tab name="bill" label="发票管理" />
            <!-- <q-tab name="site" label="站点管理" /> -->
            <q-tab name="store" label="商家管理" />
            <q-tab name="servicelog" label="售后日志" />
          </q-tabs>
        </div>
        <q-scroll-area
          :style="{ height: $q.screen.height * 0.8 + 'px', 'max-height': $q.screen.height * 0.8 + 'px', 'min-height': $q.screen.height * 0.8 + 'px' }"
        >
          <div class="fit  bg-white" v-if="tab == 'worker'">
            <q-card flat bordered square class=" q-mt-sm">
              <div class="full-width  q-mx-xs">
                <q-tabs
                  v-model="workerTab"
                  @input="changeTab"
                  dense
                  class="bg-grey-2 text-grey-10"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                >
                  <q-tab :name="key" :label="item.work ? item.work.name : ''" :key="`workers-tab-${key}`" v-for="(item, key) in contactData.relationWorkerData" />
                </q-tabs>
                <q-tab-panels v-model="workerTab" animated class="bg-white text-primary" :key="`workers-panels-${key}`"  v-for="(item, key) in contactData.relationWorkerData">
                  <q-tab-panel :name="key">
                    <div class="row">
                      <div class="col-6">
                        <q-item>
                          <q-item-section avatar>
                            <q-item-label class="text-caption">状态：</q-item-label>
                          </q-item-section>

                          <q-item-section>
                            <q-item-label class="text-caption">
                              <q-btn size="sm" unelevated :color="viewStatusColor(parseInt(item.status))">
                                {{ viewStatus(parseInt(item.status)) }}
                              </q-btn>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>

                      <div class="col-6">
                        <q-item>
                          <q-item-section avatar>
                            <q-item-label class="text-caption">客户来源：</q-item-label>
                          </q-item-section>

                          <q-item-section>
                            <q-item-label class="text-body2">{{ viewAddWay(parseInt(item.add_way)) }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>

                      <div class="col-6">
                        <q-item>
                          <q-item-section avatar>
                            <q-item-label class="text-caption">添加时间：</q-item-label>
                          </q-item-section>

                          <q-item-section>
                            <q-item-label class="text-body2">{{ item ? item.createtime : '' }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>

                      <div class="col-6">
                        <q-item class="list-item-min-height q-py-none">
                          <q-item-section avatar>
                            <q-item-label class="text-caption">手机号：</q-item-label>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label class="text-subtitle2" v-if="item && item.remark_mobiles">
                              <span :key="k" v-for="(i, k) in JSON.parse(item.remark_mobiles)">
                                {{ i }}
                              </span>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>

                      <div class="col-6">
                        <q-item>
                          <q-item-section avatar>
                            <q-item-label class="text-caption">备注：</q-item-label>
                          </q-item-section>

                          <q-item-section>
                            <q-item-label class="text-body2">{{ item ? item.remark : '' }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>

                      <div class="col-6">
                        <q-item>
                          <q-item-section avatar>
                            <q-item-label class="text-caption">描述：</q-item-label>
                          </q-item-section>

                          <q-item-section>
                            <q-item-label class="text-body2">{{ item ? item.description : '' }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </q-card>
          </div>
          <div class="fit  bg-white" v-if="tab == 'console'">
            <contact-track :qwExternalUserid="contactData.qw_external_userid" />
          </div>
          <div class="fit bg-white" v-if="tab == 'event'">
            <event-manage :contact_id="contactData.id" />
          </div>
          <div class="full-height bg-white " v-if="tab == 'contract'">
            <contract-manage :contact_id="contactData.id" />
          </div>
          <div class="full-height bg-white " v-if="tab == 'bill'">
            <bill-manage :contact_id="contactData.id" />
          </div>
          <div class="full-height bg-white " v-if="tab == 'site'">
            <site-manage
              :qwExternalUserid="contactData.qw_external_userid"
              :relationUser="contactData.relationUser"
              @bindUserRelation="bindUserRelation"
            />
          </div>
          <div class="col-shrink full-height bg-white " v-if="tab == 'store'">
            <store-manage
              :qwExternalUserid="contactData.qw_external_userid"
              :relationUser="contactData.relationUser"
              @bindUserRelation="bindUserRelation"
            />
          </div>
          <div class="col-shrink full-height bg-white " v-if="tab == 'servicelog'">
            <service-log
              :qwExternalUserid="contactData.qw_external_userid"
              :relationUser="contactData.relationUser"
              @bindUserRelation="bindUserRelation"
            />
          </div>
        </q-scroll-area>
      </q-card>
    </div>

    <field-value ref="fieldValueRef" v-if="fieldDialogStatus" @closeDialog="closeDialog" />
    <hl-contact-lists ref="contactListsRef" v-if="contactDialogStatus" @getCheckContact="getCheckContact" />
  </div>
</template>

<script>
import { date } from 'quasar'
import FieldValue from './components/FieldValue.vue'
import ContactTrack from './components/Track.vue'
import EventManage from '../plugins/event/Record.vue'
import ContractManage from '../plugins/contract/Index.vue'
import BillManage from '../plugins/bill/Index.vue'
import SiteManage from './components/site/Index.vue'
import StoreManage from './components/store/Index.vue'
import ServiceLog from './components/servicelog/Index.vue'
export default {
  name: 'ContactDetail',
  components: {
    FieldValue,
    ContactTrack,
    EventManage,
    ContractManage,
    BillManage,
    SiteManage,
    StoreManage,
    ServiceLog
  },
  data () {
    return {
      editDialogStatus: false,
      contactData: {},
      genderText: ['未知', '男性', '女性'],
      tab: '',
      contactFieldData: {},
      fieldDialogStatus: false,
      trackLogData: [],
      qw_external_userid: '',
      contactUserId: '',
      tabOne: 'group',
      workerTab: 0,
      relationContact: [],
      contactDialogStatus: false,
      groupContactObject: this.$store.state.contact.groupContactObject,
      groupObject: this.$store.state.contact.groupObject,
      groupContactObjectColor: this.$store.state.contact.groupContactObjectColor,
      groupObjectColor: this.$store.state.contact.groupObjectColor
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    if (this.$route.query.contactId) {
      this.init(this.$route.query.contactId)
    } else {
      this.$store.dispatch('tagviews/delView', {
        affix: false,
        icon: 'las la-id-card',
        name: 'contactDetail',
        path: '/contact/detail',
        title: '客户详情'
      })

      this.$router.push({ name: 'Index' })
    }

    console.log('pageTable mounted')
  },
  activated () {
    console.log('pageTable activated')
  },
  deactivated () {
    console.log('pageTable deactivated')
  },
  destroyed () {
    console.log('pageTable destroyed')
  },
  methods: {
    init (contactUserId) {
      this.editDialogStatus = true
      this.contactUserId = contactUserId

      this.getContactItem()
      // if (fieldId > 0) {
      //   this.fieldId = fieldId
      //   this.getFieldDetail()
      // }
    },

    getContactItem () {
      this.$store
        .dispatch('contact/getLocalContactInfo', { contactUserId: this.contactUserId })
        .then((res) => {
          if (res.code == 200) {
            this.contactData = res.data ? res.data : {}
            this.qw_external_userid = res.data.qw_external_userid
            this.tab = 'worker'
            this.$nextTick(() => {
              this.getFieldData()
            })
          }
        })
        .catch((error) => {})
    },

    bindUserRelation () {
      this.getContactItem()

      this.$nextTick(() => {
        this.tab = 'info'
      })
    },

    changeTab () {
      switch (this.tab) {
        case 'info':
          break
        case 'field':
          this.getFieldData()
          break
        case 'relation':
          this.getRelationContactData()
          break
      }

      switch (this.tabOne) {
        case 'relation':
          this.getRelationContactData()
          break
      }
    },

    getFieldData () {
      this.$store
        .dispatch('contact/getContactFieldData', { contact_id: this.contactData.id })
        .then((res) => {
          if (res.code == 200) {
            this.contactFieldData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    setFieldValue (item) {
      this.fieldDialogStatus = true
      this.$nextTick(() => {
        this.$refs.fieldValueRef.init(item, this.contactData.id)
      })
    },

    closeEndDialog () {
      this.editDialogStatus = false
      this.$emit('closeDialog')
    },

    closeDialog () {
      this.fieldDialogStatus = false
      this.getFieldData()
    },

    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return '未授权'
    },

    // 显示状态
    viewStatus (val) {
      switch (val) {
        case 1:
          return '正常状态'
          break
        case 2:
          return '已删除'
          break
        case 3:
          return '已拉黑'
          break
      }
    },
    // 显示状态颜色
    viewStatusColor (val) {
      switch (val) {
        case 1:
          return 'positive'
          break
        case 2:
          return 'negative'
          break
        case 3:
          return 'warning'
          break
      }
    },
    // 显示来源类型
    viewAddWay (val) {
      switch (val) {
        case 0:
          return '未知来源'
          break
        case 1:
          return '扫描二维码'
          break
        case 2:
          return '搜索手机号'
          break
        case 3:
          return '名片分享'
          break
        case 4:
          return '群聊'
          break
        case 5:
          return '手机通讯录'
          break
        case 6:
          return '微信联系人'
          break
        case 7:
          return '来自微信的添加好友申请'
          break
        case 8:
          return '安装第三方应用时自动添加的客服人员'
          break
        case 9:
          return '搜索邮箱'
          break
        case 201:
          return '内部成员共享'
          break
        case 202:
          return '管理员/负责人分配'
          break
      }
    },

    // star 设置关联客户
    openSelectContactDialog () {
      this.contactDialogStatus = true
      this.$nextTick(() => {
        this.$refs.contactListsRef.init()
      })
    },

    getRelationContactData () {
      this.$store
        .dispatch('contact/getRelationContactData', { contactId: this.contactData.id })
        .then((res) => {
          if (res.code == 200) {
            this.relationContact = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },

    getCheckContact (item) {
      this.contactDialogStatus = false

      this.$store
        .dispatch('contact/setRelationData', { relation_contact_id: item.id, contact_id: this.contactData.id })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存成功！',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getRelationContactData()
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
    },

    removeRelation (item) {
      this.$store
        .dispatch('contact/delRelation', { relation_contact_id: item.id, contact_id: this.contactData.id })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除成功！',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getRelationContactData()
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
    // end 设置关联客户
  }
}
</script>
