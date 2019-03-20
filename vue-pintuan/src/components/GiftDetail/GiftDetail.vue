<template>
    <div class="giftDetail">
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="礼包兑换">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>

      <div class="packInfo">
        <div class="title">我收到的礼包</div>
        <div class="pack">
          <img :src="packInfo&&packInfo.showPhotoUrl" class="pic" alt="">
          <div class="info">
            <div class="name">{{packInfo&&packInfo.name}}</div>
            <div class="endTime">有效期至：{{$route.query.endTime}}</div>
          </div>
        </div>
      </div>
      <div class="selectProduct">
        <div class="title">请选择商品</div>
        <scroll class="giftProductList">
          <div>
            <ul class="List">
              <li class="listItem" v-for="(item,index) in packList" :key="index">
                <giftProduct :data="item">
                  <div class="btn" slot="btn"   @click="select(item)" :class="{active:itemId == item.itemId}">选TA</div>
                </giftProduct>
              </li>
            </ul>
          </div>
        </scroll>
      </div>
      <div class="exchange" @click="exchange">确认兑换</div>
    </div>
</template>
<script type='text/javascript'>
  import Scroll from '../../common/components/scroll.vue'
  import giftProduct from '../../common/components/giftProductItem.vue'
  import {commonMethod} from '../../common/js/mixin.js'
    export default {
        data() {
            return {
                packInfo:null,
                packList:null,
                itemId:null,
                product:null
            }
        },
        mixins:[commonMethod],
        created(){
          this.id = this.$route.params.id;
          this._initData()
        },
        methods: {
            _initData(){
              //================>初始化礼包信息
              this.$http.post(
                  this.$api.getPacksInfo,
                  this.$until.getFormData({
                    packsId:this.id
                  })
              ).then(({data}) => {
                  if(data.success){
                      this.packInfo = data.obj.packsInfo
                  }
                  console.log(data)
              });


              //================>初始化礼包商品信息
              this.$http.post(
                this.$api.findPacksProductList,
                this.$until.getFormData({
                  packsId:this.id
                })
              ).then(({data}) => {
                if(data.success){
                  this.packList = data.obj.productList
                }
              })
            },
            select(item){
              this.itemId = item.itemId;
              this.product = item
            },
            exchange(){
                if(!this.itemId){
                 this.Toasts('请选择兑换商品',false)
                 return
                }
              let product = this.product;
              localStorage.setItem('giftSelectProduct',JSON.stringify(product))
              this.$router.push('/GiftExchange?id=' + this.id + '&accId=' + this.$route.query.accId)
            }
        },
        components:{
          Scroll,
          giftProduct
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/toastIcon/iconfont.css"
.giftDetail
  fullScreen(40px,0,0,0)
  .title
    position relative
    line-height 1rem
    font-size 0.4rem
    padding 0 0.5rem
    border-bottom 0.5px solid #eee
    background white
    &::after
      content ''
      position absolute
      left 0.2rem
      height 0.6rem
      width 0.1rem
      top 0.2rem
      background $color-theme
  .packInfo
    background white
    margin-bottom 0.3rem
    .pack
      padding 0.2rem
      overflow hidden
      .pic
        float left
        width 2.4rem
        height 2.4rem
        box-shadow -2px -2px 5px #ccc
      .info
        float right
        width 7rem
        .name
          font-size 0.35rem
          line-height 1rem
          height 1rem
          overflow hidden
        .endTime
          font-size 0.3rem
  .selectProduct
    .giftProductList
      overflow hidden
      fullScreen(5.1rem,0,1.2rem,0)
      .listItem
        background white
        padding 0.2rem
        overflow hidden
        .btn
          float right
          padding 0.2rem 0.4rem
          border 0.5px solid $color-theme
          border-radius 0.1rem
          color $color-theme
          font-weight bold
          &.active
            background $color-theme
            color white
  .exchange
    position absolute
    bottom 0
    left 0
    width 100%
    height 1.2rem
    line-height 1.2rem
    text-align center
    font-size 0.5rem
    background $color-theme
    color white
</style>
