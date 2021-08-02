<template>
  <!-- <q-dialog v-model="mapDialog" @hide="closeMap" class="z-top"> -->
  <q-card
    :style="{
      width: this.$q.screen.width * 0.6 + 'px',
      'min-width': this.$q.screen.width * 0.6 + 'px'
    }"
    flat
    class="rounded-borders"
  >
    <div class="row q-pa-sm">
      <div class="col-12 col-md-4">
        <q-input
          outlined
          bottom-slots
          v-model="addressText"
          label="搜索地址"
          clearable
          type="text"
          name="place"
          ref="placeAddressText"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="place" />
          </template>
          <template v-slot:hint>
            {{ addressInfo.address }}-经度:{{
              addressInfo.ad_info.location.lng
            }},纬度:{{ addressInfo.ad_info.location.lat }}
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-4" v-if="addressInfo"></div>
    </div>
    <div
      class="asdasdasas"
      id="container"
      :style="{
        height: this.$q.screen.height * 0.3 + 'px'
      }"
    ></div>

     <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
  </q-card>
  <!-- </q-dialog> -->
</template>

<script>
import { TMap, getMapAddress } from "./qqmap";
export default {
  data() {
    return {
      key: "65JBZ-RKICX-BKY4X-7VRVT-QNPK7-FVFL4",
      addressInfo: {
        ad_info: {
          location: {}
        }
      },
      addressText: "",
      mapDialog: true,
      visible:false
    };
  },
  created: function() {},
  mounted() {
    
  },

  methods: {
    modelMap(lat, lng) {
      this.visible = true
      // this.mapDialog = true;
      let lats = lat ? lat : 39.98412;
      let lngs = lng ? lng : 116.307484;

      this.addressInfo.ad_info.location.lat = lats;
      this.addressInfo.ad_info.location.lng = lngs;
      setTimeout(() => {
        this._TMap(lats, lngs);
      }, 1000);
    },
    closeMap() {
      this.mapDialog = false;
    },
    _TMap(lat, lng) {
      var that = this;
      TMap(that.key)
        .then(qq => {
          var center = new qq.maps.LatLng(lat, lng);

          //定义map变量，调用 TMap.Map() 构造函数创建地图
          var map = new qq.maps.Map(document.getElementById("container"), {
            center: center, //设置地图中心点坐标
            zoom: 13 //设置地图缩放级别
          });
           that.visible = false
          var ap = new qq.maps.place.Autocomplete(
            this.$refs.placeAddressText.$refs.input
          );

          var searchService = new qq.maps.SearchService({
            complete: function(results) {
              if (results.type === "CITY_LIST") {
                searchService.setLocation(results.detail.cities[0].cityName);
                searchService.search(keyword);
                return;
              }
              var pois = results.detail.pois;
              var latlngBounds = new qq.maps.LatLngBounds();
              for (var i = 0, l = pois.length; i < l; i++) {
                var poi = pois[i];
                latlngBounds.extend(poi.latLng);
                var marker = new qq.maps.Marker({
                  map: map,
                  position: poi.latLng
                });

                marker.setTitle(poi.name);
              }
              map.fitBounds(latlngBounds);
            },
            source: function(request, response) {
              console.log("request", request);
            }
          });

          //添加监听事件
          new qq.maps.event.addListener(map, "click", function(event) {
            var latLng = event.latLng;
            var lat = latLng.getLat().toFixed(5);
            var lng = latLng.getLng().toFixed(5);

            that.getMapAddressPage(that.key, lat, lng);
          });
          var keyword = "";
          new qq.maps.event.addListener(ap, "confirm", function(res) {
            that.addressText = res.value;
            keyword = res.value;
            searchService.search(keyword);
          });
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getMapAddressPage(key, lat, lng) {
      getMapAddress(key, lat, lng)
        .then(res => {
          this.addressInfo = res.result;

          this.$emit("getAddressInfo", this.addressInfo);
          console.log("res", res);
        })
        .catch(err => {
          console.log("err", err);
        });
    }
  }
};
</script>
