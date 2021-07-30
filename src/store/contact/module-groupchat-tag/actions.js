import { api } from "boot/axios";

export function getList({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post(`v1/group-chat-tag/index-list`,item)
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
      api.post(`v1/group-chat-tag/del-data`,item)
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
        var apiUrl = "v1/group-chat-tag";
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

export function addTagData({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post(`v1/group-chat-tag/create-tag`,item)
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
    api.post(`v1/group-chat-tag/del-tag-data`,item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}


export function getGroupDataList({ commit },item) {
  return new Promise((resolve, reject) => {
    api.get(`v1/group-chat-tag/tag-lists`,{
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

export function saveGroupChatTag({ commit },item) {
  return new Promise((resolve, reject) => {
    api.post(`v1/group-chat-tag/save-tag`,item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}