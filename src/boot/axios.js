import Vue from "vue";
import axios from "axios";
import axiosRetry from "axios-retry";
import { Cookies, LocalStorage, LoadingBar, Dialog } from "quasar";
import {
  removeAllCookies,
  removeAllLocalStorage,
  notifyError,
  authConfig
} from "@/utils/common";

//oauth登录url
const oauth_url =
  authConfig.login_uri +
  "?response_type=code&appId=" +
  authConfig.appId +
  "&redirect_uri=" +
  authConfig.redirect_uri;

Vue.prototype.$axios = axios;
let wurl = require("wurl");

const api = axios.create({
  // 可以在这里设置 headers 部分
  baseURL: process.env.BASE_URL_API,
  // withCredentials: true, // 是否携带cookie
  timeout: 5000 // 请求超时时间
});

Vue.prototype.$api = api;

// Before request
api.interceptors.request.use(
  function(config) {
    let urlPath = wurl("path", config.url)
    //生产环境
    if (Cookies.get("loggedIn")) {
      let accessToken = Cookies.get("access_token")
      config.headers.common["Authorization"] = `Bearer ${accessToken}`
      config.headers.common["StoreId"] = LocalStorage.getItem(
        "account_info"
      ).store_id
      config.headers.common["UserId"] = LocalStorage.getItem(
        "account_info"
      ).user_id
      config.headers.common["ApplyId"] = LocalStorage.getItem(
        "account_info"
      ).apply_id
      config.headers.common["LibId"] = LocalStorage.getItem(
        "account_info"
      ).lib_id
      if(LocalStorage.getItem("CorpInfo"))
      config.headers.common["CorpId"] = LocalStorage.getItem(
        "CorpInfo"
      ).id
    }
    // 开发环境
    // config.headers.common["StoreId"] = 5
    // config.headers.common["UserId"] = 73
    // config.headers.common["ApplyId"] = "qwscrm"
    // config.headers.common["LibId"] = 5
    // config.headers.common["CorpId"] = 1

    if (
      urlPath === "/authorize/login" ||
      urlPath === "/authorize/access-token"
    ) {
      config.headers["Content-Type"] = "multipart/form-data";
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// After request
api.interceptors.response.use(
  function(response) {
    switch (response.data.code) {
      case 401:
        Dialog.create({
          dark: true,
          title: "重要提示",
          message: "您的登录信息过期，请重新登录！",
          persistent: true
        })
          .onOk(() => {
            removeAllLocalStorage();
            removeAllCookies();
            window.location.href = oauth_url;
          })
          .onCancel(() => {
            // console.log('Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
        break;
      case 403:
        notifyError("对不起，您暂无权限！", 1500);
        break;
      case 404:
        notifyError("对不起，您访问的接口不存在！", 1500);
        break;
      case 422:
        notifyError("对不起，系统发生故障，请稍后再试！", 1500);
        break;
      case 429:
        notifyError("对不起，您访问太频繁了，等等再试！", 1500);
        break;
      case 500:
        notifyError("对不起，内部服务器错误，请稍后再试！", 1500);
        break;
      case 501:
        notifyError("对不起，服务器发生故障，请稍后再试！", 1500);
        break;
    }
    response = response.data;
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axiosRetry(api, {
  retries: 3, // 设置自动发送请求次数
  retryDelay: () => 1000, // 重新请求的间隔
  shouldResetTimeout: true, //  重置超时时间
  retryCondition: error => {
    notifyError("对不起。请求超时，系统正在努力重试，请稍后！", 2000);
    // true为打开自动发送请求，false为关闭自动发送请求
    if (error.message.includes("timeout")) return true;
    // 如果你要在请求出错的时候重新发送请求（返回400以上的状态码时） 你应该像下面这样写
    if (
      error.message.includes("timeout") ||
      error.message.includes("status code")
    )
      return true;
  }
});

LoadingBar.setDefaults({
  color: "light-blue-4",
  size: "4px",
  position: "top"
});

export { axios, api };
