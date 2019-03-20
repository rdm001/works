<template>
  <div class="zlCustomer3">

    <scroll class="scroll" style="z-index: 2" :listenScroll="true" :probeType="3" ref="scroll">
      <div class="content" style="padding-bottom: 2rem">
        <!-- <img src="./image/zlHome/banner.png" class="banner" alt> -->
        <div class="bannerBox"></div>
        <img src="./image/zlHome/pigfight.png" style="width: 8rem;position: absolute;left: 1rem;top:1.5rem;z-index: 1" alt="" >
        <img src="./image/zlHome/logo.png" alt="" style="width:3rem;position: absolute;left:0.8rem;top:0.3rem">
        <img src="./image/zlHome/111.png" style="width: 6rem;position: absolute;left:2rem;top:5rem;z-index: 1" alt="">
        <img src="./image/zlHome/222.png" style="width: 4rem;position: absolute;left:0.5rem;top:9rem;z-index: 1" alt="">
        <img src="./image/zlHome/3.png" style="width: 5rem;position: absolute;right:0.08rem;top:9rem;z-index: 1" alt="">
        <img src="./image/zlHome/title.png" class="title" alt="">
        <div class="list">
          <div class="item">
            <div class="info">
              <div class="photo">
                <div class="photoWrap" @click="changGoods(detail.id)">
                  <img :src="detail.photo" alt>
                </div>
                <div
                  style="font-size: 0.2rem;color:#ec1e4e;line-height: 0.4rem;font-weight: bold;text-align:center;"
                >3人助力,抢资格!</div>
              </div>
              <div class="productInfo">

                  <!-- <i>{{detail.activityProductVo.floorPrice | fulterUnit}}</i> -->
                  <div class="price">
                    <i>{{detail.activityProductVo.floorPrice | fulterUnit}}</i>
                    <span style="color:#ec1e4e;font-weight: bold;font-size:0.3rem">
                    市场价:
                    <i style="text-decoration: line-through">{{detail.salePoints | fulterUnit}}</i>
                  </span>

                </div>
                <!-- <div class="consumption">符合资格 {{num}}人</div> -->
                <div class="btn" @click="spell">为Ta助力</div>
              </div>
            </div>
            <div class="again" @click="toWalMark">去抽奖</div>
          </div>
        </div>
        <img src="./image/ruleCunstr.png" alt="" class="constr" @click="showRules">
        <!-- <img src="./image/zlHome/rule.png" class="rule" alt> -->
      </div>
    </scroll>
    <transition  name="opacity">
      <div class="shadow" v-show="ruleFlag">
        <div class="rules">
          <div class="rule-box">
            <div class="rule-son">
              <h5>1、活动名称：</h5>
              <p>找猪大作战</p>
              <h5>2、活动时间</h5>
              <p>即日起-2019年2月13日</p>
              <p>第一阶段：即日起-2019年2月2日</p>
              <p>第二阶段：2019年2月3日-2019年2月13日</p>
              <h5>3、活动对象</h5>
              <p>招行APP一网通用户</p>
              <h5>4、活动概述：</h5>
              <p>用户参与活动，成功发起并完成3人助力可获得2019元无门槛机酒券、酒店抵用金、港澳台漫游金等奖品抽奖机会，中奖率高达100%。</p>
              <h5>5、活动流程</h5>
              <img src="./image/zlHome/rules.jpg" style="width: 100%" alt="">
              <h5>6、活动细则</h5>
              <span>（1）用户输入生日检测属相</span>
              <span>（2）若满足生肖为猪（以农历为准）即可发起好友助力，完成3名好友助力即可获得抽奖资格。</span>
              <span>（3）若不满足生肖为猪则可将活动一键转发给生肖为猪的好友，在收到属猪好友助力/抽奖邀请后，即可获得抽奖资格。</span>
              <span>（4）所有用户仅可以发起一次助力，为他人助力次数不限但为同一人只可助力一次。同一用户在每阶段仅可参与1次抽奖，累计参与抽奖不超过2次。</span>
              <span>（5）完成活动助力或收到属猪好友抽奖邀请，即可参与抽奖，奖品数量有限先到先得 。</span>
              <span>（6）具体参与资格信息以招商银行系统后台数据为准。</span>
              <span>（7）本活动奖品为2019元无门槛机票酒店抵用券、100元酒店抵用券、50元酒店抵用券、28元港澳台流量包。相关券码将直接发放至用户“我的票券”账户。</span>
              <span>（8）抽奖过程中若遇手机网络异常情况，以“我的-我的票券”中显示奖品为准。</span>
              <span>（9）同一手机号、同一证件号（符合以上任一条件）均视为同一客户，参与次数和交易时间以招商银行系统记录为准，如发生退货交易，活动参与资格不另行补偿。活动过程中如发现违规行为（包括但不限于套现、虚假消费等交易）或有碍于其他客户公平参与本次活动，我行有权取消有此行为的客户参与活动的资格，并扣除参与活动所获得的奖品。 </span>
            </div>
            <img src="./image/pig.png" alt="" class="pig">
          </div>
        </div>
        <img src="./image/x.png" alt="" class="closeRules" @click="showRules">
        <!-- <img src="./image/rules.png" alt="" class="rules"> -->
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
      time:0,
      ruleFlag: false,
    };
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.scroll.refresh();
    });
  },
  created() {
    // var vn = new VConsole()
    console.log(this.user)
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
        if (data.success){
          this.detail = data.obj.entity;
          this.time = this.detail.currentTime
          if (
            this.detail.activityProductVo.productCutRecords[0].cutUserName ==
            this.user.id
          ) {
            this.$router.push("/zlHome4");
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
      this.actGoods = id;
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
    },
    toWalMark() {
      var flagTime = new Date('2019/02/03 00:00:00')
      if (flagTime.getTime() > this.time) {
        window.location.href = 'https://act.cmbchina.com/ActShipMobile/Pages/PointDrawDetail.aspx?ActGroupID=AGP20190128133006tbNdgUYe'

      } else {
        window.location.href = 'https://act.cmbchina.com/ActShipMobile/Pages/PointDrawDetail.aspx?ActGroupID=AGP20190128140936F2AXx3vr'
      }
    },
    showRules() {
      this.ruleFlag = !this.ruleFlag
    },
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
@import '../../common/css/variable.styl'
.zlCustomer3
  position absolute
  left 0
  top 0
  bottom 0
  right 0
  overflow auto
  -webkit-overflow-scrolling touch
  background-color #070c45

  background-size 100% 100%
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
  .content
     background url('./image/zlHome/bg2.png') repeat left top
     background-size 100% 100%
  .bannerBox
    width 100%
    height 12rem
  .banner
    width 100%
  .title
    display block
    width 40%
    margin 0.3rem auto
  .constr
    position relative
    float right
    width 3rem
    margin-right 0.5rem
  .list
    position relative
    margin 0rem auto 0.2rem
    width 8.9rem
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
            height 3.3rem
            margin 0 auto 0.3rem
            // box-shadow 0 5px 5px #666
            // background url('./image/zlHome/photo-bg.png') no-repeat center
            // background-size 100% 100%
            display flex
            justify-content center
            align-items center
            img
              width 100%
              height 100%
              display block
        .productInfo
          padding-top 0.5rem
          padding-right 0.5rem
          .price
            font-size 0.4rem
            font-weight bold
            color #ec1e4e
            > i
              display inline-block
              vertical-align bottom
              font-size 0.5rem
            span
              display inline-block
              vertical-align bottom
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
            margin-top 0.6rem
            background url('./image/zlHome/btn-bg.png') no-repeat center
            background-size 100% 100%
            text-align center
            line-height 1.05rem
            font-size 0.4rem
            color white
      .again
        width 70%
        height 1rem
        line-height 1rem
        margin 0 auto
        text-align center
        border-radius 0.1rem
        color #ec1e4e
        font-size 0.4rem
        font-family '黑体'
        border 2px solid #ec1e4e
      .load
        color #59dadf
        padding 0 0.5rem
      .loadBar
        width 7.8rem
        height 0.2rem
        border-radius 0.2rem
        margin 0.2rem auto 0
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
    fullScreen(0,0,0,0)
    position fixed
    background rgba(0,0,0,0.7)
    z-index 11
    .rules
      position absolute
      left 50%
      top 50%
      transform translate3d(-50%,-50%,0)
      width 80%
      height 10rem
      padding 0.667rem
      border-radius 0.2rem
      background-color #fff
      box-sizing border-box
      .rule-box
        width 100%
        height 100%
        background-color #fff
        overflow-y auto;
        .pig
          position fixed
          left 50%
          top -1rem
          height 2rem
          transform translateX(-50%)
        .rule-son
          width 100%
          h5
            font-size 0.373rem
            line-height 0.6rem
            font-weight 700
            margin-top 0.2rem
          p
            font-size 0.32rem
            line-height 0.6rem
          span
            display block
            margin 0 auto
            font-size 0.32rem
            line-height 0.6rem
    .closeRules
      position fixed
      left 50%
      transform translateX(-50%)
      bottom 2rem
      width 1rem
</style>
