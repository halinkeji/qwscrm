import Vue from 'vue'

import { date } from 'quasar'
Vue.prototype.$q_date = date

import hlPagination from '../components/hl-pagination.vue'
Vue.component('hl-pagination', hlPagination)

import hlAddress from '../components/hl-address/index.vue'
Vue.component('hl-address', hlAddress)

import uploadImage from '../components/upload/img.vue'
Vue.component('hl-upload-image', uploadImage)

import QrcodeVue from 'qrcode.vue'
Vue.component('qrcode-vue', QrcodeVue)
