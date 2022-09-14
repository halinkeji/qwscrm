<template>
  <q-page class="bg-color-EAE full-width column no-wrap" :style="cssVars">
    <div v-show="showLoadingData">
      <div class="q-mt-md q-mx-xs">
        <q-list class="shadow-box q-pa-xs">
          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle1">编号：{{ contactUserInfo.business_no }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle2"> 真实姓名：{{ contactUserInfo.nick_name }} </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle2">性别：{{ genderText[contactUserInfo.gender] }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle2">手机号：</q-item-label>

              <q-item-label class="text-subtitle2" v-if="contactUserInfo.relationWorker && contactUserInfo.relationWorker.remark_mobiles">
                <span @click="sendPhone(item)" :key="key" v-for="(item, key) in JSON.parse(contactUserInfo.relationWorker.remark_mobiles)">
                  {{ item }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-my-sm" />

          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle2">企业简称：{{ contactUserInfo.corp_name }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle2">企业职位：{{ contactUserInfo.position }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle2">企业全称：{{ contactUserInfo.corp_full_name }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset class="q-my-sm" />

          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle2"
                >客户来源：
                {{ contactUserInfo.add_way ? contactUserInfo.add_way : '' }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle2"
                >跟进状态：

                <q-badge outline color="grey" label="未跟进" v-if="parseInt(contactUserInfo.follow_status) == 1" />
                <q-badge outline color="secondary" label="跟进中" v-if="parseInt(contactUserInfo.follow_status) == 2" />
                <q-badge outline color="red" label="已拒绝" v-if="parseInt(contactUserInfo.follow_status) == 3" />
                <q-badge outline color="green" label="已成交" v-if="parseInt(contactUserInfo.follow_status) == 4" />
                <q-badge outline color="primary" label="已复购" v-if="parseInt(contactUserInfo.follow_status) == 5" />
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="list-item-min-height q-py-none">
            <q-item-section>
              <q-item-label class="text-subtitle2">添加时间：{{ formatDate(contactUserInfo.created_at) }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2"
                >描述：
                {{ contactUserInfo.relationWorker ? contactUserInfo.relationWorker.description : '' }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle2"
                >备注：
                {{ contactUserInfo.relationWorker ? contactUserInfo.relationWorker.remark : '' }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="q-mt-sm q-mx-xs">
        <q-card class="shadow-tabs-box">
          <q-tabs
            v-model="tab"
            @input="changeTab"
            dense
            class="bg-grey-2 text-grey-10"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="tag" label="标签" />
            <q-tab name="group" label="企微群" />
            <q-tab name="relation" label="关联客户" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated class="bg-white text-primary">
            <q-tab-panel name="tag">
              <!-- <div class="q-gutter-sm" v-if="contactUserInfo && contactUserInfo.relationWorker && contactUserInfo.relationWorker.tags &&  contactUserInfo.relationWorker.tags.length > 0">
                <q-btn
                  outline
                  dense
                  color="primary"
                  :key="`tag${k}`"
                  v-for="(i, k) in contactUserInfo.relationWorker.tags"
                  :label="i && i.tag ? i.tag.name : ''"
                />
              </div> -->
               <div class="q-gutter-sm" v-if="contactUserInfo && contactUserInfo.relationTag && contactUserInfo.relationTag.length > 0">
                <q-btn
                  outline
                  dense
                  color="primary"
                  :key="`tag${k}`"
                  v-for="(i, k) in contactUserInfo.relationTag"
                  :label="i && i.tag ? i.tag.name : ''"
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="group">
              <q-list bordered separator v-if="contactUserInfo && contactUserInfo.relationGroupChat && contactUserInfo.relationGroupChat.length > 0">
                <q-item clickable v-ripple @click="initChar(i.groupChat)" :key="`group${k}`" v-for="(i, k) in contactUserInfo.relationGroupChat">
                  <q-item-section avatar>
                    <q-icon name="people_outline" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ i.groupChat ? i.groupChat.name : '' }}</q-item-label>
                    <q-item-label caption>
                      成员状态： <q-badge :color="groupContactObjectColor[i.status]" class="q-mx-sm"> {{ groupContactObject[i.status] }} </q-badge>群状态：
                      <q-badge :color="groupObjectColor[i.groupChat.status]" text-color="white" v-if="i.groupChat">{{ groupObject[i.groupChat.status] }}</q-badge>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side><q-icon name="navigate_next" /></q-item-section>
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
                  <q-item-section side>
                   <q-toggle
                    v-model="item.is_share"
                    color="green"
                    true-value="1"
                    false-value="0"
                    @input="changeSyncStatus(item.id,$event)"
                  />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>

      <div class="q-mt-sm q-mx-xs">
        <q-list class="shadow-box q-pa-xs" separator>
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle1"><q-icon name="fa-solid fa-user" color="primary" /> 客户扩展资料卡</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="setFieldValue(item)" :key="`field-${key}`" v-for="(item, key) in contactFieldData">
            <q-item-section avatar>
              <q-item-label class="text-subtitle2"> {{ item.label }} ： </q-item-label>
            </q-item-section>

            <q-item-section>
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
              <q-icon name="arrow_forward_ios" color="dark" size="xs"></q-icon>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-item class="items-center full-width q-pt-xs flex-bottom">
        <div class="col text-center"><q-icon name="fa-solid fa-copyright" /> 2022 哈林科技</div>
      </q-item>
    </div>
    <q-inner-loading :showing="visible" label="正在加载数据..." label-class="text-positive" label-style="font-size: 1.1em" />
    <field-value ref="fieldValueRef" v-if="fieldDialogStatus" @closeDialog="closeDialog" />
    <hl-contact-lists ref="contactListsRef" v-if="contactDialogStatus" @getCheckContact="getCheckContact" />

    <q-page-sticky position="bottom" :offset="[0, 18]" v-if="!$store.state.oauth.qwUserInfo || !$store.state.oauth.qwUserInfo.relationUser">
      <q-btn unelevated rounded class="full-width" @click="inviteBind" color="deep-orange" label="邀请客户绑定" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { date, LocalStorage } from 'quasar'
import FieldValue from './FieldValue.vue'
import { wxConfig, wxAgentConfig, getContactUserId, getGroupChatId, sendChatMessage, openExistedChatWithMsg } from 'boot/utils'
export default {
  name: 'PageIndex',
  components: {
    FieldValue
  },
  data () {
    return {
      tab: 'tag',
      avatar: true,
      text: '',
      dense: false,
      visible: false,
      showLoadingData: false,
      col: {
        width: this.$q.screen.width,
        box_width: (this.$q.screen.width - 10) / 5,
        left: (this.$q.screen.width / 3 - 70) / 2 + 'px',
        right: 0 + 'px'
      },
      contactUserInfo: {},
      genderText: ['未知', '男性', '女性'],
      contactDialogStatus: false,
      // contactUserId: 'wmGYEEDgAATjy1QdGEJCnZ-9Qzs5ztaw',
      contactUserId: '',
      relationContact: [],
      contactFieldData: [],
      fieldDialogStatus: false,
      groupContactObject: this.$store.state.contact.groupContactObject,
      groupObject: this.$store.state.contact.groupObject,
      groupContactObjectColor: this.$store.state.contact.groupContactObjectColor,
      groupObjectColor: this.$store.state.contact.groupObjectColor
    }
  },
  computed: {
    cssVars () {
      return {
        '--width': this.col.width,
        '--box-width': this.col.box_width
      }
    },
    comWxConfig () {
      return this.$store.state
    }
  },
  mounted () {},
  watch: {},
  created () {
    this.onCheckQuery()
    this.onGetContext()
    // this.getQwUserInfo()
  },
  methods: {
    sendPhone (phone) {
      window.location.href = 'tel:' + phone
    },
    changeTab () {
      if (this.tab == 'relation') {
        this.getRelationContactData()
      }
    },
    formatDate (val) {
      if (val) {
        return date.formatDate(val * 1000, 'YYYY年MM月DD日 HH:mm:ss')
      }
      return '未授权'
    },
    // 验证url正确性
    onCheckQuery () {
      const objQuery = this.$route.query
      if (!this.$q.localStorage.getItem('qwscrm_saas_header_local')) {
        if (!this.$_.hasIn(objQuery, 'agentId')) {
          this.$router.push({ name: 'error' })
        }
      }
    },
    // 验证企业微信进入H5的环境
    onGetContext () {
      this.onShowLoading()
      wxAgentConfig(this.$store)
        .then((res) => {
          // console.log('wxAgentConfig', res)
          if (res.entry) {
            this.onEntryType(res.entry)
            this.onHideLoading()
          }
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    onEntryType (v) {
      switch (v) {
        case 'contact_profile':
          console.log('contact_profile', '从联系人详情进入')
          break
        case 'single_chat_tools':
          console.log('single_chat_tools', '从单聊会话的工具栏进入')
          this.onGetContactUser()
          break
        case 'group_chat_tools':
          console.log('group_chat_tools', '从群聊会话的工具栏进入')
          this.onGetGroupChat()
          break
        case 'chat_attachment':
          console.log('chat_attachment', '从会话的聊天附件栏进入')
          break
        case 'normal':
          console.log('normal', '除以上场景之外进入，例如工作台，聊天会话等')
          break
      }
    },
    onShowLoading () {
      this.visible = true
      this.showLoadingData = false
    },
    onHideLoading () {
      this.visible = false
      this.showLoadingData = true
    },
    onGetContactUser () {
      getContactUserId()
        .then((res) => {
          console.log('getContactUserId', res)
          this.contactUserId = res
          this.$store.commit('oauth/SET_EXTERNAL_USER_ID', res.data)
          this.getQwUserInfo(res)
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    onGetGroupChat () {
      getGroupChatId()
        .then((res) => {
          // this.$store.commit('oauth/SET_EXTERNAL_USER_ID', res.data)
          // console.log('getGroupChatId', res)
          // this.getQwUserInfo(res)
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    getQwUserInfo () {
      this.$store.commit('oauth/SET_EXTERNAL_USER_ID', this.contactUserId)
      this.$store
        .dispatch('contact/getData', { contactUserId: this.contactUserId })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$store.commit('oauth/SET_QW_USER_INFO', res.data)
            this.onHideLoading()
            this.contactUserInfo = res.data
            this.getFieldData()
          }
        })
        .catch((error) => {})
    },
    onClick () {
      // console.log('Clicked on a fab action')
    },

    getFieldData () {
      this.$store
        .dispatch('contact/getContactFieldData', { contact_id: this.contactUserInfo.id })
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
        this.$refs.fieldValueRef.init(item, this.contactUserInfo.id)
      })
    },

    closeDialog () {
      this.fieldDialogStatus = false
      this.getFieldData()
    },

    // star 设置关联客户
    openSelectContactDialog () {
      this.contactDialogStatus = true
      this.$nextTick(() => {
        this.$refs.contactListsRef.init()
      })
    },
    changeSyncStatus (relationId, status) {
      if (relationId) {
        const obj = {

          is_share: status,
          relation_contact_id: relationId,
          contact_id: this.contactUserInfo.id
        }
        this.$store
          .dispatch('contact/setRelationData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '更新成功！',
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
    },
    getRelationContactData () {
      this.$store
        .dispatch('contact/getRelationContactData', { contactId: this.contactUserInfo.id })
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
        .dispatch('contact/setRelationData', { relation_contact_id: item.id, contact_id: this.contactUserInfo.id })
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
        .dispatch('contact/delRelation', { relation_contact_id: item.id, contact_id: this.contactUserInfo.id })
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
    },
    // end 设置关联客户
    inviteBind () {
      const headerLocal = LocalStorage.getItem('qwscrm_saas_header_local')
      const userInfo = LocalStorage.getItem('qwscrm_saas_user_info')

      const that = this
      sendChatMessage('news', {
        link: window.location.origin + '/m/pqwscrm/saas/bind?CorpId=' + headerLocal.corp_id + '&contactUserId=' + this.contactUserId, // H5消息页面url 必填
        title: this.contactUserInfo.nick_name + '您好，' + (userInfo.userInfo ? userInfo.userInfo.name : '') + '邀请您开通会员权益！', // H5消息标题
        desc: '专属一对一售后服务', // H5消息摘要
        imgUrl: this.contactUserInfo.avatar // H5消息封面图片URL
      })
        .then((res) => {
          that.$q.notify({
            message: '成功',
            caption: '发送消息成功！',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'green'
          })
        })
        .catch((error) => {
          that.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },

    initChar (groupChat) {
      if (groupChat && groupChat.qw_chat_id && parseInt(groupChat.status) == 0) {
        const that = this
        openExistedChatWithMsg(groupChat.qw_chat_id)
          .then((res) => {
            that.$q.notify({
              message: '成功',
              caption: '进入群聊成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
          })
          .catch((error) => {
            that.$q.notify({
              message: '失败',
              caption: error.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          })
      }
    }
  }
}
</script>
<style lang="scss">
.list-item-min-height {
  min-height: 32px;
}
.shadow-tabs-box {
  width: 100%;
  height: auto;
  background: #fbfbfb;
  box-shadow: 0px 1px 10px rgba(27, 31, 68, 0.08);
  border-radius: 10px;
}
</style>
