import { api } from 'boot/axios'

// 获取Oauth网页授权target url 及 code
export function getWxCode ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/oauth/code', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 获取Oauth网页授权的user info
export function getWxUser ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/oauth/user', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// wxConfig js sdk
export function getWxConfig ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/jssdk-config/wx-config', item)
      .then(response => {
        commit('SET_WX_CONFIG', true)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// wxAgentConfig js sdk
export function getWxAgentConfig ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/jssdk-config/wx-agent-config', item)
      .then(response => {
        commit('SET_WX_AGENT_CONFIG', true)
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
