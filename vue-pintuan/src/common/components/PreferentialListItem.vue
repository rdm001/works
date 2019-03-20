<template>
  <router-link :to='{path:"/productDetail/"+data.id}' tag="div">
    <div class="preferentialList">
      <img :src="data.photo" alt="">
      <div class="info">
        <div class="productName"><span class="sourceTag">{{sourceText}}</span>{{data.itemName}}</div>
        <div class="price_wrap">
          <span class="price">{{newPoint | fulterUnit}}</span>
          <span class="oldPrice">{{ data.salePoints | fulterUnit}}</span>
          <span v-if="activityStatus == -1" class="status unStart">即将开抢</span>
          <span v-else-if="activityStatus == 0" class="status starting">立即购买 </span>
          <span v-else-if="activityStatus == 1" class="status end">已结束</span>
        </div>
        <div class="time">{{times}}</div>
        <!--<div class="otherInfo">
          <span class="supplyName">{{data.supplyName}}</span>
        </div>-->
      </div>
    </div>
  </router-link>
</template>
<script type='text/javascript'>
  import {mapGetters} from 'vuex'
  let diff = 0
  export default {
    props:{
      data:{
        type:Object,
        default:null
      },
      unit:{
        type:String,
        default:""
      }
    },
    data() {
      return {
        tip:"",
        diffTime:"",
        activityStatus:0
      }
    },
    destroyed(){
        let that = this
        if(that.timer){
          clearInterval(that.timer)
        }

    },
    created(){
      diff = Date.now() - this.data.currentTime
      let that = this;
      that.countdown();
      this.timer = setInterval(that.countdown,1000)
    },
    methods: {
      countdown(){
          //倒计时
        var that = this
        var endTime = this.data.activityProductVo.endDate;
        var startTime = this.data.activityProductVo.startDate;
        var nowTime = Date.now() - diff
        var diffTime = 0
        this.activityStatus = this.filterTime()
        if(nowTime < endTime && nowTime >= startTime ){
          //正在活动中
          this.tip = "仅剩"
          diffTime = endTime - nowTime
        }else if(nowTime < startTime){
          //活动未开始
          this.tip = "倒计时"
          diffTime = startTime - nowTime
        }else if(nowTime > endTime){
          //活动已结束
          this.tip = "活动已结束"
          if(that.timer) clearInterval(that.timer)
          return
        }
        this.diffTime = diffTime
      },
      filterTime(){
        //返回活动状态
        var endTime = this.data.activityProductVo.endDate;
        var startTime = this.data.activityProductVo.startDate;
        var nowTime = Date.now() - diff
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
      }
    },
    computed:{
        newPoint(){
          let newPoint = ((this.data.salePoints / (this.data.salePrice <= 0 ? 1 :this.data.salePrice)) * this.data.activityProductVo.preferentialPrice).toFixed(2)
          return newPoint
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
          let time = this.tip + day + "天" + hour + "时" + minute + "分" + sec + "秒"
          return time
        },
        sourceText(){
          switch(this.data.source){
            case 1:
                return '京东';
            case 2:
                return '特供';
            case 3:
                return '苏宁';
            case 4:
                return '严选'
          }
        },
      ...mapGetters(['siteConfig'])
    }
  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  .preferentialList
    padding 0.1rem
    background white
    overflow hidden
    border-bottom  1px solid #ededed
    img
      float left
      width 3rem
      height 3rem
      margin-right 0.1rem
    .info
      float right
      width 6.5rem
      padding 0.1rem
      .time
        color #fd3c4f
      .productName
        height 1rem
        font-size 0.35rem
        line-height 0.55rem
        overflow hidden
        .sourceTag
          display: inline-block;
          position: relative;
          bottom: 0.06rem;
          margin-right: 0.1rem;
          width: 0.7rem;
          height: 0.4rem;
          line-height: 0.4rem;
          text-align: center;
          padding 0 0.1rem
          border-radius 0.05rem
          font-size: 0.2rem;
          color white;
          background #fd3c4f
      .price_wrap
        height 1rem
        line-height 1rem
        position relative
        .price
          color #fd3c4f
          font-size 0.4rem
        .oldPrice
          color #333
          margin-left .3rem
          text-decoration line-through
        .status
          float right
          margin-top 0.15rem
          width 2rem
          font-size 0.3rem
          line-height 0.7rem
          text-align center
          border-radius 0.36rem
          &.unStart
            border 1px solid #fd3c4f
            color #fd3c4f
          &.starting
            background #fd3c4f
            color white
          &.end
            background #999
            color white
      .otherInfo
        height 1rem
        line-height 1rem
        .supplyName
          font-size 0.3rem
          color gray
</style>
