<template>
  <div class="shopping">
    <img src="../../assets/shopping.png" class="buy">
    <img src="../../assets/click2.png" class="gouwu" @click="shopping">
  </div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {};
  },
  methods: {
    shopping() {
     this.$router.push('/signIn')
    }
  }
};
</script>
<style lang="less" scoped>
.shopping {
       width: 100%;
       height: 100%;
       overflow-y: auto;
       -webkit-overflow-scrolling: touch;
       position: relative;
    .buy {
       display: block;
       width: 100%;
    }
    .gouwu{
       position: absolute;
       width: 5.29rem;
       height: 1.25rem;
       top: 15.48rem;
       left: 2.33rem;
    }
  }
</style>
