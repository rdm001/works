<template>
    <div class="wishWrap">
      <mt-header  class="topBar" style="font-size: 0.4rem" title="敬请期待">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>
      <img src="./image/wish.jpg" class="wish" alt="">
    </div>
</template>
<script type='text/javascript'>
    export default {
        data() {
            return {}
        },
        methods: {}
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  .wishWrap
    position fixed
    left 0
    right 0
    bottom 0
    top 0
    background white
    overflow hidden
    .wish
      width 100%
</style>
