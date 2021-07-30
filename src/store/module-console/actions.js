import { api } from "boot/axios";

export function getConsoleNotices({ commit },item) {
    return new Promise((resolve, reject) => {
        api.post(`/v1/analysis/console-notice`,item)
        .then(response => {
            resolve(response)
        })
        .catch(error => {
            reject(error)
        })
    })
}