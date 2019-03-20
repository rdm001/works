<template>
  <div id="app">
    <keep-alive :include="['Search','Home']">
      <router-view v-if="AuthConfig"></router-view>
    </keep-alive>
    <!-- <router-view v-if="!$route.meta.keepAlive"></router-view>-->
    <!--<tab-bar></tab-bar>-->
    <!--<div  v-if="!show1 || !show2" style="position: fixed;left:0;right:0;top:0;bottom:0;font-size:0.5rem;background: white;display: flex;align-items: center;justify-content: center;z-index: 100000001">系统维护中...</div>
    <div style="position: fixed;left:0;top:0;width: 1rem;height:1rem;z-index: 100000002" v-if="!show1 || !show2" @click="show1 = true"></div>
    <div style="position: fixed;right:0;bottom:0;width: 1rem;height:1rem;z-index: 100000002"
    v-if="!show1 || !show2" @click="show2 = true"></div>-->
  </div>
</template>

<script>
let checkToken = [
  "home",
  "spellgroup",
  "person",
  "shopcar",
  "spellgroupdetail",
  "person",
  "product",
  "myspell",
  "myorder",
  "orderdetail",
  "address",
  "confirmorder",
  "editaddress",
  "giftdetail",
  "giftexchange",
  "myticket"
];
import { mapMutations, mapGetters } from "vuex";
import tabBar from "./common/components/tabBar.vue";
import { TabItem, Toast } from "mint-ui";
import VuelazyLoad from "vue-lazyload";
import Vue from "vue";
import axios from "axios";
import router from "./router";
import md5 from "js-md5";
/*Vue.use(VuelazyLoad,{
      preLoad: 1,
      loading:require('./common/image/lazyload/loading.gif'),
    });*/
export default {
  name: "App",
  data() {
    return {
      show1: false,
      show2: false
    };
  },

  created() {
    let that = this;
    var userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.match(/mpbank/i) !== null) {
      //判断是否是app登录
      this.set_isApp(true);
    }

    //存储token
    if (localStorage.getItem("token")) {
      this.set_token(localStorage.getItem("token"));
    }

    //获取本地 购物车商品数据
     if(localStorage.getItem('shopCarProduct')){
      this.set_shopCarProduct(JSON.parse(localStorage.getItem('shopCarProduct')))
     }
    if (localStorage.getItem("user")) {
      this.set_user(JSON.parse(localStorage.getItem("user")));
      let user = JSON.parse(localStorage.getItem("user"));
      let CartProduct = localStorage.getItem("jf-shopCarProduct-" + user.id)
        ? localStorage.getItem("jf-shopCarProduct-" + user.id)
        : "[]";
      this.set_shopCarProduct(JSON.parse(CartProduct));
    }

    //获取siteId
    let siteId = this.$route.query.siteId;
    console.log(siteId);
    if (!siteId && localStorage.getItem("siteId")) {
      //如果路径上不存在 本地存在 从本地取
      this.set_siteId(localStorage.getItem("siteId"));
    } else {
      //否则从路径取
      this.set_siteId(siteId);
      localStorage.setItem("siteId", siteId);
    }
    if (userAgent.match(/mpbank/i) === null) {
      //判断是否是app登录
    /*  if ((this.siteId == 20 || this.siteId == 1) && !this.$route.query.auth) {
       window.location.href =
       "https://zhapp.whecb.com/hdpage/authLose/authLose.html";
       }*/
      if (this.siteId == 1) {
        /*var _hmt = _hmt || [];

        (function() {

          var hm = document.createElement("script");

          hm.src = "https://hm.baidu.com/hm.js?00535435cc4a9863cbb36ed0732cda15";

          var s = document.getElementsByTagName("script")[0];

          s.parentNode.insertBefore(hm, s);

        })();
*/
      }
    }
    //获取站点配置
    this.$http
      .post(
        this.$api.getSiteConfig,
        this.$until.getFormData({
          siteId: this.siteId
        })
      )
      .then(({ data }) => {
        if (!that.isApp) {
          //window.location.href = data.obj.mallSite.siteConfigJson.authShorUrl
        }
        this.set_AuthConfig(data.obj.mallSite.siteConfigJson);
        document.title = data.obj.mallSite.siteName;
        localStorage.setItem("siteConfig", JSON.stringify(data.obj.mallSite));
        localStorage.setItem("payWay", data.obj.mallSite.paywayConf);
        this.set_payWay(data.obj.mallSite.paywayConf);
        this.set_siteConfig(data.obj.mallSite);
        this.set_unit(data.obj.mallSite.cashUnit);
        localStorage.setItem("unit", data.obj.mallSite.cashUnit);
        Vue.filter("fulterUnit", function(value) {
          if (data.obj.mallSite.cashUnit == "￥") {
            return "￥" + value;
          } else {
            return value + data.obj.mallSite.cashUnit;
          }
        });

        if (!this.token) {
          this.$until.auth(data.obj.mallSite.siteConfigJson);
        }

        //axios全局拦截
        axios.interceptors.response.use(
          function(response) {
            if (response.data.code == 416) {
              let authUrl = that.$until.auth(data.obj.mallSite.siteConfigJson);
              that.set_authUrl(authUrl);
              if (!that.isApp) {
                //alert(that.authUrl)
               //that.$router.push("/home");
                Toast("请进入招行App查看");
              } else {
                //添加推荐人
                if(data.obj.mallSite.id === 20){
                    this.$http.get('https://mobile.cmbchina.com/PToolkit/Recommend/Recommend.aspx?recommendcode=504048')
                }

                window.location.href = that.authUrl;
              }
            }
            return response;
          },
          function(error) {
            return Promise.reject(error);
          }
        );

        let routePath = this.$route.path.substring(1).toLocaleLowerCase();

        if (checkToken.indexOf(routePath) >= 0)
          axios.post(
            "/api/checkToken",
            this.$until.getFormData({
              token: this.token ? this.token : ""
            })
          );
      });

    if (!this.isApp) {
      //如果不是app进入  打开app
      // window.location.href = 'https://t.cmbchina.com/amiqum'
    }
    /*if(this.$route.query.productId){
        this.$router.push('/productDetail/' + this.$route.query.productId)
    }*/

    // 全局配置分享信息
    /*
    if(siteId == 1){
      //https://zhapp.whecb.com/#/home?siteId=1&_k=3y69jc
      window.siteId = {
        home:{
          title:'“玩趣”商城',
          text:'专属礼包、品牌特惠',
          url:'http://zhapp.whecb.com/#/home?siteId=1?jump=app'
        },
        product:{
          url:'http://zhapp.whecb.com/#/product/'
        },
        spell:{
          url:"http://zhapp.whecb.com/#/spellGroupDetail/?siteId=1"
        }
      }
    }else{
      window.siteId = {
        home:{
          title:'“玩趣”商城',
          text:'专属礼包、品牌特惠',
          url:'http://m-test.ycb51.cn/app/#/home?siteId=1?jump=app'
        },
        product:{
          url:'http://m-test.ycb51.cn/app/#/product/'
        },
        spell:{
          url:"http://m-test.ycb51.cn/index/#/spellGroupDetail/?siteId=11"
        }
      }
    }
*/

    if (localStorage.getItem("payWay")) {
      this.set_payWay(localStorage.getItem("payWay"));
    }

    //跳转到砍价详情
    let recordsId = this.$route.query.recordsId;
    if (recordsId) {
      this.$router.push(`/spellGroupDetail?id=${recordsId}`);
    }

    /*//set_siteConfig
    if(localStorage.getItem('siteConfig')){
      this.set_siteConfig(JSON.parse(localStorage.getItem('siteConfig')))
    }*/
    if(JSON.parse(localStorage.getItem("user")).id == 877314 && JSON.parse(localStorage.getItem("user")).id == 775398){
       var v = new VConsole()
    }
  },
  watch: {
    $route() {
      //全局监控路由变化
    },
    AuthConfig(newVal) {
      /*if(newVal){
              this.authing(newVal)
            }*/
    }
  },
  methods: {
    ...mapMutations({
      set_siteId: "set_siteId",
      set_unit: "set_unit",
      set_token: "set_token",
      set_shopCarProduct: "set_shopCarProduct",
      set_payWay: "set_payWay",
      set_user: "set_user",
      set_siteConfig: "set_siteConfig",
      set_authUrl: "set_authUrl",
      set_isApp: "set_isApp",
      set_AuthConfig: "set_AuthConfig"
    })
  },
  computed: {
    ...mapGetters(["token", "siteId", "isApp", "authUrl", "AuthConfig"])
  },
  components: {
    tabBar
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import 'common/css/variable.styl'
html, body
  position fixed
  left 0
  top 0
  width 100%
  overflow auto
  .mint-msgbox
    transform none
    left 7.5%
    top 35%
    .mint-msgbox-btns
      width 100%
      overflow hidden
      .mint-msgbox-btn
        float left
        text-align center
#app
  min-height 100%
  background #eee
  .mint-header
    background white
    color black
    box-shadow 0 0 3px #ccc
    overflow hidden
    text-align center
    z-index 20
    .is-left
      float left
      .mintui-back
        font-size 0.6rem
    .is-right
      float right
    .mint-header-title
      display inline-block
      margin 0 auto
      height 100%
      line-height 40px
.topBar
  background url('./common/image/theme.jpg') no-repeat left top
  background-size 100% auto
  /* 组件部分样式兼容性处理 */
  /* .mint-header
    display block
  .mint-header-button.is-right
    width 2.5rem
    height 100%
    float right
  .mint-header-button.is-left
    width 2.5rem
    float left
    height 100%
  .mint-header-title
    height 100%
    width 4rem
    line-height 40px
    float left */
</style>
