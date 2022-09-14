import { api } from 'boot/axios'

export function getList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/contact-field', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getData ({ commit }, fieldId) {
  return new Promise((resolve, reject) => {
    api.get('v1/contact-field/view?id=' + fieldId)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function saveData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/contact-field/'
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

export function deteleField ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact-field/delete-fileld', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
