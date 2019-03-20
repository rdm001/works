<template>
    <div class="shopCar">

      <Scroll class="scroll">
        <!--
        {{filterCheckData}}
        -->
        <div>
          <mt-header  class="topBar" style="font-size: 0.4rem" title="购物车">
            <div @click="$router.go(-1)" slot="left">
              <mt-button icon="back"></mt-button>
            </div>
          </mt-header>
          <div class="source" v-for='(store,key,index) in filterData'>
            <div class="source_title" @click="allCheck(key)">
              <div class="allCheck" :class="{active:store.products.length == (filterCheckData[key]? filterCheckData[key] :-1)}" ></div>
              {{store.name}}
            </div>
            <mt-cell-swipe
              class="cell"
              v-for="item,index in store.products"
              :key="index"
              :right="[{content: '删除',style:{display:'flex',fontSize:'0.4rem',alignItems:'center',width:'2rem',justifyContent:'center',background: 'red',lineHeight:'1',color: '#fff' },
              handler:() => deleteProduct(item)}]">
              <productList :data="item" :act="actProduct" @addNum="addNum" @changeNum="changeNum" @reduceNum="reduceNum" @check="checked"></productList>
            </mt-cell-swipe>
          </div>
        </div>
      </Scroll>

      <div class="tolBar" v-if="shopCarProduct.length">
        <div class="tol">合计：<span class="tolPrice">{{total | fulterUnit}}</span></div>
        <div class="settlement" @click="shopping">结算({{actProduct.length}})</div>
      </div>

      <div class="tip"  v-if="!shopCarProduct.length">
        <div class="content">
          <img src="./image/shopCar_empty.png" alt="">
          <div class="tipText">购物车空空如也</div>
          <div class="goShop" @click="$router.push('/search')">去购物</div>
        </div>
      </div>
    </div>
</template>
<script type='text/javascript'>
  import Scroll from '../../common/components/scroll'
  import productList from '../../common/components/shopCarListItem.vue'
  import { CellSwipe,Toast } from 'mint-ui';
  import Vue from 'vue'
  Vue.component(CellSwipe.name, CellSwipe);
  import {mapGetters,mapMutations} from 'vuex'
    export default {
        data() {
            return {
                actProduct:[] //存储选中商品
            }
        },
        created(){
          if(localStorage.getItem('jf-shopCarProduct-' + this.user.id)){
            this.set_shopCarProduct(JSON.parse(localStorage.getItem('jf-shopCarProduct-' + this.user.id)))
          }
        },
        methods:{
        deleteProduct(data){
              //左滑 删除
              let arr =  this.shopCarProduct
              for(let i = 0 ; i < arr.length;i++){
                if( arr[i].id == data.id){
                  arr.splice(i,1);
                  break
                }
              }
              this.actProduct.forEach((item,index) => {
                this.actProduct.splice(index,1)
              })
            this.set_shopCarProduct(arr)
          },
          checked(data){
            //选中购物车商品
            if(!this.actProduct.length){
                //如果没有选中商品  直接添加
              this.actProduct.push(data)
              return
            }
            let supply = this.actProduct.filter((e) => {
                  //只保留 相同供应商商品
                  return e.supplyId == data.supplyId
              })
            if(!supply.length){
                //如果没有相同供应商商品 直接清空选中商品 添加商品
              this.actProduct = []
              this.actProduct.push(data)
              return
            }
            //如果有相同类型的商品  是否已添加
            let arr = supply.filter((e) => {
                return e.id == data.id
            })
              if(arr.length > 0) {
                //如果选中商品存在
                for(let i = 0 ; i < supply.length;i++){
                    if(supply[i].id == data.id){
                      supply.splice(i,1);
                      break
                    }
                }
              }else{
                //如果选中商品 不存在
                supply.push(data)
              }
              this.actProduct = supply
          },
          allCheck(key){
              //全选反选
            console.log(key)

                let arr = this.actProduct.filter((e) => {
                    //遍历选中数组  是否存在不同供应商
                  return e.supplyId != key
                })

                if(arr.length>0){
                  //如果存在不同供应商 清空选中数组
                  this.actProduct = []
                }

              if(this.filterCheckData[key]){ //判断此供应商 是否有已选中商品
                  //如果存在 此供应商的商品
                  if(this.filterCheckData[key] == this.filterData[key].products.length){
                      //如果 所有商品已选中则反选
                    console.log(this.filterCheckData[key])
                    this.actProduct = []
                   /* this.filterData[key].products.forEach((e) => {
                      for(let i = 0 ; i < this.actProduct.length;i++){
                        if(this.actProduct[i].id == e.id){
                          //在选中商品 删除 反选的 商品
                          this.actProduct.splice(i,1);
                          return
                        }
                      }
                    });*/
                    return
                  }
              }
            this.filterData[key].products.forEach((e) => {
              for(let i = 0 ; i < this.actProduct.length;i++){
                if(this.actProduct.length&&this.actProduct[i].id == e.id){
                  //如果当前商品已选中 则直接跳过
                  return
                }

              }
              //在选中商品 添加商品
              this.actProduct.push(e);
            });
          },
          addNum(id){
              let arr = this.actProduct
             /*for (let i = 0 ; i <arr.length; i++){
                 if(arr[i].id == id){
                   arr[i].num++
                   console.log(arr[i])
                 }
             }*/
            for (let i = 0 ; i <arr.length; i++){
             if(arr[i].id == id){
               arr[i].num++
             //console.log(arr[i])
             }
             }
            this.actProduct = arr
          },
          changeNum(id,num){
            let arr = this.shopCarProduct
            for (let i = 0 ; i <arr.length; i++){
              if(arr[i].id == id){
                arr[i].num = num
                console.log(arr[i].num)
              }
            }
            this.set_shopCarProduct(arr)
          },
          reduceNum(id){
            let arr = this.actProduct
            for (let i = 0 ; i <arr.length; i++){
              if(arr[i].id == id){
                arr[i].num--
              }
            }
            this.actProduct = arr

          },
          shopping(){
            if(!this.actProduct.length){
                  Toast('请选择购买商品');
                  return
              }
            let confirmOrder = JSON.stringify(this.actProduct)
            localStorage.setItem('confirmOrder',confirmOrder)
            localStorage.setItem('confirmFlag','true')
            this.$router.push('/confirmOrder')
          },
          ...mapMutations({
            set_shopCarProduct:'set_shopCarProduct'
          })
        },
        components:{
          productList,
          Scroll
        },
        computed:{
          filterData(){
            let store = {}
            this.shopCarProduct.forEach((item) => {
              const id = item.supplyId   //获取当前商品供应商Id
              if(!store[id]){
                //判断store 是否存在当前供应商
                //如果不存在
                store[id] = {
                  name:item.supplyName,
                  products:[]
                }
              }
              store[id].products.push(item)
            })
            return store
          },
          filterCheckData(){
              //统计各个供应商 商品数量
            let store = {}
            this.actProduct.forEach((item) => {
              const id = item.supplyId   //获取当前商品供应商Id

              if(!store[id]){
                //判断store 是否存在当前供应商
                //如果不存在
                store[id] = 0
              }
              store[id]++
            })
            return store
          },
          total(){
              let tol = 0
              this.actProduct.forEach((e) => {
                    tol += (e.num * e.salePoints)
              })
            return tol.toFixed(2)
          },
          ...mapGetters(['shopCarProduct','unit','user'])
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  .shopCar
    .tip
      fullScreen(40px,0,0,0)
      .content
        fullScreen(0,0,0,0)
        margin auto
        width 3rem
        height 8rem
        .tipText
          line-height 1rem
          text-align center
          font-size 0.4rem
          font-family '微软雅黑'
        img
          width 3rem
        .goShop
          padding 0.2rem 0.3rem
          margin 0.2rem auto
          width 2rem
          text-align center
          border 1px solid #1296db
          color #1296db
          border-radius 5px
    .scroll
      fullScreen(0,0,1.5rem,0)
      .source
        margin-bottom 0.2rem
        .source_title
          display flex
          background #fff
          height 1rem
          line-height 1rem
          align-items center
          padding 0 10px
          font-family  '黑体'
          font-size 0.4rem
          border-bottom 0.5px solid #eee
          .allCheck
            box-sizing border-box
            width 0.5rem
            height 0.5rem
            border-radius 0.3rem
            border 1px solid #bbb
            margin-right 0.2rem
            extend-click()
            &.active
              background url("../../common/image/radio-checked.png") no-repeat center
              background-size 100% 100%
              border none
        .cell
          border-bottom 0.5px solid #eee
          &:last-child
            border none
    .tolBar
      position fixed
      left 0
      bottom 0
      width 100%
      height 1.2rem
      display flex
      justify-content flex-end
      box-shadow 0 0 3px #ccc
      background white
      .settlement
        width 3rem
        height 100%
        line-height 1.2rem
        background  $color-theme
        background  linear-gradient(to right,orange,$color-theme)
        color white
        text-align center
        font-size 0.3rem
      .tol
        height 100%
        line-height 1.2rem
        margin-right 0.2rem
        .tolPrice
          color $color-theme
          font-size 0.4rem
</style>
