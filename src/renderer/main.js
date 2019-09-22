import Vue from 'vue'
import axios from 'axios'

import App from './App'
import store from './store'

//////////////////////////////////////////////////////

import 'iview/dist/styles/iview.css'
import iView from 'iview'
Vue.use(iView)

//////////////////////////////////////////////////////

// codemirror
import 'codemirror/lib/codemirror.css'
import VueCodemirror from './components/vue-codemirror'
Vue.use(VueCodemirror)

//////////////////////////////////////////////////////

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http = Vue.prototype.$http = axios

Vue.prototype.$config = require('../config');

Vue.config.productionTip = false

new Vue({
  components: {
    App
  },
  store,
  template: '<App/>'
}).$mount('#app')