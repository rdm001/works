<template>
  <transition name="opacity">
    <div class="cateProducts">
      <!-- 顶部导航 -->
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="商品列表">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
        <mt-button  slot="right" @click="cateShow = true">分类</mt-button>
      </mt-header>

      <!-- 更多分类 -->
      <transition name="opacity">
        <div @click="cateShow = false" class="shadow" v-show="cateShow">
        </div>
      </transition>
      <transition name="moveRight">
        <scroll v-show="cateShow" class="more_classification">
          <ul>
            <li @click="catId = '';cateShow = false">全部</li>
            <li v-for="item in cateList" @click="catId = item.cateId">{{item.cateName}}</li>
          </ul>
        </scroll>
      </transition>

      <div style="position: relative;height:100%">

        <!-- 选项卡 -->
        <ul class="tabBar">
          <li @click="changeType(0)" :class="{active:type==0}">默认</li>
          <li @click="changeType(1)" :class="{active:type==1}">价格<i class="sortFont" :class="sort?'icon-sheng':'icon-jiang'"></i></li>
        </ul>

        <!-- 选项卡视图 -->
        <scroll :listenScroll="true" :listenTouchend="true" @touchEnd="downPullReload" :probeType="3" ref="scroll" @scroll="getNewData"class="scroll">
          <div class="view">
            <div class="reload" v-show="priceList.length&&defaultList.length">下拉刷新</div>
            <ul  v-show="type==0">
              <li  v-for="item,index in defaultList">
                <AllProductListItem :data="item" :unit="unit" :key="index" ></AllProductListItem>
              </li>
            </ul>
            <ul v-show="type == 1">
              <li  v-for="item,index in priceList">
                <AllProductListItem :data="item" :unit="unit" :key="index" ></AllProductListItem>
              </li>
            </ul>
            <div class="loadMore">{{type == 0 ? defaultLoadText : priceLoadText}}</div>
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
        cateList:[], //分类列表
        cateShow:this.$route.params.catId == -1,//分类显示隐藏
        type:'', //''为默认 ‘1’ 为积分
        defaultPage:0,  //默认 分页 当前页
        pricePage:0,    //积分 分页 当前页
        catId:this.$route.params.catId == -1 ? "" :this.$route.params.catId,  //初始化catId
        defaultList:[], //默认商品列表
        priceList:[],   //积分商品列表
        defaultLoadText:"正在加载",
        priceLoadText:'正在加载',
        defaultFlag:true, //控制商品列表请求多次触发
        priceFlag:true, //控制积分列表请求多次触发
        sort:false,     //排序方式 false为降序 true为升序   ‘asc升序’ ‘desc降序’
        priceFocus:false,   //积分tab 是否连点
        priceInit:true
      }
    },
    created(){
      if(this.siteConfig){
        this._initData()
        this._initCate()
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
        this.cateShow = false
        this.type = '' //重置数据
        this.defaultPage = 0 //重置数据
        this.pricepricePage = 0 //重置数据
        this.priceList = [] //重置数据
        this.defaultList = [] //重置数据
        this.defaultLoadText = '正在加载' //重置数据
        this.priceLoadText = '正在加载' //重置数据
        this.defaultFlag = true //重置数据
        this.priceFlag = true //重置数据
        this._initData()
      },
      siteConfig(){
        this._initData()
        this._initCate()
      },
    },
    methods: {
      _initCate(){
        //====================>获取所有分类
        this.$http.post(
          this.$api.cateList,
          this.$until.getFormData({siteId:this.siteId})
        ).then((res) => {
          this.cateList = res.data.obj.page.rows
        })
      },
      _initData(){
        this.resetData()
        //==========================> 初始化默认商品
        this.getNewPageData('default')
        //==================================>初始化商品
        this.getNewPageData('price')
      },
      resetData(){

        this.defaultPage = 0
        this.pricePage = 0
        this.defaultList = []
        this.priceList = []
        this.defaultFlag = true
        this.priceFlag = true
        this.defaultLoadText = '正在加载'
        this.priceLoadText = '正在加载'
      },
      getNewPageData(type){

        //===============>获取商品数据
        if (!this[type + 'Flag']) return //判断请求是否返回
        this[type + 'Flag'] = false
        this[type + 'Init'] = true
        // this[type + 'Init'] = false
        this.$http.post(
          this.$api.productList,
          this.formQuery(type)
        ).then((res) => {
          this[type + 'Init'] = false
          if(res.data.success){
            this[type + 'Page']++
            let oldData = this[type + 'List']
            let data = res.data.obj.page.rows
            this[type + 'List'] = oldData.concat(data);
            this.$nextTick(()=>{
              this.$refs.scroll.refresh()
            })
            if (!data.length || data.length < 10) {//如果返回的数据为空
              this[type + 'LoadText'] = '无更多数据'
              this[type + 'Flag'] = false   //已达到最后一页 禁止继续发送请求
              return
            }else{
              this[type + 'Flag'] = true   //不是最后一页 可继续发送请求
            }

          }else {
            //如果查询失败 可重新发送请求
            this[type + 'Flag'] = true
          }
        }).catch(() => {
          this[type + 'Flag'] = true
          this[type + 'Init'] = false
        })
      },
      getNewData(pos,maxY){
        if(pos && pos.y < maxY + GET_NEWDATA_Y) { //滑动到距离屏幕 固定距离时 获取新数据
          if (this.type == '') {
            this.getNewPageData('default')
          } else {
            this.getNewPageData('price')
          }
        }
      },
      downPullReload(pos,maxY){
        if(pos && pos.y >50){
          this._initData()
        }
      },
      changeType(type){
        this.type = type
        if(this.priceFocus&&type == 1&& !this.priceInit){
          this.sort = !this.sort //排序取反
          this.pricePage = 0 //重置数据
          this.priceList = [] //重置数据
          this.priceFlag = true
          this.priceLoadText = '正在加载'
          this.getNewPageData('price') //重新获取数据
        }else if(type == 1){
          //积分列表获取焦点
          this.priceFocus = true
        }else {
          //积分列表失去焦点
          this.priceFocus = false
        }
        this.$nextTick(()=>{
          this.$refs.scroll.refresh()
        })
      },
      formQuery(type){ //请求参数处理
        let query = {
          siteId: this.siteId,
          pageNo: this[type + 'Page'],
          px:type == 'default' ?'': 1,
          catId: this.catId,
          desc:this.sort ? 'asc' : 'desc'
        }
        return this.$until.getFormData(query)
      }
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

  .cateProducts
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
      z-index:31;
    .more_classification
      position fixed
      left 3rem
      top 0
      right 0
      bottom 0
      overflow hidden
      background white
      z-index 32
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
      fullScreen(1rem,0,0,0)
      overflow hidden
      .loadMore
        loadMore()
      .reload
        reload()

</style>
