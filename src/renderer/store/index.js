import Vue from 'vue'
import Vuex from 'vuex'

import {
  createPersistedState,
  createSharedMutations
} from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(),
    // 多进程之间共享状态，但会导致 vue 无法共享状态的问题
    // 详见网友 https://yq.aliyun.com/articles/702886
    //createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production'
})