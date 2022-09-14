import { LoadingBar, LocalStorage } from 'quasar'

import { isLocalStorageTokenExpir, isAuthenticated, loalHomeUrl } from 'boot/utils'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ app, router, store, Vue }) => {
  if (!LocalStorage.getItem('qwscrm_merchant_home_url')) {
    loalHomeUrl()
  }
  router.beforeEach((to, from, next) => {
    LoadingBar.start()
    if (to.meta.auth) {
      // return next()
      // 判断token是否有效，有效跳转首页，去准备H5环境，无效跳转login获取授权
      if (isAuthenticated() && isLocalStorageTokenExpir()) {
        return next()
      } else {
        return next({ path: 'login', query: { agentId: to.query.agentId } })
      }
    } else {
      if (!to.name) {
        return next({ name: 'error' })
      }
      return next()
    }
     // 开发环境
    // return next()
  })

  router.afterEach(() => {
    LoadingBar.stop()
  })
}
