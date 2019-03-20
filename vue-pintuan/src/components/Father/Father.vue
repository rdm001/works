<template>
  <transition name="opacity">
    <div class="advertProducts">
      <!-- 顶部导航 -->
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" :title="title">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>
      <div style="position: relative;height:100%">
        <!-- 选项卡 -->
        <!--<ul class="tabBar">
          <li @click="changeType(0)" :class="{active:type==0}">默认</li>
          <li @click="changeType(1)" :class="{active:type==1}">价格<i class="sortFont" :class="sort?'icon-sheng':'icon-jiang'"></i></li>
        </ul>-->
        <!-- 选项卡视图 -->
        <scroll :listenScroll="true" :listenTouchend="true" @touchEnd="downPullReload" :probeType="3" ref="scroll" @scroll="getNewData"class="scroll">
          <div class="view">
            <img :src="banner" style="width: 100%" class="banner" alt="">
            <!--    <div class="reload" v-show="priceList.length&&defaultList.length">下拉刷新</div>-->
            <ul  v-show="type==0">
              <li  v-for="item,index in defaultList">
                <AllProductListItem :data="item" :unit="unit" :key="index" ></AllProductListItem>
              </li>
            </ul>

            <div class="loadMore">{{defaultLoadText }}</div>
          </div>
        </scroll>
      </div>

      <spellAddress  v-if="spellInfo.showAddress"></spellAddress>

    </div>
  </transition>

</template>
<script type='text/javascript'>
  const GET_NEWDATA_Y = 200  //什么时候获取新商品列表
  import  Scroll from '@/common/components/scroll'
  import {mapGetters} from 'vuex'
  import  AllProductListItem from '@/common/components/AllProductListItem'
  import  spellAddress from '@/common/components/spellAddress'

  export default {
    data() {
      return {
        type:'', //''为默认 ‘1’ 为积分
        defaultPage:0,  //默认 分页 当前页
        defaultList:[], //默认商品列表
        defaultLoadText:"正在加载",
        defaultFlag:true, //控制商品列表请求多次触发
        sort:false,     //排序方式 false为降序 true为升序   ‘asc升序’ ‘desc降序’
        advertId:this.$route.query.id ? this.$route.query.id : 0,
        title:'',
        banner:''
      }
    },
    created(){
        let id = this.$route.query.id
      if(id == 144){
          this.title = '亲子乐园'
          this.banner = require('./image/PreferentialBanner.jpg')
      }else if(id == 49){
        this.title = '玩趣黄石'
        this.banner = require('./image/PreferentialBanner.jpg')
      }else if(id == 145){
        this.title = '玩趣宜昌'
        this.banner = require('./image/PreferentialBanner.jpg')
      }else if(id == 48){
        this.title = '玩趣襄阳'
        this.banner = require('./image/PreferentialBanner.jpg')
      }

      if(this.siteConfig){
        this._initData()
      }
    },
    watch:{
      type(){
        this.$nextTick(() => {
          //滑动scroll 使懒加载图片刷新
          this.$refs.scroll.scrollTo(0,-1,16)
        })
      },
      catId(newVal){
        this.type = '' //重置数据
        this.defaultPage = 0 //重置数据
        this.defaultList = [] //重置数据
        this.defaultLoadText = '正在加载'//重置数据
        this.defaultFlag = true//重置数据
        this._initData()
      },
      siteConfig(){
        this._initData()
      }
    },
    methods: {
      _initData(){
        this.defaultPage = 0
        this.defaultList = []
        this.defaultFlag = true
        this._initAdvertId()
      },
      _initAdvertId(){
        //如果是从专题页面进入

        this.defaultFlag = false
        this.defaultLoadText = '正在加载'
        this.$http.post(
          this.$api.productList,
          this.$until.getFormData({
            siteId: this.siteId,
            pageNo: this.defaultPage,
            advertId: this.advertId
          })
        ).then((res) => {
          if(res.data.success){
            this.defaultPage++
            let oldData = this.defaultList
            let data = res.data.obj.page.rows
            if (!data.length || data.length < 10) {//如果返回的数据为空
              this.defaultLoadText = '无更多数据'
              if(!data.length) {
                this.defaultFlag = false
                return
              }
            }
            this.defaultList = oldData.concat(res.data.obj.page.rows)
            this.$nextTick(()=>{
              this.$refs.scroll.refresh()
            })
          }

          //如果请求完成并且 数据不为空 启用请求接口
          this.defaultFlag = true

        }).catch(() => {
          this.defaultFlag = true
        })

      },
      getNewData(pos,maxY){
        if(pos && pos.y < maxY + GET_NEWDATA_Y) { //滑动到距离屏幕 固定距离时 获取新数据

          this.getDefaultData()

        }
      },
      downPullReload(pos,maxY){
        if(pos && pos.y > 50){
          this._initData()
        }
      },
      getDefaultData(){
        //===============>获取默认商品数据
        if (!this.defaultFlag) return
        this.defaultFlag=false
        this.$http.post(
          this.$api.productList,
          this.$until.getFormData({
            siteId: this.siteId,
            pageNo: this.defaultPage,
            advertId:this.advertId
          })
        ).then((res) => {
          if(res.data.success){
            this.defaultPage++
            let oldData = this.defaultList
            let data = res.data.obj.page.rows
            this.defaultList = oldData.concat(res.data.obj.page.rows)
            this.$nextTick(()=>{
              this.$refs.scroll.refresh()
            })
            if (!data.length|| data.length < 10) {//如果返回的数据为空
              this.defaultFlag = false  //禁止再次发送请求
              this.defaultLoadText = '无更多数据'
              return
            }
          }

          //如果请求完成并且 数据不为空 启用请求接口
          this.defaultFlag = true
        }).catch(() => {
          this.defaultFlag = true
        })
      },


    },
    computed:{
      ...mapGetters(['siteId','siteConfig','unit','spellInfo'])
    },
    components:{
      Scroll,AllProductListItem,spellAddress
    }


  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "./iconfont/iconfont.css"
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"

  .advertProducts
    fullScreen(0,0,0,0)
    padding-top 40px
    .topBar
      background $color-theme
    .shadow
      position fixed
      left 0
      bottom 0
      top 0
      right 0
      background rgba(0,0,0,0.7)
      z-index:11;
    .more_classification
      position fixed
      left 3rem
      top 0
      right 0
      bottom 0
      overflow hidden
      background white
      z-index 11
      ul
        min-height 100%
        padding-left  1rem
        li
          border-bottom 0.5px solid #eee
          height 1rem
          line-height 1rem
          font-size 0.4rem
    .tabBar
      position relative
      display flex
      width 100%
      background white
      font-size 0.4rem
      height 1rem
      box-shadow 0 0 5px #ccc
      z-index:10;
      li
        position relative
        width 50%
        height 1rem
        line-height 1rem
        text-align center
      .active
        color $color-theme
      .active::after
        content:''
        position absolute
        left 0
        bottom 0
        width 100%
        border-bottom 2px solid $color-theme
      .sortFont
        display inline-block
        width 0.5rem
        height 0.5rem
    .scroll
      fullScreen(0,0,0,0)
      overflow hidden
      .loadMore
        loadMore()
      .reload
        reload()

</style>
