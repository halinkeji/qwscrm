import { api } from 'boot/axios'

export function  roleInfo({ commit }, item) {
    return new Promise((resolve, reject) => {
      api.get(`/v1/rbac`)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  }