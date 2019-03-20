<template>
  <div class="SpellGroupDetail" :style="{overflow:showSuccess ? 'hidden' : ''}">
    <mt-header  class="topBar" style="font-size: 0.4rem" title="砍价详情">
      <div @click="closeApp" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>
    <div class="wrap">
      <div class="user">
        <img src="./image/head.png" class="head" alt="">
        <div class="userInfo">
          <div class="userName">用户{{user.id}}</div>
          <div class="desc">我发现一件好货,一起来砍价{{spellDetail&&spellDetail.activityProductVo.floorPrice| fulterUnit}}拿吧</div>
        </div>
      </div>
      <div class="product">
        <img :src="spellDetail&&spellDetail.photo" class="photo" alt="">
        <div class="productInfo">
          <div class="productName">{{spellDetail&&spellDetail.itemName}}</div>
          <div class="productPrice">
            <span class="newPrice">{{spellDetail&&spellDetail.activityProductVo.floorPrice| fulterUnit}}</span>
            <span style="text-decoration: line-through;color:#bbb">{{spellDetail&&spellDetail.salePoints| fulterUnit}}</span></div>
        </div>
      </div>
      <div class="loadProgress">
        <div class="text">
          已砍 <span style="color:red;font-size:0.4rem">{{spellDetail&&spellDetail.activityProductVo.cutPrice | fulterUnit}}</span>,
          还差 <span style="color:red;font-size:0.4rem">{{spellDetail&&spellDetail.activityProductVo.surplusCutPrice | fulterUnit}}</span>
        </div>
        <div class="Progress">
          <div class="loading" :style="{width:percentage + '%'}"></div>
        </div>
      </div>
      <!--<div class="btn" @click="helperCut">帮他砍一刀</div>-->
      <div class="btn" v-if="Ended && isMe" @click="$router.push('/mySpell')">砍价成功</div>
      <div class="btn" v-if="Ended && !isMe">砍价成功</div>
      <!--<div class="btn" v-else-if="type == -1 && !Ended">打开app帮好友砍价</div>-->
      <div class="btn" v-if="type == 1 && !Ended" @click="share">分享给好友,帮我砍价</div>
      <div class="btn" @click="helperCut" v-if="type == 2 && !Ended">帮他砍一刀</div>
      <div class="btn mySpells" @click="again">再发起砍价</div>
      <div class="time">{{times}}</div>
      <div class="helpers">
        <div class="title">砍价帮</div>
        <ul class="helperList">
          <li class="item" v-for="(item,index) in helper" :key="index">
            <img src="./image/head.png" class="head" alt="">
            <div class="helperInfo" >
              <div>{{item.cutUserName}}</div>
              <div>{{index == 0 ? "发起人" :""}}</div>
            </div>
            <div class="result">
              <!-- 砍掉 <span style="color:red">{{item.cutPrice | fulterUnit}}</span>-->
              砍掉 <span style="color:red">{{item.cutPrice  | fulterUnit}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="spellSuccess" v-show="showSuccess" @click="showSuccess = false">
      <div class="content">
        <img src="./image/success.png" class="successPic" alt="">
        <div class="cutNum">你已砍了<span style="color: red;font-size: 0.5rem">{{cutValue | fulterUnit}}</span></div>
        <div class="share" @click="share">分享给好友</div>
      </div>
    </div>
  </div>
</template>
<script type='text/javascript'>
  /*orderNo:"DD2018090304530235484506"
   recordsId:1128*/
  import {mapGetters} from 'vuex'
  import {Toast} from 'mint-ui'
  let diff = 0;
  export default {
    data() {
      return {
        id:this.$route.query.id,
        spellDetail:null,
        showSuccess:this.$route.query.alert,
        Ended:false,
        type:'',
        diffTime:0,
        cutValue:0,
        tip:'',
        cutFlag:true,
        helper:[],
        productId:0,
        isMe:false
      }
    },
    created(){
      this._initData()
    },
    methods: {
      _initData(){
        let that = this
        this.$http.post(
          this.$api.spellDetail,
          this.$until.getFormData({
            recordsId:this.id,
            token:this.token ? this.token : ''
          })
        ).then(({data}) => {
          if(data.success){
            this.spellDetail = data.obj.entity
            diff = Date.now() - data.obj.entity.currentTime
            if(data.obj.entity.activityProductVo.surplusCutPrice <= 0){
              this.Ended = true
            }
            this.productId = data.obj.entity.id
            if(window.location.href.indexOf('alert=true') >= 0 && data.obj.entity.activityProductVo.productCutRecords.length <=1){
              this.cutValue = data.obj.entity.activityProductVo.cutPrice
            }
            this.type = data.obj.entity.activityProductVo.cutType
            this.helper = data.obj.entity.activityProductVo.productCutRecords
            this.isMe = this.helper[0].cutUserName == this.user.id
            that.countdown()
            setInterval(that.countdown,1000)
          }else{
            Toast(data.msg)
          }
        })
      },
      again(){
        /* if(this.siteId == 1){
         window.location.href = 'https://whyst.wx.cmbchina.com/LS/Campus/CutPrice'
         }else */
        if(this.siteId == 13){
          if(this.productId == 5529  ){
            window.location.href = 'https://zhapp.whecb.com/hdpage/cq_yyj/cq_yyj.html'
          }else if(this.productId == 6090){
            window.location.href = 'https://zhapp.whecb.com/hdpage/cq_ych/cq_ych.html'
          }
        }else if(this.productId == 7047){
            window.location.href = 'https://zhapp.whecb.com/hdpage/qd_ysl/qd_ysl.html'
        }else{
          this.$router.push('/productDetail/' + this.productId)
        }
        /*else if(this.siteId == 13){
         window.location.href = 'https://zhapp.whecb.com/hdpage/cq_ych/cq_ych.html'
         }*/

      },
      closeApp(){
        var isiPhone = navigator.userAgent.match(/(iPhone|iPod)/i) != null;
        if(isiPhone){
          location.href = "http://cmbiphone/tool";
        }else{
          location.href = "http://cmbandroid/tool";
        }
      },
      share(){
        let id = this.siteId
        let pic =  this.spellDetail.photo
        let name = this.spellDetail.itemName
        let text = this.spellDetail ? this.spellDetail.activityProductVo.floorPrice  : 0
        text = this.filterPrice(text)
        window.location.href = `http://cmbls/socialshare?id=mpBank&&channel=defaultWithNoSMS&type=url&title=我发现了一件好货，帮我砍价${text}拿吧&text=${name}&picurl=${pic}&url=${this.AuthConfig.authShorUrl}?kanjiaid=${this.id}`
      },
      filterPrice (value) {
        if(this.unit == '￥'){
          return '￥' + value
        }else{
          return value + this.siteConfig.cashUnit
        }
      },
      helperCut(){
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
            this._initData()
            this.cutValue = data.obj.cutValue
            this.showSuccess = true
          }else{
            Toast(data.msg)
          }
        }).catch(e => this.cutFlag = true)
      },
      countdown(){
        //倒计时
        var that = this
        var endTime = this.spellDetail.activityProductVo.endDate;
        var startTime = this.spellDetail.activityProductVo.startDate;
        var nowTime = Date.now() - diff
        var diffTime = 0;
        //this.activityStatus = this.filterTime()
        if(nowTime < endTime && nowTime >= startTime ){
          //正在活动中
          this.tip = "仅剩"
          diffTime = endTime - nowTime
        }else if(nowTime < startTime){
          //活动未开始
          this.tip = "倒计时"
          diffTime = startTime - nowTime
        }else if(nowTime > endTime){
          //活动已结束
          this.tip = "活动已结束"
          if(that.timer) clearInterval(that.timer)
          return
        }
        this.diffTime = diffTime
      },
      filterTime(){
        //返回活动状态
        var endTime = this.spellDetail.activityProductVo.endDate;
        var startTime = this.spellDetail.activityProductVo.startDate;
        var nowTime = Date.now() - diff
        if(nowTime < endTime && nowTime >= startTime ){
          //正在活动中
          return 0
        }else if(nowTime < startTime){
          //活动未开始
          return -1
        }else if(nowTime > endTime){
          //活动已结束
          return 1
        }
      },
    },
    computed:{
      times(){
        if(!this.spellDetail) return ''
        if(this.filterTime() == 1){
          return '砍价已失效'
        }
        let diffTime = this.diffTime
        var day = parseInt( diffTime / 1000/ 60 / 60 / 24).toString()
        day = day.length < 2 ? "0" + day : day
        var hour =  parseInt( diffTime / 1000/ 60 / 60 % 24).toString()
        hour = hour.length < 2 ? "0" + hour : hour
        var minute =  parseInt( diffTime / 1000/ 60 % 60 ).toString()
        minute = minute.length < 2 ? "0" + minute : minute
        var sec =  parseInt( diffTime / 1000 % 60  ).toString()
        sec = sec.length < 2 ? "0" + sec : sec
        let time = this.tip + day + "天" + hour + "时" + minute + "分" + sec + "秒"
        return time
      },
      percentage(){
        let proportion = this.spellDetail ? parseInt((this.spellDetail.activityProductVo.cutPrice/(this.spellDetail.activityProductVo.cutPrice + this.spellDetail.activityProductVo.surplusCutPrice  ))*100) : 0
        return proportion
      },
      ...mapGetters(['token','unit','user','siteId','siteConfig','AuthConfig'])
    }
  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  .SpellGroupDetail
    fullScreen(0,0,0,0)
    overflow auto
    overflow-scrolling touch
    -webkit-overflow-scrolling touch
    background #fd3c4f url("./image/bg.png") no-repeat left 40px
    background-size 100%  auto
    .spellSuccess
      position fixed
      fullScreen(0,0,0,0)
      background rgba(0,0,0,0.8)
      .content
        position absolute
        left 50%
        margin-left -3rem
        top 30%
        padding 1.5rem 0.3rem 0.3rem
        width 6rem
        background white
        .successPic
          position absolute
          left 20%
          top -1.5rem
          width 60%
        .cutNum
          text-align center
          font-size 0.4rem
        .share
          width 5rem
          height 1rem
          text-align center
          line-height 1rem
          color red
          font-size 0.35rem
          margin 1rem auto 0.3rem
          background url("./image/btn2.png") no-repeat center
          background-size 100% 100%
    .wrap
      width 90%
      box-sizing border-box
      margin 0.5rem auto
      padding 0.5rem 0.2rem
      background white
      border-radius 0.1rem
      .user
        width 100%
        overflow hidden
        .head
          float left
          width 1.2rem
          height 1.2rem
        .userInfo
          float left
          width 6.5rem
          font-size 0.3rem
          padding-left 0.5rem
          line-height 0.6rem
          & > div
            overflow hidden
            text-overflow ellipsis
            white-space nowrap


      .product
        width 100%
        box-sizing border-box
        padding 0.2rem
        background #f5f5f5
        overflow hidden
        border-radius 0.1rem
        margin 0.3rem auto
        .photo
          float left
          width 2rem
          height 2rem
        .productInfo
          float right
          width 5.8rem
          .productName
            overflow hidden
            font-size 0.35rem
            height 1.4rem
            line-height 0.7rem
          .productPrice
            line-height 0.6rem
            font-size 0.25rem
            color red
            .newPrice
              font-size 0.45rem
              margin-right 0.2rem
      .loadProgress
        margin 0.7rem auto
        .text
          text-align center
          font-size 0.3rem
        .Progress
          width 90%
          height 0.2rem
          background #e6e6e6
          margin 0.3rem auto 0
          border-radius 0.1rem
          overflow hidden
          .loading
            float left
            border-radius 0.1rem
            height 100%
            background #ffd23b
      .btn
        width 8rem
        height 1.2rem
        margin 0.3rem auto
        text-align center
        line-height 1.2rem
        font-size 0.4rem
        color red
        background url("./image/btn.png") no-repeat center
        background-size 100% 100%
        &.mySpells
          background white
          border 1px solid red
          border-radius 0.8rem
      .time
        margin 0.5rem auto
        text-align center
        font-size 0.4rem
      .helpers
        background #fef8e8
        border-radius 0.1rem
        .title
          line-height 1rem
          text-align center
          font-size 0.4rem
          border-bottom 1px solid #ffefc3
        .helperList
          .item
            overflow hidden
            .head
              float left
              padding 0.2rem
              width 1.2rem
              height 1.2rem
            .helperInfo
              width 3.5rem
              float left
              padding 0.2rem
              line-height 0.6rem
              & > div
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
            .result
              float right
              height 1.6rem
              text-align center
              width 2.5rem
              padding 0 0.2rem
              line-height 1.6rem
</style>
