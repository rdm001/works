<template>
  <div class="groupBuyGoodDetail">
    <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem;z-index:30" :title="title ? title : '商品详情'">
      <div @click="back" slot="left" v-if="siteId != 8">
        <mt-button icon="back"></mt-button>
      </div>
      <!--<div slot="right" class="share" @click="share">

      </div>-->
    </mt-header>
    <div class="scroll"   ref="productScroll">
      <div class="wrap">
        <!--  <div class="backs" @click="$router.go(-1)"></div>-->
        <div class="scrollWrap">
          <div style="position: relative">
            <img :src="product.photo" class="photo"  alt="">
            <div class='infoWrap' v-if="tip">
              <div class='priceInfo'>
                <span class='avtivityPrice'> {{newPoint | fulterUnit}}</span>
                <span class='oldPrice'>{{this.product.salePoints| fulterUnit}}</span>
              </div>
              <div class='timeWrap'>
                <div class='startTime' v-if="status == -1">{{startTime + '开始'}}</div>
                <p class='timeTips'>{{tip}}:</p>
                <p class='time'>{{times}}</p>
              </div>
            </div>
          </div>

        </div>
        <div class="title info">
          <span class="sourceTag">{{sourceText}}</span>{{product.itemName}}
        </div>
        <div class="info">
          <p class="price">
            <span v-if="status == 1">{{newPoint | fulterUnit}}<span class="oldPrice">原价{{price | fulterUnit}}</span></span>
            <span class="saleNum"><span v-if="hideArr.indexOf('c_stock') != -1"> 参团人数:{{nums}}</span></span>
          </p>
          <p style="text-align:right;line-height:0.8rem;color:#999" v-if="hideArr.indexOf('c_groupnum') != -1">{{vo.groupMaxUserNum}}人团,{{vo.successNum}}团已成功</p>
          <p class="timer" v-if="product.activityType == 3 && !tip">活动已结束
            <span
              @click="$router.push('/myGroupBuy')"
              style="
            float:right;
            line-height:0.5rem;
            margin-top:0.1rem;
            padding:0.1rem 0.2rem;
            border-radius:0.1rem;
            color:white;
            background:#fd3c4f;
          "> 查看中奖资格 </span> </p>
          <!-- <p>价格<span class="oldPrice">1000元</span></p> -->
        </div>
        <ul class="navBar" ref="nav">
          <li @click="type = 'detail'" :class="{active:type=='detail'}" style="width: 100%">商品介绍</li>
    <!--      <li @click="type = 'sh'" :class="{active:type=='sh'}">售后保障</li>-->
        </ul>
        <div class="content" >
          <div v-show="type=='detail'" ref="detail" class="detail" v-html="detail"></div>
          <div v-show="type=='sh' "  ref='sh' class="sh">
            <div v-if="product.type != 3 && siteId != 1">
              <img v-if="product.source == 1"  src="./image/jd.jpg" style="width: 100%" alt="">
              <img v-else-if="product.source == 4"  src="./image/jd.jpg" style="width: 100%" alt="">
              <img v-else  src="./image/jd.jpg" style="width: 100%" alt="">
            </div>
            <div v-if="product.type == 3">
              <img src="./image/xn.jpg" style="width: 100%"  alt="">
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="shopBar">


      <div class="item result" @click="showResult = true">
        <i class="icon_result"></i>
        活动规则
      </div>
      <div class="item GroupBuy" @click="groupBuy" :class="{disabled:shopDisabled}">
        开团
      </div>
      <div class="item myGroupBuy" @click="$router.push('/myGroupBuy')">
        我的拼团
      </div>

      <!--<div class="item addCar" @click="showQueryHandler(0)" v-if="showAddShopCar&&oneCount.indexOf(siteId) < 0" ><span>加入购物车</span></div>-->
    </div>

    <transition name="opacity">
      <div class="shadow" v-show="showQuery"  @click="close"></div>
    </transition>
    <spellAddress v-if="spellInfo.showAddress"></spellAddress>
    <transition name="moveBottom" >
      <inventory class="query" @closed="close" v-if="showQuery" @shopCar="addProduct" :type="showQueryType" :data="product" :unit="unit"></inventory>
    </transition>

    <transition name="opacity">
      <div class="showResult" @click="showResult = false" v-show="showResult">
        <div class="resultContent">
          <div class="resultTitle">活动规则</div>
          <div class="desc" v-html="vo.description">

          </div>
        </div>
      </div>
    </transition>
  </div>

</template>
<script type='text/javascript'>
  import Scroll from '../../common/components/scroll.vue'
  import Inventory from '../../common/components/InventoryQuery.vue'
  import {mapGetters,mapMutations} from 'vuex'
  import {Toast,Indicator,MessageBox} from 'mint-ui';
  import  spellAddress from '@/common/components/spellAddress'
  let diff = 0;
  Date.prototype.toLocaleString = function() {
    alert(this.getMonth())
    return (this.getMonth() + 1 < 10 ? '0' + (this.getMonth() + 1)  : this.getMonth() + 1  )
      + "月" +
      (this.getDate()+1  < 10 ? '0' +  this.getDate():this.getDate())
      + "日 " +
      (this.getHours()  < 10 ? '0' +  this.getHours()   :this.getHours())
      + ":" +
      (this.getMinutes()  < 10 ? '0' +  this.getMinutes()  :this.getMinutes())
  };

  export default {
    data() {
      return {
        id:0,
        product:{},
        type:"detail",
        fixed:true,
        detail:'',
        price:0,
        showQuery:false,
        showQueryType:0,
        activity:"",
        status:0,
        diffTime:"",
        activating:false,
        tip:"",
        num:0,
        title:"",
        vo:{},
        showResult:false,
        hideArr:[],
      }
    },
    created(){
      let href = window.location.href
      if(href.indexOf('flag=1') == -1 && href.indexOf('hdpage=banner') != -1 && (
          this.siteId == 1 ||
          this.siteId == 8 ||
          this.siteId == 31 ||
          this.siteId == 32
        ) ){
        window.location.href = this.$until.auth(this.AuthConfig)
      }
      Date.prototype.toLocaleString = function() {
        return (this.getMonth() + 1 < 10 ? '0' + (this.getMonth() + 1)  :this.getMonth() + 1  )
          + "月" +
          (this.getDate()+1  < 10 ? '0' +  this.getDate():this.getDate())
          + "日 " +
          (this.getHours()  < 10 ? '0' +  this.getHours() : this.getHours())
          + ":" +
          (this.getMinutes()  < 10 ? '0' +  this.getMinutes() :this.getMinutes())
      };
      this.id = this.$route.params.id;
      this._initData()

    },
    destroyed(){
      let that = this
      if(that.timer){
        clearInterval(that.timer)
      }
    },
    watch:{
      activity(newVal){
          let that = this
          that.countdown()
          this.timer = setInterval(that.countdown,1000)
      }
    },
    methods:{
      _initData(){
        //初始化商品详情数据
        this.$http.post(
          this.$api.productDetail,
          this.$until.getFormData({
            id:this.id
          })
        ).then(({data}) => {
          if(data.success){
            this.product = data.obj.entity
            if(data.obj.entity.activityType == 0){
                  this.$router.push('/productDetail/' + this.id + '?hdpage=banner')
            }
            this.vo = data.obj.entity.activityProductVo
            if(data.obj.entity.activityProductVo.showCompontents) {
              this.hideArr = data.obj.entity.activityProductVo.showCompontents.split(',')
            }
            if(this.product.activityType && this.product.activityProductVo.title ){
              this.title = this.product.activityProductVo.title
            }
            this.price = this.product.salePoints
            this.activity = this.product.activityType
            diff = Date.now() - this.product.currentTime
            console.log(this.product)
            this.detail = this.product.content
            this.setOrderType()
          }
        })

        //======>销量查询接口
        this.$http
          .post(
            this.$api.productSaleNum,
            this.$until.getFormData({
              id: this.id
            })
          )
          .then(({ data }) => {
            if (data.success) {
              this.num = data.obj.saleNum;
            }
          });

      },
      close(){
        //关闭 查询库存弹框
        this.showQuery = false
      },
      groupBuy(){
          if(this.shopDisabled) return
          if(this.product.activityProductVo.captainPrice <= 0){
              this.product.payWay = 'ye'
          }
        if(this.product.type != 3){
          this.set_spellInfo({
            source:this.product.source,
            showAddress:true,
            product:this.product
          })
        }else {
        let that = this
         MessageBox.prompt('请输入手机号').then(({ value, action }) => {
            let reg = /^1[0-9]{10}$/
             if(!reg.test(value)){
                return Toast('手机号码格式不正确')
             }else{
               Indicator.open();
                 that.$http.post(
                 that.$api.submitOrder,
                 that.FreightQuery(value)
                ).then(({data}) => {
                Indicator.close();

                if (data.success) {
                  that.$router.push('/groupBuyDetail?id=' + data.obj.groupRecordId)
                } else {
                 // that.cancel()
                Toast(data.msg)
                }
                })
             }
          });
       /*   MessageBox({
            title: '提示',
            message: '请输入手机号',
            showCancelButton: true,
            showInput:true,
            inputType:'tel'
          }).then((val) => {
              alert(val)
          });*/

        }
      },
      setOrderType(){
        //返回活动状态
        this.product.orderType = 5
      },
      countdown(){
        //倒计时
        var that = this;
        var endTime = this.product.activityProductVo.endDate;
        var startTime = this.product.activityProductVo.startDate;
        var nowTime = Date.now() - diff;
        var diffTime = 0;
        this.status = this.filterTime()
        if(nowTime < endTime && nowTime >= startTime ){
          //正在活动中
          this.tip = "距离结束还剩"
          diffTime = endTime - nowTime
          this.activating = true

        }else if(nowTime < startTime){
          //活动未开始
          this.tip = "距离开始还剩"
          diffTime = startTime - nowTime
          this.activating = false

        }else if(nowTime > endTime){
          //活动已结束
          this.tip = false
          if(that.timer) clearInterval(that.timer)
          this.activating = false
          return
        }
        this.diffTime = diffTime
      },
      filterTime(){
        //返回活动状态
        var endTime = this.product.activityProductVo ? this.product.activityProductVo.endDate : 0;
        var startTime = this.product.activityProductVo ? this.product.activityProductVo.startDate : 0;
        var nowTime = Date.now() - diff;
        if(nowTime < endTime && nowTime >= startTime ){
          //正在活动中
          return 0
        }else if(nowTime < startTime){
          //活动未开始
          return -1
        }else if(nowTime > endTime){
          //活动已结束
          return 1
        }
      },
      back(){
        let href = window.location.href;
        if(href.indexOf('hdpage=banner')!= -1 && (this.siteId == 1 || this.siteId == 9 || this.siteId == 8 || this.siteId == 31 || this.siteId == 32)){
          this.$until.closeApp()
        }else if(href.indexOf('hdpage=true')!= -1) {
          window.location.href = document.referrer
        }else{
          this.$router.go(-1)
        }
      },
      share(){
        var pic = this.product.photo
        var name = this.product.itemName
        var text = '专属礼包、品牌特惠'
        if(this.product.activityType &&this.product.activityProductVo.title){
          text = this.product.activityProductVo.title
        }
        //window.location.href = `http://cmbls/socialshare?id=mpBank&type=url&title=${name}&text=${text}&picurl=${pic}&url=https://t.cmbchina.com/amiqum?productId=${this.id }`
      },
      FreightQuery(mobile){
        //运费查询参数
        let cartItemList = [{
          itemId:this.product.id,
          shopNum:1
        }];

        let query = {
          cartItemList:cartItemList,
          orgId:this.user&&Number(this.user.organization.id),
          payWay:this.vo.captainPrice <= 0 ?  'ye' :'zh_ywt',
          remark:'',
          siteId:this.siteId,
          orderType:5,
          source:this.product.source,
          supplyId:this.product.supplyId,
          token:this.token,
          groupRecordId:this.recordId,
          mobile:mobile
        }
        return query
      },
      ...mapMutations({
        set_shopCarProduct:'set_shopCarProduct',
        set_spellInfo:'set_spellInfo'
      })
    },
    computed:{
        nums(){
          return this.vo.groupMaxUserNum ? parseInt(this.vo.groupMaxUserNum * this.vo.successNum) : 0
        },
      newPoint(){
        let newPoint = 0
        newPoint =  ((this.product.salePoints / (this.product.salePrice <= 0 ? 1 :this.product.salePrice)) * this.product.activityProductVo.memberPrice).toFixed(2)
        return newPoint
      },
      showAddShopCar(){
        return this.product.type!=3 && this.product.activityType != 1 && this.product.activityType != 2
      },
      times(){
        if(this.filterTime() == 1){
          return '活动已结束'
        }
        let diffTime = this.diffTime
        var day = parseInt( diffTime / 1000/ 60 / 60 / 24).toString()
        day = day.length < 2 ? "0" + day : day
        var hour =  parseInt( diffTime / 1000/ 60 / 60 % 24).toString()
        hour = hour.length < 2 ? "0" + hour : hour
        var minute =  parseInt( diffTime / 1000/ 60 % 60 ).toString()
        minute = minute.length < 2 ? "0" + minute : minute
        var sec =  parseInt( diffTime / 1000 % 60  ).toString()
        sec = sec.length < 2 ? "0" + sec : sec
        let time = day + "天" + hour + "时" + minute + "分" + sec + "秒"
        return time
      },

      startTime(){
        let time = this.product.activityProductVo ? this.product.activityProductVo.startDate : 0;
        let start = new Date(time);
        //alert(start.toLocaleString())
        return start.toLocaleString()
      },
      sourceText(){
        switch(this.product.source){
          case 1:
            return '京东';
          case 2:
            return '特供';
          case 3:
            return '苏宁';
          case 4:
            return '严选';
          default:
            return "";
        }
      },
      shopDisabled(){
        //如果不在活动中 并且特惠商品
        console.log(!this.activating&&(this.activity == 1 || this.activity == 2))
        return !this.activating&&(this.activity == 1 || this.activity == 2 || this.activity == 3)
      },
      ...mapGetters(['unit','shopCarProduct','token','siteId','spellInfo','oneCount','AuthConfig'])
    },
    components:{
      Scroll,
      Inventory,
      spellAddress
    }
  }


</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"
  .groupBuyGoodDetail
    .backs
      extend-click()
      position fixed
      left 0.3rem
      top 0.3rem
      width 0.7rem
      height 0.7rem
      z-index 10
      background rgba(0,0,0,0.5) url("image/icon_back.png") no-repeat center
      background-size 0.4rem 0.4rem
      border-radius 0.6rem
    .showResult
      fullScreen(0,0,0,0)
      position fixed
      background rgba(0,0,0,0.7)
      .resultContent
        position absolute
        overflow hidden
        border-radius 0.2rem
        top 10%
        left 50%
        width 8rem
        margin-left -4rem
        background white
        .resultTitle
          line-height 1rem
          text-align center
          border-bottom 1px solid #ccc
          font-size 0.4rem
        .desc
          height 10rem
          overflow-y auto
          -webkit-overflow-scrolling touch
          padding 0.3rem
          font-size 0.3rem
          line-height 0.7rem
          box-sizing border-box
          width 100%
    .shadow
      fullScreen(0,0,0,0)
      z-index:12;
      background rgba(0,0,0,0.6)
    .scroll
      padding-top 40px
      fullScreen(0,0,0,0)
      overflow-x hidden
      overflow-y auto
      -webkit-overflow-scrolling touch
      overflow-scrolling touch
      .share
        height 40px
        background url("../../common/image/icon-share.png") no-repeat right center
        background-size 0.5rem auto
      .wrap
        padding-bottom 1.3rem
        .photo
          display block
          width 100%
          height 10rem
          background white
        .infoWrap
          position absolute
          bottom 0
          left 0
          width 100%
          height 1.2rem
          background #ff3d00
          .priceInfo
            width 60%
            float left
            height 100%
            line-height 1.2rem
            .avtivityPrice
              color:white ;
              margin: 0 0.2rem;
              font-size: 0.48rem
            .oldPrice
              color white
              font-size 0.35rem
              text-decoration line-through
          .timeWrap
            width 40%;
            float right
            height:100%
            box-sizing border-box
            padding 0.1rem 0
            background #ffe9de
            position relative
            p
              margin 0
              line-height 0.5rem
              color #ff3d00
              text-align center
            .timeTips
              font-size 0.35rem
            .time
              font-size 0.35rem
            .startTime
              position absolute
              bottom 100%
              width 100%
              background #ff3d00
              color white
              font-size 0.35rem
              height 0.7rem
              line-height 0.7rem
              text-align center
              border-top-right-radius 0.1rem
              border-top-left-radius 0.1rem
        .info
          background white
          padding 0 0.2rem
          .shopNum
            font-size 0.3rem
            margin-right 0.2rem
          .saleNum
            float right
            font-size 0.35rem
            color #999
            font-weight normal
          .price
            line-height 0.7rem
            font-size 0.45rem
            font-weight bold
            overflow hidden
            color $color-theme
            .oldPrice
              color #ccc
              margin-left .3rem
              font-size 0.3rem
              text-decoration line-through
          .timer
            border-top 1px dashed #aaa
            line-height 1rem
            font-size 0.35rem
            color red
        .title
          font-size 0.4rem
          line-height 0.5rem
          padding-bottom 0.2rem
          padding-top 0.2rem
          font-family '黑体'
          .sourceTag
            display: inline-block;
            position: relative;
            margin-top: 0.15rem;
            bottom: 0.1rem;
            margin-right: 0.1rem;
            width: 0.7rem;
            height: 0.4rem;
            line-height: 0.4rem;
            text-align: center;
            padding 0 0.1rem
            border-radius 0.05rem
            font-size: 0.2rem
            color: white
            background #fd3c4f
        .detail
          img
            width 10rem !important
            height auto !important
        .sh
          padding 0.3rem
          background white
    .navBar
      height 1rem
      line-height 1rem
      background white
      margin-top 0.3rem
      border-bottom 0.5px solid #eee
      li
        width 49%
        float left
        text-align center
        border-left 0.5px solid #eee
        font-size 0.4rem
        &.active
          color #f00
        &:first-child
          border none
      &.fixed
        position fixed
        left 0
        top 0
        margin 0
        width 100%
        z-index:10;
    .shopBar
      position fixed
      bottom 0
      left 0
      height 1.3rem
      width 100%
      background #fff
      box-shadow 0 0 2px #ccc
      .item
        float left
        width 33%
        text-align center
        height 100%
        line-height 1.3rem
        font-size 0.4rem
        &.result
          font-size 0.35rem
          .icon_result
            display inline-block
            vertical-align middle
            margin-top -0.1rem
            width 0.4rem
            height 0.4rem
            background url("./image/icon_result.png") no-repeat center
            background-size 100% auto
      .myGroupBuy,.GroupBuy
        color white
        float right
        background #fda03c
      .GroupBuy
        background $color-theme
        &.disabled
          background #999
      .addCar
        float right
        width 33%
        height 100%
        background orange
        background linear-gradient(to right,#FFDC50,#FFB400)
        color white
      .shopCar
        width 2rem
        padding 0.2rem 0
        box-sizing border-box
        .icon_shopCar
          position relative
          display block
          margin 0 auto
          width 0.5rem
          height 0.5rem
          background url("../../common/image/icon_shopCar.png") no-repeat center center
          background-size 100% 100%
          .num
            position absolute
            left 0.3rem
            top -0.15rem
            min-width 0.2rem
            height 0.4rem
            line-height 0.4rem
            padding 0 0.1rem
            background red
            color white
            text-align center
            font-size 0.25rem
            border-radius 0.3rem
        .text
          line-height 1
          font-size 0.3rem
          margin-top 0.1rem
    .query
      position fixed
      left 0
      bottom 0
      width 100%
      z-index 13
      background white
</style>
