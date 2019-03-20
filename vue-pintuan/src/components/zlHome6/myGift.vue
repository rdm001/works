<template>
  <div class="ZlGift">
    <scroll class="scroll"  :listenScroll="true" :probeType="3" ref="scroll" >
    <div class="content">
      <img src="./image/back.png" class="back" @click="$router.push('/zlHome6')" alt="">
      <img src="./image/zlHome/banner.png" class="banner" alt="">

      <div class="list">
        <div class="item" v-for="(item,index) in list" v-if="index == 0" :key="index">
          <div class="info">
            <div class="photo">
              <div class="photoWrap" @click="changGoods(item.activityProductVo.siteProductId)">
                <img :src="item.photo" alt="">
              </div>

            </div>
            <div class="productInfo">

              <div class="btn" @click="showAlert = true">填写您的信息</div>
            </div>
          </div>

        </div>
      </div>


      <img src="./image/zlHome/rule.png" class="rule" alt="">
    </div>
    </scroll>


    <div class="shadow" v-show="showAlert">
      <div class="contact">
        <div class="item">
          <span class='item-title'>真实姓名</span>
          <input type="text" v-model="name" class="input">
        </div>

        <div class="item">
          <span class='item-title'>联系电话</span>
          <input type="text" v-model="phone" class="input">
        </div>

        <div class="item">
          <span class='item-title'>赠送对象</span>
          <input type="text" v-model="zsObj" class="input">
        </div>

        <div class="item">
          <span class='item-title' style="width: 5rem;text-align: left">您参加本次活动的原因:</span>
          <input type="text" v-model="YY" style="width: 100%;" class="input">
        </div>


        <div class="submit" @click="submitAddr">提交</div>

        <div class="close" @click="showAlert = false"></div>
      </div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
  let itemIds = [7564]
  import {mapGetters} from 'vuex'
  import {Toast,MessageBox } from 'mint-ui'
  import scroll from '../../common/components/scroll.vue'
  import Clipboard from 'clipboard';
  export default {
    data() {
      return {
        list:[],
        spellList:[],
        showAlert:false,
        name:'',
        phone:'',
        address:'',
        actGoods:'0',
        zsObj:'',
        YY:'',
        code:''
      }
    },
    updated(){
      this.$nextTick(()=>{
        this.$refs.scroll.refresh()
      })
    },
    created(){

      this.$http.post(
        '/api/client/act/cut/htlpList',
        this.$until.getFormData({
          siteId:this.siteId,
          token:this.token,
          activityType:2,
          pageNo:0,
          pageSize:10000
        })
      ).then(({data}) => {
        if(data.success){
          let arr = []
          data.obj.page.rows.forEach((e) => {
              if(e.activityProductVo.orderNo && itemIds.indexOf(e.activityProductVo.siteProductId) != -1){
             // if(1+1 == 2){
                  e.num = 0
                  arr.push(e)
                //=============================话费查询虚拟券码
                  if(e.activityProductVo.siteProductId == 6994){
                    this.$http.post(
                      this.$api.orderDetail,
                      this.$until.getFormData({
                        orderNo:e.activityProductVo.orderNo
                      })
                    ).then(({data}) => {
                      if(data.success){
                        let order = data.obj.entity

                        this.$http.post(
                          this.$api.virtualCode,
                          this.$until.getFormData({
                            token:this.token,
                            orderDetailId:order.orderDetailList[0].id
                          })
                        ).then(({data}) => {
                          if(data.success){
                            this.code = data.obj.entity.productVirtualAccCashList[0].virtualCode

                          }else{
                            Toast(data.msg)
                          }

                        })
                      }
                    })
                  }
              }
          })
          this.list = arr
        }
      })
     // this.init(itemIds[0])
    },
    watch:{
        list(newVal){
         /*   console.log(newVal)
          return
            newVal.forEach(e => {
              this.$http.post(
                this.$api.productSaleNum,
                this.$until.getFormData({
                  id:e.activityProductVo.siteProductId
                })
              ).then(({data}) => {
                  if(data.success){
                      e.num = data.obj.saleNum
                  }
              })
              console.log(this.list)
            })*/
        }
    },
    methods: {
      changGoods(id){
        this.actGoods = id
      },
      copy(){
        var clipboard = new Clipboard('#code')
        clipboard.on('success', e => {
          Toast('复制成功')
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          console.log('该浏览器不支持自动复制')
          // 释放内存
          clipboard.destroy()
        })
      },
      copy2(){
        var clipboard = new Clipboard('#code2')
        clipboard.on('success', e => {
          Toast('复制成功')
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          console.log('该浏览器不支持自动复制')
          // 释放内存
          clipboard.destroy()
        })
      },
      use(item){
          if(item.activityProductVo.siteProductId == 6994){
            MessageBox.alert('复制充值地址到浏览器打开后进行充值', '提示');
             // window.location.href = 'https://t.cmbchina.com/mvzzrV'
          }
          if(item.activityProductVo.siteProductId == 6993){
            this.$http.post(
              this.$api.orderDetail,
              this.$until.getFormData({
                orderNo:item.activityProductVo.orderNo
              })
            ).then(({data}) => {
              if(data.success){
                let order = data.obj.entity
                this.$router.push(`/virtualCode?id=${order.orderDetailList[0].id}&itemId=${order.orderDetailList[0].id}`)
              }
            })
          }

      },
      submitAddr(){
          let reg = /1[0-9]{10}/
          if(this.name == ''){
              Toast('请填写姓名')
              return
          }else if(this.phone == ''){
            Toast('请填写手机号')
            return
          }else if(!reg.test(this.phone)){
            Toast('请填写手机号码格式不正确')
            return
          }else if(this.zsObj == ''){
              Toast('请填写赠送对象');
              return
          }else if(this.YY == ''){
            Toast('请填写参加本次活动原因');
            return
          }
          let obj = this.list.filter((e) => {
              return e.activityProductVo.siteProductId == itemIds[0]
          })[0]
          this.$http.post(
              '/api/client/act/cut/writeBackAddress',
              this.$until.getFormData({
                token:this.token,
                orderNo:obj.activityProductVo.orderNo,
                receiver:this.name,
                receiverPhone:this.phone,
                address:this.zsObj + '__' + this.YY
              })
          ).then(({data}) => {
              if(data.success){
                  this.showAlert = false
                  Toast('信息提交成功')
              }else {
                  Toast(data.msg)
              }
          })
      },
      init(id){
        let obj = {}
        this.$http.all([
          this.$http.post(
            this.$api.productDetail,
            this.$until.getFormData({
               id:id
            })
          ),
          this.$http.post(
            this.$api.productSaleNum,
            this.$until.getFormData({
               id:id
            })
          )
        ]).then(this.$http.spread((res1,res2) => {
          if(res1.data.success){
            obj.price = res1.data.obj.entity.activityProductVo.floorPrice
            obj.photo = res1.data.obj.entity.photo
          }
          if(res2.data.success){
            obj.num = res2.data.obj.saleNum
          }
        })).then(() => {
          this.list.push(obj)
        })
      }
    },
    computed:{
      ...mapGetters(['siteId','token'])
    },
    components:{
      scroll
    }
  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css' scoped>
  .ZlGift
    position absolute
    left 0
    top 0
    bottom 0
    right 0
    overflow auto
    -webkit-overflow-scrolling touch
    .ruleImg
      position fixed
      left 0
      top 0
      bottom 0
      right 0
      background rgba(0,0,0,0.7)
      z-index 100
      .img
        width 8rem
        position absolute
        left 50%
        top 20%
        margin-left -4rem
    .scroll
      position absolute
      left 0
      top 0
      bottom 0
      right 0
    .back
      width 1rem
      height 1rem
      position fixed
      left 0.5rem
      top 0.5rem
    .content
      background url("./image/zlHome/bg.png") repeat left top
      background-size 100% auto
    .banner
      width 100%
    .title
      display block
      width 80%
      margin 0.3rem auto
    .list
      position relative
      margin 1rem auto
      width 8.9rem
      padding-top 1rem
      background url("./image/zlHome/content-bg.png") no-repeat left top
      background-size 100% 100%
      .list-header
        width 9.2rem
        position absolute
        left 50%
        margin-left -4.6rem
        top -1rem
      .item
        width 100%
        padding 1.2rem 0 0.8rem
        #code
          position absolute
          right 0
          top 0
          background #5fbed4
          color #184d6f
          font-size 0.2rem
          padding 0.05rem 0.2rem
          &:before
            content: ''
            position: absolute
            top: -10px
            left: -10px
            right: -10px
            bottom: -10px
        #code2
          position absolute
          right 1.5rem
          top 0
          background #5fbed4
          color #184d6f
          font-size 0.2rem
          padding 0.05rem 0.2rem
          &:before
            content: ''
            position: absolute
            top: -10px
            left: -10px
            right: -10px
            bottom: -10px
        .info
          display flex
          justify-content space-between
          .photo,.productInfo
            width 50%
          .photo
            box-sizing border-box
            padding 0.5rem
            .photoWrap
              width 3.3rem
              height 3.3rem
              margin 0 auto
              img
                width 100%
                height 100%
          .productInfo
            padding-top 0.5rem
            padding-right 0.5rem
            .price
              color #ffe25d
              font-size 0.4rem
            .consumption
              padding 0.05rem 0.2rem
              display inline-block
              font-size 0.2rem
              color #5fbed4
              border 1px solid #5fbed4
              margin 0.1rem 0
            .btn
              width 3.6rem
              height 1.05rem
              background url("./image/zlHome/btn-bg.png") no-repeat center
              background-size 100% 100%
              text-align center
              margin-top 0.1rem
              line-height 1.05rem
              font-size 0.4rem
              color white

        .load
          color #59dadf
          padding 0 0.5rem
        .loadBar
          width 7.8rem
          height 0.2rem
          border-radius 0.2rem
          margin 0.2rem auto 0
          background #21718b
          box-shadow 1px 1px 2px  #333
          overflow hidden
          .loading
            width 50%
            height 100%
            border-radius 0.2rem
            background #fae37d
    .rule
      display block
      margin -0.5rem auto 0
      width 89%
    .footer
      width 100%
      margin-top -5.5rem
  .shadow
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    background rgba(0,0,0,0.7)
    padding-top 1rem
    .contact
      position relative
      width 9.1rem
      height 11rem
      margin 0 auto
      box-sizing border-box
      padding 3rem 1.5rem 1rem
      background url("./image/zlHome/contact-bg.png") no-repeat center
      background-size 100% 100%
      .close
        position absolute
        left 50%
        margin-left -0.5rem
        bottom -1.5rem
        width 1rem
        height 1rem
        background url('./image/gift/close.png') no-repeat center
        background-size 100% 100%
      .item
        height 0.8rem
        color #000
        margin-bottom 0.3rem
        .item-title
          display inline-block
          width 2rem
          text-align center
          line-height 0.8rem
        .input
          background transparent url("./image/zlHome/input-bg.png") no-repeat center
          background-size 100% 100%
          height 0.8rem
          width 3.4rem
          padding 0 0.2rem
          color #fff
      .tips
        color #3dbad5
        font-size 0.3rem
        line-height 0.5rem
      .submit
        width 4rem
        height 1rem
        background #ff675b
        background-size 100% 100%
        color white
        text-align center
        line-height 1rem
        margin 1.3rem auto 0


</style>
