<template>
  <q-layout view="lHr lpR lFr">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-avatar rounded class="q-mr-xs">
          <img v-if="contactUserInfo.avatar" :src="contactUserInfo.avatar" />
          <q-skeleton v-else size="50px" />
        </q-avatar>

        <q-toolbar-title class="">
          <q-item-section>
            <q-item-label class="text-subtitle1 text-weight-bold"
              >{{ contactUserInfo.name }}
              <span class="text-orange" v-if="parseInt(contactUserInfo.type) == 2">@企业微信联系人</span>
              <span class="text-positive" v-if="parseInt(contactUserInfo.type) == 1">@微信</span></q-item-label
            >
            <q-item-label caption class="text-grey-3">
              友好关系持续{{ contactUserInfo.cycle }}
              <q-rating
                v-model="contactUserInfo.qw_user_rating"
                max="5"
                size="16px"
                color="amber-1"
                icon="star_border"
                icon-selected="star"
                icon-half="star_half"
                readonly
              />
            </q-item-label>
          </q-item-section>
        </q-toolbar-title>
        <q-btn dense flat round @click="refreshPage" icon="las la-sync-alt" />
        <q-btn dense flat round icon="menu" disable @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-toolbar>

      <q-separator inset />

      <q-tabs align="left" v-model="tab" mobile-arrows outside-arrows inline-label>
        <q-route-tab to="/" label="客户资料" />
        <q-route-tab to="/track" label="互动轨迹" />
        <q-route-tab to="/event" label="跟进事件" />
        <q-route-tab to="/contract" label="合同事宜" />
        <q-route-tab to="/bill" label="发票管理" />

        <q-route-tab to="/store" label="商家管理" />
        <q-route-tab to="/servicelog" label="售后日志" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" show-if-above overlay behavior="mobile" bordered content-class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8"> Essential Links </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]
import { LocalStorage } from 'quasar'
export default {
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  computed: {
    contactUserInfo () {
      return this.$store.state.oauth.qwUserInfo
    }
  },

  data () {
    return {
      rightDrawerOpen: false,
      essentialLinks: linksData,
      tab: 'mails'
    }
  },
  methods: {
    refreshPage () {
      if (LocalStorage.getItem('qwscrm_saas_home_url')) {
        window.location = LocalStorage.getItem('qwscrm_saas_home_url')
      }
    }
  }
}
</script>
