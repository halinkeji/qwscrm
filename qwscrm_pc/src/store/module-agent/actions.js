import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/agent/index', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function deleteData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/agent/delete-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function editData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/agent'
    apiUrl += parseInt(item.id) > 0 ? '/update?id=' + parseInt(item.id) : '/create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('v1/agent/view?id=' + id)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function cloudSyncGet ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/agent/sync-get', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function openSyncData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/agent/open-sync-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
