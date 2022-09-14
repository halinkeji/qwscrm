import { LocalStorage, Notify } from 'quasar'
import Store from '../store/index'

const store = Store()
const wx = window.wx

/* 判断localStorage token是否过期 */
export const loalHomeUrl = () => {
  LocalStorage.set('qwscrm_merchant_home_url', window.location.href)
}

/* 判断localStorage token是否过期 */
export const isLocalStorageTokenExpir = () => {
  const expiredTime = parseInt(
    LocalStorage.getItem('qwscrm_merchant_user_info').access_token.expires
  )
  /* 获取本地时间 */
  const nowTime = parseInt(new Date().getTime() / 1000)
  return expiredTime > nowTime
}

// 判断LocalStorage是否有值
export const isAuthenticated = () => {
  return (
    LocalStorage.getItem('qwscrm_merchant_user_info') && LocalStorage.getItem('qwscrm_merchant_header_local') && LocalStorage.getItem('qwscrm_merchant_agent_info')
  )
}

// get wx target url callback url code
export function wxOauthCode (objQuery, uriPath) {
  const item = {
    AgentId: objQuery.agentId,
    CallbackUrl: window.location.href
  }
  store.dispatch('oauth/getWxCode', item)
    .then(res => {
      if (res.code == 200) {
        window.location.href = res.data
      } else {
        reject()
      }
    })
    .catch(error => {})
}

// 获取wxConfig
export function wxConfig (stores) {
  return new Promise((resolve, reject) => {
    const item = {
      UriPath: window.location.href
    }
    stores.dispatch('oauth/getWxConfig', item)
      .then(res => {
        if (res.code == 200) {
          wx.config({
            beta: res.data.beta, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: res.data.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，企业微信的corpID
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: res.data.jsApiList // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
          })
          wx.ready(function () {

          })
          wx.error(function (res) {
            Notify.create({ type: 'negative', message: 'wx.config fail', timeout: 1500 })
            console.log(res)
          })
          resolve(wxAgentConfig(stores))
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取wxAgentConfig
export function wxAgentConfig (stores) {
  return new Promise((resolve, reject) => {
    const item = {
      UriPath: window.location.href
    }
    stores.dispatch('oauth/getWxAgentConfig', item)
      .then(res => {
        if (res.code == 200) {
          // console.log(res)
          // console.log(wx)
          wx.agentConfig({
            corpid: res.data.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid: res.data.agentid, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
            jsApiList: res.data.jsApiList, // 必填，传入需要使用的接口名称
            success: function (res) {
              resolve(getWxContext())
            },
            fail: function (res) {
              console.log('getWxAgentConfig res', res)
              if (res.errMsg.indexOf('function not exist') > -1) {
                Notify.create({ type: 'negative', message: '版本过低请升级', timeout: 1500 })
              }
              Notify.create({ type: 'negative', message: 'wx.agentConfig fail', timeout: 1500 })
              return res
            }
          })
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取H5运行环境
export function getWxContext () {
  return new Promise((resolve, reject) => {
    wx.invoke('getContext', {
    }, function (res) {
      if (res.err_msg === 'getContext:ok') {
        // entry  = res.entry ; //返回进入H5页面的入口类型，目前有normal、contact_profile、single_chat_tools、group_chat_tools、chat_attachment
        // shareTicket = res.shareTicket; //可用于调用getShareInfo接口
        resolve(res)
      } else {
        reject(res.err_msg)
      }
    })
  })
}

// 获取当前外部联系人userid
export function getContactUserId () {
  return new Promise((resolve, reject) => {
    wx.invoke('getCurExternalContact', {
    }, function (res) {
      if (res.err_msg == 'getCurExternalContact:ok') {
        resolve(res.userId)
        // userId  = res.userId ; //返回当前外部联系人userId
      } else {
        // 错误处理
        reject(res.err_msg)
      }
    })
  })
}

// 获取当前客户群的群ID
export function getGroupChatId () {
  return new Promise((resolve, reject) => {
    wx.invoke('getCurExternalChat', {
    }, function (res) {
      if (res.err_msg == 'getCurExternalChat:ok') {
        resolve(res.chatId)
        // chatId  = res.chatId ; //返回当前外部群的群聊ID
      } else {
        // 错误处理
        reject(res.err_msg)
      }
    })
  })
}

// 分享消息到当前会话
// 消息格式支持文本(“text”)，图片(“image”)，视频(“video”)，文件(“file”)，H5(“news”）和小程序(“miniprogram”)
export function sendChatMessage (type, content) {
  let param
  switch (type) {
    case 'text':
      param = {
        msgtype: 'text',
        enterChat: true,
        text: {
          content
        }
      }
      break
    case 'image':
      param = {
        msgtype: 'image',
        enterChat: true,
        image: {
          mediaid: content
        }
      }
      break
    case 'video':
      param = {
        msgtype: 'video',
        enterChat: true,
        video: {
          mediaid: content
        }
      }
      break
    case 'file':
      param = {
        msgtype: 'file',
        enterChat: true,
        file: {
          mediaid: content
        }
      }
      break
    case 'news':
      // content的值
      // {
      //   link: "", //H5消息页面url 必填
      //   title: "", //H5消息标题
      //   desc: "", //H5消息摘要
      //   imgUrl: "", //H5消息封面图片URL
      // }
      param = {
        msgtype: 'news',
        enterChat: true,
        news: content
      }
      break
    case 'miniprogram':
      // content的值
      // {
      //   appid: "wx8bd80126147df384",//小程序的appid，企业已关联的任一个小程序
      //   title: "this is title", //小程序消息的title
      //   imgUrl:"https://search-operate.cdn.bcebos.com/d054b8892a7ab572cb296d62ec7f97b6.png",//小程序消息的封面图。必须带http或者https协议头，否则报错 $apiName$:fail invalid imgUrl
      //   page:"/index/page.html", //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
      // }
      param = {
        msgtype: 'miniprogram',
        enterChat: true,
        miniprogram: content
      }
      break
  }

  return new Promise((resolve, reject) => {
    wx.invoke('sendChatMessage', param, function (res) {
      if (res.err_msg == 'sendChatMessage:ok') {
        resolve()
      } else {
        // 错误处理
        reject(res.err_msg)
      }
    })
  })
}

// 打开已有群聊
// 该接口允许打开一个已有的群聊，同时传入一条link消息（消息是可选的）
export function openExistedChatWithMsg (chatId, linkContent) {
  let params
  if (linkContent) {
    params = {
      chatId,
      msg: {
        msgtype: 'link',
        link: linkContent
        // linkContent 的值
        // {
        //   title: "title1",
        //   desc: "desc1",
        //   url: "link1",
        //   imgUrl: "imgurl1"
        // }
      }
    }
  } else {
    params = {
      chatId
    }
  }

  return new Promise((resolve, reject) => {
    wx.invoke('openExistedChatWithMsg', params, function (res) {
      if (res.err_msg == 'openExistedChatWithMsg:ok') {
        resolve()
      } else {
        // 错误处理
        reject(res.err_msg)
      }
    })
  })
}
