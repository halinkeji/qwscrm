<template>
  <div class="row">
    <div class="col col-md-4 q-pa-xs">
      <q-select
        :outlined="outlined"
        :dense="dense"
        v-model="page_province"
        :options="provinceOptions"
        option-value="code"
        option-label="value"
        map-options
        label="省"
        @input="getCity"
      />
    </div>
    <div class="col col-md-4 q-pa-xs">
      <q-select
        :outlined="outlined"
        :dense="dense"
        v-model="page_city"
        :options="cityOptions"
        option-value="code"
        option-label="value"
        map-options
        label="市"
        @input="getArea"
      />
    </div>
    <div class="col col-md-4 q-pa-xs">
      <q-select
        :outlined="outlined"
        :dense="dense"
        v-model="page_area"
        :options="districtOptions"
        option-value="code"
        option-label="value"
        map-options
        label="区"
        @input="getDistrict"
      />
    </div>
  </div>
</template>
<script>
import districts from './districts'
export default {
  props: {
    province: {
      type: String,
      default: '北京市'
    },
    city: {
      type: String,
      default: '北京市'
    },
    area: {
      type: String,
      default: '东城区'
    },
    dense: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    watch (v) {
      console.log('woshiceshi', v)
    },
    province (v) {
      const provinceOptions = this.provinceOptions
      if (v) {
        this.page_province = this.mapDistrictsValue(provinceOptions, v)

        this.cityOptions = this.mapDistrictsData(
          districts[this.page_province.code]
        )
      }
    },
    city (v) {
      const cityOptions = this.cityOptions
      if (v) {
        this.page_city = this.mapDistrictsValue(cityOptions, v)
        this.districtOptions = this.mapDistrictsData(
          districts[this.page_city.code]
        )
      }
    },
    area (v) {
      const districtOptions = this.districtOptions
      if (v) {
        this.page_area = this.mapDistrictsValue(districtOptions, v)
      }
    }
  },
  data () {
    return {
      provinceOptions: [],
      cityOptions: [],
      districtOptions: [],
      page_province: '',
      page_city: '',
      page_area: ''
    }
  },
  created () {
    const provinceOptions = this.mapDistrictsData(districts[100000])
    this.provinceOptions = provinceOptions
  },
  mounted () {
    this.changeProvince(this.province)
    this.$nextTick(() => {
      this.changeCity(this.city)
      this.$nextTick(() => {
        this.changeArea(this.area)
      })
    })
  },
  methods: {
    getCity (val) {
      this.$emit('province', val)
      this.cityOptions = this.mapDistrictsData(districts[val.code])
    },
    getArea (val) {
      this.$emit('city', val)
      this.districtOptions = this.mapDistrictsData(districts[val.code])
    },
    getDistrict (val) {
      this.$emit('area', val)
    },
    mapDistrictsValue (ob, va) {
      let nowData = {}
      _.forEach(ob, function (value, key) {
        if (value.value == va) {
          nowData = value
        }
      })
      return nowData
    },
    mapDistrictsData (ob) {
      const data = []
      _.mapKeys(ob, function (value, key) {
        return data.push({
          value: value,
          code: key
        })
      })
      return data
    },
    changeProvince (v) {
      const provinceOptions = this.provinceOptions
      if (v) {
        this.page_province = this.mapDistrictsValue(provinceOptions, v)

        this.cityOptions = this.mapDistrictsData(
          districts[this.page_province.code]
        )
      }
    },
    changeCity (v) {
      const cityOptions = this.cityOptions
      if (v) {
        this.page_city = this.mapDistrictsValue(cityOptions, v)
        this.districtOptions = this.mapDistrictsData(
          districts[this.page_city.code]
        )
      }
    },
    changeArea (v) {
      const districtOptions = this.districtOptions
      if (v) {
        this.page_area = this.mapDistrictsValue(districtOptions, v)
      }
    }
  }
}
</script>
