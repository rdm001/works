<template>
  <transition name="opacity">
    <div class="spellGroup" v-show="show" >
      <!-- 顶部导航 -->
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="砍价商品">
        <div @click="closeApp" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>
      <spellAddress v-if="spellInfo.showAddress"></spellAddress>
      <div style="position: relative;height:100%">
        <!-- 选项卡视图 -->
        <scroll :listenScroll="true" :listenTouchend="true" @touchEnd="downPullReload" :probeType="3" ref="scroll" @scroll="getNewData" class="scroll">
          <div class="view">
            <div class="reload" v-show="defaultList.length">下拉刷新</div>
           <img src="./image/spellBanner.png" style="width: 100%" v-if="siteId == 1" class="banner" alt="">
           <img src="./image/csBanner.jpg" style="width: 100%" v-if="siteId == 9" class="banner" alt="">
           <img src="./image/cqBanner.png" style="width: 100%" v-if="siteId == 13" class="banner" alt="">
            <ul>
              <li  v-for="item in defaultList"><ProductListItem :data="item" :unit="unit"></ProductListItem></li>
            </ul>
            <div class="loadMore">{{ defaultLoadText}}</div>
          </div>
        </scroll>
      </div>

      <div class="goMySpell" @click="$router.push('/mySpell')">我的砍价</div>
    </div>
  </transition>

</template>
<script type='text/javascript'>
  const GET_NEWDATA_Y = 200  //什么时候获取新商品列表
  import  Scroll from '@/common/components/scroll'
  import  ProductListItem from '@/common/components/spellListItem'
  import  spellAddress from '@/common/components/spellAddress'
  import {mapGetters,mapMutations} from 'vuex'
  import md5 from 'js-md5'
  export default {
    data() {
      return {
        type:'', //''为默认 ‘1’ 为积分
        defaultPage:0,  //默认  分页  当前页
        defaultList:[], //默认商品列表
        defaultLoadText:"正在加载",
        show:window.location.href.indexOf('flag=1') > 0,
        defaultFlag:true //控制商品列表请求多次触发
      }
    },

    created(){

    let href = window.location.href

      if(href.indexOf('flag=1') < 0 ){
        let str = href.split('#')[1];
        let path =  'jump_' + str.substring(1).replace(/\?/g,'@@').replace(/&/g,'@@').replace(/@@siteId=[0-9]{1,9}/g,'').toLowerCase()
        let authCodes = md5(this.AuthConfig.authUrl + '?param='+ path + '&corpno='+ this.AuthConfig.authCorpNo + this.AuthConfig.authCorpKey)
        let authUrl = this.AuthConfig.authUrl + '?param='+ path + '&corpno='+ this.AuthConfig.authCorpNo +'&auth=' + authCodes
        window.location.href = authUrl
      }

    },
    mounted(){
      if(this.siteConfig){
        this._initData()
      }
    },
    watch:{
     /* siteConfig(){
        this._initData()
      }*/
    },
    methods: {
      _initData(){
        this.defaultPage = 0
        this.defaultList = []
        this.defaultFlag = true
        this.defaultLoadText = '正在加载'
        this.getDefaultData()
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
      closeApp(){
        var isiPhone = navigator.userAgent.match(/(iPhone|iPod)/i) != null;
        if(isiPhone){
          location.href = "http://cmbiphone/tool";
        }else{
          location.href = "http://cmbandroid/tool";
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
            activityType:2
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
      }

    },
    computed:{
      ...mapGetters(['siteId','siteConfig','unit','spellInfo','AuthConfig','authUrl'])
    },
    components:{
      Scroll,
      ProductListItem,spellAddress
    }



  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "./../CateProducts/iconfont/iconfont.css"
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"
  .spellGroup
    fullScreen(0,0,0,0)
    padding-top 40px
    .goMySpell
      position fixed
      bottom 0
      width 100%
      height 1.2rem
      line-height 1.2rem
      text-align center
      font-size 0.4rem
      color white
      background #fd3c4f
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
      fullScreen(0,0,1.2rem,0)
      overflow hidden
      .loadMore
        loadMore()
      .reload
        reload()
</style>
