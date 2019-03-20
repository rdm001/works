// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'babel-polyfill'  //es6转义工具
import Vue from 'vue'
import store from './store/index.js'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import axios from 'axios'

import apis from './common/js/services'
import 'lib-flexible/flexible.js' //淘宝适配
import untils from './common/js/unitls'  //导入公共库
import './common/css/reset.css'
Vue.config.productionTip = false
Vue.prototype.$until = untils //全局注册until方法
Vue.prototype.$api = apis  //全局注册api
/*FastClick.attach(document.body) //绑定FastClick*/
Vue.prototype.$http = axios //全局注册axios
import Mint from 'mint-ui';
import 'mint-ui/lib/style.min.css'
Vue.use(Mint); //注册mint-UI组件库

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

/**
router.afterEach( ( to, from, next ) => {
  setTimeout(()=>{
          var _hmt = _hmt || [];
          (function() {
            console.log('武汉招行百度统计...')
              //每次执行前，先移除上次插入的代码
              document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?00535435cc4a9863cbb36ed0732cda15";
              hm.id = "baidu_tj"
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
          })();
  },0);
} );
 */