import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import oauth from './oauth-wx'
import eventManage from './event-manage'
import contact from './contact'
import upload from './upload'

import member from './member'

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

      eventManage,
      contact,
      upload,

      member
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
