<template>
    <div class="shopCarListItem">
      <div class="radio" :class="{active:checked.length }" @click="check"></div>
      <img :src='data.photo' class="shopCar-photo" alt="" />
      <div class="info">
        <div class="title">
          {{data.itemName}}
        </div>
        <div class="price">
          {{data.salePoints | fulterUnit}}
        </div>
        <div class="other">
          <div class="step">
            <div class="reduce" @click="reduce" ></div>
            <input type="tel" @blur="resetNum" v-model="num" class="num">
            <div class="add" @click="add"></div>
          </div>
        </div>
      </div>
    </div>
</template>
<script type='text/javascript'>
    import {mapGetters} from 'vuex'
    import { Toast } from 'mint-ui';
    export default {
        props:['data','act'],
        created(){
            this.num = this.data.num
        },
        data() {
            return {
                num:1
            }
        },
        watch:{
            num(newVal,oldVal){
                if(isNaN(newVal) || newVal == 0){
                    Toast('请输入正确数量')
                    this.num = oldVal
                }else{
                  if(newVal > 9999){
                    Toast('超过最大购买数')
                    this.num = oldVal
                    return
                  }

                  this.$emit('changeNum',this.data.id,Number(newVal))
                  /*this.act.forEach((e) => {
                    if(e.id == this.data.id){
                      e.num = newVal
                    }
                  })*/
                }
            }
        },
        methods: {
          resetNum(){
              if(this.num == "" || this.num == ' '){
                  this.num = 1
              }else if(this.num <=0 ){
                Toast('选中商品最少购买一件')
                this.num = 1
              }
          },
          check(){
              this.$emit('check',this.data)
           // console.log(this.act)
          },
          add(){
            this.num ++
            this.$emit('addNum',this.data.id)

          },
          reduce(){
            this.num --
            if(this.num < 1){
              Toast('商品数量已达到最少！')
              this.num = 1
              return
            }
            this.$emit('reduceNum',this.data.id)
          }
        },
        computed:{
            checked(){
               let arr = this.act.filter((e) => {
                   return e.id == this.data.id
                })
              return arr
            },
          ...mapGetters(['unit'])
        },
        components:{
          Toast
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../css/variable.styl"
  .shopCarListItem
    width 10rem
    padding 0.2rem 0
    .radio
      float left
      position relative
      top 1rem
      box-sizing border-box
      width 0.5rem
      height 0.5rem
      border-radius 0.3rem
      border 1px solid #bbb
      margin-right 0.2rem
      extend-click()
      &.active
        background url("../image/radio-checked.png") no-repeat center
        background-size 100% 100%
        border none
    .shopCar-photo
      float left
      height 3rem
      width 3rem
      margin-right 0.2rem
    .info
      float left
      width 6rem
      box-sizing border-box
      .title
        height 1rem
        padding-right 0.5rem
        font-size 0.35rem
        overflow hidden
        line-height 0.5rem
        color #333
      .price
        color red
        margin 0.2rem 0

    .other
      .step
        display flex
        .reduce
          background url("../image/icon_reduce.png") no-repeat center
          border-top-left-radius 0.1rem
          border-bottom-left-radius 0.1rem
        .add
          background url("../image/icon_add.png") no-repeat center
          border-top-right-radius 0.1rem
          border-bottom-right-radius 0.1rem
        .reduce,.add
          width 0.8rem
          height 0.8rem
          background-size 0.5rem 0.5rem
          border 0.5px solid #eee
        .num
          width 1rem
          height 0.8rem
          border 0.5px solid #eee
          text-align center
          font-size 0.35rem

</style>
