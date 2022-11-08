
import { jsonp } from "vue-jsonp";

export function TMap(key) {
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(qq); //注意这里
    };
    var script = document.createElement("script");
    script.type = "text/javascript";

    script.src =
      "https://map.qq.com/api/js?v=2.exp&libraries=place&callback=init&key=" +
      key;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
export function getMapAddress(key, lat, lng) {
  return new Promise(function(resolve, reject) {
    var locationdata = lat + "," + lng; //纬度，经度

    jsonp(
      "https://apis.map.qq.com/ws/geocoder/v1?&poi_options=address_format=short&get_poi=0",
      {
        key: key,
        location: locationdata,
        output: "jsonp"
      }
    )
      .then(json => {
        resolve(json);
      })
      .catch(err => {
        reject(err);
      });
  });
}
