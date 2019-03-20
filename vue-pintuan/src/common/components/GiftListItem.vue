<template>
  <div class="giftListItem">
    <div class="item">
      <img :src="data.showPhotoUrl" class="pic" alt>
      <div class="info">
        <div class="title">{{data.name}}</div>
        <div class="endTime">有效期至：{{endTime}}</div>
      </div>
    </div>
    <div class="btnGroup" v-if="status == 0">
      <span class="btn" @click="goDetail">去兑换</span>
    </div>
  </div>
</template>
<script type='text/javascript'>
export default {
  props: ["data", "status"],
  data() {
    return {};
  },
  created() {
    console.log(this.data);
  },
  methods: {
    goDetail() {
      this.$router.push(`GiftDetail/${this.data.id}?accId=${this.data.accId}&endTime=${this.endTime}`);
    },
    fmtDate(dateStr) {
      var date = new Date(dateStr);
      var Month = date.getMonth() + 1;
      var Day = date.getDate();
      var Y = date.getFullYear() + "-";
      var M = Month < 10 ? "0" + Month + "-" : Month + "-";
      var D = Day < 10 ? "0" + Day : Day;
      return Y + M + D;
    }
  },
  computed: {
    endTime() {
      return this.fmtDate(this.data.accValidEndDate);
    }
  }
};
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
.giftListItem
  background white
  margin 0.2rem 0
  .item
    width 100%
    height 2.4rem
    box-sizing border-box
    padding 0.2rem
    border 0.5px solid #eee
    .pic
      float left
      width 2rem
      height 2rem
    .info
      float right
      width 7rem
      height 2rem
      & > div
        height 0.7rem
        font-size 0.4rem
        line-height 0.7rem
      & .endTime
        font-size 0.3rem
  .btnGroup
    padding 0.2rem
    overflow hidden
    text-align right
    .btn
      display inline-block
      padding 0.2rem 0.3rem
      border 0.5px solid #ff605d
      color #ff605d
      border-radius 0.1rem
</style>
