import { api } from 'boot/axios'

export function postApi ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/member/do', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
