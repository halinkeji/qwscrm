import { api } from "boot/axios"

export function getCorp({ commit }) {
  return new Promise((resolve, reject) => {
    api
      .get("/v1/corp/index")
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setCorp({ commit }, item) {
    return new Promise((resolve, reject) => {
      api
        .post("/v1/corp/create", item)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
