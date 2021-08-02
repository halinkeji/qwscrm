import { api } from "boot/axios";

export function getTypeList({ commit },item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v1/plugin-media/index-type`,{
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

export function getTypeListData({ commit }) {
  return new Promise((resolve, reject) => {
    api
      .get(`v1/plugin-media/type-list`)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
export function deleteTypeData({ commit },item) {
    return new Promise((resolve, reject) => {
      api
        .post(`v1/plugin-media/del-data`,item)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
}

export function editTypeData({ commit },item) {
    return new Promise((resolve, reject) => {
        var apiUrl = "v1/plugin-media";
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

export function getTypeItem({ commit },item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v1/plugin-media/view`,{
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
export function getMediaList({ commit },item) {
  return new Promise((resolve, reject) => {
    api.get(`v1/plugin-media`,{
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

export function editMediaData({ commit },item) {
  return new Promise((resolve, reject) => {
      var apiUrl = "v1/plugin-media";
      apiUrl +=
        parseInt(item.id) > 0 ? "/update-media?id=" + parseInt(item.id) : "/create-media";
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

export function deleteMediaData({ commit },item) {
  return new Promise((resolve, reject) => {
    api
      .post(`v1/plugin-media/del-media`,item)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getMediaItem({ commit },item) {
  return new Promise((resolve, reject) => {
    api
      .get(`v1/plugin-media/view-media`,{
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