import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('/v1/provider-suite/index', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = '/v1/provider-suite'
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
    api
      .get('v1/provider-suite/view?id=' + id)
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
    api
      .post('v1/provider-suite/delete-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getCropList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('/v1/provider-suite/get-crop-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
