<template>
  <transition name="opacity">
    <div class="paySuccess">
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem; " :title="success ? '支付成功' : '支付失败'">

      </mt-header>
      <div class="content" v-if="success">
        <img src="./image/success.png" class="success">
        <div class="info">订单支付成功</div>
        <div class="tip" @click="going">
            返回个人中心
         </div>
      </div>

      <div class="content" v-if="!success">
        <img src="./image/error.png" class="success">
        <div class="info">订单支付失败</div>
        <div class="tip" @click="going">
          返回个人中心
        </div>
      </div>
    </div>
  </transition>

</template>
<script type='text/javascript'>
  import {mapGetters} from 'vuex'
    export default {
        created(){
            if(this.$route.query.orderNo){
                let orderNo =  this.$route.query.orderNo
              this.$http.post( //初始化订单详情
                this.$api.orderDetail,
                this.$until.getFormData({
                  orderNo:orderNo
                })
              ).then(({data}) => {
                if(data.success) {
                  if(data.obj.entity.operStatus != 22 && data.obj.entity.operStatus  != 23){
                    this.success = false
                   }

                }
              })
            }
        },
        data() {
            return {
                success:true
            }
        },
        methods: {
            going(){
                if(this.siteId == 8 || this.siteId == 11){
                  this.$router.push('/myOrder')
                }else{
                  this.$router.push('/person')
                }

            }
        },
      computed:{
        ...mapGetters(['siteId'])
      }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  .paySuccess
    fullScreen(0,0,0,0)
    background white
    .content
      fullScreen(0,0,0,0)
      margin auto
      width 5rem
      height 5rem
      .success
        display block
        width 2rem
        margin 0 auto
      .info
        margin 0.2rem 0
        font-size 0.5rem
        text-align center
      .tip
        padding 0.2rem 0
        border-radius 0.1rem
        width 3rem
        margin 0 auto
        border 1px solid #1296db
        color #1296db
        text-align center
        font-size 0.4rem
</style>
