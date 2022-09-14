import { api } from "boot/axios";

export function getList({ commit },item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v1/worker-tag`,{
          params:item
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function refreshData({ commit },item) {
    return new Promise((resolve, reject) => {
      api
        .post(`v1/worker-tag/sync`,item)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
}

export function deleteData({ commit },item) {
    return new Promise((resolve, reject) => {
      api
        .post(`v1/worker-tag/del-data`,item)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
}

export function editData({ commit },item) {


    return new Promise((resolve, reject) => {
        var apiUrl = "v1/worker-tag";
        apiUrl +=
          parseInt(item.id) > 0 ? "/update?id=" + parseInt(item.id) : "/create";
        var requestType = parseInt(item.id) > 0 ? "put" : "post";
        api[requestType](apiUrl, item)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });

  
}

export function getItem({ commit },item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v1/worker-tag/view`,{
          params:item
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

//查看关联下数据
export function getItemToList({ commit },item) {
  return new Promise((resolve, reject) => {
    api.get(`v1/worker-tag/worker-list`,{
          params:item
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}