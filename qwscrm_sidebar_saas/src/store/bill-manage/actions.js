import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/bill-manage', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/bill-manage/'
    apiUrl += parseInt(params.id) > 0 ? 'update?id=' + parseInt(params.id) : 'create'
    const requestType = parseInt(params.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getBaseBill ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('v1/bill-manage/view?id=' + id)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getBillLog ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('v1/bill-manage/view-log?id=' + id)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setBillData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/bill-manage/'
    apiUrl += parseInt(params.id) > 0 ? 'bill-update?id=' + parseInt(params.id) : 'bill-create'
    const requestType = parseInt(params.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getLinkData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/bill-manage/link-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
