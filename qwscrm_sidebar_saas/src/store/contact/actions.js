import { api } from 'boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/contact/get-local-contact-info', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/contact/get-local-contact-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setRelationData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact/set-contact-relation', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function delRelation ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact/del-contact-relation', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getRelationContactData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/contact/get-relation-contact-data', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getContactConsoleData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/analysis/console-notice', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getContactFieldData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact-field/get-contact-field', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setFieldValueData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact-field/set-field-value-data', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function bindUserRelation ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact/bind-user-relation', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function verifyUserPhone ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/contact/verify-user-phone', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function sendSms ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact/sms-code-send', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getRelationData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/rbac/get-relation-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setBindClient ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/rbac/set-user-client', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
