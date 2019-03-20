// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../build/flexible.js'
import './css/reset.css'
import $ from 'jquery'
import axios from 'axios'
Vue.prototype.$http = axios
//axios.defaults.baseURL = 'https://gdwx.whecb.com'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.min.css'
Vue.use(Mint)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
