<template>
  <router-link :to='{path:"/productDetail/"+data.id}' tag="div">
    <div class="productList">
      <img :src="data.photo" alt="">
      <div class="info">
        <div class="productName"><span class="sourceTag">{{sourceText}}</span>{{data.itemName}}</div>
        <div class="price_wrap">
          <span class="price">{{ data.salePoints | fulterUnit}}</span>
        </div>
       <!-- <div class="otherInfo">
            <span class="supplyName">{{data.supplyName}}</span>
        </div>-->
      </div>
    </div>
  </router-link>
</template>
<script type='text/javascript'>
    import {mapGetters} from 'vuex'
    export default {
        props:{
          data:{
            type:Object,
            default:null
          },
          unit:{
              type:String,
              default:""
          }
        },
        data() {
            return {}
        },
        methods: {},
        computed:{
          sourceText(){
            switch(this.data.source){
              case 1:
                return '京东';
              case 2:
                return '特供';
              case 3:
                return '苏宁';
              case 4:
                return '严选'
            }
          },
          ...mapGetters(['siteConfig'])
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  .productList
    padding 0.1rem
    background white
    overflow hidden
    border-bottom  1px solid #ededed
    img
      float left
      width 3rem
      height 3rem
      margin-right 0.1rem
    .info
      float right
      width 6.5rem
      padding 0.1rem
      .productName
        height 1rem
        font-size 0.35rem
        line-height 0.55rem
        overflow hidden
        .sourceTag
          display: inline-block;
          position: relative;
          bottom: 0.06rem;
          margin-right: 0.1rem;
          width: 0.7rem;
          height: 0.4rem;
          line-height: 0.4rem;
          text-align: center;
          padding 0 0.1rem
          border-radius 0.05rem
          font-size: 0.2rem
          color: white
          background #fd3c4f
      .price_wrap
        height 1rem
        line-height 1rem
        .price
          color #fd3c4f
          font-size 0.4rem
      .otherInfo
        height 1rem
        line-height 1rem
        .supplyName
          font-size 0.3rem
          color gray
</style>
