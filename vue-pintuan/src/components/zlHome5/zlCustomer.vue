<template>
  <div class="zlCustomer">
    <scroll class="scroll"  :listenScroll="true" :probeType="3" ref="scroll" >
    <div class="content">
        <!-- <img src="./image/back.png" class="back" @click="back" alt=""> -->

      <img src="./image/zlHome/zlhome-banner1.jpg" class="banner" alt="">
      <!-- <img src="./image/zlHome/title.png" class="title" alt=""> -->
      <div class="list">
        <!-- <img src="./image/zlHome/content-header.png" class="list-header" alt=""> -->
        <div class="item">
          <div class="info">
            <div class="photo">
              <div class="photoWrap" @click="changGoods(detail.id)">
                <img src="./image/zlHome/zlhome-quan.jpg" alt="">
              </div>
              <!-- <div v-if="detail.itemName&&detail.itemName.indexOf('华为') != -1" style="font-size: 0.2rem;color:#5fbed4;line-height: 0.4rem">活动期间每日10:00开放一部，发完即止先到先得哦!</div> -->
            </div>
            <div class="productInfo">
              <div class="price">市场价<i class="price-i">{{detail.salePoints |fulterUnit}}</i><span class="text-red">{{detail.activityProductVo  && detail.activityProductVo.floorPrice | fulterUnit}}</span></div>
              <div class="consumption">符合资格{{num}}人 共100份</div>
              <div class="btn" @click="spell">为他助力</div>
            </div>
          </div>
          <div class="again" @click="$router.push('/zlHome5')">我也来发起</div>
        </div>
      </div>

      <!-- <img src="./image/zlHome/rule.png" class="rule" alt=""> -->
      <img src="./image/zlHome/zlhome-b.jpg" class="footer" alt="">

    </div>
    </scroll>
    <div class="ruleImg" v-show="actGoods != 0" @click="actGoods = 0">
      <img src="./image/kfc.png" class="img" v-show="actGoods == 6993" alt="">
      <img src="./image/hw.png" class="img"  v-show="actGoods == 6992" alt="">
      <img src="./image/hf.png" class="img" v-show="actGoods == 6994" alt="">
    </div>

 </div>

</template>
<script type='text/ecmascript-6'>
  import {mapGetters} from 'vuex'
  import {Toast} from 'mint-ui'
  import scroll from '../../common/components/scroll.vue'
  export default {
    data() {
      return {
        show:true,
        id:this.$route.query.id,
        detail:{},
        num:0,
        cutFlag:true,
        actGoods:'0'
      }
    },
   updated(){
      this.$nextTick(()=>{
        this.$refs.scroll.refresh()
      })
    },
    created(){
      //var vn = new VConsole()
      //console.log(this.user)
      let href = window.location.href
      if(href.indexOf('flag=1') < 0 ){
        window.location.href = this.$until.auth(this.AuthConfig)
        return
      }

      this.$http.post(
        this.$api.spellDetail,
        this.$until.getFormData({
          recordsId: this.id,
          token:this.token ? this.token : ''
        })
      ).then(({data}) => {
        if(data.success){
        this.detail = data.obj.entity
        // console.log(this.detail)
        if(this.detail.activityProductVo.productCutRecords[0].cutUserName == this.user.id){
          this.$router.push('/zlHome5')
          return
        }
        this.$http.post(
          this.$api.productSaleNum,
          this.$until.getFormData({
            id:data.obj.entity.id
          })).then((res) => {
            this.num = res.data.obj.saleNum
          })

        }else{
           Toast(data.msg)
        }
    })
    },
    methods: {
      changGoods(id){
        // console.log(id)
        this.actGoods = id
      },
      spell(){
        if(!this.cutFlag) return
        this.cutFlag = false
        this.$http.post(
          this.$api.helperCut,
          this.$until.getFormData({
            recordsId:this.id,
            token:this.token
          })
        ).then(({data}) => {
          this.cutFlag = true
          if(data.success){
            if(data.msg.indexOf('最低价') != -1){
              //Toast('助力已成功!')
              Toast('该订单已助力成功，请勿重复助力')
              return
            }
            if(data.msg.indexOf('砍过价') != -1){
              Toast('您已经助过力!')
              return
            }
            if(data.msg.indexOf('同一人') != -1){
              Toast('当前活动帮同一人助力次数为1次!')
              return
            }
            if(data.msg.indexOf('砍价次数限制') != -1){
              Toast('当前活动助力次数为1次!')
              return
            }
            if(data.msg.indexOf('砍价已失效') != -1){
              Toast('助力已失效!')
              return
            }
            Toast('助力成功!')
          }else{
              if(data.msg.indexOf('最低价') != -1){
                //Toast('助力已成功!')
              Toast('该订单已助力成功，请勿重复助力')
                return
              }
            if(data.msg.indexOf('同一人') != -1){
              Toast('当前活动帮同一人助力次数为1次!')
              return
            }
            if(data.msg.indexOf('砍价次数限制') != -1){
              Toast('当前活动助力次数为1次!')
              return
            }
            if(data.msg.indexOf('砍过价') != -1){
              Toast('您已经助过力!')
              return
            }
            if(data.msg.indexOf('砍价已失效') != -1){
              Toast('助力已失效!')
              return
            }
            Toast(data.msg)
          }


        }).catch(e => this.cutFlag = true)
      }
    },
    computed:{
      ...mapGetters(['siteId','token','user','AuthConfig'])
    },
    components:{
      scroll
    }
  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css' scoped>
  .zlCustomer
    position absolute
    left 0
    top 0
    bottom 0
    right 0
    background white
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
    .content
      background #ac1e24
      background-size 100% auto
    .banner
      width 100%
    .title
      display block
      width 80%
      margin 0.3rem auto
    .list
      position relative
      margin 0 auto
      width 90%
      height 0
      padding 32% 0
      // padding-top .5rem
      background url("./image/zlHome/zlhome-kuang1.jpg") no-repeat left top
      background-size 100% 100%
      .list-header
        width 9.2rem
        position absolute
        left 50%
        margin-left -4.6rem
        top -1rem
      .item
        width 100%
        // background url("./image/zlHome/shadow.png") no-repeat center bottom
        background-size 98% auto
        padding-bottom 0.3rem
        img   
          width 100%
        .info
          display flex
          margin-top -28%
          justify-content space-between
          // .photo,
          .photo
            width 55%
            box-sizing border-box
            padding 0.2rem 0 .3rem .4rem
            .photoWrap
              margin 0 auto
              background-size 100% 100%
              display flex
              justify-content center
              align-items center
          .productInfo
            padding-top 0.5rem
            padding-right 0.5rem
            width 45%
            .price
              font-size .3rem
              font-weight 600
              .price-i
                background url("./image/zlHome/zlhome-line.png") no-repeat center center
                background-size 100%
            .text-red
              color #c8132d
              padding-left .2rem
            .consumption
              height .5rem
              line-height .5rem
              border .05rem solid #000
              font-weight 600
              color #000
              display inline-block
              padding 0 .1rem
              margin .15rem 0
              font-size .3rem
            .btn
              background  #c8132d
              border .05rem solid #860c1d
              line-height .9rem
              color #fff
              border-radius .1rem
              // padding 0 .3rem
              width 95%
              font-size .5rem
              font-weight 600
              letter-spacing .1rem
              text-align center

        .again
          border-radius .2rem
          background #f1bf70
          box-shadow 0 .2rem .3rem rgba(0,0,0,.3)
          width 3.7rem
          color #ac1e24
          line-height .8rem
          font-weight 600
          font-size .5rem
          text-align center
          display block
          margin .5rem auto
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

</style>
