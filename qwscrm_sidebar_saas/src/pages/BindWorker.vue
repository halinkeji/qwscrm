<template>
  <q-layout view="lHr lpR lFr">
    <q-header>
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">绑定用户</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>

      <q-page class="bg-color-EAE full-width column no-wrap" v-if="contactUserId">
        <q-item>
          <q-item-section>
            <q-item-label>员工姓名</q-item-label>
            <q-item-label caption>{{ userInfo.name }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon color="primary" name="link" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>失效时间：{{ date.formatDate((parseInt($route.query.bind_code) + 300) * 1000, 'YYYY年MM月DD日 HH:mm') }}</q-item-label>
            <q-item-label caption>授权二维码</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon color="primary" name="query_builder" />
          </q-item-section>
        </q-item>

        <q-footer class="bg-white">
          <div class="text-caption text-center text-grey">请核对用户信息</div>
          <q-toolbar>
            <q-toolbar-title>
              <q-btn unelevated rounded class="full-width"  @click="bindUserRelation" color="primary" label="绑定" />
            </q-toolbar-title>
          </q-toolbar>
        </q-footer>
      </q-page>

      <q-page class="bg-color-EAE full-width column no-wrap shadow-box" v-if="!contactUserId">
        <q-item class="box-center">
          <q-icon name="warning" color="red" size="64px" />
        </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-red"> 信息获取失败 </q-item>
      </q-page>

      <q-page class="bg-color-EAE full-width column no-wrap shadow-box" v-else-if="errCode == 2">
        <q-item class="box-center">
          <q-icon name="warning" color="red" size="64px" />
        </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-red"> 绑定码缺失 </q-item>
      </q-page>

      <q-page class="bg-color-EAE full-width column no-wrap shadow-box" v-else-if="errCode == 3">
        <q-item class="box-center">
          <q-icon name="warning" color="red" size="64px" />
        </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-red"> 绑定码失效/过期 </q-item>
      </q-page>

      <q-page class="bg-color-EAE full-width column no-wrap shadow-box" v-else-if="errCode == 4">
        <q-item class="box-center">
          <q-icon name="fa-solid fa-circle-check" color="red" size="64px" />
        </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-red"> 成功 </q-item>
      </q-page>

      <q-page class="bg-color-EAE full-width column no-wrap shadow-box" v-else-if="errCode == 5">
        <q-item class="box-center">
          <q-icon name="warning" color="red" size="64px" />
        </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-red"> 绑定失败 </q-item>
      </q-page>

    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'

import { wxAgentConfig, getContactUserId } from 'boot/utils'
export default {
  name: 'BindUser',
  components: {},
  data () {
    return {
      errCode: 0,
      contactUserId: ''
    }
  },
  computed: {},
  mounted () {},
  created () {
    this.date = date
    if (this.$route.query.bind_code) {
      if (parseInt(Date.now() / 1000) - parseInt(this.$route.query.bind_code) > 300) {
        this.errCode = 3
      } else {
        this.bind_code = parseInt(this.$route.query.bind_code)

        this.onGetContext()
      }
    }
  },
  methods: {
    onGetContext () {
      wxAgentConfig(this.$store)
        .then((res) => {
          console.log('wxAgentConfig', res)
          if (res.entry) {
            this.onEntryType(res.entry)
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
          this.onGetContactUser()
          break
      }
    },
    onGetContactUser () {
      getContactUserId()
        .then((res) => {
          this.useridToqywxopenid(res)
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    useridToqywxopenid (res) {
      const payload = {
        userId: res
      }

      this.$store
        .dispatch('contact/getRelationData', payload)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.contactUserId = res.data
            this.getUserInfo()
          } else {
            this.errCode = 3
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    getUserInfo () {
      const payload = {
        bind_code: this.bind_code
      }

      this.$store
        .dispatch('contact/getRelationData', payload)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.userInfo = res.data
          } else {
            this.errCode = 3
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    bindUserRelation () {
      const payload = {
        relation_user_id: this.userInfo.relation_user_id,
        qywx_openid: this.contactUserId
      }

      this.$store
        .dispatch('contact/setBindClient', payload)
        .then((res) => {
          if (res.code == 200) {
            this.$router.push({
              name: 'bindSuccess'
            })
          } else {
            this.errCode = 5
          }
        })
        .catch((error) => {
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
<style lang="scss">
.shadow-box {
  width: 100%;
  height: auto;
  background: #fbfbfb;
  box-shadow: 0px 3px 10px rgba(27, 31, 68, 0.08);
  border-radius: 10px;
}
.box-center {
  text-align: center;
  display: block;
}
.btn-submit-box {
  /* Gradient */

  background: radial-gradient(122.27% 198.92% at -22.27% -27.38%, #0070ba 0%, #1546a0 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  box-shadow: 0px 24px 48px -18px rgba(21, 70, 160, 0.5);
  border-radius: 20px;
}
</style>
