<template>
  <div class="person">
    <mt-header class="topBar" style="font-size: 0.4rem" title="订单中心">
      <!-- <div @click="$router.push('/home')" slot="left" v-if="oneCount.indexOf(siteId) < 0">
        <mt-button icon="back"></mt-button>
      </div> -->
    </mt-header>
    <div class="info_wrap">
      <!--
        <div class="loginOut" @click="loginOut"></div>
      -->
      <img class="headPhoto" src="../../common/image/headPhoto.png" alt>
      <div class="info">
        <div>客户,您好！</div>
        <div>ID:{{user ? user.id : ''}}</div>
        <!-- <div>余额:{{availablePoints}}</div>-->
      </div>
    </div>
    <ul class="serviceList">
      <li @click="$router.push('/myOrder')">
        <img src="./image/icon_order.png" alt>
        <div>我的订单</div>
      </li>
      <li @click="$router.push('/myGroupBuy')">
        <img src="./image/icon_groupBuy.png" alt>
        <div>我的拼团</div>
      </li>
      <li @click="$router.push('/myspell')">
        <img src="./image/icon_spell.png" alt>
        <div>我的砍价</div>
      </li>
      <li @click="$router.push('/address')">
        <img src="./image/icon_address.png" alt>
        <div>地址管理</div>
      </li>
      <li @click="$router.push('/myTicket')">
        <img src="./image/icon_ticket.png" alt>
        <div>我的电子券</div>
      </li>
      <li @click="$router.push('/Gift')">
        <img src="./image/icon_gift.png" alt>
        <div>我的礼包</div>
      </li>
      <li>
        <img src="./image/icon_service.png" alt>
        <div @click="tel">客服电话</div>
      </li>
    </ul>
  </div>
</template>
<script type='text/javascript'>
import { mapGetters, mapMutations } from "vuex";
import { MessageBox } from "mint-ui";
export default {
  data() {
    return {};
  },
  created() {
    this._initData();
  },
  methods: {
    _initData() {
      //余额查询
      this.$http
        .post(
          this.$api.findUserVoucher,
          this.$until.getFormData({ token: this.token, siteId: this.siteId })
        )
        .then(res => {
          if (res.data.success) {
            this.set_availablePoints(res.data.obj.ye);
          }
        });
    },
    tel() {
      let tel = JSON.parse(localStorage.getItem('siteConfig')).hotline
      this.$until.tel(tel);
    },
    loginOut() {
      let that = this;
      MessageBox.confirm("确认退出登录？", "退出登录")
        .then(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("confirmOrder");
          that.$router.push("/login");
        })
        .catch(() => {});
    },
    ...mapMutations({
      set_availablePoints: "set_availablePoints"
    })
  },
  computed: {
    ...mapGetters(["siteId", "token", "availablePoints", "user", "oneCount"])
  }
};
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../../common/css/variable.styl'
.person
  fullScreen(0, 0, 0, 0)
  .info_wrap
    position relative
    width 100%
    height 4rem
    background red url('../../common/image/theme.jpg') no-repeat left top
    background-size 100% 100%
    .headPhoto
      float left
      width 2rem
      height 2rem
      margin-top 1rem
      margin-left 1rem
      border-radius 50%
    .info
      float left
      font-size 0.4rem
      color white
      margin-top 1.3rem
      line-height 0.7rem
      margin-left 0.5rem
    .loginOut
      position absolute
      right 0.4rem
      top 0.3rem
      width 0.5rem
      height 0.5rem
      background url('./image/loginOut.png') no-repeat center
      background-size 100% 100%
  .serviceList
    background white
    li
      overflow hidden
      height 1rem
      line-height 1rem
      font-size 0.4rem
      background url('./image/icon_arrow-right.png') no-repeat 9rem center
      background-size 0.5rem 0.5rem
      div
        float right
        width 8.9rem
        box-sizing border-box
        height 100%
        border-bottom 1px solid #ececec
      a
        float right
        color #333
      img
        float left
        width 0.5rem
        height 0.5rem
        margin 0.2rem
</style>
