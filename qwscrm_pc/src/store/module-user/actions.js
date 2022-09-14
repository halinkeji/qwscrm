import { api } from 'boot/axios'

export function roleInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('/v1/rbac/role')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function getUserList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/rbac', {
      params
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setUserInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/rbac'
    apiUrl += parseInt(item.id) > 0 ? '/update?id=' + parseInt(item.id) : '/create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v1/rbac/view?id=' + item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function delUserInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.delete(`v1/rbac/delete?id=${item}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/rbac/lists', {
      params
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserExtend ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/rbac/get-user-extend', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setUserExtend ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/rbac/set-user-extend', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/rbac/get-user-info', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setUserItem ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/rbac/set-user-info', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
