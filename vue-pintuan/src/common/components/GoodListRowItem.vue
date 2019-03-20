<template>
  <li class="good_item">
    <img class="product_photo" :src="data.photo" alt="">
    <div class="products_name">{{data.itemName}}</div>
    <div class="desc">
      <span class="price">{{data.salePoints | fulterUnit}}</span>
      <span class="flag"></span>
    </div>
  </li>
</template>

<script>
  import {mapGetters} from 'vuex'
    export default{
        props:{
            data:{
                type:Object,
                default:{}
            },
            unit:{
                type:String,
                default:""
            }
        },
        created(){

        },
        data(){
            return {}
        }
    }
</script>

<style type='text/css' lang='stylus' rel='stylesheet/stylus'>
  .good_item
    width 4.9rem
    background white
    .product_photo
      width 4.9rem
      height 4.9rem
    .products_name
      font-size: 0.3rem
      height: 1rem
      padding 0 0.3rem
      line-height 0.5rem
      margin-top 0.2rem
      width: 3.9rem
      color: rgb(51, 51, 51)
      overflow hidden
      text-align: left
      text-overflow: ellipsis
      word-break: break-all
    .desc
      height 0.8rem
      line-height 0.8rem
      width 3.9rem
      padding 0 0.3rem
      .price
        color red
      .flag
        float right
        font-size 0.3rem
        height 0.8rem

</style>

