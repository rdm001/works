<template>
  <div class="Watermelonfrom4">
    <mt-header  class="topBar" style="font-size: 0.4rem" title="1分钱品尝琼浆玉液米酒">
      <div @click="closeApp" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>
    <div class="wrap">
      <img src="./water4/img1.png" style="width: 100%;" alt="">
      <div class="infoWrap">
        <div class='codeNum' v-if="num != 0">剩余数量: <span class='num'>{{num}}</span>张</div>
        <div class="info">
         <!-- <p>当前场次: <span>2018-09-24</span></p>-->
          <p> {{num == 0 ? '距离下场活动开始还有' : '距离本场活动结束还有'}}: <span>{{times}}</span> </p>
          <p>本场代金券有效期至: <span>2018-12-31</span></p>
        </div>
      </div>

      <img src="./water4/img2.png" @click="shopping" class="shopping" alt="">

      <div class="btns">
        <img src="./water4/img3.png" @click="$router.push('/myOrder')" class="myOrderBtn" alt="">
        <!-- <img src="./image/btn2.png" class="shops"  @click="showShops = true" alt="">-->
        <img src="./water4/img5.png" style="width: 100%" alt="">
      </div>

      <div class="shadow" v-show="showShops">
        <img src="./image/shops.png" class="shopsPic" alt="">
        <div class="back" @click="showShops = false">返回</div>
      </div>
    </div>
  </div>
</template>
<script type='text/javascript'>
  const itemId = 5530
  let diff = 0;
  Date.prototype.toLocaleString = function() {
    return (this.getMonth() + 1 < 10 ? '0' + (this.getMonth() + 1)  :this.getMonth()  )
      + "月" +
      (this.getDate()  < 10 ? '0' +  this.getDate():this.getDate())
      + "日 " +
      (this.getHours()  < 10 ? '0' +  this.getHours()   :this.getHours())
      + ":" +
      (this.getMinutes()  < 10 ? '0' +  this.getMinutes()  :this.getMinutes())
  };
  import {mapGetters} from 'vuex'
  import md5 from 'js-md5'
  export default {
    data() {
      return {
        product:{},
        showShops:false,
        activating:false,
        num:0,
        activity:"",
        status:"",
        diffTime:0
      }
    },
    destroyed(){
      let that = this
      if(that.timer){
        clearInterval(that.timer)
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
       return
       }
      this._initData()
    },
    watch:{
      activity(newVal){
        let that = this
        that.countdown()
        this.timer = setInterval(that.countdown,1000)
      }
    },
    methods: {
      _initData(){
        this.$http.post(
          this.$api.productDetail,
          this.$until.getFormData({
            id:itemId
          })
        ).then(({data}) => {
          if(data.success){
            this.product = data.obj.entity
            this.activity = this.product.activityType
            diff = Date.now() - this.product.currentTime
            this.num = this.product.stockNum || 0

          }
        })


      },
      closeApp(){
        var isiPhone = navigator.userAgent.match(/(iPhone|iPod)/i) != null;
        if(isiPhone){
          location.href = "http://cmbiphone/tool";
        }else{
          location.href = "http://cmbandroid/tool";
        }
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
      shopping(){
        this.$router.push('/productDetail/' + itemId)
      }
    },
    computed:{
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
      ...mapGetters(['siteId','token','AuthConfig'])
    }
  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css' scoped>
  .Watermelonfrom4
    position absolute
    left 0
    right 0
    bottom 0
    top 0
    overflow-y auto
    -webkit-overflow-scrolling touch
    .wrap
      background #f5f2d9
      background-size 100% auto
      position relative
      .infoWrap
        position absolute
        top 9rem
        left 50%
        margin-left -4rem
        width 8rem
        background url('./water4/img4.png') no-repeat left top
        background-size 100% 100%
        box-sizing border-box
        padding 0.3rem 0.6rem
        .codeNum
          line-height 1rem
          text-align center
          font-size 0.35rem
          color #f4f74f
          border-bottom:1px dashed #fded54
          .num
            display inline-block
            padding 0 0.1rem
            color white
            background #c62e09
            height 0.5rem
            line-height 0.5rem
            margin 0 0.1rem
            vertical-align middle
        .info
          padding 0.2rem 0
          p
            margin 0
            line-height 0.7rem
            font-size 0.0.35rem
            text-align center
            color #f4f74f
            span
              color white
      .shopping
        display block
        float left
        width 100%
        margin 0
      .btns

        position relative
        z-index 10
        overflow hidden
        width 100%
        margin 0
        .myOrderBtn
          float left
          display block
          width 100%
          margin 0
      .result
        width 100%
      .shadow
        position absolute
        left 0
        right 0
        bottom 0
        top 0
        padding-top 1rem
        background rgba(0,0,0,0.8)
        .shopsPic
          width 9rem
          display block
          margin 0 auto
        .back
          width 3rem
          height 1rem
          margin 0.5rem auto
          line-height 1rem
          text-align center
          font-size 0.3rem
          color white
          background #f1b42b
          border-radius 0.1rem
</style>
