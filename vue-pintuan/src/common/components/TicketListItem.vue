<template>
    <div class="ticketListItem">
      <div class="pic">{{data.totalBlance | fulterUnit}}</div>
      <div class="info">
        <div class="name">
          {{data.name}}
        </div>
        <div class="price">
          余额 <i class="blanceNum">{{data.blance | fulterUnit}}</i></span>
        </div>
        <div class="endTime">
          截止有效期：{{data.validEndDate}}
        </div>
      </div>
    </div>
</template>
<script type='text/javascript'>
    import {mapGetters} from 'vuex'
    export default {
        props:['data'],
        data() {
            return {}
        },
        created(){

        },
        methods: {},
        computed:{
          ...mapGetters(['unit'])
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
.ticketListItem
  width 100%
  height 3rem
  margin 0.2rem 0
  box-sizing border-box
  padding 0.2rem
  overflow hidden
  background white
  .pic
    float left
    width 2.6rem
    height 2.6rem
    line-height 2.6rem
    text-align center
    background #ff605d
    font-size 0.4rem
    color white
  .info
    float right
    width 6.8rem
    height 2.6rem
    &>div
      height 0.8rem
      line-height 0.8rem
      font-size 0.4rem
    .name
      color #ff605d
    .price
      color #ff605d
      .blanceNum
        margin-left 0.2rem
        padding 0.1rem 0.2rem
        background #ff605d
        color white
        border-radius 0.1rem
    .endTime
      font-size 0.3rem
      color #aaa

</style>
