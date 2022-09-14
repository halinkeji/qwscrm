import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import oauth from './oauth-wx'
import serviceLog from './service-log'
import storeManage from './store-manage'
import siteManage from './site-manage'
import billManage from './bill-manage'
import eventManage from './event-manage'
import contract from './contract'
import contact from './contact'
import upload from './upload'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      oauth,
      serviceLog,
      storeManage,
      siteManage,
      billManage,
      contract,
      eventManage,
      contact,
      upload
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
