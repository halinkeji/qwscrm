
import { api } from 'boot/axios'

export function files ({ commit }, formData) {
  return new Promise((resolve, reject) => {
    api.post('/v1/file/file-data', formData)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function image ({ commit }, formData) {
  return new Promise((resolve, reject) => {
    api.post('/v1/file/images', formData)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
