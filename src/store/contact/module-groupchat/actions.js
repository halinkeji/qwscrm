import { api } from "boot/axios";

export function getList({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post(`v1/group-chat/index-list`,item)
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
      api.post(`v1/group-chat/sync`,item)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
}

export function getItemList({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post(`v1/group-chat/item-list`,item)
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
        .post(`v1/contact-tag/del-data`,item)
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
        var apiUrl = "v1/contact-tag";
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
      .get(`v1/contact-tag/tag-group-view`,{
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

export function delTagData({ commit },item) {
  return new Promise((resolve, reject) => {
    api
      .post(`v1/contact-tag/del-tag-data`,item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function addTagData({ commit },item) {
  return new Promise((resolve, reject) => {
    api
      .post(`v1/contact-tag/create-tag`,item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

