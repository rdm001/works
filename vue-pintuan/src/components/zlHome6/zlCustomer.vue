<template>
  <div class="zlCustomer">
    <scroll class="scroll"  :listenScroll="true" :probeType="3" ref="scroll" >
    <div class="content">
      <img src="./image/zlHome/banner.png" class="banner" alt="">
      <div class="list">
        <div class="item">
          <div class="info">
            <div class="photo">
              <div class="photoWrap" @click="changGoods(detail.id)">
                <img :src="detail.photo" alt="">
              </div>
            </div>
            <div class="productInfo">

              <div class="price" style="color:black">市场价：<i style="text-decoration: line-through;margin-right: 0.2rem">{{detail  && detail.salePoints | fulterUnit}}</i><i style="font-size:0.5rem;color:red">{{detail.activityProductVo  && detail.activityProductVo.floorPrice | fulterUnit}}</i></div>


              <div class="consumption">符合资格{{num}}人</div>
              <div class="btn" @click="spell">为他助力</div>
            </div>
          </div>
          <div class="again" @click="$router.push('/zlHome6')">我也来发起</div>
        </div>
      </div>

      <img src="./image/zlHome/rule.png" class="rule" alt="">

    </div>
    </scroll>


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
        if(this.detail.activityProductVo.productCutRecords[0].cutUserName == this.user.id){
          this.$router.push('/zlHome6')
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
        console.log(id)
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
              Toast('助力已成功!')
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
                Toast('助力已成功!')
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
                height 100%
                width 100%
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
              color #000
              border 1px solid #000
              margin 0.1rem 0
            .btn
              width 3.6rem
              height 1.05rem
              border 2px solid #860c1d
              background #e33e31
              border-radius 0.2rem
              text-align center
              line-height 1.05rem
              font-size 0.4rem
              color white

        .again
          width 5rem
          height 1rem
          line-height 1rem
          text-align center
          border-radius 0.1rem
          color #fff
          font-family '黑体'
          margin 0 auto
          font-size 0.4rem
          background #ff675b
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

</style>
