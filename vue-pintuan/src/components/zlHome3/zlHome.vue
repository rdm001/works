<template>
  <div class="zlHome3">
    <scroll class="scroll" :listenScroll="true" :probeType="3" ref="scroll">
      <div class="content">
        <img src="./image/back.png" class="back" @click="back" alt>
        <img src="./image/zlHome/banner.png" class="banner" alt>
        <img src="./image/zlHome/title.png" class="title" alt="">

        <div class="list">
          <!-- v-if="item.id==7231"  -->
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="info">
              <div class="photo">
                <div class="photoWrap">
                  <img :src="item.photo" @click="toShowRules">
                </div>
                <div style="font-size: 0.2rem;color:#000;line-height: 0.4rem;font-weight: bold;text-align:center;">10人助力,抢资格!</div>
              </div>
              <div class="productInfo">
                <div class="price">
                  <span style="margin-right: 0.3rem;color:#000;font-weight: bold;font-size:0.3rem">
                    市场价:
                    <i style="text-decoration: line-through">{{item.oldPrice | fulterUnit}}</i>
                  </span>
                  <i
                    style="font-size:0.4rem;color:#c8132d;font-weight: bold;"
                  >{{item.price | fulterUnit}}</i>
                </div>
                <!-- <div class="consumption">符合资格{{item.num}}人</div> -->
               <!-- <div class="consumption">符合资格1500人</div>-->
                <div class="btn" v-if="!item.success" @click="spell(item)">邀请{{item.cutNum}}人助力</div>
                <!--<div class="btn" v-if="item.success && item.vo.remarks != 1" @click="getGift(item)">领取奖品</div>-->
                <div class="btn" v-if="item.success" @click="toWalMark">立即领取</div>
              </div>
            </div>
            <div v-if="item.vo">
              <div class="load">
                <span>邀请进度: {{ item.helpers }} / {{item.vo.cutNumber}}</span>
                <span
                  style="margin-left:0.5rem"
                  v-if="!item.success"
                >此次邀请还剩{{item.diffTime | filterDate}}分钟过期</span>
              </div>
              <div class="loadBar">
                <div
                  class="loading"
                  :style="{width: (item.helpers * 100 / item.vo.cutNumber) + '%'}"
                ></div>
              </div>
            </div>
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
  <!--  <div class="zlHome">
    <div style="position: absolute;left:0;top:40%;width: 100%;text-align: center;font-size: 0.5rem">活动已结束</div>
  </div>-->
</template>
<script type='text/ecmascript-6'>
//话费 6994    KFC 6993   手机 6992
let itemIds = [7231];
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
      showRules: false,
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
    if (href.indexOf("flag=1") < 0) {
      window.location.href = this.$until.auth(this.AuthConfig);
      return;
    }
    if (this.user.id == 435004 || this.user.id == 388892) {
      var v = new VConsole();
    }
    this.initSpell();
  },
  methods: {
    changGoods(id) {
      this.actGoods = id;
    },
    toShowRules() {
      this.showRules = !this.showRules
    },
    back() {
      this.$until.closeApp();
    },
    share(item, id) {
      window.location.href = `http://cmbls/socialshare?id=mpBank&&channel=defaultWithNoSMS&type=url&title=0元限时抢沃尔玛代金券，快帮我助力吧！&text=${
        item.name
      }&picurl=${item.photo}&url=${this.AuthConfig.authShorUrl}?zlid3=${id}`;
    },
    spell(item) {
      let product = item;
      console.log(item)
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
                    console.log(view);

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
            console.log(123);
            console.log(this.list)
          })
        )
        .then(() => {});
    },
    toWalMark() {
      window.location.href = 'https://act.cmbchina.com/ActShipMobile/Pages/PointDrawDetail.aspx?ActGroupID=AGP20190111101153q3zih8zT'
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
.zlHome3
  position absolute
  left 0
  top 0
  bottom 0
  right 0
  background white
  overflow-y auto
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
    overflow hidden
  .banner
    width 100%
  .title
    display block
    width 80%
    margin 0.3rem auto
  .list
    position relative
    margin auto
    width 8.9rem
    background-size 100% 100%
    .tplink
      position absolute
      left 50%
      bottom -0.8rem
      transform translateX(-50%)
      width 70%
      height 1.6rem
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
            height 2.1rem
            margin 0 auto 0.3rem
            background url('./image/zlHome/photo-bg.png') no-repeat center
            box-shadow 0 5px 5px #666
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
      .load
        color black
        padding 0 0.5rem
        text-align center
      .loadBar
        width 7.8rem
        height 0.2rem
        border-radius 0.2rem
        margin 0.2rem auto 0.3rem
        background #21718b
        box-shadow 1px 1px 2px #333
        overflow hidden
        .loading
          height 100%
          border-radius 0.2rem
          background #fae37d
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
