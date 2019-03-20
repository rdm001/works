<template>
    <div class="myOrder">
      <!-- 顶部导航 -->
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="我的订单">
        <!--<router-link to="/person" slot="left">
          <mt-button icon="back"></mt-button>
        </router-link>-->
        <div slot="left" @click="back">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>

      <transition name="opacity">
        <div class="shadow" v-show="showContienu" @click="hideContinue(false)"></div>
      </transition>
      <transition name="moveBottom">
        <continuePay class="continue" v-if="showContienu" :token="token" :data="continuePayOrder" @hide="hideContinue"></continuePay>
      </transition>


      <div class="wrap">
        <ul class="tabBar">
          <li v-for="item in statusList" @click="changeStatus(item.status)" :class="{active:status==item.status}" :key="item.id">{{item.name}}</li>
        </ul>
        <scroll class="scroll" :listenScroll="true" :probeType="3" ref="scroll"  @scroll="ScrollGetNewData">
          <div>
            <ul>
              <li v-for="item in orderList" :key="item.id"><orderListItem @continuePay="continuePay" :data="item" @reload="reload" ></orderListItem></li>
            </ul>
            <div class="load_more">{{loadText?'正在加载' :'已无更多数据'}}</div>
          </div>
        </scroll>
      </div>
    </div>
</template>
<script type='text/javascript'>
    import  Scroll from '@/common/components/scroll'
    import  orderListItem from '@/common/components/orderListItem'
    import  continuePay from '../../common/components/continuePay.vue'
    import {mapGetters} from 'vuex'
    import {Toast,Popup } from 'mint-ui';
    import Vue from 'vue'
    Vue.component(Popup.name, Popup);
    const GET_NEWDATA_Y = 200
    export default {
        data() {
            return {
                statusList:[
                  {
                      name:'全部',
                      status:''
                  },
                  /*{
                    name:'待审核 ',
                    status:1
                  },
                  {
                    name:'未通过',
                    status:21
                  },*/
                  {
                    name:'待支付 ',
                    status:15
                  },
                  {
                    name:'待收货',
                    status:22
                  },
                  {
                    name:'已完成',
                    status:23
                  }
                ],
                showContienu:false,
                status:'',
                page:0,
                loadText:true,
                orderList:[],
                sendHttpFlag:true,
                continuePayOrder:{}
            }
        },
        created(){
              this._initData()
        },
        watch:{
          status(){
              this.page = 0
              this.sendHttpFlag = true
              this.loadText = true
              this.orderList = []
              this.getNewData()
          },
          orderList(){
            this.$nextTick(()=>{
              this.$refs.scroll.refresh()
            })
          }
        },
        methods: {
            _initData(){
              this.sendHttpFlag = false
              this.$http.post(
                  this.$api.myOrder,
                  this.$until.getFormData({
                    token:this.token,
                    status:this.status,
                    pageNo:this.page,
                    siteId:this.siteId
                  })
              ).then((res) =>{
                  if(res.data.success){
                      let data = res.data.obj.page.rows;
                      this.orderList = data
                      this.page++
                    if (!data.length || data.length < 10){
                      this.loadText = false
                      return
                    }
                  }else{
                    Toast({message:res.data.msg,iconClass:'ToastIcon icon-error'})
                  }
                  this.sendHttpFlag = true
              }).catch(() => this.sendHttpFlag = true)
            },
            ScrollGetNewData(pos,maxY){
                //下滑刷新
              if(pos && pos.y < maxY + GET_NEWDATA_Y){
                  this.getNewData()
              }
            },
            back(){
              let href = window.location.href;
              if(this.siteId == 8 || this.siteId == 11){
                this.$until.closeApp()
                return
              }
              if(href.indexOf('hdpage=true')!= -1) {
                window.location.href = document.referrer/* js中获取上一页面url地址的方法 */
              }else{
                this.$router.go(-1)
              }
            },
            reload(){
                 // 重新加载数据
              this.$refs.scroll.refresh()
             /* this.page = 0
              this.sendHttpFlag = true
              this.loadText = '正在加载'
              this.orderList = []
              this.getNewData()*/
            },
            getNewData(){
                //获取新数据
              if(!this.sendHttpFlag) return
              this.sendHttpFlag = false
              this.$http.post(
                this.$api.myOrder,
                this.$until.getFormData({
                  token:this.token,
                  status:this.status,
                  pageNo:this.page,
                  siteId:this.siteId
                })
              ).then((res) =>{
                if(res.data.success){
                  let data = res.data.obj.page.rows;
                  let oldOrder = this.orderList
                  this.orderList = oldOrder.concat(data)

                  if (!data.length || data.length < 10){
                    this.loadText = false
                    return
                  }
                  this.page++
                }else{
                  Toast({message:res.data.msg,iconClass:'ToastIcon icon-error'})
                }
                this.sendHttpFlag = true
              }).catch(() => this.sendHttpFlag = true)

            },
            changeStatus(status){
                //正在请求 并且不是最后一页
              if(!this.sendHttpFlag&&this.loadText) return
              this.status = status
            },
            continuePay(order){
              this.showContienu = true
              this.continuePayOrder = order
            },
            hideContinue(flag){
             this.showContienu = flag
            }
        },
        computed:{
          ...mapGetters(['siteId','token'])
        },
        components:{
          Scroll,
          orderListItem,
          continuePay
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/toastIcon/iconfont.css"
  @import "../../common/css/transition_name.styl"
  .myOrder
    fullScreen(0,0,0,0)
    padding-top 40px
    .shadow
      fullScreen(0,0,0,0)
      position fixed
      background rgba(0,0,0,0.6)
      z-index 20
    .continue
      position fixed
      bottom 0
      left 0
      z-index 21
      width 100%
    .wrap
      position relative
      fullScreen(40px,0,0,0)
    .tabBar
      position relative
      z-index 10
      box-shadow 0 0 5px #ccc
      background white
      overflow hidden
      li
        float left
        width 25%
        box-sizing border-box
        height 1rem
        line-height 1rem
        text-align center
        font-size 0.35rem
        &.active
          border-bottom 2px solid $color-theme
    .scroll
      overflow hidden
      fullScreen(1rem,0,0,0)
    .load_more
      loadMore()
</style>
