import Vue from 'vue'


const _ = require('lodash')

import { date } from 'quasar'
Vue.prototype.$q_date = date

import localeText from '../assets/ag-grid/localeText.json'
Vue.prototype.$ag_grid_localeText = localeText

import hlPagination from '../components/hl-pagination.vue'
Vue.component('hl-pagination', hlPagination)

import uploadImg from '../components/upload-components/imgList.vue'
Vue.component('upload-img', uploadImg)

import hlEditor from '../components/hl-editor/index.vue'
Vue.component('hl-editor', hlEditor)

import hlAddress from '../components/hl-address/index.vue'
Vue.component('hl-address', hlAddress)

import hlQqMap from '../components/hl-qq-map/index.vue'
Vue.component('hl-qq-map', hlQqMap)

import hlFileUpload from '../components/upload-components/fileUpload.vue'
Vue.component('hl-file-upload', hlFileUpload)

import hlContactLists from '../components/hl-contact-lists/index.vue'
Vue.component('hl-contact-lists', hlContactLists)

import hlWorkerLists from '../components/hl-worker-lists/index.vue'
Vue.component('hl-worker-lists', hlWorkerLists)

// 新增表格重写组件
import hlTable from '../components/hl-table.vue'
Vue.component('hl-table', hlTable)

// 新增的关于框架的基本设置
import SideMenu from '../components/SideMenu.vue'
Vue.component('SideMenu', SideMenu)
import PageTagViews from '../components/PageTagViews.vue'
Vue.component('PageTagViews', PageTagViews)
import BrandColor from '../components/BrandColor.vue'
Vue.component('BrandColor', BrandColor)
import Breadcrumb from '../components/Breadcrumb.vue'
Vue.component('Breadcrumb', Breadcrumb)

import QrcodeVue from 'qrcode.vue'
Vue.component('qrcode-vue', QrcodeVue)

import JsonViewer from 'vue-json-viewer'
Vue.component('vue-json-viewer', JsonViewer)
