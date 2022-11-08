import Vue from 'vue'
import Vuex from 'vuex'

import mConsole from './module-console'
import settings from './module-settings'
import analysis from './module-analysis'
import tagviews from './module-tagviews'

import corp from './module-corp'
import provider from './module-provider'
import providerSuite from './module-provider-suite'
import contact from './contact/module-index'
import contactTag from './contact/module-tag'
import contactField from './contact/module-field'
import groupchat from './contact/module-groupchat'
import groupchatTag from './contact/module-groupchat-tag'
import worker from './module-worker'
import workerDepartment from './module-worker-department'
import workerTag from './module-worker-tag'
import pluginMedia from './plugins/module-media'
import user from './module-user'
import agent from './module-agent'

import eventManage from './event-manage'
import contract from './contract'
import siteManage from './site-manage'
import billManage from './bill-manage'
import storeManage from './store-manage'
import serviceLog from './service-log'

import image from './file/image'
import group from './file/group'
import upload from './upload'

import role from './role'

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
      provider,
      providerSuite,
      contact,
      contactTag,
      groupchat,
      groupchatTag,
      worker,
      workerDepartment,
      workerTag,
      pluginMedia,
      contactField,

      eventManage,
      contract,
      siteManage,
      billManage,
      storeManage,
      serviceLog,

      image,
      group,
      upload,
      role,

      agent

    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
