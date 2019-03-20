<template>
    <div class="hotProduct" @click="$router.push('/productDetail/' + data.id)">
      <img :src="data.photo" class="photo" alt="">
      <div class="itemName">{{data.itemName}}</div>
      <div class="Price">
        <span class="newPrice">{{ newPrice | fulterUnit}}</span>
        <span class="oldPrice">{{data.salePoints | fulterUnit}}</span>
      </div>
    </div>
</template>
<script type='text/javascript'>
    export default {
        props:['data','unit'],
        created(){
            console.log(this.data)
        },
        data() {
            return {}
        },
        methods: {},
        computed:{
            newPrice(){
              let price  = ((this.data.salePoints /(this.data.salePrice <= 0 ? 1 :this.data.salePrice)) *this.data.activityProductVo.preferentialPrice).toFixed(2);
              return price
            }
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
.hotProduct
  background white
  width 2.99rem
  .photo
    width 2.99rem
    height 2.99rem
  .itemName
    width 2.99rem
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    line-height 0.8rem
    font-size 0.35rem
    text-align center
  .Price
    font-size 0.4rem
    color #fd3c4f
    text-align center
    .oldPrice
      color #333
      font-size 0.255rem
      text-decoration line-through
</style>
