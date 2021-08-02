
import { api } from 'boot/axios'

export function image({ commit },formData) {
  return new Promise((resolve, reject) => {
    api
      .post(`/v3/file/images`,formData)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
