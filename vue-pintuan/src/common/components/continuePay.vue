<template>
  <div class="continuePay">
    <transition name="toRight">
      <div v-show="!tab" class="tab">
        <div class="title">
          确认付款
          <i class="icon_close" @click="$emit('hide',false)"></i>
        </div>
        <div class="payWrap">
          <p>订单号：
            <span class="right">{{data.orderNo}}</span>
          </p>
          <!--<p>商品名：阿阿阿阿阿阿阿</p>-->
          <p class="actPayWay" @click="tab = 1">支付方式：
            <span class="right">{{payWayText}}</span>
          </p>
          <!--  <div class="btn" :class="{active:payWay == 'ye'}" @click="payWay = 'ye'">余额支付</div>
          <div class="btn" :class="{active:payWay == 'zh_ywt'}"  @click="payWay = 'zh_ywt'">一网通支付</div>-->
          <div class="submit" @click="submit">确认支付</div>
        </div>
      </div>
    </transition>

    <transition name="toLeft">
      <div v-show="tab" class="tab">
        <div class="title">
          <i class="icon_back" @click="tab = 0"></i>
          选择支付方式
        </div>
        <div class="payWrap">
          <p
            v-if="payWay.indexOf('ye') >= 0"
            :class="{active:actPayWay == 'ye'}"
            @click="check('ye')"
          >
            <i class="icon_ye"></i>余额支付
          </p>
          <!--<p>商品名：阿阿阿阿阿阿阿</p>-->
          <p
            v-if="payWay.indexOf('zh_ywt') >= 0"
            :class="{active:actPayWay == 'zh_ywt'}"
            @click="check('zh_ywt')"
          >
            <i class="icon_ywt"></i>一网通支付
          </p>

          <p
            v-if="payWay.indexOf('zh_zcj') >= 0"
            :class="{active:actPayWay == 'zh_zcj'}"
            @click="check('zh_zcj')"
          >
            <i class="icon_zcj"></i>一网通支付
          </p>
          <!--  <div class="btn" :class="{active:payWay == 'ye'}" @click="payWay = 'ye'">余额支付</div>
          <div class="btn" :class="{active:payWay == 'zh_ywt'}"  @click="payWay = 'zh_ywt'">一网通支付</div>-->
        </div>
      </div>
    </transition>
  </div>
</template>
<script type='text/javascript'>
import { commonMethod } from "../../common/js/mixin.js";
import { Indicator } from "mint-ui";
import { mapGetters } from "vuex";
export default {
  props: ["data", "token"],
  mixins: [commonMethod],
  data() {
    return {
      actPayWay: "ye",
      httpFlag: true,
      tab: 0
    };
  },
  created() {
    this.actPayWay = this.payWay.split(",")[0];
  },
  watch: {
    httpFlag(newVal) {
      if (newVal) {
        Indicator.close();
      } else {
        Indicator.open();
      }
    }
  },
  methods: {
    submit() {
      if (!this.httpFlag) return; //===>防重复
      this.httpFlag = false;
      this.$http
        .post(this.$api.payOrder, {
          token: this.token,
          payWay: this.actPayWay,
          orderType: this.data.orderType,
          orderNo: this.data.orderNo
        })
        .then(({ data }) => {
          this.httpFlag = true;
          Indicator.close();
          if (data.success) {
            if (this.actPayWay == "ye") {
              //this.Toasts('支付成功',true)
              this.$router.push("/pay/success");
            } else if (
              this.actPayWay == "zh_ywt" ||
              this.actPayWay == "zh_zcj"
            ) {
              this.ywt_successCallBack(data.obj.payHtml);
            }
          } else {
            this.Toasts(data.msg, false);
            this.$emit("hideContinue", false);
          }
        })
        .catch(e => (this.httpFlag = true));
    },
    ywt_successCallBack(form) {
      var formHtml = form;
      document.write(form);

      /*  console.log(formHtml)
              //document.getElementById("public").innerHTML = forms
              let wrap = document.createElement('form');
              let input1 = document.createElement('input');
              input1.type = 'hidden'
              input1.name = 'jsonRequestData'
              input1.value = formHtml

              let input2 = document.createElement('input');
              input2.type = 'hidden'
              input2.name = 'charset'
              input2.value = 'UTF-8'
              wrap.mehtod = 'post'
              wrap.id = 'paySubmit'
              wrap.action = 'https://netpay.cmbchina.com/netpayment/BaseHttp.dll?MB_EUserPay'
              wrap.appendChild(input1)
              wrap.appendChild(input2)
              document.getElementsByTagName('body')[0].append(wrap)

              document.getElementById('paySubmit').submit()*/
    },

    check(payWay) {
      this.actPayWay = payWay;
      this.tab = 0;
    }
  },
  computed: {
    payWayText() {
      let text = "";
      switch (this.actPayWay) {
        case "ye":
          text = "余额支付";
          break;
        case "zh_ywt":
          text = "一网通支付";
          break;
        case "zh_zcj":
          text = "一网通支付";
          break;
      }
      return text;
    },
    ...mapGetters(["payWay"])
  }
};
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
@import '../../common/css/variable.styl'
@import '../../common/css/toastIcon/iconfont.css'
.mint-toast
  z-index 2222
.mint-indicator-mask
  z-index 2222
.mint-indicator-wrapper
  z-index 2222
.continuePay
  position relative
  background white
  width 100%
  height 6rem
  .tab
    fullScreen(0, 0, 0, 0)
  .title
    position relative
    height 1rem
    line-height 1rem
    font-size 0.4rem
    color black
    border-bottom 0.5px solid #eee
    text-align center
    background-size 100%
    .icon_back, .icon_close
      position absolute
      width 1rem
      height 1rem
    .icon_back
      left 0.2rem
      top 0.1rem
      background url('../image/icon_back.png') no-repeat center 0.2rem
      background-size 0.5rem 0.5rem
    .icon_close
      right 0.2rem
      background url('../image/icon_close.png') no-repeat center 0.2rem
      background-size 0.6rem 0.6rem
  .payWrap
    font-size 0.35rem
    padding 0.2rem
    fullScreen(1rem, 0, 2rem, 0)
    p
      line-height 1rem
      font-size 0.4rem
      border-bottom 0.5px solid #eee
      .right
        float right
      .icon_ye
        background url('../image/icon_ye.png') no-repeat center 0.2rem
      .icon_ywt
        background url('../image/icon_ywt.png') no-repeat center 0.2rem
      .icon_zcj
        background url('../image/icon_zcj.png') no-repeat center 0.2rem
      .icon_ye, .icon_ywt, .icon_zcj
        display inline-block
        width 1rem
        height 1rem
        vertical-align middle
        background-size 0.5rem 0.5rem
      &.active
        background url('../image/icon_check.png') no-repeat right center
        background-size 0.7rem 0.7rem
      &.payWay
        padding-right 0.8rem
        background url('../image/icon_arrow_right.png') no-repeat right center
        background-size 0.5rem 0.5rem
    .btn
      margin 0 auto 0.2rem
      width 7rem
      height 0.8rem
      text-align center
      line-height 0.8rem
      color #333
      font-size 0.4rem
      box-shadow 0 0 3px #ccc
      &.active
        background url('../image/radio-checked.png') no-repeat 0.5rem center
        background-size 0.5rem 0.5rem
    .submit
      position absolute
      width 8rem
      height 1.2rem
      margin-left -4rem
      left 50%
      bottom -1rem
      font-size 0.4rem
      line-height 1.2rem
      text-align center
      border-radius 0.1rem
      color white
      background $color-theme
</style>
