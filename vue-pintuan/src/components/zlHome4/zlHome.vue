<template>
  <div class="zlHome4">
    <img src="./image/back.png" class="back" @click="back" alt>
    <scroll class="scroll" :listenScroll="true" :probeType="3" ref="scroll">
      <div class="content" style="padding-bottom:2rem">

        <div class="bannerBox"></div>
        <!-- <img src="./image/zlHome/banner.png" class="banner" alt> -->
        <img src="./image/zlHome/title.png" class="title"  alt>
        <div class="list">
          <div class="item" v-for="(item,index) in list" :key="index">
          <div class="info">
              <div class="photo">
                <div class="photoWrap" @click="changGoods(item.id)">
                  <img :src="item.photo" alt>
                </div>
                <div
                  style="font-size: 0.2rem;color:#ec1e4e;line-height: 0.4rem;font-weight: bold;text-align:center;"
                >3人助力,抢资格!</div>
              </div>
              <div class="productInfo">
                <div class="price">
                  <i>{{item.price | fulterUnit}}</i>
                  <span style="color:#ec1e4e;font-weight: bold;font-size:0.3rem">
                    市场价:
                    <i style="text-decoration: line-through">{{item.oldPrice | fulterUnit}}</i>
                  </span>
                </div>
                <!-- <div class="consumption">符合资格{{item.num}}人</div> -->
                <div class="btn" v-if="!item.success" @click="spell(item)">邀请好友助力/抽奖</div>
                <!--<div class="btn" v-if="item.success && item.vo.remarks != 1" @click="getGift(item)">领取奖品</div>-->
                <div class="btn" v-if="item.success" @click="toWalMark">去抽奖</div>
              </div>
            </div>
            <div v-if="item.vo">
              <div class="load">
                <span>邀请进度: {{ item.helpers }} / {{item.vo.cutNumber}}</span>
              <!--  <span style="margin-left:0.3rem" v-if="!item.success">此次邀请还剩{{item.diffTime | filterDate}}分钟过期哦</span>-->
              </div>
              <div class="loadBar">
                <div
                  class="loading"
                  :style="{width: (item.helpers * 100 / item.vo.cutNumber) + '%'}"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <img src="./image/ruleCunstr.png" alt="" class="constr" style="position: relative;z-index: 10;top:0.3rem" @click="showRules">
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
  <!--  <div class="zlHome">
    <div style="position: absolute;left:0;top:40%;width: 100%;text-align: center;font-size: 0.5rem">活动已结束</div>
  </div>-->
</template>
<script type='text/ecmascript-6'>
//话费 6994    KFC 6993   手机 6992
let itemIds = [7489];
import { mapGetters } from "vuex";
import { Toast } from "mint-ui";
import scroll from "../../common/components/scroll.vue";
let diff = 0;

export default {
  data() {
    return {
      list: [],
      spellList: [],
      showAlert: false,
      actGoods: "0",
      ruleFlag: false,
      time:0
    };
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.scroll.refresh();
    });
  },
  filters: {
    filterDate(val) {
      return parseInt(val / 60000) + 1;
    }
  },
  watch: {
    spellList(newVal) {
      if (newVal[0] == true) {
        return;
      }

      itemIds.forEach(e => {
        this.init(e);
      });
      /*newVal.forEach((e) => {
                this.list.forEach((j) => {
                    if(e.activityProductVo.siteProductId == j.id){

                    }
                })
            })*/
    },

    list(newVal) {
      let obj = newVal[newVal.length - 1];
      //console.log(newVal)
      if (obj.diffTime == 0) {
        if (obj.operStatus == 22 || obj.operStatus == 23) return;
        obj.timer = setInterval(() => {
          let endTime = obj.vo.endDate;
          let nowTime = Date.now() - diff;
          obj.diffTime = endTime - nowTime;

          /*   if(obj.diffTime < 0){
                      //obj.vo = null
                    }
                    clearInterval(obj.timer)*/
          this.list.forEach(e => {
            if (e.diffTime < 0) {
              console.log(e);
              // console.log(obj.operStatus)
              clearInterval(e.timer);
              this.list = [];
              this.spellList = [true];
              this.initSpell();
            }
          });
        }, 1000);
      }

      /*  newVal[newVal.length - 1].timer = setInterval(() => {
              let obj = newVal[newVal.length -1]
              let endTime = obj.vo.endDate;
              let nowTime = Date.now() - diff
              obj.diffTime =  endTime - nowTime
            },1000)*/
    }
  },
  destroyed() {
    this.list.forEach(e => {
      if (e.timer) {
        clearInterval(e.timer);
      }
    });
  },
  created() {
    let href = window.location.href;
    console.log('href')
    console.log(href)
   /* if (href.indexOf("flag=1") < 0) {
      window.location.href = this.$until.auth(this.AuthConfig);
      return;
    }*/

    this.initSpell();
  },
  methods: {
    changGoods(id) {
      this.actGoods = id;
    },
    back() {
      this.$until.closeApp();
    },
    share(item, id) {
      window.location.href = `http://cmbls/socialshare?id=mpBank&&channel=defaultWithNoSMS&type=url&title=百万礼金悬赏猪百万，快来助力吧！&text=寻找猪队友，赢2019元旅行基金
      &picurl=${item.photo}&url=${this.AuthConfig.authShorUrl}?zlid4=${id}`;
      // window.location.href = `http://cmbls/socialshare?id=mpBank&&channel=defaultWithNoSMS&type=url&title=2019元旅行基金免费抢，快来帮我助力吧！&text=${
      //   item.name
      // }&picurl=${item.photo}&url=${this.AuthConfig.authShorUrl}?zlid4=${id}`;
    },
    spell(item) {
      let product = item;
      //console.log(item)
      if (item.recordsId) {
        this.share(item, item.recordsId);
        return;
      }
      let query = {
        cartItemList: [{ itemId: product.id, shopNum: 1 }],
        orgId: product.orgId,
        payWay: "ye",
        remark: "",
        siteId: this.siteId,
        source: product.source,
        supplyId: product.supplyId,
        token: this.token,
        userAddressId: this.id,
        orderType: 4
      };
      this.$http
        .post(this.$api.spell, JSON.stringify(query), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        })
        .then(({ data }) => {
          if (data.success) {
            Toast("发起助力成功");
            this.list = [];
            this.spellList = [true];
            this.initSpell();
            this.$nextTick(() => {
              this.share(item, data.obj.recordsId);
            });

            /*this.$router.push('/SpellGroupDetail?id=' + data.obj.recordsId + '&alert=true')*/
          } else {
            /*this.cancel();*/
            if (data.msg.indexOf("过期") != -1) {
              Toast("不在活动时间内");
              return;
            }
            Toast(data.msg);
          }
        });
    },
    getGift(item) {
      console.log(item);
      this.$http
        .post(
          "/api/client/act/cut/setRemarks",
          this.$until.getFormData({
            token: this.token,
            recordsId: item.recordsId,
            remarks2: "1"
          })
        )
        .then(({ data }) => {
          if (data.success) {
            Toast("领取成功");
            this.list = [];
            this.spellList = [true];
            this.initSpell();
          }
        });
    },
    initSpell() {
      // 查询 对应商品 是否有正在砍价的订单
      this.$http
        .post(
          "/api/client/act/cut/htlpList",
          this.$until.getFormData({
            siteId: this.siteId,
            token: this.token,
            activityType: 2,
            pageNo: 0,
            pageSize: 10000
          })
        )
        .then(({ data }) => {
          if (data.success) {
            let arr = [];
            itemIds.forEach(e => {
              data.obj.page.rows.forEach(j => {
                if (j.activityProductVo.siteProductId == e) {
                  arr.push(j);
                }
              });
            });
            this.spellList = arr;
            //   console.log(this.spellList)
          }
        });
    },
    init(id) {
      let obj = {};
      obj.id = id;
      this.$http
        .all([
          this.$http.post(
            this.$api.productDetail,
            this.$until.getFormData({
              id: id
            })
          ),
          this.$http.post(
            this.$api.productSaleNum,
            this.$until.getFormData({
              id: id
            })
          )
        ])
        .then(
          this.$http.spread((res1, res2) => {
            if (res1.data.success) {
              this.time = res1.data.obj.entity.currentTime

              obj.oldPrice = res1.data.obj.entity.salePoints;
              obj.price = res1.data.obj.entity.activityProductVo.floorPrice;
              obj.photo = res1.data.obj.entity.photo;
              obj.source = res1.data.obj.entity.source;
              obj.supplyId = res1.data.obj.entity.supplyId;
              obj.cutNum = res1.data.obj.entity.activityProductVo.cutNumber;
              obj.name = res1.data.obj.entity.itemName;
            }
            if (res2.data.success) {
              obj.num = res2.data.obj.saleNum;
            }
            let flag = true;
            this.spellList.forEach(e => {
              console.log(res1.data.obj.entity.id);
              if (
                res1.data.obj.entity.id == e.activityProductVo.siteProductId
              ) {
                obj.operStatus = e.operStatus;
                obj.vo = e.activityProductVo;

                flag = false;
                this.$http
                  .post(
                    this.$api.spellDetail,
                    this.$until.getFormData({
                      recordsId: e.activityProductVo.recordsId,
                      token: this.token ? this.token : ""
                    })
                  )
                  .then(view => {
                    if (view.data.success) {
                      obj.helpers = view.data.obj.cutCount;
                      diff = Date.now() - view.data.obj.entity.currentTime;
                      obj.vo = view.data.obj.entity.activityProductVo;
                      obj.recordsId = view.data.obj.entity.cutRecordsId;
                      obj.diffTime = 0;
                      if (view.data.obj.entity.activityProductVo.orderNo) {
                        obj.Ended = true;
                        obj.success = true;
                      }
                    }
                    this.list.push(obj);
                  });
              }
            });
            if (flag) {
              this.list.push(obj);
            }
            console.log(this.list);
          })
        )
        .then(() => {});
    },
    showRules() {
      this.ruleFlag = !this.ruleFlag
    },
    toWalMark() {
      var flagTime = new Date('2019/02/03 00:00:00')
      if (flagTime.getTime() > this.time) {
        window.location.href = 'https://act.cmbchina.com/ActShipMobile/Pages/PointDrawDetail.aspx?ActGroupID=AGP20190128133006tbNdgUYe'

      } else {
        window.location.href = 'https://act.cmbchina.com/ActShipMobile/Pages/PointDrawDetail.aspx?ActGroupID=AGP20190128140936F2AXx3vr'
      }
    }
  },
  computed: {
    ...mapGetters(["siteId", "token", "AuthConfig", "user"])
  },
  components: {
    scroll
  }
};
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css' scoped>
@import '../../common/css/variable.styl'
.zlHome4
  position absolute
  left 0
  top 0
  bottom 0
  right 0
  overflow-y auto
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
  .back
    width 1rem
    height 1rem
    position fixed
    left 0.3rem
    top 1.3rem
    z-index 100
    // background url('./image/zlHome/bg.png') repeat left top
    // background-size 100% 100%
  .content
     background url('./image/zlHome/bg.png') no-repeat left top
     background-size 100% auto
 .bannerBox
    width 100%
    height 9rem
 .banner
    width 100%
  .title
    display block
    width 40%
    margin 0.3rem auto
  .list
    position relative
    margin auto
    width 8.9rem
    background-size 100% 100%
    .item
      width 100%
      background url('./image/zlHome/itemBg.png') no-repeat center bottom
      background-size 98% 100%
      padding 0.5rem 0
      margin 0.3rem auto
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
            // background url('./image/zlHome/photo-bg.png') no-repeat center
            // box-shadow 0 5px 5px #666
            // background-size 100% 100%
            display flex
            justify-content center
            align-items center
            img
              max-width 100%
              max-height 100%
              display block
        .productInfo
          // padding-top 0.5rem
          padding-right 0.5rem
          .price
            margin-top 0.4rem
            margin-right 0.3rem
            font-weight bold
            font-size 0.4rem
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
            // border 1px solid black
            margin 0.2rem 0
            color rgb(236, 30, 78)
            // border-color rgb(236, 30, 78)
          .btn
            width 3.6rem
            height 1.05rem
            margin-top 0.6rem
            background url('./image/zlHome/btn-bg.png') no-repeat center
            background-size 100% 100%
            text-align center
            line-height 1.05rem
            font-size 0.3rem
            color white
      .load
        color #ec1e4e
        padding 0 0.5rem
        text-align center
      .loadBar
        width 7.8rem
        height 0.2rem
        border-radius 0.2rem
        margin 0.2rem auto 0
        background #e6e6e6
        // box-shadow 1px 1px 2px #333
        overflow hidden
        .loading
          height 100%
          border-radius 0.2rem
          background #fd8833
  .constr
    position relative
    float right
    width 3rem
    margin-right 0.5rem
  .rule
    display block
    margin 0.3rem auto 0
    padding-bottom 1rem
    width 89%
  .footer
    width 100%
    margin-top -5.5rem
  .shadow
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    background rgba(0, 0, 0, 0.7)
    padding-top 1rem
    .contact
      width 9.1rem
      height 11rem
      margin 0 auto
      box-sizing border-box
      padding 4rem 1.5rem 1rem
      background url('./image/zlHome/contact-bg.png') no-repeat center
      background-size 100% 100%
      .item
        height 0.8rem
        color #3dbad5
        margin-bottom 0.3rem
        .item-title
          display inline-block
          width 2rem
          text-align center
          line-height 0.8rem
        .input
          background transparent url('./image/zlHome/input-bg.png') no-repeat center
          background-size 100% 100%
          height 0.8rem
          width 3.6rem
          padding 0 0.2rem
          color #fff
      .tips
        color #3dbad5
        font-size 0.3rem
        line-height 0.5rem
      .submit
        width 4rem
        height 1rem
        background url('./image/zlHome/btn-bg.png') no-repeat center
        background-size 100% 100%
        color white
        text-align center
        line-height 1rem
        margin 0.3rem auto 0
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
