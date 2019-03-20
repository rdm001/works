<template>
    <div class="giftProductItem">
      <img :src="data.productPhotoUrl " class="pic" alt="">
      <div class="name">{{data.productName}}</div>
      <slot name="btn"></slot>
    </div>
</template>
<script type='text/javascript'>
    export default {
        props:['data','actId'],
        data() {
            return {}
        },
        methods: {},

    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
.giftProductItem
  .pic
    float left
    width 2.2rem
    height 2.2rem
  .name
    width 6.8rem
    float right
    height 1.4rem
    overflow hidden
    font-size 0.4rem
    line-height 0.7rem
</style>
