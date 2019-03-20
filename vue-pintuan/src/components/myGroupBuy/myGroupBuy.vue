<template>
  <div class="myGroupBuy">
    <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="我的拼团">
      <div @click="$router.go(-1)" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>

    <scroll class="scroll" ref="scroll" :probeType="3" :listenScroll="true" @scroll="getNewData">
      <div>
        <myGroupBuyListItem @continuePay="continuePay"  :key="index" v-for="(item,index) in list" :data="item"></myGroupBuyListItem>
        <div class="loadMore">{{LoadText}}</div>
      </div>
    </scroll>
    <div class="continuePayWrap" v-if="showContinue" @click="showContinue = false"></div>
    <transition name="moveBottom">
      <continuePay class="continue" v-if="showContinue" :token="token" :data="continuePayOrder" @hide="hideContinue"></continuePay>
    </transition>


  </div>
</template>
<script type='text/javascript'>
  import  Scroll from '@/common/components/scroll'
  import  myGroupBuyListItem from '@/common/components/myGroupBuyListItem'
  import {mapGetters} from 'vuex'
  import  continuePay from '../../common/components/continuePay.vue'
  export default {
    data() {
      return {
        list:[],
        pageNo:0,
        httpFlag:true,
        LoadText:'正在加载',
        showContinue:false,
        continuePayOrder:{}
      }
    },
    created(){
      this._initData()
    },
    methods: {
      _initData(){
        this.getNewData()
      },
      getNewData(){
        if(!this.httpFlag) return
        this.httpFlag = false
        this.$http.post(
          this.$api.myGroupBuyList,
          this.$until.getFormData({
            siteId:this.siteId,
            token:this.token,
            pageNo:this.pageNo
          })
        ).then(({data}) => {
          this.httpFlag = true
          if(data.success){
            this.pageNo ++
            let oldData = this.list;
            let Data = data.obj.page.rows;

            this.list = oldData.concat(Data);
            console.log(this.list)
            this.$nextTick(()=>{
              this.$refs.scroll.refresh()
            })

            if (!Data.length || Data.length < 10) {//如果返回的数据为空
              this.LoadText= '无更多数据'
              this.httpFlag = false   //已达到最后一页 禁止继续发送请求
            }
          }
        }).catch(e =>  this.httpFlag = true)
      },
      hideContinue(flag){
        this.showContinue = flag
      },
      continuePay(order){
        this.showContinue = true
        this.continuePayOrder = order
      }
    },
    computed:{
      ...mapGetters(['siteId','token'])
    },
    components:{
      Scroll,myGroupBuyListItem,continuePay
    }
  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css' scoped>
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"
  .myGroupBuy
    fullScreen(0,0,0,0)
    padding-top 40px
    .continuePayWrap
      fullScreen(0,0,0,0)
      position fixed
      background rgba(0,0,0,0.8)
    .continue
      position fixed
      bottom 0
      left 0
      z-index 30
      width 100%
    .scroll
      fullScreen(40px,0,0,0)
      overflow hidden
      .loadMore
        loadMore()
      .reload
        reload()
</style>
