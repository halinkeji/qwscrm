<template>
  <q-layout
    :view="sidebarTop?'lHh LpR lFf':'hHh LpR lFf'"
    :class="{'layout-main-bg-image':pageBgImage}"
    class='custom-page-bg'>
    <q-header :reveal="!fixedHeader" :elevated="false" :reveal-offset="60" bordered class="hl-header" :style="headerStyles">
      <q-toolbar>
        <template v-if="!sidebarTop || !$q.screen.gt.xs">
          <q-avatar class="q-logo" @click="leftDrawerOpen = !leftDrawerOpen">
            <img src="/pics/logo.svg" />
          </q-avatar>
          <q-toolbar-title
            shrink
            class="text-bold"
            v-if="$q.screen.gt.xs"
          >
            {{title}}
            <span v-show="false"
              class="q-ml-xs"
              style="letter-spacing: 0.1em;font-size:12px;font-weight:500;"
            >v1.14.1</span>
          </q-toolbar-title>
        </template>

        <q-btn
          v-if="sidebarTop && $q.screen.gt.xs"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <breadcrumb mobile-less />

        <!-- 右侧工具栏 -->
        <q-space/>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn dense flat icon="notifications">
            <q-badge color="red" text-color="white" floating>
              {{page.totalCount}}
            </q-badge>
            <q-menu
              fit
              anchor="bottom left"
              self="top middle"
              :offset="[93, 0]"
              @show="scrollTarget = $refs.scrollTargetRef"
            >
              <q-item-label header>
                系统通知
              </q-item-label>
              <q-list
                ref="scrollTargetRef"
                class="scroll"
                style="max-height: 250px; width:300px;"
              >
                <q-infinite-scroll
                  @load="onLoadNotices"
                  :offset="250"
                  :scroll-target="scrollTarget"
                  ref="noticeScrollRef"
                >

                  <q-item
                    clickable
                    v-ripple
                    v-for="(item, index) in noticeData"
                    :key="index"
                  >
                    <q-item-section>
                      <q-item-label><q-badge rounded color="warning" class="q-mr-xs"/>{{ viewDate(item.create_time) }}</q-item-label>
                      <q-item-label caption>{{ item.content }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <div v-if="noticeText" class="text-center text-grey">
                    -- 没有更多了 --
                  </div>
                  <template v-slot:loading>
                    <div class="text-center q-my-md">
                      <q-spinner-dots
                        color="primary"
                        size="40px"
                      />
                    </div>
                  </template>
                </q-infinite-scroll>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn flat dense v-if="$q.screen.gt.xs" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="$q.fullscreen.toggle()"/>
          <q-btn flat dense :icon="$q.dark.isActive ? 'wb_sunny' : 'brightness_3'" @click="changeSetting({key:'darkMode', value: !$q.dark.isActive})"/>
          <q-btn flat dense :label="$q.screen.gt.xs?username:''" @click="$refs.drawerRight.toggle()" class="no-wrap">
            <q-avatar size="md" class="q-pl-xs">
              <img src="/pics/avatar.gif">
            </q-avatar>
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>

    <q-drawer
      side="right"
      ref="drawerRight"
      :show-if-above="false"
      :overlay="false"
      :bordered="true"
      :elevated="false"
      :width="260"
      :breakpoint="599"
      class="non-selectable"
      content-class="custom-other-bg"
    >
        <div class="q-pa-sm q-pb-xl">
          <q-toolbar class="transparent">
            <q-btn icon="close" round flat dense @click="$refs.drawerRight.toggle()"/>

            <q-space/>
            <q-btn flat dense :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="$q.fullscreen.toggle()"/>
            <q-btn flat dense :icon="$q.dark.isActive ? 'wb_sunny' : 'brightness_3'" @click="changeSetting({key:'darkMode', value: !$q.dark.isActive})"/>
          </q-toolbar>

          <div class="no-wrap">
            <div class="column items-center">
              <div class="text-body1 q-mb-xs">{{username}}</div>
              <q-avatar size="80px">
                <img src="/pics/avatar.gif">
              </q-avatar>
              <div>
                {{ userName }}
              </div>
              <q-toolbar>
                <q-btn
                  color="primary"
                  label="个人设置"
                  flat
                  borderless
                />
                <q-space/>
                <q-btn
                  color="primary"
                  label="退出登录"
                  flat
                  borderless
                  @click="logoutAccount"
                />
              </q-toolbar>
            </div>

            <q-separator inset class="q-my-sm" />

            <div class="column">
              <div class="text-subtitle1 ">Settings</div>
              <q-toggle :value="$q.dark.isActive" :val="true" label="DARK模式" @click.native="changeSetting({key:'darkMode', value: !$q.dark.isActive})"/>
              <q-toggle :value="tagsView" :val="true" label="Tab栏显示" @click.native="changeSetting({key:'tagsView', value: !tagsView})"/>
              <q-toggle :value="tagsViewTop" :val="true" label="Tab栏顶部显示" @click.native="changeSetting({key:'tagsViewTop', value: !tagsViewTop})"/>
              <q-toggle :value="fixedHeader" :val="true" label="顶部锁定" @click.native="changeSetting({key:'fixedHeader', value: !fixedHeader})"/>
              <q-toggle :value="sidebarTop" :val="true" label="左侧菜单到顶" @click.native="changeSetting({key:'sidebarTop', value: !sidebarTop})" v-if="$q.screen.gt.xs"/>
              <q-toggle :value="sidebarMini" :val="true" label="左侧菜单折叠（刷新页面生效）" @click.native="changeSetting({key:'sidebarMini', value: !sidebarMini})" v-if="$q.screen.gt.xs"/>
              <q-toggle :value="uniqueOpened" :val="true" label="左侧菜单只展开一个" @click.native="changeSetting({key:'uniqueOpened', value: !uniqueOpened})"/>
              <q-input label="左侧菜单宽度" style="width:100px" :value="sidebarWidth" @input="val => changeSetting({key:'sidebarWidth', value: val})" type="number"/>

              <q-separator inset class="q-mt-md" />

              <q-toolbar class="no-padding">
                <div class="text-subtitle1 ">主色调</div>
                <q-space/>
                <q-toggle :value="$q.dark.isActive" :val="true" label="DARK" @click.native="changeSetting({key:'darkMode', value: !$q.dark.isActive})"/>
              </q-toolbar>
              <brand-color />

              <q-toolbar class="no-padding">
                  <div class="text-subtitle1 ">顶部</div>
                  <q-space/>
                  <q-btn icon="restore" flat round color="primary">
                    <q-tooltip :delay="550" content-class="bg-amber text-black shadow-4">
                      恢复默认
                    </q-tooltip>
                    <q-popup-proxy>
                      <hl-card class="my-card" style="width:240px; ">
                        <q-card-section class="bg-secondary text-white">
                          <div class="text-subtitle1 text-no-wrap">恢复默认？</div>
                        </q-card-section>
                        <q-separator />
                        <q-card-actions align="right" class="q-pa-md">
                          <q-btn v-close-popup flat>取消</q-btn>
                          <q-btn v-close-popup color="secondary" icon="check" @click="restoreSetting('colorHeader')">是的</q-btn>
                        </q-card-actions>
                      </hl-card>
                    </q-popup-proxy>
                  </q-btn>
                  <q-toggle :value="$q.dark.isActive" :val="true" label="DARK" @click.native="changeSetting({key:'darkMode', value: !$q.dark.isActive})"/>
              </q-toolbar>
              <div class="row q-gutter-lg">
                <q-btn class="col-auto" size="sm" label="背景1" color="primary">
                  <q-popup-proxy>
                    <q-color :value="colorHeaderBg1" @change="value => changeSetting({key:'colorHeaderBg1', value: value})"/>
                  </q-popup-proxy>
                </q-btn>
                <q-btn class="col-auto" size="sm" label="背景2" color="primary">
                  <q-popup-proxy>
                    <q-color :value="colorHeaderBg2" @change="value => changeSetting({key:'colorHeaderBg2', value: value})"/>
                  </q-popup-proxy>
                </q-btn>
                <q-btn class="col-auto" size="sm" label="文字" color="primary">
                  <q-popup-proxy>
                    <q-color :value="colorHeaderText" @change="value => changeSetting({key:'colorHeaderText', value: value})"/>
                  </q-popup-proxy>
                </q-btn>
              </div>

              <q-toolbar class="no-padding">
                  <div class="text-subtitle1 ">左侧</div>
                  <q-space/>
                  <q-btn icon="restore" flat round color="primary">
                    <q-tooltip :delay="550" content-class="bg-amber text-black shadow-4">
                      恢复默认
                    </q-tooltip>
                    <q-popup-proxy>
                      <hl-card class="my-card" style="width:240px; ">
                        <q-card-section class="bg-secondary text-white">
                          <div class="text-subtitle1 text-no-wrap">恢复默认？</div>
                        </q-card-section>
                        <q-separator />
                        <q-card-actions align="right" class="q-pa-md">
                          <q-btn v-close-popup flat>取消</q-btn>
                          <q-btn v-close-popup color="secondary" icon="check" @click="restoreSetting('colorMenu')">是的</q-btn>
                        </q-card-actions>
                      </hl-card>
                    </q-popup-proxy>
                  </q-btn>
                  <q-toggle :value="$q.dark.isActive" :val="true" label="DARK" @click.native="changeSetting({key:'darkMode', value: !$q.dark.isActive})"/>
              </q-toolbar>
              <div class="row q-gutter-lg">
                <q-btn class="col-auto" size="sm" label="背景" color="primary">
                  <q-popup-proxy>
                    <q-color :value="colorMenuBg" @change="value => changeSetting({key:'colorMenuBg', value: value})"/>
                  </q-popup-proxy>
                </q-btn>
                <q-btn class="col-auto" size="sm" label="文字" color="primary">
                  <q-popup-proxy>
                    <q-color :value="colorMenuText" @change="value => changeSetting({key:'colorMenuText', value: value})"/>
                  </q-popup-proxy>
                </q-btn>
                <q-btn class="col-auto" size="sm" label="Active" color="primary">
                  <q-popup-proxy>
                    <q-color :value="colorMenuBgActive" @change="value => changeSetting({key:'colorMenuBgActive', value: value})"/>
                  </q-popup-proxy>
                </q-btn>
              </div>

              <q-toolbar class="no-padding">
                  <div class="text-subtitle1 ">页面<q-icon name="help_outline"><q-tooltip>请在PageCrudDict页面查看效果，分页设置为5条/页</q-tooltip></q-icon></div>
                  <q-space/>
                  <q-btn icon="restore" flat round color="primary">
                    <q-tooltip :delay="550" content-class="bg-amber text-black shadow-4">
                      恢复默认
                    </q-tooltip>
                    <q-popup-proxy>
                      <hl-card class="my-card" style="width:240px; ">
                        <q-card-section class="bg-secondary text-white">
                          <div class="text-subtitle1 text-no-wrap">恢复默认？</div>
                        </q-card-section>
                        <q-separator />
                        <q-card-actions align="right" class="q-pa-md">
                          <q-btn v-close-popup flat>取消</q-btn>
                          <q-btn v-close-popup color="secondary" icon="check" @click="restoreSetting('colorPage')">是的</q-btn>
                        </q-card-actions>
                      </hl-card>
                    </q-popup-proxy>
                  </q-btn>
                  <q-toggle :value="$q.dark.isActive" :val="true" label="DARK" @click.native="changeSetting({key:'darkMode', value: !$q.dark.isActive})"/>
              </q-toolbar>
              <div class="row q-gutter-lg">
                <q-btn class="col-auto" size="sm" label="背景底色" color="primary">
                  <q-popup-proxy>
                    <q-color :value="colorPageBg" @change="value => changeSetting({key:'colorPageBg', value: value})"/>
                  </q-popup-proxy>
                </q-btn>
                <q-btn class="col-auto" size="sm" label="Table背景" color="primary">
                  <q-popup-proxy>
                    <q-color :value="colorTableBg" @change="value => changeSetting({key:'colorTableBg', value: value})"/>
                  </q-popup-proxy>
                </q-btn>
                <q-btn class="col-auto" size="sm" label="其它背景" color="primary" @click="testDialog=true">
                  <q-popup-proxy>
                    <q-color :value="colorOtherBg" @change="value => changeSetting({key:'colorOtherBg', value: value})"/>
                  </q-popup-proxy>
                </q-btn>
                <q-checkbox :value="pageBgImage" label="显示背景图" dense @click.native="changeSetting({key:'pageBgImage', value: !pageBgImage})"/>
              </div>

            </div>

          </div>
        </div>
    </q-drawer>

    <q-drawer class="hl-sidebar main-page-sidebar non-selectable no-scroll"
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      elevated
      :mini="miniCheck"
      @mouseover="leftDrawerMouseOver"
      @mouseout="leftDrawerMouseOut"
      :mini-to-overlay="miniToOverlay"
      :width="parseInt(sidebarWidth)"
      :breakpoint="599"
      :bordered="false"
    >
      <div class="sidebar-body" :style="drawerStyles">
        <q-scroll-area class="fit">
          <q-list>
            <template v-if="sidebarTop || !$q.screen.gt.xs">
              <q-item>
                <q-item-section avatar>
                  <q-avatar class="q-logo">
                    <img src="/pics/logo.svg" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-toolbar-title
                    shrink
                    class="text-bold"
                    :style="drawerStylesFontColor"
                  >
                    {{title}}
                  </q-toolbar-title>

                </q-item-section>
              </q-item>
            </template>

            <side-menu ref="menu" v-for="(routeItem) in routes" :route-item="routeItem" :key="routeItem.path" base-path="" :level="1"/>

          </q-list>
        </q-scroll-area>
      </div>
      <div
        class="sidebar-footer row items-center"
        :style="drawerStyles"
      >
        <q-btn v-if="$q.screen.gt.xs"
          flat
          dense
          round
          @click="leftDrawerMiniClick"
          :icon="`${leftDrawerMini?'format_indent_increase':'format_indent_decrease'}`"
          aria-label="Menu"
          size="md"
        />
      </div>
    </q-drawer>

    <q-page-container :style="stylesPageContainer">
      <q-page
        :style="(tagsView && tagsViewTop)?'padding-top: 36px;':((tagsView && !tagsViewTop)?'padding-bottom: 36px':'')"
      >
        <keep-alive :include="cachedViews">
          <router-view class="hl-page" :class="settingPageClass" :style="settingPageStyle"/>
        </keep-alive>

        <!-- place QPageSticky at end of page -->
        <q-page-sticky expand position="top" v-if="tagsView && tagsViewTop" style="z-index:5;">
          <page-tag-views :class="$q.dark.isActive ? 'pagetagviews-dark' : 'pagetagviews-normal'"/>
          <q-separator/>
        </q-page-sticky>
        <q-page-sticky expand position="bottom" v-if="tagsView && !tagsViewTop" style='z-index:5;'>
          <q-separator/>
          <page-tag-views switch-indicator :class="$q.dark.isActive ? 'pagetagviews-dark' : 'pagetagviews-normal'"/>
        </q-page-sticky>
        <!-- place QPageScroller at end of page -->
        <q-page-scroller position="bottom" :scroll-offset="150" :offset="fabPos" style="z-index:6;">
          <q-btn fab-mini icon="keyboard_arrow_up" color="primary" v-touch-pan.capture="moveFab" v-touch-pan.prevent.mouse="moveFab" :disable="draggingFab"/>
        </q-page-scroller>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import routes from '@/router/routes'
import Setting from '@/utils/setting'
import { date, LocalStorage } from 'quasar'
import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'
export default {
  name: 'MainLayout',
  components: {
  },
  data () {
    return {
      miniState: false,
      leftDrawerMini: false,
      leftDrawerOpen: false,

      fabPos: [48, 58],
      draggingFab: false,

      scrollTarget: undefined,
      noticeData: [], // 通知项
      page: {
        pageIndex: 1,
        pSize: 6,
        totalCount: 0
      },
      noticeText: false,
      userName: ''
    }
  },
  created () {
    const user_info = LocalStorage.getItem('qwscrm_user_info')
    this.userName = user_info ? user_info.username : '未知'
    this.getNoticeData()
  },
  mounted () {
    this.menuOpen(this.menuFind(this.$refs.menu, this.$route.path))
    if (this.sidebarMini || !this.$q.screen.gt.sm) {
      this.leftDrawerMini = true
      this.miniState = true
    }
  },
  watch: {
    $route (route) {
      this.menuOpen(this.menuFind(this.$refs.menu, route.path))
    }
  },
  computed: {
    settingPageClass () {
      if (this.$q.screen.gt.xs) {
        return Setting.pageClass
      } else {
        return Setting.pageClassMobile
      }
    },
    settingPageStyle () {
      if (this.$q.screen.gt.xs) {
        return Setting.pageStyle
      } else {
        return Setting.pageStyleMobile
      }
    },
    drawerStyles () {
      return {
        backgroundColor: this.colorMenuBg,
        color: this.colorMenuText
      }
    },
    stylesPageContainer () {
      return {
        // backgroundColor: this.$q.dark.isActive ? '#000' : 'rgb(238 240 248 / 70%)'
      }
    },
    drawerStylesFontColor () {
      return {
        color: this.colorMenuText
      }
    },
    headerStyles () {
      return {
        background: 'linear-gradient(145deg, ' + this.colorHeaderBg1 + ' 15%, ' + this.colorHeaderBg2 + ' 70%)',
        color: this.colorHeaderText
      }
    },
    ...mapGetters('settings', [
      'title',
      'tagsView',
      'tagsViewTop',
      'fixedHeader',
      'uniqueOpened',
      'sidebarTop',
      'sidebarWidth',
      'sidebarMini',
      'darkMode',
      'pageBgImage',
      'colorPrimary',
      'colorHeaderBg1',
      'colorHeaderBg2',
      'colorHeaderText',
      'colorMenuBg',
      'colorMenuText',
      'colorMenuBgActive',
      'colorPageBg',
      'colorTableBg',
      'colorOtherBg'
    ]),
    ...mapGetters('tagviews', [
      'cachedViews'
    ]),
    ...mapGetters('user', [
      'username'
    ]),
    routes () {
      return routes
    },
    /* cachedViews () {
      return this.$store.state.tagviews.cachedViews
    }, */
    // 20210603 发现一个问题：当noCache==false的页面在dev模式下更改了页面结构，会导致网页白屏，<router-view /> 不使用key就没这个问题
    key () {
      return this.$route.path
    },
    miniCheck: function () {
      if (this.leftDrawerMini) {
        return this.miniState
      } else {
        return false
      }
    },
    miniToOverlay: function () {
      if (this.leftDrawerMini) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions('settings', [
      'changeSetting',
      'restoreSetting'
    ]),
    moveFab (ev) {
      this.draggingFab = ev.isFirst !== true && ev.isFinal !== true

      this.fabPos = [
        this.fabPos[0] - ev.delta.x,
        this.fabPos[1] - ev.delta.y
      ]
    },
    menuFind (array, path) {
      if (array === undefined || array.length === 0) {
        return undefined
      }
      for (const a of array) {
        if (a.$refs['route-' + path]) {
          return a
        }
        const ret = this.menuFind(a.$refs.menu, path)
        if (ret !== undefined) {
          return ret
        }
      }
      return undefined
    },
    menuOpen (menu) {
      if (this.$q.screen.lt.sm) {
        return
      }
      if (menu !== undefined && menu !== this) {
        this.menuOpen(menu.$parent)
        if (menu.show) {
          menu.show()
        }
      }
    },
    leftDrawerMouseOver (evt) {
      this.miniState = false
    },
    leftDrawerMouseOut (evt) {
      this.miniState = true
    },
    leftDrawerMiniClick () {
      this.leftDrawerMini = !this.leftDrawerMini
      if (this.leftDrawerMini) {
        this.miniState = true
      } else {
        this.miniState = false
      }
    },
    onLoadNotices (index, done) {
      if (this.noticeData.length == parseInt(this.page.totalCount)) {
        this.$refs.noticeScrollRef.stop()
        this.noticeText = true
        return false
      } else {
        if (index > 1) {
          setTimeout(() => {
            this.page.pageIndex = index
            this.getNoticeData()
            done()
          }, 2000)
        } else {
          setTimeout(() => {
            done()
          }, 200)
        }
      }
    },
    getNoticeData () {
      const payload = {
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }
      this.$store.dispatch('mConsole/getConsoleNotices', payload)
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              if (this.noticeData.length > 0) {
                this.noticeData = this.noticeData.concat(res.data.list)
              } else {
                this.noticeData = res.data.list
              }
              this.page.totalCount = res.data.page.totalCount
            }
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
    },
    // 显示日期格式
    viewDate (val) {
      return val ? date.formatDate(val * 1000, 'YYYY-MM-DD  HH:mm:ss') : '暂无时间'
    },
    logoutAccount () {
      this.$q.loading.show({
        message: '正在保存数据,请稍后...'
      })

      removeAllLocalStorage()
      removeAllCookies()

      setTimeout(() => {
        this.$q.loading.hide()

        if (this.$route.name == 'Index') {
          location.reload()
        } else {
          this.$router.push({ name: 'Index' })
        }
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-main-bg-image {
  background-image: url("/pics/index.svg");
  background-repeat: no-repeat;
  background-position: center 0px;
  background-size: 100%;
}

.body--dark .layout-main-bg-image {
}

.hl-sidebar.main-page-sidebar ::v-deep > .q-drawer {
  background-image: url("https://qwscrm.halin.net/pics/sidebar-bg.jpg") !important;
  background-size: cover !important;
  background-repeat: no-repeat;
}
.pagetagviews-normal {
  background-color: #eeeeee;  // $grey-3
  color: var(--q-color-primary);
  ::v-deep .q-tab--active {
    background-color: white;
  }
}
.pagetagviews-dark {
  background-color: #212121; // $grey-10
  color: var(--q-color-primary);
  // color: $grey-2;
  ::v-deep .q-tab--active {
    background-color: $grey-9;
  }
}
</style>

<style lang="sass" scoped>
.main-page-sidebar
  & .sidebar-body
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 45px
  & .sidebar-footer
    position: absolute
    left: 0
    right: 0
    bottom: 0
    height: 45px
    padding-left: 11px
</style>
