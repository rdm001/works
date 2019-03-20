<template>
  <div class="qrCode">
    <div class="code">
      <span>券码：</span>
      <span @click="jump" :style="{textDecoration: line ? 'underline' : 'none'}">{{code}}</span>

      <button :class="'Qcode'+codeId" :data-clipboard-text="code" class="copy" @click="copy">复制</button>
    </div>
    <ul class="type">
      <li :class="{active:!codeType}" @click="codeType = false">二维码</li>
      <li :class="{active:codeType}" @click="codeType = true">条形码</li>
    </ul>
    <div v-show="!codeType" class="canvas" :id="'Qcode'+codeId"></div>
    <div v-show="codeType">
      <svg :id="'svg' + codeId" class="bar"></svg>
    </div>
    <div v-if="codeUrl" class="toUse" @click="toUse">去使用</div>
  </div>
</template>

<script>
const itemId = -1;
import QRCode from "qrcodejs2";
import Clipboard from "clipboard";
let JsBarcode = require("jsbarcode");
import { Toast } from "mint-ui";
export default {
  props: ["code", "itemId", "codeId", "codeUrl"],
  data() {
    return {
      codeType: false,
      line: false,
      styles: {
        textDecoration: "underline"
      }
    };
  },
  created() {
    this.line = this.code.indexOf("http") != -1;
  },
  mounted() {
    this.$nextTick(function() {
      this.qrcode();
    });
  },
  methods: {
    jump() {
      if (this.code.indexOf("http") != -1) {
        window.location.href = this.code;
      }
    },
    qrcode() {
      console.log(this.codeId);
      JsBarcode("#svg" + this.codeId, this.code, {
        format: "CODE128",
        width: 1.5,
        displayValue: false
      });
      var canvas = document.getElementById("Qcode" + this.codeId);
      let code = this.code;

      var qrcode = new QRCode(canvas, {
        width: (document.body.clientWidth * 2) / 3, //设置宽高
        height: (document.body.clientWidth * 2) / 3,
        text: code
      });
    },
    copy() {
      var clipboard = new Clipboard(".Qcode" + this.codeId);
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
    toUse() {
      window.location.href = this.codeUrl
    }
  }
};
</script>

<style type='text/css' lang='stylus' rel='stylesheet/stylus' scoped>
.qrCode
  .type
    width 100%
    overflow hidden
    display flex
    flex-direction row
    justify-content center
    margin 0 auto 0.3rem
    li
      border 1px solid #2794f4
      padding 0.2rem 0.5rem
      color #2794f4
      &.active
        background #2794f4
        color white
  .code
    line-height 1rem
    padding 0.2rem 1.8rem 0.2rem 1rem
    text-align left
    font-size 0.4rem
    margin 0 auto
    position relative
    overflow hidden
    white-space nowrap
    text-overflow ellipsis
    .couponCode
      position absolute
      left 0.3rem
      top 50%
      transform translateY(-50%)
    .copy
      position absolute
      right 0.3rem
      top 50%
      transform translateY(-50%)
      display inline-block
      width 1.5rem
      padding 0.1rem 0.2rem
      background #3b79f2
      color white
      border-radius 0.1rem
  .canvas
    width 6.66rem
    margin 0 auto
  .bar
    width 100%
    margin-top 1rem
  .toUse
    display block
    width  3rem
    line-height 0.8rem
    margin 0.3rem auto 0
    background  #3b79f2
    color white
    text-align  center
    border-radius  0.1rem
</style>

