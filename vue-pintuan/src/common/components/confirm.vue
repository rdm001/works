<template>
  <transition name="bounceIn">
    <div class="confirm">
      <div class="content">
        <slot name="header"></slot>
        <slot name="body"></slot>
        <div class="footer">
          <span class="sure" @click="sure">确认</span>
          <span @click="cancel">取消</span>
        </div>
      </div>
    </div>
  </transition>

</template>
<script type='text/javascript'>
    export default {
        data() {
            return {}
        },
        methods: {
            sure(){
              this.$emit('sure')
            },
            cancel(){
              this.$emit('cancel')
            }
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../css/variable.styl"
  @import "../css/transition_name.styl"
.confirm
  fullScreen(0,0,0,0)
  position fixed
  z-index 100
  transform-origin:center 40%
  .content
    position absolute
    top 30%
    left 50%
    width 8rem
    margin-left -4rem
    background white
    border-radius 0.2rem
    overflow hidden
    .header
      height 1rem
      line-height 1rem
      text-align center
      font-size 0.4rem
      font-weight bold
    .body
      padding 0.3rem
      text-align center
      line-height 0.5rem
    .footer
      border-top 1px solid #ccc
      height 1.2rem
      overflow hidden
      span
        width 50%
        float left
        line-height 1.2rem
        text-align center
        box-sizing border-box
        font-size 0.4rem
        &:nth-child(1)
          border-right 1px solid #ccc
      .sure
        color #26a2ff


</style>
