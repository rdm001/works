<template>
  <div class="mt-tabbar" v-show="show">
    <div class="mt-tab-item"  :class="{selected:actRoute.indexOf('/home') >-1}"  @click="checked('/home')">
      <div class="mt-tab-item-label">
        <div class="iconBar icon-weibiao"></div>
        <p style="text-align: center">主页</p>
      </div>
    </div>

    <div class="mt-tab-item"  :class="{selected:actRoute.indexOf('/search') >-1}"  @click="checked('/search')">
      <div class="mt-tab-item-label">
        <div class="iconBar icon-sousuo"></div>

        <p style="text-align: center">搜索</p>
      </div>
    </div>

    <!--<div class="mt-tab-item"  :class="{selected:actRoute.indexOf('/shopCar') >-1}"  @click="checked('/shopCar')">
      <div class="mt-tab-item-label">
        <div class=" iconBar icon-gouwuche">
          <div class="shopNum" v-show="shopCarProduct.length">{{shopCarProduct.length}}</div>
        </div>
        <p style="text-align: center">购物车</p>
      </div>
    </div>-->
    <div class="mt-tab-item"  :class="{selected:actRoute.indexOf('/person') >-1}"  @click="checked('/person')">
      <div class="mt-tab-item-label">
        <div class="iconBar icon-geren"></div>
        <p style="text-align: center">订单</p>
      </div>
    </div>

    <!--  <mt-tab-item id="/search" :class="{selected:act=='/search'}"  @click.native="checked('/search')">
        <div class="iconBar icon-sousuo"></div>
        搜索
      </mt-tab-item>-->
    <!-- <mt-tab-item id="/shopCar" :class="{selected:act=='/shopCar'}"  @click.native="checked('/shopCar')">
       <div class=" iconBar icon-gouwuche">
         <div class="shopNum" v-show="shopCarProduct.length">{{shopCarProduct.length}}</div>
       </div>
       购物车
     </mt-tab-item>-->
    <!-- <mt-tab-item  id="/person" :class="{selected:act=='/person'}"  @click.native="checked('/person')">
       <div class="iconBar icon-geren"></div>
       我的
     </mt-tab-item>-->
  </div>
</template>
<script type='text/javascript'>
  import {mapGetters,mapMutations} from 'vuex'
  import { Tabbar, TabItem } from 'mint-ui';
  export default {
    data(){
      return {
        activeRouter:"",
        show:true,
        actRoute:'',
       
      }
    },
    created(){
      this.activeRouter = this.$route.fullPath
      this.set_show(this.activeRouter)
    },
    update(){
      this.activeRouter = this.$route.fullPath
    },
    watch:{
      $route(newVal){
        let path = newVal.fullPath
        this.actRoute = path
        console.log(this.actRoute)
        this.set_show(path)
      },

      activeRouter(newVal){
        this.actRoute = newVal
        this.$router.push(newVal)
      },
    },
    methods: {
      set_show(path){
        if(path.indexOf('/home') > -1 ||
          path.indexOf('/search') > -1||
          path.indexOf('/shopCar') > -1||
          path.indexOf('/person') > -1
        ){

          this.show = true
        }else{
          this.show = false
        }
      },
      checked(item){
        if(item ==  this.activeRouter){
          this.$router.push(item)
        }
        this.activeRouter = item
      }
    },
    computed:{
      ...mapGetters(['shopCarProduct','unit'])
    },
    components:{
      Tabbar,
      TabItem
    }

  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../css/tabBarIconFont/iconfont.css"
  .mt-tabbar
    height 1.5rem
    background-image: -webkit-gradient(linear,left top, left bottom,from(#d9d9d9),color-stop(50%, #d9d9d9),color-stop(0, transparent));
    background-image: linear-gradient(180deg,#d9d9d9,#d9d9d9 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-color: #fafafa;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    text-align: center;
    .mt-tab-item
      width 33.33%
      float left
      height 100%
    .selected
      background  #eaeaea
    .iconBar
      padding-top 0.1rem
      font-size 0.5rem
      margin 0 auto 0.2rem
      width 0.5rem
    .mt-tab-item-label
      padding-top 0.2rem
      position relative
      font-size 0.3rem
      color rgb(148, 148, 148);
      .icon-gouwuche
        position relative
        .shopNum
          position absolute
          min-width 0.2rem
          height 0.4rem
          line-height 0.4rem
          padding 0 0.1rem
          top -0.1rem
          left 0.3rem
          background red
          color white
          font-size 0.25rem
          border-radius 0.25rem
</style>
