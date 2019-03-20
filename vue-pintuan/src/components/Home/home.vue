<template>
    <div class="home">
      <scroll class="scroll"  :listenScroll="true" :probeType="3" ref="scroll" @scroll="getNewProduct">
        <div class="scrollWrap">
          <mt-header  class="topBar" style="font-size: 0.4rem" :title="siteConfig ? siteConfig.siteName :'首页'">
              <div v-if="isApp" @click="closeApp" slot="left">
                <mt-button icon="back"></mt-button>
              </div>
           <!-- <div  slot="right" class="share" @click="share">

            </div>
-->
          </mt-header>


           <mt-swipe :auto="3000" :prevent="true" class="swipe" v-show="siteId != 31 && siteId != 32">
                <mt-swipe-item v-for="item,index in bannerList" :key="index">
                  <img @click="href(item.url)" class="bannerImg" :src="item.photoUrl" alt="">
                </mt-swipe-item>
            </mt-swipe>

          <!-- 分类 -->
          <div class="classification" v-if="siteId == 1" >
            <div class="item" @click="$router.push(item.path)" :class="{border:index%4 == 3}" v-for="item,index in zhappList">
              <img :src="item.imgUrl" alt="">
              <div style="text-align: center">{{item.text}}</div>
            </div>
          <!--  <a href="http://m-test1.ycb51.cn/apps/scratchablelatex/#/home?siteId=11" class="item">
              <img src='./image/icon_more.png' alt="">
              <div style="text-align: center">抽奖</div>
            </a>-->
            <!--<div class="item" @click="goCate(item.showType)"  v-for="item,index in advertList">
              <img v-lazy="item.photoUrl" alt="">
              <div style="text-align: center">{{item.name}}</div>
            </div>
            <div @click="goCate(-1)" class="item" >
              <img src='./image/icon_more.png' alt="">
              <div style="text-align: center">更多分类</div>
            </div>

            <div @click="$router.push('/preferential')" class="item">
              <img src='./image/icon_more.png' alt="">
              <div style="text-align: center">特惠商品</div>
            </div>-->
          </div>

    <!-- <div class="classification" v-if="siteId != 1 && siteId != 28">
            <div class="item" @click="goCate(item.showType)"  v-for="item,index in advertList">
              <img :src="item.photoUrl" alt="">
              <div style="text-align:center">{{item.name}}</div>
            </div>
          <div @click="$router.push('/spellGroup')" class="item" >
              <img src='./image/icon_more.png' alt="">
              <div style="text-align: center">砍价</div>
            </div>
            <div @click="goCate(-1)" class="item" >
              <img src='./image/icon_more.png' alt="">
              <div style="text-align: center">更多分类</div>
            </div>
          </div>-->


          <!-- 特惠秒杀 -->
          <div class="hotPreferential" v-if="preferential.length && siteId != 31 && siteId != 32">
            <div class="title preferential"> <span class="more" @click="$router.push('/preferential')">更多秒杀</span> </div>
            <div>
              <isHotProduct class="homeHot" :key="index" :data="item" :unit="unit" v-for="item,index in preferential"></isHotProduct>
            </div>
          </div>


          <!-- 分类主题 -->
          <div class="recom"  v-if="recomList.length && siteId != 31 && siteId != 32">
            <div class="title rec"></div>
            <ul>
              <li v-for="item in recomList"  @click="goRecom(item)" >
                <img :src="item.photoUrl"  alt="" >
              </li>
            </ul>
          </div>

          <div class="selectGood"  >
            <div class="title select"></div>
            <div v-if="!productList.length && siteId == 31 " style="font-size:0.4rem;text-align: center;line-height: 0.8rem;background: white">当前暂无砍价活动，更多活动，敬请期待</div>
            <div v-if="!productList.length && siteId == 32" style="font-size:0.4rem;text-align: center;line-height: 0.8rem;background: white">当前暂无拼团活动，更多活动，敬请期待</div>
            <div class="homeproductList" v-if="productList.length">
              <AllProductListItem :data="item" :unit="unit" :key="index"  v-for="item,index in productList">

              </AllProductListItem>
                <!--
                  <SpellListItem v-if="item.activityType == 2"  :data="item" :unit="unit"></SpellListItem>
                  <PreferentialListItem v-else-if="item.activityType == 1"  :data="item" :unit="unit"></PreferentialListItem>
                  <ProductListItem v-else  :data="item" :unit="unit"></ProductListItem>
                -->


<!--
              <component :is="item.activityType == 1 ? 'PreferentialListItem' :  'ProductListItem'"  :key="index"  v-for="item,index in productList"  :data="item" :unit="unit"></component>
-->
<!--
              <product @click.native="$router.push('/productDetail/'+item.id)" v-for="item,index in productList" :key="index" :data="item" :unit="unit"></product>
-->
            </div>
          </div>
          <div class="load_more" v-if="productList.length">{{loadState}}</div>
        </div>
      </scroll>
      <spellAddress  v-if="spellInfo.showAddress"></spellAddress>
      <tabBar></tabBar>
    </div>
</template>
<script type='text/javascript'>
    import { Swipe,Toast, SwipeItem } from 'mint-ui';
    import Vue from 'vue'
    import  Scroll from '@/common/components/scroll'
    import  tabBar from '@/common/components/tabBar'
    import  AllProductListItem from '@/common/components/AllProductListItem'
    import  isHotProduct from '@/common/components/isHotProduct'
    import  spellAddress from '@/common/components/spellAddress'
    import {mapGetters} from 'vuex'
    /*import Swiper from 'swiper';*/
    const GET_NEWDATA_Y = 200  //什么时候获取新商品列表
    export default {
        name:'Home',
        data() {
            return {
              zhappList:[
                {
                    imgUrl:require('./image/father.png'),
                    path:'/father?id=144',
                    text:'亲子乐园'
                },

                {
                  imgUrl:require('./image/xy.png'),
                  path:'/father?id=49',
                  text:'玩趣黄石'
                },
                {
                  imgUrl:require('./image/yc.png'),
                  path:'/father?id=145',
                  text:'玩趣宜昌'
                },
                {
                  imgUrl:require('./image/hg.png'),
                  path:'/father?id=48',
                  text:'玩趣襄阳'
                }/*,
                {
                  imgUrl:require('./image/Preferential.png'),
                  path:'/spellgroup',
                  text:'砍价'
                }*/
              ],   //分类
              advertList:[],
              bannerList:[],
              recomList:[],
              cateList:[], //所有分类列表
              page:0,
              productList:[],  //推荐商品
              loadState:'正在加载',
              moreProduct:true,   //是否有更多商品数据
              advertId:-1,
              title:'',
              httpFlag:false,
              preferential:[]
            }
        },
        mounted(){
            //  console.log(this.$refs)
        },

        watch:{
            $route(){
              this.$nextTick(()=>{
                this.$refs.scroll.refresh()
              })
            }
        },
        created(){
          this._initData()
        },
        methods: {
          _initData(){
            //=========>获取推荐特惠商品
            this.$http.post(
              this.$api.productList,
              this.$until.getFormData({
                    siteId: this.siteId,
                    activityType:1,
                    page: 0,
                    isHot:1
                  })
            ).then(({data}) => {
               if(data.success){
              let arr = data.obj.page.rows.slice(0,3);
              this.preferential = arr
            }
            })
              //==========================>初始化分类
              this.$http.post(
                this.$api.advertList+'?siteId='+this.siteId
              ).then((res) => {
                  let data = res.data.obj.page.rows

                    data.forEach((e) =>{
                      //数据分类
                      if(e.type == 1){
                        this.bannerList.push(e)
                      }else if(e.type == 2&&e.showType==1){
                        this.recomList.push(e)
                      }else if(e.type == 3){
                            this.advertList.push(e)
                      }
                    })
                  this.$nextTick(()=>{
                    this.$refs.scroll.refresh()
                  })
                  let ids = data.filter(e => e.type == 2 && e.showType == 2)
                  this.advertId = ids.length ? ids[0].id : false
                  if(!this.advertId) return
                    //==========================>初始化推荐商品
                    this.httpFlag = true
                    this.getProductList()
              })


          },
          getNewProduct(pos,maxY){  //====================>分页获取商品列表
              if(pos && pos.y < maxY + GET_NEWDATA_Y){ //滑动到距离屏幕 固定距离时 获取新数据
                this.getProductList()
              }
          },
          getProductList(){
            if(!this.advertId) {return}
            if(!this.moreProduct) return  //如果没有更多数据
            this.moreProduct = false  // 请求完成之前 禁止发送请求
            if(!this.httpFlag) return
            this.httpFlag = false
            let page = this.page
            this.$http.post(
              this.$api.productList,
              this.$until.getFormData({ siteId:this.siteId , advertId:this.advertId , pageNo:page})
            ).then((res) => {
              this.httpFlag = true
              if(res.data.success){
                this.page++;
                let oldData = this.productList
                let data = res.data.obj.page.rows
                if( !data.length|| data.length < 10 ){//如果返回的数据为空
                  this.moreProduct = false  //禁止再次发送请求
                  this.loadState = '无更多数据'
                  if(!data.length) {
                    this.moreProduct = false
                    return
                  }
                }
                this.productList = oldData.concat(data)
                this.$nextTick(()=>{
                  this.$refs.scroll.refresh()
                })
              }


              //如果请求完成并且 数据不为空 启用请求接口
              this.moreProduct = true

            }).catch(() => { this.moreProduct = true ; this.httpFlag = true})
          },
          goRecom(item){
              if(item.url){
                window.location.href = item.url
              }else{
                this.$router.push({path:'/advert/' + item.id})
              }

          },
          compare(property){
            return function(a,b){
              var value1 = a[property];
              var value2 = b[property];
              return value1 - value2;
            }
          },
          goCate(id){
            this.$router.push({path:'/cateProducts/'+ id})
          },
          href(url){
            window.location.href = url
          },
          closeApp(){
            var isiPhone = navigator.userAgent.match(/(iPhone|iPod)/i) != null;
            if(isiPhone){
              location.href = "http://cmbiphone/tool";
            }else{
              location.href = "http://cmbandroid/tool";
            }
          },
          share(){
              window.location.href = `http://cmbls/socialshare?id=mpBank&channel=defaultWithNoSMS&type=url&title=222&text=aaa&picurl=XXX&url=https://t.cmbchina.com/amiqum`
          }
        },

        computed:{
          ...mapGetters(['siteId','unit','siteConfig','isApp','spellInfo','token'])
        },
        components:{
          Scroll,
          AllProductListItem,
          spellAddress,
          tabBar,isHotProduct
        }
    }
</script>
<style lang='stylus' type='text/css' rel="stylesheet/stylus">
  @import "../../common/css/variable.styl"
  @import "../../common/css/tabBarIconFont/iconfont.css"
  .home
    background #eee
    position:absolute
    top 0
    bottom 0
    left 0
    right 0
    /*padding-bottom 1.5rem*/
    .scroll
      fullScreen(0,0,1.5rem,0)
      position fixed
      .share
        height 40px
        background url("../../common/image/icon-share.png") no-repeat right center
        background-size 0.5rem auto
      .swipe
        width 100%
        height 4.48rem
        .bannerImg
          width 100%
          height 100%
      .classification
        overflow hidden
        width 100%
        background white
        .item
          width 25%
          height 2.65rem
          float left
          font-size 0.4rem
          font-family '黑体'
          box-sizing border-box
          border-bottom 1px solid #eee
          border-right 1px solid #eee
          &.border
            border-right none
          img
            display block
            padding-top 0.3rem
            width 1.2rem
            height:1.2rem
            margin 0 auto 0.25rem
      .title
        position relative
        width 100%
        margin-top 0.3rem
        height 1rem
        box-sizing border-box
        line-height 1rem
        padding 0 0.1rem
        font-size:0.4rem
        border-bottom 1px solid #ededed
        &.select
          background white url("./image/title-product.png") no-repeat center
          background-size auto 0.5rem

        &.preferential
          background white url("./image/title-Preferential.png") no-repeat center
          background-size auto 0.5rem
          margin 0
          .more
            float right
            padding-right 0.5rem
            line-height 1rem
            font-size 0.3rem
            font-family '黑体'
            background url("../../common/image/icon_arrow_right.png") no-repeat right center
            background-size 0.3rem auto
        &.rec
          background white url("./image/title-recom.png") no-repeat center
          background-size auto 0.5rem
      /*  &::before
          content ''
          position absolute
          left: 0.3rem
          width 0.6rem
          height 0.6rem
          top 50%
          margin-top -0.3rem*/
      .hotPreferential
        overflow hidden
        background white
        margin 0.3rem auto
        .homeHot
          float left
          margin 0.4rem 0
          margin-left 0.25rem
      .recom
        background white
        img
          width 100%
          height 4rem
          margin 0 0 0.3rem
      .selectGoods
        width 100%
      .homeproductList
        overflow hidden
        li
          margin-top 0.2rem
          &:nth-child(odd)
            float left
          &:nth-child(even)
            float right
      .load_more
        loadMore()

</style>
