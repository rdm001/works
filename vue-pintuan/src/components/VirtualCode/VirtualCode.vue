<template>
  <div class="virtualCode">
    <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="查看卡券">
      <div @click="$router.go(-1)" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>
    <div class="code-wrap">
      <ul>
        <li class="codeItem" v-for="(item,index) in codeList" :key="index">
          <div class="info">
            <img v-if="item.operStatus == 1" src="./image/used.png" class="used" alt>
            <div class="title">
              <i class="icon_ticket"></i>
              {{orderDetail.itemName}}
            </div>
            <div class="endTime">有效期：{{item.validEndDate}}</div>
            <qr-code class="codeImgs" :codeId="index" :code="item.virtualCode" :codeUrl="item.jumpUrl" :itemId="itemId"></qr-code>
          </div>
        </li>
      </ul>
      <a
        v-if="siteId==18 && orderDetail.itemId == 5513"
        href="http://t.cmbchina.com/vNeJEA"
        style="display:block;width: 3rem;line-height:0.8rem;margin:0.3rem auto 0;background: #3b79f2;color:white;text-align: center;border-radius: 0.1rem"
      >去使用</a>
    </div>
  </div>
</template>
<script type='text/javascript'>
import { mapGetters } from "vuex";

import qrCode from "../../common/components/QrCode.vue";
export default {
  data() {
    return {
      id: 0,
      codeList: [],
      orderDetail: {},
      itemId: 0
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.itemId = this.$route.query.itemId;
    this._initData();
  },
  methods: {
    _initData() {
      this.$http
        .post(
          this.$api.virtualCode,
          this.$until.getFormData({
            token: this.token,
            orderDetailId: this.id
          })
        )
        .then(({ data }) => {
          if (data.success) {
            this.orderDetail = data.obj.entity;
            this.codeList = data.obj.entity.productVirtualAccCashList;
            console.log(this.codeList)
          } else {
            Toast(data.msg);
          }
        });
    }
  },
  computed: {
    ...mapGetters(["token", "siteId"])
  },
  components: {
    qrCode
  }
};
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../../common/css/variable.styl'
.virtualCode
  .code-wrap
    fullScreen(40px, 0, 0, 0)
    z-index 10
    overflow-y auto
    -webkit-overflow-scrolling touch
    .codeItem
      width 9rem
      margin 0.3rem auto
      background white
      .used
        width 2rem
        position absolute
        left 0.5rem
        top 0.2rem
      .info
        width 100%
        padding-bottom 0.5rem
        .title
          position relative
          padding 0.4rem 0 0
          padding-left 2rem
          line-height 0.6rem
          font-size 0.35rem
          width 7rem
          margin 0 auto
          .icon_ticket
            position absolute
            left 1.3rem
            top 0.7rem
            width 0.5rem
            height 0.5rem
            background url('./image/icon_ticket.png') no-repeat center
            background-size 100% 100%
        .endTime
          padding 0.1rem 2rem 0.3rem
          margin 0 auto
          border-bottom 0.5px solid #eee
        .codeImgs
          width 100%
          margin 0 auto
</style>
