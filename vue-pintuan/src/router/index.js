import Vue from 'vue'
import store from '../store/index'
import axios from 'axios'
import until from '../common/js/unitls'
import Router from 'vue-router'
import Home from '@/components/Home/home'
import Login from '@/components/Login/login'
import Search from '@/components/Search/search'
import CateProducts from '@/components/CateProducts/CateProducts'
import Person from '@/components/Person/person'
import MyOrder from '@/components/myOrder/myOrder'
import Address from '@/components/Address/address'
import EditAddress from '@/components/EditAddress/editAddress'
import ProductDetail from '@/components/ProductDetail/productDetail'
import ShopCar from '@/components/ShopCar/shopCar'
import ConfirmOrder from '@/components/ConfirmOrder/confirmOrder'
import OrderDetail from '@/components/OrderDetail/OrderDetail'
import Logistics from '@/components/logistics/Logistics'
import PaySuccess from '@/components/PaySuccess/paySuccess'
import Advert from '@/components/advertProduct/advertProduct'
import virtualCode from '@/components/virtualCode/virtualCode'
import myTicket from '@/components/myTicket/myTicket'
import Gift from '@/components/Gift/Gift'
import GiftDetail from '@/components/GiftDetail/GiftDetail'
import GiftExchange from '@/components/GiftExchange/GiftExchange'
import Preferential from '@/components/preferential/preferential'
import Wish from '@/components/Wish/Wish'
import Father from '@/components/Father/Father'
import SpellGroup from '@/components/SpellGroup/SpellGroup'
import SpellGroupDetail from '@/components/SpellGroupDetail/SpellGroupDetail'
import MySpell from '@/components/MySpell/MySpell'
import Watermelonfrom from '@/components/Watermelonfrom/Watermelonfrom'
import Watermelonfrom2 from '@/components/Watermelonfrom/Watermelonfrom2'
import Watermelonfrom4 from '@/components/Watermelonfrom/Watermelonfrom4'
import Watermelonfrom5 from '@/components/Watermelonfrom/Watermelonfrom5'
import Watermelonfrom6 from '@/components/Watermelonfrom/Watermelonfrom6'
import specialExchange from '@/components/specialExchange/specialExchange'
import GroupBuyGoodsDetail from '@/components/GroupBuyGoodsDetail/GroupBuyGoodsDetail'
import GroupBuyDetail from '@/components/GroupBuyDetail/GroupBuyDetail'
import myGroupBuy from '@/components/myGroupBuy/myGroupBuy'
import zlHome from '@/components/zlHome/zlHome'
import zlCustomer from '@/components/zlHome/zlCustomer'
import myGift from '@/components/zlHome/myGift'

import zlHome2 from '@/components/zlHome2/zlHome'
import zlCustomer2 from '@/components/zlHome2/zlCustomer'
import myGift2 from '@/components/zlHome2/myGift'

import zlHome3 from '@/components/zlHome3/zlHome'
import zlCustomer3 from '@/components/zlHome3/zlCustomer'
import myGift3 from '@/components/zlHome3/myGift'
import zlHome4 from '@/components/zlHome4/zlHome'
import zlCustomer4 from '@/components/zlHome4/zlCustomer'
import myGift4 from '@/components/zlHome4/myGift'


import zlHome5 from '@/components/zlHome5/zlHome'
import zlCustomer5 from '@/components/zlHome5/zlCustomer'
import myGift5 from '@/components/zlHome5/myGift'

import zlHome6 from '@/components/zlHome6/zlHome'
import zlCustomer6 from '@/components/zlHome6/zlCustomer'
import myGift6 from '@/components/zlHome6/myGift'


Vue.use(Router)

let router = new Router({
  // mode: 'history',
  routes: [{
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        isLogin: false,
        checkToken: false
      }
    },
    {
      path: '/cateProducts/:catId',
      name: 'CateProducts',
      component: CateProducts,
      meta: {
        isLogin: false,
        checkToken: true
      }
    },
    {
      path: '/specialExchange/:id',
      name: 'specialExchange',
      component: specialExchange,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {
        isLogin: false,
        checkToken: true
      }
    },
    {
      path: '/person',
      name: 'Person',
      component: Person,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        isLogin: false,
        checkToken: false
      }
    },
    {
      path: '/myOrder',
      name: 'MyOrder',
      component: MyOrder,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/address',
      name: 'Address',
      component: Address,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/editAddress',
      name: 'EditAddress',
      component: EditAddress,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    { //落地页进入商城 重定向
      path: '/product/:id',
      redirect: '/ProductDetail/:id'
    },
    {
      path: '/ProductDetail/:id',
      name: 'ProductDetail',
      component: ProductDetail,
      meta: {
        isLogin: false,
        checkToken: true
      }
    },
    {
      path: '/GroupBuyGoodsDetail/:id',
      name: 'GroupBuyGoodsDetail',
      component: GroupBuyGoodsDetail,
      meta: {
        isLogin: false,
        checkToken: true
      }
    },
    {
      path: '/groupBuyDetail',
      name: 'GroupBuyDetail',
      component: GroupBuyDetail,
      meta: {
        isLogin: false,
        checkToken: true
      }
    },
    {
      path: '/myGroupBuy',
      name: 'myGroupBuy',
      component: myGroupBuy,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/confirmOrder',
      name: 'ConfirmOrder',
      component: ConfirmOrder,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/shopCar',
      name: 'ShopCar',
      component: ShopCar,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail,
      meta: {
        isLogin: true,
        checkToken: false
      }
    },
    /*{  //一网通返回地址重定向
      path:'/pay/success',
      redirect: '/paySuccess'
    },*/
    {
      path: '/pay/success',
      name: 'PaySuccess',
      component: PaySuccess,
      meta: {
        isLogin: false
      }
    },
    {
      path: '/logistics/:outTradeNo/:source',
      name: 'Logistics',
      component: Logistics,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/advert/:advertId',
      name: 'Advert',
      component: Advert,
      meta: {
        isLogin: false,
        checkToken: false
      }
    },
    {
      path: '/virtualCode',
      name: 'virtualCode',
      component: virtualCode,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/myTicket',
      name: 'myTicket',
      component: myTicket,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/Gift',
      name: 'Gift',
      component: Gift,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/GiftDetail/:id',
      name: 'GiftDetail',
      component: GiftDetail,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/GiftExchange',
      name: 'GiftExchange',
      component: GiftExchange,
      meta: {
        isLogin: true,
        checkToken: true
      }
    },
    {
      path: '/preferential',
      name: 'preferential',
      component: Preferential,
      meta: {
        isLogin: false,
        checkToken: true
      }
    },
    {
      path: '/father',
      name: 'father',
      component: Father,
      meta: {
        isLogin: false,
        checkToken: false
      }
    },
    {
      path: '/wish',
      name: 'wish',
      component: Wish,
      meta: {
        isLogin: false,
        checkToken: false
      }
    },
    {
      path: '/spellgroup',
      name: 'SpellGroup',
      component: SpellGroup,
      meta: {
        isLogin: false,
        checkToken: false
      }
    },
    {
      path: '/SpellGroupDetail',
      name: 'SpellGroupDetail',
      component: SpellGroupDetail,
      meta: {
        isLogin: false,
        checkToken: true
      }
    },
    {
      path: '/mySpell',
      name: 'MySpell',
      component: MySpell,
      meta: {
        isLogin: false,
        checkToken: true,
      }
    },
    {
      path: '/watermelonfrom',
      name: 'Watermelonfrom',
      component: Watermelonfrom,
      meta: {
        isLogin: false,
        checkToken: true,
      }
    },
    {
      path: '/watermelonfrom2',
      name: 'Watermelonfrom2',
      component: Watermelonfrom2,
      meta: {
        isLogin: false,
        checkToken: true,
      }
    },
    {
      path: '/watermelonfrom4',
      name: 'Watermelonfrom4',
      component: Watermelonfrom4,
      meta: {
        isLogin: false,
        checkToken: true,
      }
    },
    {
      path: '/Watermelonfrom5',
      name: 'Watermelonfrom5',
      component: Watermelonfrom5,
      meta: {
        isLogin: false,
        checkToken: true,
      }
    },
    {
      path: '/Watermelonfrom6',
      name: 'Watermelonfrom6',
      component: Watermelonfrom6,
      meta: {
        isLogin: false,
        checkToken: true,
      }
    },
    {
      path: '/zlHome',
      name: 'zlHome',
      component: zlHome,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlCustomer',
      name: 'zlCustomer',
      component: zlCustomer,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/myGift',
      name: 'myGift',
      component: myGift,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlHome2',
      name: 'zlHome2',
      component: zlHome2,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlCustomer2',
      name: 'zlCustomer2',
      component: zlCustomer2,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/myGift2',
      name: 'myGift2',
      component: myGift2,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlHome3',
      name: 'zlHome3',
      component: zlHome3,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlCustomer3',
      name: 'zlCustomer3',
      component: zlCustomer3,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/myGift3',
      name: 'myGift3',
      component: myGift3,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlHome4',
      name: 'zlHome4',
      component: zlHome4,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlCustomer4',
      name: 'zlCustomer4',
      component: zlCustomer4,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/myGift4',
      name: 'myGift4',
      component: myGift4,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlHome5',
      name: 'zlHome5',
      component: zlHome5,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlCustomer5',
      name: 'zlCustomer5',
      component: zlCustomer5,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/myGift5',
      name: 'myGift5',
      component: myGift5,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlHome6',
      name: 'zlHome6',
      component: zlHome6,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/zlCustomer6',
      name: 'zlCustomer5',
      component: zlCustomer6,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '/myGift6',
      name: 'myGift6',
      component: myGift6,
      meta: {
        isLogin: false,
        checkToken: false,
      }
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
// ===========> vue-router 全局拦截

router.beforeEach((to, from, next) => {
  //console.log(to)
  if (to.path && _hmt) {
    _hmt.push(['_trackPageview', '/#' + to.fullPath]);
  }
  if (to.path == '/login') {
    localStorage.setItem('history', from.fullPath)
  }

  if ((!localStorage.getItem('token') && to.meta.isLogin) && to.meta.checkToken) {

    //如果本地存储没有token 且需要登录
    // window.location.href = store.state;

    /*let siteId;
    if(to.query.siteId) {
      siteId = to.query.siteId
      next('/login?siteId=' + siteId)
      return
    }
    next('/login')
    return*/
  }
  if (to.meta.checkToken) {
    axios.post(
      '/api/checkToken',
      until.getFormData({
        token: store.state.token ? store.state.token : ''
      })
    )
  }
  next()
})

export default router
