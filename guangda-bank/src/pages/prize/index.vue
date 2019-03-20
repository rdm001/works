<template>
  <div class="prize">
    <!-- <div class="prize-btn">
            <img src="../../assets/click1.png" alt="" @click='getPrize'>
    </div>-->
    <img src="../../assets/prize.png"  class="banner">
    <img src="../../assets/click1.png" class="choujiang" @click="getPrize">
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {};
  },
  methods: {
    getPrize() {
      window.location.href =
        "https://gdwx1.whecb.com/apps/scratchablelatexh5/#/home?siteId=34";
    }
  }
};
</script>
<style lang="less" scoped>
// .prize{
//     width: 100%;
//     height: 100%;
//     background: url(../../assets/prize.png);
//     background-size: 100% 100%;
//     position:fixed;
//     }
//     img{
//         position: absolute;
//         width: 5.29rem;
//         height: 1.25rem;
//         left: 2.32rem;
//         top: 10rem;
//     }

  .prize {
       width: 100%;
       height: 100%;
       overflow-y: auto;
       -webkit-overflow-scrolling: touch;
       position: relative;
    .banner {
       display: block;
       width: 100%;
    }
    .choujiang{
       position: absolute;
       width: 5.29rem;
       height: 1.25rem;
       top: 13.5rem;
       left: 2.33rem;
    }
  }
  
  

</style>

    

