import { api } from 'src/boot/axios'

// 保存角色信息
export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/role/create', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 更新角色信息
export function updateRoleData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .put(`v1/role/update?id=${item.id}`, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 保存用户角色信息
export function setUesrRoleData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/role/set-user', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取菜单树状列表
export function getRoleData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/role', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取菜单权限
export function getApplyMenuData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/role/menu', { params: item })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取角色详情
export function getRoleOneData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/role/one', {
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

// 删除菜单
export function delOneData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .delete(`v1/role/delete?id=${item.id}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 角色名称配置
export function config ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/role/config')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 设置主管理权限
export function setConfig ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/role/set-config', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 获取当前用户可用权限
export function getApplyRoleList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/role/lists', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取当前用户可用权限
export function getUserRelationList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/role/relation', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
// 获取角色详情
export function getUserRoleData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/role/user-role', {
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
