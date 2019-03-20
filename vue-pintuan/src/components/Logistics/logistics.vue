<template>
    <div class="logistics">
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="查看物流">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>
      <Scroll class="scroll" v-if="voList.length">
          <div>
            <div v-for="item,index in voList" class="logisticsListItem">
              <div class="name">包裹{{index+1}}</div>
              <div v-for="item2,index2 in item.itemList" class="item">
                <i class="index">{{index2+1}}</i>
                <p>{{item2.msgTime}}</p>
                <p>{{item2.content}}</p>
              </div>
            </div>
          </div>
      </Scroll>
      <div class="tips" v-if="showTips">

      </div>
    </div>
</template>
<script type='text/javascript'>
  import Scroll from '../../common/components/scroll.vue'
    export default {
        data() {
            return {
              outTradeNo:0,
              source:0,
              voList:[],
              showTips:false
            }
        },
        created(){
          this.outTradeNo = this.$route.params.outTradeNo
          this.source = this.$route.params.source
          this._initData()
        },
        methods: {
            _initData(){
                this.$http.post(
                    this.$api.logistics,
                  this.$until.getFormData({
                    outTradeNo:this.outTradeNo,
                    source:this.source
                  })).then(({data}) => {
                        if(data.success){
                          this.voList = data.obj
                        }else{
                          this.showTips = true
                        }
                  })
            }
        },
        components:{
          Scroll
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
.logistics
  .tips
    fullScreen(40px,0,0,0)
    background url("./image/Logistics_empty.png") no-repeat center
    background-size 3rem
  .scroll
    fullScreen(40px,0,0,0)
    .logisticsListItem
      background white
      padding 0.2rem 0.5rem
      margin-bottom 0.3rem
      .name
        font-family '黑体'
        font-weight bold
        font-size 0.4rem
      .item
        position relative
        margin 0.2rem 0
        padding-left 0.7rem
        line-height 0.5rem
        .index
          position absolute
          left 0
          top 0
          height 0.5rem
          width 0.5rem
          background #1296db
          color white
          text-align center
          line-height 0.5rem
          border-radius 0.3rem

</style>
