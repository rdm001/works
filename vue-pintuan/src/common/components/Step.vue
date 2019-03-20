<template>
      <div class="step">
        <div class="reduce" @click="reduce" ></div>
        <input type="tel" v-model="numbers" @blur="resetNum" class="num">
        <div class="add" @click="add"></div>
      </div>
</template>
<script type='text/javascript'>
    import {Toast} from 'mint-ui';
    export default {
        props:['num'],
        data() {
            return {
                numbers:1
            }
        },
        watch:{
          num(newVal,oldVal){
            this.numbers = newVal
          },
          numbers(newVal,oldVal){
            if(isNaN(newVal)){
              Toast('请输入正确数量')
              this.numbers = oldVal
              this.$emit('changeNum',oldVal)
              return
            }else{
              this.$emit('changeNum',newVal)
            }
          }
        },
        methods: {
            add(){
              this.$emit('add')
            },
            reduce(){
              this.$emit('reduce')
            },
          resetNum(){
            if(this.numbers == "" || this.numbers == ' '){
              this.numbers = 1
            }else if(this.num <= 0){
              Toast('选中商品最少购买一件')
              this.numbers = 1
            }
          }
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  .step
    display inline-block
    overflow hidden
    .reduce
      background url("../image/icon_reduce.png") no-repeat center
      border-top-left-radius 0.1rem
      border-bottom-left-radius 0.1rem
    .add
      background url("../image/icon_add.png") no-repeat center
      border-top-right-radius 0.1rem
      border-bottom-right-radius 0.1rem
    .reduce,.add
      float left
      width 0.8rem
      height 0.8rem
      background-size 0.5rem 0.5rem
      border 0.5px solid #eee
    .num
      float left
      width 1rem
      height 0.8rem
      border 0.5px solid #eee
      text-align center
      font-size 0.35rem
</style>
