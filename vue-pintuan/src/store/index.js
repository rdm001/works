/**
 * Created by Administrator on 2018/5/25.
 */
import Vue from 'vue'
import VueX from 'vuex'
 Vue.use(VueX)
import  * as actions from './actions'
import  * as getters from './getters'
import  state from './state'
import  * as mutations from './mutations'
import  createLogger from 'vuex/dist/logger'

//是dev环境 还是production 环境
const debug = process.env.Node_env !== 'production'
export default new VueX.Store({
  actions,
  getters,
  state,
  mutations,
  strick:debug,  //开启vuex 严格模式
  plugins:debug ? [createLogger()] : []
})
