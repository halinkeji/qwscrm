import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/store-manage', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setLogListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/store-manage/set-log-list-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setStoreData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/store-manage/set-store-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
