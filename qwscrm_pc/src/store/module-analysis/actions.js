import { api } from "boot/axios"

// 首页统计 
export function getContactSync({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post("/v1/analysis/contact-sync",item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getHomeHeader({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post("/v1/analysis/index-header-analysis",item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getHomeBody({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post("/v1/analysis/index-body-analysis",item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getGroupChatTopAnalysis({ commit }) {
  return new Promise((resolve, reject) => {
    api.get("/v1/analysis/group-chat-top-analysis")
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 客户群统计 

export function getGroupChatSync({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post("/v1/analysis/group-chat-sync",item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getGroupChatBody({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post("/v1/analysis/group-chat-body-analysis",item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getGridGroupChatBody({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post("/v1/analysis/grid-group-chat-body-analysis",item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getOwnerGroupChatBody({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post("/v1/analysis/owner-group-chat-body-analysis",item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 企业员工工作统计 

export function getContactTopAnalysis({ commit }) {
  return new Promise((resolve, reject) => {
    api.get("/v1/analysis/contact-top-analysis")
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getContactBody({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post("/v1/analysis/contact-body-analysis",item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getWorkerGroupChatBody({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post("/v1/analysis/worker-contact-body-analysis",item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}