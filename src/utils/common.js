import { Cookies,LocalStorage,Notify } from 'quasar'

//auth Config 值

// export const authConfig =  {
//     domain: "hlfqt2BxF42o44Qqor",
//     login_uri: "hlTaHnvRxxagiYHIYR",
//     redirect_uri: "hlk2If2SOXAUc6OfXa",
//     appId: "hlG9cTQcb7T69C9ot6"
// }

export const authConfig =  {
    domain: ".halin.net",
    login_uri: "https://passport.halin.net/login",
    redirect_uri: "https://qwscrm.halin.net",
    appId: "hlyP80SdocX0xGXSx3"
}


/*判断localStorage token是否过期*/
export const isLocalStorageTokenExpir = () => {
    let expiredTime = parseInt(LocalStorage.getItem("accessToken_info").expires)
    /*获取本地时间*/
    let nowTime = parseInt(new Date().getTime() / 1000);
    /*如果小于15分钟，则说明即将过期*/
    return (expiredTime - nowTime) < 60 * 15
  };
  
/*判断Cookies token是否过期*/
export const isCookiesTokenExpir = () => {
    let expiredTime = parseInt(Cookies.get('accessToken_info').expires)
    /*获取本地时间*/
    let nowTime = parseInt(new Date().getTime() / 1000);
    /*如果小于15分钟，则说明即将过期*/
    return (expiredTime - nowTime) < 60 * 15
};

//判断Cookies是否有值
export const  isAuthenticated =  () => {
    return LocalStorage.getItem("loggedIn") && (Cookies.get('access_token') === LocalStorage.getItem("access_token"))
}


//设置 全局LocalStorage
export function setAllLocalStorage() {
    LocalStorage.set('access_token', Cookies.get('access_token'))
    LocalStorage.set('expires_in', Cookies.get('expires_in'))
    LocalStorage.set('refresh_token', Cookies.get('refresh_token'))
    LocalStorage.set('token_type', Cookies.get('token_type'))
    LocalStorage.set('loggedIn', Cookies.get('loggedIn'))
    LocalStorage.set('accessToken_info', Cookies.get('accessToken_info'))
    LocalStorage.set('user_info', Cookies.get('user_info'))
    LocalStorage.set('account_info', Cookies.get('account_info'))
    if(Cookies.get('store_info')){
        LocalStorage.set('store_info', Cookies.get('store_info'))
    }
    return true
}


//删除 Cookies 
export const  removeAllCookies =  () => {
    Cookies.remove('access_token', { path: '/', domain: authConfig.domain})
    Cookies.remove('expires_in', { path: '/', domain: authConfig.domain})
    Cookies.remove('refresh_token', { path: '/', domain: authConfig.domain})
    Cookies.remove('token_type', { path: '/', domain: authConfig.domain})
    Cookies.remove('loggedIn', { path: '/', domain: authConfig.domain})
    Cookies.remove('accessToken_info', { path: '/', domain: authConfig.domain})
    Cookies.remove('user_info', { path: '/', domain: authConfig.domain})
    Cookies.remove('account_info', { path: '/', domain: authConfig.domain})
    if(Cookies.get('store_info')){
        Cookies.remove('store_info', { path: '/', domain: authConfig.domain})
    }
}
  
//删除 LocalStorage 
export const  removeAllLocalStorage =  () => {
    LocalStorage.clear()
}

//notify提示
export function notifyError(errorMsg, timeout) {
    Notify.create({
      type: 'negative',
      message: errorMsg,
      timeout,
      position: 'bottom',
      closeBtn: '关闭'
    })
}

