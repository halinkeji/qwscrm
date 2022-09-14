import Vue from 'vue'

const _ = require('lodash')

import hlContactLists from '../components/hl-contact-lists/index.vue'
Vue.component('hl-contact-lists', hlContactLists)

import hlFileUpload from '../components/upload-components/fileUpload.vue'
Vue.component('hl-file-upload', hlFileUpload)

import hlUploadImage from '../components/upload-components/img.vue'
Vue.component('hl-upload-image', hlUploadImage)
