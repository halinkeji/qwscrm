import Vue from "vue";

import { AgGridVue } from "ag-grid-vue";
import "../../node_modules/ag-grid-community/dist/styles/ag-grid.css";
import "../../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";
Vue.component("ag-grid-vue", AgGridVue); //ag-grid表格

var _ = require("lodash");

import { date } from "quasar";
Vue.prototype.$q_date = date;


import localeText from "../assets/ag-grid/localeText.json"
Vue.prototype.$ag_grid_localeText = localeText;


import hlPagination from '../components/hl-pagination.vue'
Vue.component('hl-pagination', hlPagination)

import uploadImg from "../components/upload-components/imgList.vue";
Vue.component("upload-img", uploadImg);

import hlEditor from "../components/hl-editor/index.vue";
Vue.component("hl-editor", hlEditor);

import hlAddress from "../components/hl-address/index.vue";
Vue.component("hl-address", hlAddress);

import hlQqMap from "../components/hl-qq-map/index.vue";
Vue.component("hl-qq-map", hlQqMap)

// 新增表格重写组件
import hlTable from '../components/hl-table.vue'
Vue.component('hl-table', hlTable)

// 新增的关于框架的基本设置
import SideMenu from "../components/SideMenu.vue";
Vue.component("SideMenu", SideMenu);
import PageTagViews from "../components/PageTagViews.vue";
Vue.component("PageTagViews", PageTagViews);
import BrandColor from "../components/BrandColor.vue";
Vue.component("BrandColor", BrandColor);
import Breadcrumb from "../components/Breadcrumb.vue";
Vue.component("Breadcrumb", Breadcrumb);
