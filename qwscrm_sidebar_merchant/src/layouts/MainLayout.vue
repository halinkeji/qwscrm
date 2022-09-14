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
        <q-btn dense flat round icon="menu"  @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-toolbar>

      <q-separator inset />

      <q-tabs
        align="left"
        v-model="tab"
        mobile-arrows
        outside-arrows
        inline-label
        >
        <q-route-tab to="/" label="客户资料"/>
        <q-route-tab to="/track" label="互动轨迹" />
        <q-route-tab to="/event" label="跟进事件" />
        <q-route-tab to="/member-hyjc-record" label="客户寄存" />
        <q-route-tab to="/member-track-record" label="售后日志" />
      </q-tabs>

    </q-header>

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      show-if-above
      overlay
      behavior="mobile"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          <q-icon color="primary" name="dvr" size="sm" />
          工作台
        </q-item-label>
        <q-separator />
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const noMemberMenu = [
  // {
  //   title: '会员开卡码',
  //   icon: 'school',
  //   link: '/member-code'
  // },
  {
    title: '会员登记',
    icon: 'code',
    link: '/member-reg'
  },
  {
    title: '卡密登记',
    icon: 'chat',
    link: '/member-card-secret'
  }

]
const memberMenu = [
  {
    title: '信息维护',
    icon: 'record_voice_over',
    link: '/member-edit'
  },
  {
    title: '会员换卡',
    icon: 'rss_feed',
    link: '/member-change-card'
  },
  {
    title: '会员延期',
    icon: 'public',
    link: '/member-extension'
  },
  {
    title: '会员级别',
    icon: 'favorite',
    link: '/member-upgrade'
  },
  {
    title: '会员标签',
    icon: 'favorite',
    link: '/member-tag'
  },
  {
    title: '会员寄存',
    icon: 'favorite',
    link: '/member-hyjc-record'
  },
  {
    title: '会员消费单据',
    icon: 'school',
    link: '/member-consume-invoice'
  },
  {
    title: '会员储值记录',
    icon: 'code',
    link: '/member-balance-invoice'
  },
  {
    title: '会员积分记录',
    icon: 'chat',
    link: '/member-integral-invoice'
  },
  {
    title: '会员成长值记录',
    icon: 'record_voice_over',
    link: '/member-grow-record'
  },
  {
    title: '会员次卡',
    icon: 'rss_feed',
    link: '/member-count-card'
  },
  {
    title: '会员充次记录',
    icon: 'public',
    link: '/member-count-recharge'
  },
  {
    title: '会员次卡消费记录',
    icon: 'favorite',
    link: '/member-count-consume'
  },
  {
    title: '会员时卡',
    icon: 'chat',
    link: '/member-timing-card'
  },
  {
    title: '会员充时记录',
    icon: 'record_voice_over',
    link: '/member-timing-recharge'
  },
  {
    title: '会员计时消费记录',
    icon: 'rss_feed',
    link: '/member-timing-consume'
  },
  {
    title: '优惠券记录',
    icon: 'public',
    link: '/member-coupon-list'
  },
  {
    title: '积分商城订单',
    icon: 'public',
    link: '/member-jfmall-order-record'
  },
  {
    title: '发票管理',
    icon: 'favorite',
    link: '/member-receipt-index'
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
    },
    essentialLinks () {
      if (this.$store.state.oauth.memberRelation && this.$store.state.oauth.memberRelation.member_id) {
        return memberMenu
      } else {
        return noMemberMenu
      }
    }
  },
  data () {
    return {
      rightDrawerOpen: false,
      // essentialLinks: [],
      tab: 'mails'
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    refreshPage () {
      if (LocalStorage.getItem('qwscrm_merchant_home_url')) {
        window.location = LocalStorage.getItem('qwscrm_merchant_home_url')
      }
    }
  }
}
</script>
