import { api } from 'boot/axios'

export function getImageList({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api.get(`v3/image`, {
      params: payload
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function setImageData({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api.put(`v3/image/updata`, payload)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}