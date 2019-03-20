<template>
  <div class="ZlGift3">
    <scroll class="scroll" :listenScroll="true" :probeType="3" ref="scroll">
      <div class="content">
        <img src="./image/back.png" class="back" @click="$router.push('/zlHome4')" alt>
        <img src="./image/zlHome/banner.png" class="banner" alt>

        <div class="list">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="info">
              <div class="photo">
                <div class="photoWrap" @click="changGoods(item.activityProductVo.siteProductId)">
                  <img :src="item.photo" alt>
                </div>
                <div
                  style="font-size: 0.2rem;color:#000;line-height: 0.4rem;font-weight: bold"
                >10人助力,抢资格!</div>
              </div>
              <div class="productInfo">
                <div>
                  <span style="margin-right: 0.3rem;color:#000;font-weight: bold;font-size:0.3rem">
                    市场价:
                    <i
                      style="text-decoration:line-through"
                    >{{item.activityProductVo.salePrice | fulterUnit}}</i>
                  </span>
                  <i
                    style="font-size:0.4rem;color:#c8132d;font-weight: bold;"
                  >{{item.activityProductVo.floorPrice | fulterUnit}}</i>
                </div>
                <div class="consumption">已符合资格</div>
                <div class="btn" @click="showAlert = true">填写资料参与抽奖</div>
              </div>
            </div>
          </div>
        </div>
        <div class="shadow" v-show="showAlert">
          <div class="contact">
            <div class="item">
              <span class="item-title">真实姓名</span>
              <input type="text" v-model="name" class="input">
            </div>
            <div class="item">
              <span class="item-title">联系电话</span>
              <input type="text" v-model="phone" class="input">
            </div>

            <div class="tips">
              Tips：请填写您的真实信息，方便我们的工作人员后
              续与您尽快取得联系哦～。
            </div>

            <div class="submit" @click="submitAddr">提交</div>

            <div class="close" @click="showAlert = false"></div>
          </div>
        </div>
        <img src="./image/zlHome/rule.png" class="rule" alt>
      </div>
    </scroll>
  </div>
</template>
<script type='text/ecmascript-6'>
let itemIds = [7489];
import { mapGetters } from "vuex";
import { Toast, MessageBox } from "mint-ui";
import scroll from "../../common/components/scroll.vue";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      list: [],
      spellList: [],
      showAlert: false,
      name: "",
      phone: "",
      address: "",
      actGoods: "0",
      code: ""
    };
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.scroll.refresh();
    });
  },
  created() {
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
          data.obj.page.rows.forEach(e => {
            if (
              e.activityProductVo.orderNo &&
              itemIds.indexOf(e.activityProductVo.siteProductId) != -1
            ) {
              e.num = 0;
              arr.push(e);
            }
          });
          this.list = arr;
          console.log(this.list);
        }
      });
    // this.init(itemIds[0])
  },
  watch: {
    list(newVal) {
      console.log(newVal)
      return newVal.forEach(e => {
          this.$http.post(
            this.$api.productSaleNum,
            this.$until.getFormData({
              id:e.activityProductVo.siteProductId
            })
          ).then(({data}) => {
              if(data.success){
                  e.num = data.obj.saleNum
              }
          })
          console.log(this.list)
        })
    }
  },
  methods: {
    changGoods(id) {
      this.actGoods = id;
    },
    copy() {
      var clipboard = new Clipboard("#code");
      clipboard.on("success", e => {
        Toast("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        console.log("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    copy2() {
      var clipboard = new Clipboard("#code2");
      clipboard.on("success", e => {
        Toast("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        console.log("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    submitAddr() {
      let reg = /1[0-9]{10}/;
      if (this.name == "") {
        Toast("请填写姓名");
        return;
      } else if (this.phone == "") {
        Toast("请填写手机号");
        return;
      } else if (!reg.test(this.phone)) {
        Toast("请填写手机号码格式不正确");
        return;
      }
      let obj = this.list.filter(e => {
        return e.activityProductVo.siteProductId == 7489;
      })[0];
      this.$http
        .post(
          "/api/client/act/cut/writeBackAddress",
          this.$until.getFormData({
            token: this.token,
            orderNo: obj.activityProductVo.orderNo,
            receiver: this.name,
            receiverPhone: this.phone,
            address: this.address
          })
        )
        .then(({ data }) => {
          if (data.success) {
            this.showAlert = false;
            Toast("地址提交成功");
          } else {
            Toast(data.msg);
          }
        });
    },
    init(id) {
      let obj = {};
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
              obj.price = res1.data.obj.entity.activityProductVo.floorPrice;
              obj.photo = res1.data.obj.entity.photo;
            }
            if (res2.data.success) {
              obj.num = res2.data.obj.saleNum;
            }
          })
        )
        .then(() => {
          this.list.push(obj);
        });
    }
  },
  computed: {
    ...mapGetters(["siteId", "token"])
  },
  components: {
    scroll
  }
};
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css' scoped>
.ZlGift3
  position absolute
  left 0
  top 0
  bottom 0
  right 0
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
    .item
      width 100%
      background url('./image/zlHome/itemBg.png') no-repeat center bottom
      background-size 98% auto
      padding 0.5rem 0
      #code
        position absolute
        right 0
        top 0
        background #5fbed4
        color #184d6f
        font-size 0.2rem
        padding 0.05rem 0.2rem
        &:before
          content ''
          position absolute
          top -10px
          left -10px
          right -10px
          bottom -10px
      #code2
        position absolute
        right 1.5rem
        top 0
        background #5fbed4
        color #184d6f
        font-size 0.2rem
        padding 0.05rem 0.2rem
        &:before
          content ''
          position absolute
          top -10px
          left -10px
          right -10px
          bottom -10px
      .info
        display flex
        justify-content space-between
        .photo, .productInfo
          width 50%
        .photo
          box-sizing border-box
          padding 0.5rem
          .photoWrap
            width 3.3rem
            height 2.1rem
            margin 0 auto 0.3rem
            // background url('./image/zlHome/photo-bg.png') no-repeat center
            // box-shadow 0 5px 5px #333
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
            color #ffe25d
            font-size 0.4rem
          .consumption
            padding 0.05rem 0.2rem
            display inline-block
            font-size 0.2rem
            color #000
            border 1px solid #000
            margin 0.1rem 0
          .btn
            width 3.6rem
            height 1.05rem
            background url('./image/zlHome/btn-bg.png') no-repeat center
            background-size 100% 100%
            text-align center
            margin-top 0.1rem
            line-height 1.05rem
            font-size 0.4rem
            color white
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
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background rgba(0, 0, 0, 0.7)
  padding-top 1rem
  .contact
    position relative
    width 9.1rem
    height 11rem
    margin 0 auto
    box-sizing border-box
    padding 4rem 1.5rem 1rem
    // background url('./image/zlHome/contact-bg.png') no-repeat center
    // background-size 100% 100%
    .close
      position absolute
      left 50%
      margin-left -0.5rem
      bottom -1.5rem
      width 1rem
      height 1rem
      background url('./image/gift/close.png') no-repeat center
      background-size 100% 100%
    .item
      height 0.8rem
      color #000
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
        width 3.4rem
        padding 0 0.2rem
        color #fff
    .tips
      color #000
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
</style>
