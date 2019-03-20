<template>
    <div ref="wrapper">
      <slot></slot>
      <!-- slot插槽 -->
    </div>
</template>

<script type="text/javascript">
    import BScroll from 'better-scroll'

    export default {
        props:{
          /**
           * 1 滚动的时候会派发scroll事件，会截流。
           * 2 滚动的时候实时派发scroll事件，不会截流。
           * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
           */
            probeType:{  //控制监听事件类型
              type:Number,
              default:1
            },
            click:{ //是否派发点击事件
              type:Boolean,
              default:true
            },
            listenTouchend:{ //是否派发touchend 事件
              type:Boolean,
              default:false
            },
            data:{  //传递的数据
              type:Array,
              default:null
            },
            listenScroll:{
              type:Boolean,
              default:false
            },

        },
        data () {
            return {}
        },

        mounted(){
            let that = this
            setTimeout(() => {
              that._initScroll()
            },200);

        },
        methods:{
            _initScroll(){
                if(!this.$refs.wrapper){
                    return
                }
                this.scroll = new BScroll(this.$refs.wrapper,{
                    probeType:this.probeType,
                    click:this.click
                })
                var that = this
                //监听滚动事件
                if(this.listenScroll){
                    this.scroll.on('scroll',pos => {
                      that.$emit("scroll",pos,that.scroll.maxScrollY)
                    })
                }
               // 监听touchEnd事件
                if(this.listenTouchend){
                  this.scroll.on('touchEnd',(pos) => {
                       that.$emit("touchEnd",pos,that.scroll.maxScrollY)
                  })
                }


            },
            enable(){
                this.scroll && this.scroll.enable()
            },
            disable(){
              this.scroll && this.scroll.disable()
            },
            refresh(fn){
              this.scroll && this.scroll.refresh()
              if(fn) fn()
            },
            scrollTo(){
                this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)
            },
            scrollToElement(){
                this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)
            }
        },
        watch:{
            data(){

            }
        }
    }
</script>

<style type="text/css" lang="stylus" rel="stylesheet/stylus">

</style>
