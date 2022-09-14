import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/event-manage', { params })
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
    let apiUrl = 'v1/event-manage/'
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

export function getItem ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('v1/event-manage/view?id=' + id)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setWorkerData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/event-manage/'
    apiUrl += parseInt(params.id) > 0 ? 'worker-update?id=' + parseInt(params.id) : 'worker-create'
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
