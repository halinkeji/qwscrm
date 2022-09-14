import Vue from 'vue'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { LocalStorage, Dialog, Notify } from 'quasar'

Vue.prototype.$axios = axios

const api = axios.create({
  // 可以在这里设置 headers 部分
  baseURL: process.env.BASE_URL_API,
  // withCredentials: true, // 是否携带cookie
  timeout: 300000 // 请求超时时间
})

Vue.prototype.$api = api

// Before request
api.interceptors.request.use(
  function (config) {
    const headerLocal = LocalStorage.getItem('qwscrm_saas_header_local')
    const userLocal = LocalStorage.getItem('qwscrm_saas_user_info')

    if (userLocal && userLocal.access_token) {
      config.headers.common[
        'Qywx-Token'
      ] = `${userLocal.access_token.access_token}`
    }

    // 生产环境
    if (headerLocal) {
      config.headers.common.UserId = headerLocal.user_id
      config.headers.common.StoreId = headerLocal.store_id
      config.headers.common.LibId = headerLocal.lib_id
      config.headers.common.ApplyId = headerLocal.apply_id
      config.headers.common.CorpId = headerLocal.corp_id
      config.headers.common.AgentId = headerLocal.agent_id
    }

    if (userLocal && userLocal.userInfo) {
      config.headers.common.WorkerId = userLocal.userInfo.id
    }

    // dev环境
    // config.headers.common.UserId = 73
    // config.headers.common.StoreId = 5
    // config.headers.common.LibId = 5
    // config.headers.common.ApplyId = 'qwscrm'
    // config.headers.common.CorpId = 1
    // config.headers.common.AgentId = 1
    // config.headers.common.WorkerId = 47

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// After request
api.interceptors.response.use(
  function (response) {
    switch (response.data.code) {
      case 401:
        Dialog.create({
          dark: true,
          title: '重要提示',
          message: '您的登录信息过期，请重新登录！',
          persistent: true
          // ok: false
        })
          .onOk(() => {
            const agentLocal = LocalStorage.getItem('qwscrm_saas_agent_info')
            // removeAllLocalStorage()
            window.location.href = agentLocal.home_url
          })
          .onCancel(() => {
            // console.log('Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          })
        break
      case 403:
        Notify.create({ type: 'negative', message: '对不起，您暂无权限！', timeout: 1000 })
        break
      case 404:
        Notify.create({ type: 'negative', message: '对不起，您访问的接口不存在！', timeout: 1000 })
        break
      case 422:
        Notify.create({ type: 'negative', message: '对不起，系统发生故障，请稍后再试！', timeout: 1000 })
        break
      case 429:
        Notify.create({ type: 'negative', message: '对不起，您访问太频繁了，等等再试！', timeout: 1000 })
        break
      case 500:
        Notify.create({ type: 'negative', message: '对不起，内部服务器错误，请稍后再试！', timeout: 1000 })
        break
      case 501:
        Notify.create({ type: 'negative', message: '对不起，服务器发生故障，请稍后再试！', timeout: 1000 })
        break
    }
    response = response.data
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

axiosRetry(api, {
  retries: 3, // 设置自动发送请求次数
  retryDelay: () => 1500, // 重新请求的间隔
  shouldResetTimeout: true, //  重置超时时间
  retryCondition: error => {
    Notify.create({ type: 'negative', message: '对不起。请求超时，系统正在努力重试，请稍后！', timeout: 1000 })
    // true为打开自动发送请求，false为关闭自动发送请求
    if (error.message.includes('timeout')) return true
    // 如果你要在请求出错的时候重新发送请求（返回400以上的状态码时） 你应该像下面这样写
    if (
      error.message.includes('timeout') ||
        error.message.includes('status code')
    ) { return true }
  }
})

export { axios, api }
