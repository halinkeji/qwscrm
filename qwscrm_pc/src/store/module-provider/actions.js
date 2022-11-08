import { api } from 'boot/axios'

export function getData ({ commit }) {
  return new Promise((resolve, reject) => {
    api
      .get('/v1/provider/index')
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
    api
      .post('/v1/provider/create', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getSuiteAuthCode ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('/v1/provider/suite-auth-code', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
