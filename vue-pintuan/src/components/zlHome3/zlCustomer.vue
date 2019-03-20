<template>
  <div class="zlCustomer3">
    <scroll class="scroll" :listenScroll="true" :probeType="3" ref="scroll">
      <div class="content">
        <img src="./image/back.png" class="back" @click="back" alt>
        <img src="./image/zlHome/banner.png" class="banner" alt>
        <img src="./image/zlHome/title.png" class="title" alt="">
        <div class="list">
          <div class="item">
            <div class="info">
              <div class="photo">
                <div class="photoWrap">
                  <img :src="detail.photo" @click="toShowRules">
                </div>
                <div style="font-size: 0.2rem;color:#000;line-height: 0.4rem;font-weight: bold;text-align:center;">10人助力,抢资格!</div>
              </div>
              <div class="productInfo">
                <div class="price">
                  <span style="margin-right: 0.3rem;color:#000;font-weight: bold;font-size:0.3rem">
                    市场价:
                  <i style="text-decoration: line-through">{{detail.salePoints | fulterUnit}}</i>
                  </span>
                  <i style="font-size:0.4rem;color:#c8132d;font-weight: bold;">{{detail.activityProductVo.floorPrice | fulterUnit}}</i>
                </div>
                <!--<div class="consumption">符合资格 {{num}}人</div>-->
                <div class="btn" @click="spell">为他助力</div>
              </div>
            </div>
            <div class="again" @click="$router.push('/zlHome3')">我也要领礼包</div>
          </div>
          <img src="./image/zlHome/tplink.png" alt="" class="tplink">
        </div>

        <img src="./image/zlHome/rule.png" class="rule" alt>
      </div>
    </scroll>
    <transition  name="opacity">
      <div class="shadow" v-show="showRules" @click="toShowRules" @touchmove.prevent>
        <div class="toast">
          <h3>【权益名称】50元沃尔玛线上代金券</h3>
          <h5>【使用规则】</h5>
          <p>1、每张代金券仅限使用1次，不可叠加；</p>
          <p>2、该代金券仅限在招商银行APP使用一网通支付购买沃尔玛电子礼品卡时进行抵扣，不可用于其他渠道；</p>
          <p>3、用户可通过登录手机银行，在首页-我的-票券中查看已领取到的票券信息；</p>
          <p>4、代金券需在2019年2月28日前完成兑换，过期无效；</p>
          <p>5、若发生退款，该代金券不退回，敬请谅解。</p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script type='text/ecmascript-6'>
import { mapGetters } from "vuex";
import { Toast } from "mint-ui";
import scroll from "../../common/components/scroll.vue";
export default {
  data() {
    return {
      id: this.$route.query.id,
      detail: {},
      num: 0,
      cutFlag: true,
      actGoods: "0",
      showRules: false,
    };
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.scroll.refresh();
    });
  },
  created() {
    //var vn = new VConsole()
    //console.log(this.user)
    let href = window.location.href;
    if (href.indexOf("flag=1") < 0) {
      window.location.href = this.$until.auth(this.AuthConfig);
      return;
    }
    this.$http
      .post(
        this.$api.spellDetail,
        this.$until.getFormData({
          recordsId: this.id,
          token: this.token ? this.token : ""
        })
      )
      .then(({ data }) => {
        if (data.success) {
          this.detail = data.obj.entity;
          if (
            this.detail.activityProductVo.productCutRecords[0].cutUserName ==
            this.user.id
          ) {
            this.$router.push("/zlHome3");
            return;
          }
          this.$http
            .post(
              this.$api.productSaleNum,
              this.$until.getFormData({
                id: data.obj.entity.id
              })
            )
            .then(res => {
              this.num = res.data.obj.saleNum;
            });
        } else {
          Toast(data.msg);
        }
      });
  },
  methods: {
    changGoods(id) {
      console.log(id);
      this.actGoods = id;
    },
    toShowRules() {
      this.showRules = !this.showRules
    },
    back() {
      this.$until.closeApp();
    },
    spell() {
      if (!this.cutFlag) return;
      this.cutFlag = false;
      this.$http
        .post(
          this.$api.helperCut,
          this.$until.getFormData({
            recordsId: this.id,
            token: this.token
          })
        )
        .then(({ data }) => {
          this.cutFlag = true;
          if (data.success) {
            if (data.msg.indexOf("最低价") != -1) {
              //Toast('助力已成功!')
              Toast('该订单已助力成功，请勿重复助力')
              return;
            }
            if (data.msg.indexOf("砍过价") != -1) {
              Toast("您已经助过力!");
              return;
            }
            if (data.msg.indexOf("同一人") != -1) {
              Toast("当前活动帮同一人助力次数为1次!");
              return;
            }
            if (data.msg.indexOf("砍价次数限制") != -1) {
              Toast("当前活动助力次数为1次!");
              return;
            }
            if (data.msg.indexOf("砍价已失效") != -1) {
              Toast("助力已失效!");
              return;
            }
            Toast("助力成功!");
          } else {
            if (data.msg.indexOf("最低价") != -1) {
              //Toast('助力已成功!')
              Toast('该订单已助力成功，请勿重复助力')
              return;
            }
            if (data.msg.indexOf("同一人") != -1) {
              Toast("当前活动帮同一人助力次数为1次!");
              return;
            }
            if (data.msg.indexOf("砍价次数限制") != -1) {
              Toast("当前活动助力次数为1次!");
              return;
            }
            if (data.msg.indexOf("砍过价") != -1) {
              Toast("您已经助过力!");
              return;
            }
            if (data.msg.indexOf("砍价已失效") != -1) {
              Toast("助力已失效!");
              return;
            }
            Toast(data.msg);
          }
        })
        .catch(e => (this.cutFlag = true));
    }
  },
  computed: {
    ...mapGetters(["siteId", "token", "user", "AuthConfig"])
  },
  components: {
    scroll
  }
};
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css' scoped>
.zlCustomer3
  position absolute
  left 0
  top 0
  bottom 0
  right 0
  background white
  overflow auto
  -webkit-overflow-scrolling touch
  .ruleImg
    position fixed
    left 0
    top 0
    bottom 0
    right 0
    background rgba(0, 0, 0, 0.7)
    z-index 100
    .img
      width 8rem
      position absolute
      left 50%
      top 20%
      margin-left -4rem
  .scroll
    position absolute
    left 0
    top 0
    bottom 0
    right 0
  .back
    width 1rem
    height 1rem
    position fixed
    left 0.5rem
    top 0.5rem
    z-index 100
  .content
    background url('./image/zlHome/bg.png') repeat left top
    background-size 100% 100%
  .banner
    width 100%
  .title
    display block
    width 80%
    margin 0.3rem auto
  .list
    position relative
    margin 1rem auto
    width 8.9rem
    .tplink
      position absolute
      left 50%
      bottom -1rem
      transform translateX(-50%)
      width 70%
      height 1.6rem
    .item
      width 100%
      background url('./image/zlHome/itemBg.png') no-repeat center bottom
      background-size 98% 100%
      padding 0.5rem 0
      .info
        display flex
        justify-content space-between
        .photo, .productInfo
          width 50%
        .photo
          box-sizing border-box
          padding 0.5rem 0.7rem
          .photoWrap
            width 3.3rem
            height 2.1rem
            margin 0 auto 0.3rem
            box-shadow 0 5px 5px #666
            background url('./image/zlHome/photo-bg.png') no-repeat center
            background-size 100% 100%
            display flex
            justify-content center
            align-items center
            img
              height 75%
              max-height 1.5rem
              max-width 2.5rem
        .productInfo
          padding-top 0.5rem
          padding-right 0.5rem
          .price
            color #ffe25d
            font-size 0.4rem
          .consumption
            padding 0.05rem 0.2rem
            display inline-block
            font-size 0.2rem
            color black
            font-weight bold
            border 1px solid black
            margin 0.2rem 0
          .btn
            width 3.6rem
            height 1.05rem
            background url('./image/zlHome/btn-bg.png') no-repeat center
            background-size 100% 100%
            text-align center
            line-height 1.05rem
            font-size 0.4rem
            color white
      .again
        width 5rem
        height 1rem
        line-height 1rem
        text-align center
        border-radius 0.1rem
        color #c9572e
        font-family '黑体'
        margin 0 auto
        font-size 0.4rem
        background #f1bf70
        box-shadow 0 0 10px #333
      .load
        color #59dadf
        padding 0 0.5rem
      .loadBar
        width 7.8rem
        height 0.2rem
        border-radius 0.2rem
        margin 0.2rem auto 0.3rem
        background #21718b
        box-shadow 1px 1px 2px #333
        overflow hidden
        .loading
          width 50%
          height 100%
          border-radius 0.2rem
          background #fae37d
  .rule
    display block
    margin -0.5rem auto 0
    width 89%
  .footer
    width 100%
    margin-top -5.5rem
  .shadow
    position fixed
    left 0
    top 0
    bottom 0
    right 0
    background rgba(0,0,0,0.5)
    z-index 11
    .toast
      position absolute
      left 50%
      top 30%
      transform translateX(-50%)
      width 90%
      padding 0.5rem
      box-sizing border-box
      // text-align center
      color #333
      background-color #fff
      border-radius 0.1rem
      h3
        font-size 0.4rem
        line-height 0.64rem
      h5
        font-size 0.37rem
        line-height 0.64rem
      p
        padding-left 0.1rem
        width 100%
        line-height 0.54rem
        font-size 0.32rem
</style>
