import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/contract', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('v1/contract/view?id=' + id)
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
    let apiUrl = 'v1/contract/'
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

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/contract/list-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/contract/all-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
