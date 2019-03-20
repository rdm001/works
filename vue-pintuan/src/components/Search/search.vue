<template>
  <div class="search">

    <!--  搜索栏 -->
    <div class="search_bar">
      <div class="back" @click="$router.go(-1)"></div>
      <div class="input_wrap">
        <input type="text" @focus="searchFocus = true" @blur="searchFocus = false" placeholder="请输入商品名" v-model="itemName" class="input">
        <i class="close" v-show="itemName!='' && searchFocus" @click="itemName = ''"></i>
      </div>
      <div class="search_btn" @click="Submit">搜索</div>
    </div>


    <!-- 选项卡 -->
    <ul class="tabBar">
      <li @click="changeType(0)" :class="{active:type==0}">默认</li>
      <li @click="changeType(1)" :class="{active:type==1}">价格<i class="sortFont" :class="sort?'icon-sheng':'icon-jiang'"></i></li>
      <li class="filter" @click="filterToggle = true">筛选 <i class="icon_filter"></i></li>
    </ul>

    <!-- 选项卡视图 -->
    <scroll :listenScroll="true" :listenTouchend="true" @touchEnd="downPullReload" :probeType="3" ref="scroll" @scroll="getNewData" class="scroll">
      <div class="view">
        <div class="reload" v-show="priceList.length&&defaultList.length">下拉刷新</div>
        <ul  v-show="type==0">
          <li  v-for="(item,index) in defaultList" :key="item.id">
            <AllProductListItem :data="item" :unit="unit" :key="index" ></AllProductListItem>

          </li>
        </ul>
        <ul v-show="type==1">
          <li  v-for="(item,index) in priceList" :key="item.id">
            <AllProductListItem :data="item" :unit="unit" :key="index" ></AllProductListItem>
<!--
            <component :is="item.activityType == 1 ? 'PreferentialListItem' :  'ProductListItem'"  :data="item" :unit="unit"></component>
-->
          </li>
        </ul>
        <div class="load_more">{{type == 0 ? defaultLoadText : priceLoadText}}</div>
      </div>
    </scroll>


    <!-- 底部选项卡 -->
    <!--<mt-tabbar class="mt-tabbar" v-model="activeRouter">
      <mt-tab-item id="/home">
        <div class=" iconfont icon-weibiao"></div>
        主页
      </mt-tab-item>

      <mt-tab-item id="/search">
        <div class="iconfont icon-sousuo"></div>
        搜索
      </mt-tab-item>
      <mt-tab-item id="/shopCar">
        <div class=" iconfont icon-gouwuche"></div>
        购物车
      </mt-tab-item>
      <mt-tab-item id="/person">
        <div class=" iconfont icon-geren"></div>
        我的
      </mt-tab-item>
    </mt-tabbar>-->

    <transition name="opacity">
      <div class="shadow" name="opacity" v-show="filterToggle" @click="filterToggle=false"></div>
    </transition>

    <spellAddress  v-if="spellInfo.showAddress"></spellAddress>
    <!-- 筛选条件列表 -->
    <transition name="moveRight">
      <scroll class="filterScroll" ref="filter" v-show="filterToggle">
        <div class="filter_wrap"  >
          <div class="row">
            <div class="filter_title">
              <!-- <span>商品名称：</span> -->
              <input type="text" placeholder="请输入商品名称" v-model="itemName" @blur="getBrandList" class="input">
            </div>
          </div>

          <div class="row">
            <div class="filter_title">
              价格区间：
            </div>
            <div class="wrap">
              <input type="text" placeholder="最低价" class="input price" v-model="startPrice">
              <span style="line-height: 0.8rem;padding: 0 0.2rem;color:#ddd">——</span>
              <input type="text" placeholder="最高价" v-model="endPrice" class="input price">
            </div>
          </div>

          <div class="row">
            <div class="filter_title">
              商城：<span class="activeFilter">{{activeShop}}</span>
              <i class="icon_down" @click="shopSlideDown = !shopSlideDown" :class="{up:shopSlideDown}"></i>
            </div>
            <div class="wrap" :style="{height:shopSlideDown?'auto':'0.95rem'}">
              <span class="shops"  @click="selectShop(-1)" :class="{active:!shop.length}" >全部商城</span>
              <span class="shops"  @click="selectShop(item)" :class="{active:shop.indexOf(item) != -1}" v-for="item in shops">{{item.name}}</span>
            </div>
          </div>

          <div class="row">
            <div class="filter_title">
              分类：<span class="activeFilter">{{activeCate}}</span>
              <i class="icon_down" @click="cateSlideDown = !cateSlideDown" :class="{up:cateSlideDown}"></i>
            </div>
            <div class="wrap" :style="{height:cateSlideDown?'auto':'0.95rem'}">
              <span class="shops"  @click="actCate(item.cateId)" :class="{active:item.cateId == cateId}" v-for="item in cateList">{{item.cateName}}</span>
            </div>
          </div>

          <div class="row">
            <div class="filter_title">
              品牌：<span class="activeFilter">{{brandName?brandName:'全部品牌'}}</span>
              <i class="icon_down" @click="brandSlideDown = !brandSlideDown" :class="{up:brandSlideDown}"></i>
            </div>
            <div class="wrap" :style="{height:brandSlideDown?'auto':'0.95rem'}">
              <span class="shops"  @click="brandName = ''" :class="{active:brandName == ''}" >全部品牌</span>
              <span class="shops"  @click="brandName = item" :class="{active:brandName==item}" v-for="item in brandList" :key=item.id>{{item}}</span>
            </div>
          </div>
          <div class="btn_wrap">
            <div class="reset" @click="reset">重置</div>
            <div class="submit" @click="Submit">确定</div>
          </div>
        </div>

      </scroll>

    </transition>
    <div class="tip">

    </div>
    <!--<tabBar></tabBar>-->
  </div>
</template>

<script>
  import { Navbar, TabItem } from 'mint-ui';
  import Scroll from '@/common/components/scroll'
  import tabBar from '../../common/components/tabBar'
  import  spellAddress from '@/common/components/spellAddress'
  import {mapGetters,mapMutations} from 'vuex'
  const GET_NEWDATA_Y = 200
  import  AllProductListItem from '@/common/components/AllProductListItem'
  export default{
    name:'Search',
    data(){
      return {
        showTips:true,
        activeRouter:this.$route.fullPath,
        searchFocus:false,
        filterToggle:false, //筛选列表显示
        cateList:[],  //商品分类列表
        cateSlideDown:false,  //是否展开分类列表
        brandSlideDown:false, //品牌列表是否展开
        brandList:[],//选中品牌列表
        type:'',   //''为默认 ‘1’ 为排序
        defaultPage:0,  //默认 分页 当前页
        pricePage:0,    //排序 分页 当前页
        defaultList:[], //默认商品列表
        priceList:[],   //排序商品列表
        defaultLoadText:"正在加载",
        priceLoadText:'正在加载',
        defaultFlag:true, //控制商品列表请求多次触发
        priceFlag:true, //控制排序列表请求多次触发
        sort:false,     //排序方式 false为降序 true为升序   ‘asc升序’ ‘desc降序’
        priceFocus:false,   //排序tab 是否连点
        itemName:"", //搜索关键字，必填
        cateId:"", //分类id
        startPrice:"",//起始价格
        endPrice:"",//结束价格
        brandName:"",//
        shop:[], //选中商城
        shopSlideDown:false,  //商城下拉显示
        component:"",

        shops:[  //全部商城列表
          {
            name: "京东商城",
            source: 1
          },
          {
            name: "线下供应商",
            source: 2
          },
          {
            name: "苏宁易购",
            source: 3
          },
          {
            name: "网易严选",
            source: 4
          }
        ],
        scrollY:0,
        priceInit:false
      }

    },
    created(){
      if(this.siteConfig){
        this._initData()
        this._initCate()
      }
    },
    watch:{
      $route(){
        this.$nextTick(()=>{
          this.$refs.scroll.refresh()
        })
        let Y = this.scrollY
        this.$refs.scroll.scrollTo(0,Y,0)
      },
      siteConfig(){
        this._initData()
        this._initCate()
      },
      type(){

      },
      cateList(){this.$nextTick(() => this.$refs.filter.refresh())},
      cateSlideDown(){this.$nextTick(() => this.$refs.filter.refresh())},
      brandSlideDown(){this.$nextTick(() => this.$refs.filter.refresh())},
      brandList(){this.$nextTick(() => this.$refs.filter.refresh())},
      shop(){this.$nextTick(() => this.$refs.filter.refresh())},
      filterToggle(){this.$nextTick( () => {this.$refs.filter.refresh()})}
    },
    methods:{
      reset(){
        this.brandList = []
        this.shop = []
        this.cateId = ""
        this.brandName = ""
        this.brandList = []
        this.startPrice = ""
        this.endPrice = ""
        this.itemName = ""
      },
      Submit(){
        this.type = ""
        this.defaultPage = 0
        this.pricePage = 0
        this.defaultLoadText = '正在加载'
        this.priceLoadText = '正在加载'
        this.defaultFlag = true
        this.priceFlag = true
        this.defaultList = []
        this.priceList = []
        //==============>提交数据前初始化部分数据
        this._initData()
        this.filterToggle = false
      },
      _initCate(){
        //====================>获取所有分类
        this.$http.post(
          this.$api.cateList,
          this.$until.getFormData({siteId:10})
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
      actCate(id){
        if(this.cateId == id){
          this.cateId = ""
          return
        }
        this.cateId = id
      },
      getNewData(pos,maxY){//======================>获取新数据
        this.scrollY = pos.y
        if(pos && pos.y < maxY + GET_NEWDATA_Y) { //滑动到距离屏幕 固定距离时 获取新数据
          if (this.type == '') {
            this.getNewPageData('default')
          } else {
            this.getNewPageData('price')
          }
        }
      },
      downPullReload(pos,maxY){
        if(pos && pos.y > 50){

          this._initData()
        }
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
          this.$api.advance,
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

      selectShop(shop){
        //筛选商城
        if(shop == -1){
          //如果点击全部
          //则删除所有选中
          this.shop = []
          return
        }
        let index = this.shop.indexOf(shop)
        if(index != -1){
          //是否已选中 如果已选中 取消相互
          this.shop.splice(index,1)
        }else{
          //如果未选中 则选中
          this.shop.push(shop)
        }
      },
      changeType(type){
        this.type = type
        if(this.priceFocus&&type == 1 && !this.priceInit){
          this.sort = !this.sort //排序取反
          this.pricePage = 0 //重置数据
          this.priceList = [] //重置数据
          this.priceFlag = true
          this.priceLoadText = '正在加载'
          this.getNewPageData('price') //重新获取数据
        }else if(type == 1){
          //排序列表获取焦点
          this.priceFocus = true
        }else {
          //排序列表失去焦点
          this.priceFocus = false
        }
        this.$nextTick(()=>{
          this.$refs.scroll.refresh()
        })
      },
      formQuery(type){ //请求参数处理
        let query = {
          siteId:this.siteId, //站点id，必填
          itemName:this.itemName, //搜索关键字，必填
          catId:this.cateId,//分类id
          startPrice:this.startPrice/this.siteConfig.cashRate,//起始价格
          endPrice:this.endPrice/this.siteConfig.cashRate,//结束价格
          source:this.source,//商品渠道id（多选英文逗号分隔）
          brandName:this.brandName,//
          px:type == 'default' ?'': 1, //是否是排序查询
          pageNo:this[type + 'Page'],//页码
          desc:this.sort ? 'asc' : 'desc'
        }
        return this.$until.getFormData(query)
      },
      getBrandList(){
        if(this.itemName == '') return
        //=========================>获取品牌列表
        this.$http.post(
          this.$api.brandList,
          this.$until.getFormData({siteId:this.siteId,itemName:this.itemName})
        ).then((res) => {
          if(res.data.success){
            this.brandList = res.data.obj.brandList
          }

        })
      }
    },
    computed:{
      activeShop(){
        //选中的渠道
        let shop = []
        for(let i = 0;i < this.shop.length ; i++){
          shop.push(this.shop[i].name)
        }
        if(!shop.length){
          return '全部商城'
        }
        this.$nextTick(() => this.$refs.filter.refresh());
        return shop.join(',')
      },
      activeCate(){
        //选中的分类
        let actCate = {}
        for(let i = 0;i < this.cateList.length ; i++){
          if(this.cateList[i].cateId == this.cateId){
            actCate = this.cateList[i]
          }
        }
        return actCate ? actCate.cateName : ""
      },
      source(){
        //商品渠道id（多选英文逗号分隔）
        let shop = []
        for(let i = 0;i < this.shop.length ; i++){
          shop.push(this.shop[i].source)
        }
        if(!shop.length){
          return ''
        }
        return shop.join(',')
      },

      ...mapGetters(['siteId','siteConfig','unit','spellInfo'])
    },
    components:{
      Navbar,
      TabItem,
      Scroll,AllProductListItem,
      tabBar,spellAddress
    }
  }
</script>

<style type='text/css' lang='stylus' rel='stylesheet/stylus'>
  @import "../CateProducts/iconfont/iconfont.css"
  @import "../../common/css/tabBarIconFont/iconfont.css"
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"
  .search
    .mt-tabbar
      height 1.5rem
      .iconfont
        padding-top 0.1rem
        font-size 0.5rem
        margin-bottom 0.2rem
      .mint-tab-item-label
        font-size 0.3rem
        color rgb(148, 148, 148)
    .tabBar
      position relative
      width 100%
      background white
      font-size 0.4rem
      height 1rem
      border-bottom 0.5px solid #ccc
      z-index:10;
      li
        float left
        width 3.8rem
        position relative
        height 1rem
        line-height 1rem
        text-align center
        .sortFont
          display inline-block
          width 0.5rem
          height 0.5rem
      .active
        color $color-theme
      .active::after
        content:''
        position absolute
        left 0
        bottom 0
        width 100%
        border-bottom 2px solid $color-theme
      .filter
        width 2rem
        position relative
        font-size 0.35rem
        &::after
          content ''
          position absolute
          left 0
          top 50%
          margin-top -0.3rem
          width 0.5px
          height 0.6rem
          background #ccc
        .icon_filter
          display inline-block
          vertical-align middle
          width 0.45rem
          height 0.45rem
          background url('./image/filter.png') no-repeat center center
          background-size 100% 100%
    .scroll
      position fixed
      top 2.2rem
      bottom 0
      overflow hidden
      left 0
      right 0
    .search_bar
      box-sizing border-box
      width 100%
      height 1.2rem
      line-height 0.2rem
      padding 0.2rem 0
      .back
        width 1.2rem
        height 100%
        float left
        background url("./image/back.png") no-repeat center center
        background-size 0.6rem 0.6rem
      .input_wrap
        float left
        position relative
        width 70%
        box-sizing border-box
        border-radius 0.5rem
        padding 0 0.6rem 0 0.9rem
        background white url("./image/search.png") no-repeat 0.3rem center
        background-size 0.4rem 0.4rem
        .input
          height 0.8rem
          width 100%
          font-size 0.4rem
        .close
          width 0.6rem
          height 0.8rem
          position absolute
          top 0
          right 0
          background url("./image/close.png") no-repeat center center
          background-size 0.4rem 0.4rem
      .search_btn
        float left
        width 1.5rem
        height 0.8rem
        line-height 0.8rem
        font-size 0.4rem
        text-align center
    .load_more
      loadMore()
    .reload
      reload()
    .shadow
      fullScreen(0,0,0,0)
      background rgba(0,0,0,0.7)
      z-index:12;
    .filterScroll
      padding 0.5rem 0 2rem
      fullScreen(0,0,0,2rem)
      background white
      z-index 13
      .row
        padding 0.4rem 0.3rem
        border-bottom 0.5px solid #ddd
        .filter_title
          position relative
          font-size 0.35rem
          line-height 0.5rem
          padding-right: 0.5rem;
          .icon_down
            position absolute
            right 0
            top 0
            float right
            width 0.5rem
            height 0.5rem
            background url("./image/down.png") no-repeat center
            background-size 0.5rem 0.5rem
            transition transform 0.3s linear
            &.up
              transform rotateZ(180deg)
        .wrap
          margin 0.4rem 0 0
          overflow hidden
        .activeFilter
          font-size 0.25rem
          color #ff5000
        .input
          box-sizing border-box
          background #f2f2f2
          padding 0 0.5rem
          border-radius 4px
          width 5rem
          height 0.8rem
          text-align center
          &.price
            width 3rem
        .shops
          float left
          width 2.3rem
          height 0.8rem
          margin 0.15rem 0.15rem 0 0
          line-height 0.8rem
          text-align center
          border-radius 0.1rem
          background #f2f2f2
          &.active
            background #ff5000
            color white
      .btn_wrap
        overflow hidden
        height 1.8rem
        padding 0.5rem 0
        background white
        margin  0 auto
        .reset,.submit
          float left
          width 2rem
          text-align center
          height 0.8rem
          line-height 0.8rem

          color white
        .reset
          margin-left 2rem
          border-top-left-radius 0.5rem
          border-bottom-left-radius 0.5rem
          background url("./image/btn_bg.png") no-repeat left top
        .submit
          border-top-right-radius 0.5rem
          border-bottom-right-radius 0.5rem
          background-color $color-theme


</style>

