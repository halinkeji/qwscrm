import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/site-manage', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setSiteData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/site-manage/set-site-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setApplyData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/site-manage/set-apply-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getAllApply ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/site-manage/get-all-apply', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getWorkerData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/site-manage/get-worker-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function bindWorkerData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/site-manage/bind-worker-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function bindContractData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/site-manage/bind-contract-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function removeContract ({ commit }, contractId) {
  return new Promise((resolve, reject) => {
    api.delete('v1/site-manage/remove-contract?id=' + contractId)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
