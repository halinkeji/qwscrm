import Vue from 'vue'
import Vuex from 'vuex'

import mConsole from './module-console'
import settings from './module-settings'
import analysis from './module-analysis'
import tagviews from './module-tagviews'
import corp from './module-corp'
import contact from './contact/module-index'
import contactTag from './contact/module-tag'
import groupchat from './contact/module-groupchat'
import groupchatTag from './contact/module-groupchat-tag'
import worker from './module-worker'
import workerDepartment from './module-worker-department'
import workerTag from './module-worker-tag'
import pluginMedia from './plugins/module-media'
import user from './module-user'

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
      user,
      analysis,
      settings,
      mConsole,
      tagviews,
      corp,
      contact,
      contactTag,
      groupchat,
      groupchatTag,
      worker,
      workerDepartment,
      workerTag,
      pluginMedia,
     
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
