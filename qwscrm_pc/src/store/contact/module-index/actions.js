import { api } from 'boot/axios'

export function getList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact/index-list', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function refreshData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact/sync', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getDelFollowUserList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v1/contact/del-follow-user-list', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function deleteData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/contact-tag/del-data', item)
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
    let apiUrl = 'v1/contact-tag'
    apiUrl +=
          parseInt(item.id) > 0 ? '/update?id=' + parseInt(item.id) : '/create'
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

export function getItem ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/contact-tag/tag-group-view', {
        params: item
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function delTagData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/contact-tag/del-tag-data', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function addTagData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/contact-tag/create-tag', item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
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

export function getLocalContactInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/contact/get-local-contact-id-info', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
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
