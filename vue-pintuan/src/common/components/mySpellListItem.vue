<template>
    <div class="mySpellListItem">
      <img :src=" data.photo" alt="" class="photo">
      <div class="info">
        <div class="title">{{data.itemName}}</div>
        <div class="price_wrap">
          <span class="price">{{data.activityProductVo.floorPrice | fulterUnit}}</span>
         <!-- <span class="oldPrice">{{'¥' + data.salePoints}}</span>-->
          <span class="orderBtn" v-if="orderStatus == 1 && data.operStatus == 0 && activityStatus == 0" @click="continuePay">去支付</span>
          <span class="orderBtn" v-if="siteId != 17 && orderStatus == 1 && data.operStatus != 0" @click="$router.push('/orderDetail?orderNo=' +data.orderNo)">订单详情</span>
          <span class="orderBtn" style="width: auto;padding: 0 0.2rem" v-if="siteId == 17 && orderStatus == 1 && data.operStatus != 0" >等待公布获奖名单</span>
          <span class="orderBtn" v-if="orderStatus == 0 && activityStatus != 1" @click="continueSpell">继续砍价</span>
          <span class="orderBtn" style="background:#ccc" v-if="orderStatus == -1 && activityStatus != 1">已结束</span>
        </div>
        <div class="times" v-if="!(orderStatus == 1 && data.operStatus != 0)">{{times}}</div>

      </div>
    </div>
</template>
<script type='text/javascript'>
    let diff = 0;
    import {mapGetters} from 'vuex'
    export default {
        props:['data'],
        destroyed(){
          let that = this
          if(that.timer){
            clearInterval(that.timer)
          }
        },
        mounted(){
          diff = Date.now() - this.data.currentTime
          let that = this;
          that.countdown();
          this.timer = setInterval(that.countdown,1000)
        },
        data() {
            return {
              activityStatus:-1,
              tip:'',
              diffTime:0
            }
        },
        methods: {
          continueSpell(){
              this.$router.push('/spellGroupDetail?id=' + this.data.activityProductVo.recordsId)
          },
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
            console.log(this.data)
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
          },
          continuePay(){
              this.$emit('continuePay',this.data)
          }
        },
      computed:{
        times(){
          if(this.filterTime() == 1){
            return '砍价已失效'
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
          let times = this.tip + day + "天" + hour + "时" + minute + "分" + sec + "秒"
          return times
        },
        orderStatus(){
          //   1：砍价成功
          //    0：进行中
          //   1 砍价成功时 外层order operStatus状态 0为未支付 22为已发货  23为以确认收货
          //   -1：砍价失败
          let status =  this.data.activityProductVo.operStatus
          let operStatus = this.data.operStatus

          /*if(status == 1 && operStatus != 0){
            return 23
          }*/
          return status
        },
        ...mapGetters(['siteId'])
      }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
.mySpellListItem
  background white
  box-sizing border-box
  padding 0.2rem
  border-bottom 1px solid #ececec
  overflow hidden
  .photo
    float left
    width 2.3rem
    height 2.3rem
  .info
    float right
    width 7rem
    .title
      font-size 0.4rem
      height 1rem
      overflow hidden
      line-height 0.5rem
    .price_wrap
      color red
      line-height 0.7rem
      .price
        font-size 0.5rem
        margin-right 0.2rem
      .oldPrice
        font-size 0.25rem
        color #333
        text-decoration line-through
      .orderBtn
        float right
        height 0.6rem
        width 2rem
        background #fd3c4f
        color white
        text-align center
        line-height 0.6rem
        border-radius 0.4rem
    .times
      font-size 0.3rem
      color red
</style>
