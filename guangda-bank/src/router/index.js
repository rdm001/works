import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import signIn from '@/pages/signIn'
import prize from '@/pages/prize'
import shopping from '@/pages/shopping'

Vue.use(Router)

export default new Router({
  routes: [
   {path: '/',redirect:'/signIn'},
   {path: '/signIn',component:signIn},
   {path: '/prize',component:prize},
   {path: '/shopping',component:shopping}
  ]
})
