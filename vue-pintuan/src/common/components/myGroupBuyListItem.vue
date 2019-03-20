<template>
  <div class="myGroupBuyListItem">
    <img :src="data.photo" class="photo" alt>
    <div class="info">
      <p class="itemName">{{data.itemName}}</p>
      <p class="price">
        {{points | fulterUnit}}
        <span
          class="lucky"
          v-if="data.activityProductVo.groupType == 2 && data.activityProductVo.operStatus == 1"
        >{{data.activityProductVo.isPrize == 1 ? '已中奖' : '待开奖'}}</span>
        <span
          class="lucky" 
          v-if="data.activityProductVo.groupType == 2 && data.activityProductVo.operStatus == 2"
        >未中奖</span>
      </p>
      <p
        class="time"
        v-if="times && timeStatus != 1 && data.activityProductVo.operStatus == 0 "
      >距离结束：{{times}}</p>
      <div class="status">
        {{statusText}}
        <div
          v-if="data.activityProductVo.operStatus == 0 && timeStatus == 0"
          class="btn"
          @click="$router.push('/groupBuyDetail?id=' + data.activityProductVo.recordId)"
        >拼团详情</div>
        <div
          v-if="data.activityProductVo.operStatus == 1 && (data.operStatus == 22 || data.operStatus == 23)"
          class="btn"
          @click="$router.push('/orderDetail?orderNo=' + data.orderNo)"
        >订单详情</div>
      </div>
    </div>
  </div>
</template>
<script type='text/javascript'>
let diff = 0;
export default {
  props: ["data"],
  data() {
    return {
      diffTime: "",
      timeStatus: -2
    };
  },
  destroyed() {
    let that = this;
    if (that.timer) {
      clearInterval(that.timer);
    }
  },
  created() {
    diff = Date.now() - this.data.currentTime;
    let that = this;
    that.countdown();
    this.timer = setInterval(that.countdown, 1000);
  },
  methods: {
    countdown() {
      //倒计时
      let that = this;
      let vo = this.data.activityProductVo;
      let endTime = vo.endDate < vo.orderEndDate ? vo.endDate : vo.orderEndDate;
      let nowTime = Date.now() - diff;
      let diffTime = 0;
      diffTime = endTime - nowTime;
      this.diffTime = diffTime;
    },
    filterTime() {
      //返回活动状态
      let vo = this.data.activityProductVo;
      let endTime = vo.endDate < vo.orderEndDate ? vo.endDate : vo.orderEndDate;
      var startTime = this.data.activityProductVo.startDate;
      var nowTime = Date.now() - diff;
      if (nowTime < endTime && nowTime >= startTime) {
        //正在活动中
        this.timeStatus = 0;
        return 0;
      } else if (nowTime < startTime) {
        //活动未开始
        this.timeStatus = -1;
        return -1;
      } else if (nowTime > endTime) {
        this.timeStatus = 1;
        //活动已结束
        return 1;
      }
    }
  },
  computed: {
    times() {
      if (this.filterTime() == 1) {
        return "";
      }
      let diffTime = this.diffTime;
      var day = parseInt(diffTime / 1000 / 60 / 60 / 24).toString();
      day = day.length < 2 ? "0" + day : day;
      var hour = parseInt((diffTime / 1000 / 60 / 60) % 24).toString();
      hour = hour.length < 2 ? "0" + hour : hour;
      var minute = parseInt((diffTime / 1000 / 60) % 60).toString();
      minute = minute.length < 2 ? "0" + minute : minute;
      var sec = parseInt((diffTime / 1000) % 60).toString();
      sec = sec.length < 2 ? "0" + sec : sec;
      let time = day + "天" + hour + "时" + minute + "分" + sec + "秒";
      return time;
    },
    points() {
      let newPoint = 0;
      if (this.data.activityProductVo.recordType == 1) {
        newPoint = (
          this.data.ratio * this.data.activityProductVo.captainPrice
        ).toFixed(2);
        return newPoint;
      }
      newPoint = (
        this.data.ratio * this.data.activityProductVo.memberPrice
      ).toFixed(2);
      return newPoint;
    },
    statusText() {
      let text = "";
      let vo = this.data.activityProductVo;
      let status = this.data.activityProductVo.operStatus;
      if (status == -1) {
        text = "拼团失败";
      } else if (status == 0) {
        text = "拼团中";
        if (this.filterTime() == 1) {
          return "已结束";
        }
      } else if (status == 1 || status == 2) {
        text = "拼团成功";
      }
      return text;
    }
  }
};
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
.myGroupBuyListItem
  overflow hidden
  padding 0.3rem
  background white
  border-bottom 1px solid #ccc
  .photo
    float left
    width 3rem
    height 3rem
  .info
    float right
    width 6rem
    font-size 0.4rem
    .itemName
      height 1.2rem
      overflow hidden
      line-height 0.6rem
    .price
      color red
      line-height 0.6rem
      .lucky
        float right
        color #ccc
        font-size 0.4rem
    .time
      font-size 0.35rem
      line-height 0.5rem
    .status
      line-height 0.8rem
      color red
    .btn
      float right
      height 0.8rem
      line-height 0.8rem
      padding 0 0.3rem
      background red
      color white
      border-radius 0.1rem
</style>
