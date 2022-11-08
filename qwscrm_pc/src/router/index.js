import Vue from 'vue';
import VueRouter from 'vue-router';
import { LoadingBar, Cookies, LocalStorage } from 'quasar';
import routes from './routes';
var _ = require('lodash');
const other_routes = [
  {
    path: 'https://www.halin.net',
    component: MainLayout,
    meta: { title: '哈林官网', icon: 'las la-home' },
    position:'2',
  },
  {
    path: 'https://wiki.halin.net',
    component: MainLayout,
    meta: { title: '帮助手册', icon: 'las la-question-circle' },
    position:'2',
  },
  {
    path: '*',
    component: MainLayout,
    hidden: true,
    children: [{ path: '', component: () => import('pages/Error404.vue') }],
  },
];

import {
  isAuthenticated,
  isCookiesTokenExpir,
  isLocalStorageTokenExpir,
  removeAllCookies,
  removeAllLocalStorage,
  setAllLocalStorage,
  authConfig,
  isCurrentApply,
} from '@/utils/common';

import store from '../store/index';

Vue.use(VueRouter);

//oauth登录url
const oauth_url = authConfig.login_uri + '?response_type=code&appId=' + authConfig.appId + '&redirect_uri=' + authConfig.redirect_uri;

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

import MainLayout from 'layouts/MainLayout.vue';
import BlankLayout from 'layouts/BlankLayout.vue';

const Router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,

  // Leave these as they are and change in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
});

let currentRouterData = LocalStorage.getItem('qwscrm_allRouter');
if (currentRouterData) {
  let allRouter = getFormatRoutes(currentRouterData);
  routes.push(...allRouter);
  // console.log('allRouter', allRouter);
  routes.push(...other_routes);
  Router.addRoutes(routes);
}

function getFormatRoutes(arr, value = null, level = 0) {
  return arr.map((item) => {
    try {

      // if (parseInt(item.show) != 1) {
      //   return false
      // }
      if (item.component) {
        var obj = {
          path: item.path ? item.path : '/',
          name: item.name ? item.name : item.label,
          component: () => import(`@/pages${item.component}`),
        };
      } else {
        if (level == 0) {
          var obj = {
            path: item.path ? item.path : '/',
            name: item.name ? item.name : item.label,
            component: MainLayout,
          };
        }
        if (level == 2 || level == 1) {
          var obj = {
            path: item.path ? item.path : '/',
            name: item.name ? item.name : item.label,
            component: BlankLayout,
          };
        }
      }
      obj.position =  item.position
      obj.meta = [];
      if (item.meta) {
        obj.meta = item.meta;
      }
      if (item.title) {
        obj.meta.title = item.title;
      }
      if (item.icon) {
        obj.meta.icon = item.icon;
      }
      if (item.meta) {
        let iconInde = _.findIndex(item.meta, function(o) {
          return o.id == 'icon';
        });
        obj.meta.icon = item.meta[iconInde] && item.meta[iconInde].title ? item.meta[iconInde].title : '';
      }
      if (item.children && item.children.length > 0) {
        obj.redirect = 'noredirect';
        obj.alwaysShow = true;
        obj.children = getFormatRoutes(item.children, value, level + 1);
      }
       

      return obj;
    } catch (err) {
      console.log('err', err);
    }
  });
}

function getRouterData() {
  const Store = store();
  Store.dispatch('user/roleInfo')
    .then((res) => {
      if(res.data){
     
        if (res.data) {
          LocalStorage.set('qwscrm_corp_data', res.data.corp_data);
        }
        if (res.data && res.data.system_local) {
          LocalStorage.set('qwscrm_system_local', res.data.system_local);
        }

        LocalStorage.set('qwscrm_allRouter', res.data.router);
        let allRouter = getFormatRoutes(res.data.router);

        routes.push(...allRouter);
        routes.push(...other_routes);
        Router.addRoutes(routes);
        location.reload();
      }
     
    })
    .catch((error) => {
      console.log('error', error);
    });
}

// import test from './test.js'
// Cookies.set('loggedIn',1)
var dd = false

Router.beforeEach((to, from, next) => {
  LoadingBar.start();
  if(dd){
    return next()
  }
  let currentRouterData = LocalStorage.getItem('qwscrm_allRouter');
  if (!currentRouterData) {
    getRouterData();
  }

  if (to.meta.auth) {
    //验证sso是否登录
    if (Cookies.get('loggedIn')) {
      //判断是否即将过期
      if (isCookiesTokenExpir() || !isCurrentApply()) {
        removeAllLocalStorage();
        removeAllCookies();
        window.location.href = oauth_url;
        return false;
      }

      //验证本地用户是否已经登录
      if (isAuthenticated()) {
        //判断accessToken即将到期后刷新token
        if (isLocalStorageTokenExpir()) {
          removeAllLocalStorage();
          removeAllCookies();
          window.location.href = oauth_url;
          return false;
        }

        // //页面中转
        // if (to.name === 'index' || to.path === '/index' || to.path === '/') {
        //     router.push(router.currentRoute.query.to || '/')
        //     return false;
        // }
        //无效页面跳转至首页
        // if (!to.name) {
        //   next({ path: '/error404' })
        //   return false;
        // }

        // 生产环境
        // if (!currentRouterData) {
        //   getRouterData();
        // }

        return next();
      }

      setAllLocalStorage();

      //无效页面跳转至首页
      if (!to.name) {
        next({ path: '/error404' });
        return false;
      }

      return next();
    }
    removeAllLocalStorage();
    removeAllCookies();
    window.location.href = oauth_url;
  } else {
    //无效页面跳转至首页
    if (!to.name) {
      next({ path: '/error404' });
      return false;
    }

    // 不需要身份校验 直接通过
    return next();
  }

  LoadingBar.stop();
});

Router.afterEach(() => {
  LoadingBar.stop();
});

export default Router;
