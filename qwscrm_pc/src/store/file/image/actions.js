import { api } from 'boot/axios'

export function getImageList ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api.get('v1/image', {
      params: payload
    })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function setImageData ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api.put('v1/image/updata', payload)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
