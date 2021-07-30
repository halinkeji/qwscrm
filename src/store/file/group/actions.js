import { api } from "boot/axios";

export function getGroupList({ commit }) {
  return new Promise((resolve, reject) => {
    api
      .get(`v3/group`)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function setGroupData({ commit }, payload) {
  return new Promise((resolve, reject) => {
    let urlType =
      parseInt(payload.id) > 0 ? "update?id=" + parseInt(payload.id) : "create";
    let requestType = parseInt(payload.id) > 0 ? "put" : "post";
    api[requestType](`v3/group/${urlType}`, payload)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function delGroupData({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api
      .delete(`v3/group/delete?id=${payload}`)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
