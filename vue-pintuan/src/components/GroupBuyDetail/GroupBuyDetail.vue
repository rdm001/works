<template>
  <div class="groupBuyDetail">
    <mt-header  class="topBar" style="font-size: 0.4rem" title="拼团详情">
      <div @click="closeApp" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>
    <img :src="detail.photo" class="photo" alt="">
    <div class="itemName">{{detail.itemName}}</div>
    <div class="price">
      {{newPoint | fulterUnit}}
      <span style="font-size: 0.3rem;color:#666;text-decoration: line-through">{{detail.salePoints | fulterUnit}}</span>
    </div>

    <ul class="users">
      <li v-for="(item,index) in userGroup" :key="index">
        <img src="./image/head.png" class="headImg" alt="">
        <p>{{item.groupUserName}}</p>
        <p class="bigGroup" v-if="item.groupType == 1">团长</p>
      </li>
    </ul>
    <div class="status" v-if="times && vo.operStatus == 0">
      <i style="color:red">{{vo.groupMaxUserNum}}</i>人团,还差<i style="color:red">{{vo.groupMaxUserNum - userGroup.length}}</i>人.
      剩余  <i style="color:red">{{times}}</i>
    </div>

    <div class="status"  style="color :#999;font-size:0.4rem" v-if="times && vo.operStatus == -1">
      拼团失败
    </div>

    <div class="status" style="color :#f00;font-size:0.4rem" v-if="times && vo.operStatus == 1">
      拼团成功
    </div>
    <div class="status" style="color :#f00;font-size:0.4rem" v-if="times && vo.operStatus == 0">
      拼团中
    </div>

    <div class="btn" @click="join" v-if="!isSelf && vo.operStatus == 0 && showJoin" >立即参团</div>
    <div class="btn" v-if="!isSelf" @click="$router.push('/GroupBuyGoodsDetail/' + detail.id)">我也要开团</div>
    <div class="btn" @click="$router.push('/myGroupBuy')">我的拼团</div>
    <div class="share" @click="share" v-if="vo.operStatus == 0">邀请微信好友</div>
    <spellAddress @fn="_initData" v-if="spellInfo.showAddress && vo.operStatus == 0"></spellAddress>
    <div class="detailTitle">商品详情</div>
    <div class="detail" v-html="content"></div>
  </div>
</template>
<script type='text/javascript'>
  import {mapGetters,mapMutations} from 'vuex'
  import {Toast , Indicator,MessageBox} from 'mint-ui'
  import  spellAddress from '@/common/components/spellAddress'

  let diff = 0
  export default {
    data() {
      return {
        recordId:0,
        detail:{},
        userGroup:[],
        isSelf:false,
        vo:{},
        diffTime:'',
        status:'',
        id:0,
        content:'',
      }
    },
    created(){
      let that = this
      this.recordId = this.$route.query.id
      this._initData()
      this.timer = setInterval(() => { that._initData() },1000)

    },
    destroyed(){
      let that = this
      if(that.timer){
        clearInterval(that.timer)
      }
    },
    watch:{
      detail(newVal){
        let that = this
        diff = Date.now() - newVal.currentTime
        //that.countdown();
        //this.timer = setInterval(that.countdown,1500)
      },
      status(newVal){
        if(newVal == 2){
          // this._initData()
        }
      },
      id(newVal){
        this.$http.post(
          this.$api.productDetail,
          this.$until.getFormData({
            id:newVal
          })
        ).then(({data}) => {
          if(data.success){
            this.content = data.obj.entity.content
          }
        })
      }
    },
    methods: {
      _initData(){
        let that = this;
        this.$http.post(
          this.$api.groupBuyDetail,
          this.$until.getFormData({
            token:this.token,
            recordId:this.recordId
          })
        ).then(({data}) => {
          if(data.success){
            this.id = data.obj.entity.id
            this.detail = data.obj.entity
            this.vo = data.obj.entity.activityProductVo
            this.userGroup = data.obj.entity.activityProductVo.productGroupRecords
            this.isSelf = data.obj.entity.activityProductVo.groupType == 1
            let vo = this.vo
            let endTime = vo.endDate < vo.orderEndDate ? vo.endDate : vo.orderEndDate;
            let nowTime = Date.now() - diff
            let diffTime = 0
            diffTime = endTime - nowTime
            this.diffTime = diffTime
          }else{
            Toast(data.msg)
          }
        })
      },
      share(){
        let id = this.siteId
        let pic =  this.detail.photo
        let name = this.detail.itemName
        let text = 1
        // window.location.href = `http://cmbls/socialshare?id=mpBank&&channel=defaultWithNoSMS&type=url&title=我发现了一件好货，帮我砍价${text}拿吧&text=${name}&picurl=${pic}&url=${this.AuthConfig.authShorUrl}?kanjiaid=${this.id}`
        window.location.href = `http://cmbls/socialshare?id=mpBank&&channel=defaultWithNoSMS&type=url&title=我发现一件好物，帮我点一下，一起领福利！&text=${name}&picurl=${pic}&url=${this.AuthConfig.authShorUrl}?pintuanid=${this.recordId}`

      },
      closeApp(){
        var isiPhone = navigator.userAgent.match(/(iPhone|iPod)/i) != null;
        if(isiPhone){
          location.href = "http://cmbiphone/tool";
        }else{
          location.href = "http://cmbandroid/tool";
        }
      },
      countdown(){
        //倒计时

        this._initData()
        /*let that = this
         let vo = this.vo
         let endTime = vo.endDate < vo.orderEndDate ? vo.endDate : vo.orderEndDate;
         let nowTime = Date.now() - diff
         let diffTime = 0
         diffTime = endTime - nowTime
         this.diffTime = diffTime*/
      },
      filterTime(){
        //返回活动状态
        let vo = this.vo
        let endTime = vo.endDate < vo.orderEndDate ? vo.endDate : vo.orderEndDate;
        var startTime = vo.startDate;
        var nowTime = Date.now() - diff
        if(nowTime > endTime){
          //活动已结束
          this.status = 1
          return 1
        }else{
          this.status = 2
          return 2
        }
      },
      join(){
        if(this.vo.memberPrice <= 0){
          this.detail.payWay = 'ye'
        }
        this.detail.recordId =  this.recordId
        this.detail.groupType =  this.vo.groupType
        if(this.detail.type != 3){
          this.set_spellInfo({
            source:this.detail.source,
            showAddress:true,
            product:this.detail
          })
        }else {
          let that = this
          MessageBox.prompt('请输入手机号').then(({ value, action }) => {
            let reg = /^1[0-9]{10}$/
            if(!reg.test(value)){
              return Toast('手机号码格式不正确')
            }else{
              Indicator.open();
              that.$http.post(
                that.$api.joinGroup,
                that.FreightQuery(value)
              ).then(({data}) => {
                Indicator.close();
                Toast(data.msg)
                /*  if (data.success) {
                 //that.$router.push('/groupBuyDetail?id=' + data.obj.groupRecordId)
                 } else {
                 Toast(data.msg)
                 }*/
              })
            }
          });


          /*      Indicator.open();
           this.$http.post(
           this.$api.joinGroup,
           this.FreightQuery
           ).then(({data}) => {
           Indicator.close();
           console.log(data)
           if (data.success) {
           this.$router.push('/groupBuyListDetail?id=' + data.obj.groupRecordId)
           } else {
           //this.cancel()
           Toast(data.msg)
           }
           })*/
        }
      },
      FreightQuery(mobile){
        //运费查询参数
        let cartItemList = [{
          itemId:this.detail.id,
          shopNum:1
        }];

        let query = {
          cartItemList:cartItemList,
          orgId:this.user&&Number(this.user.organization.id),
          payWay:this.vo.memberPrice <= 0 ? 'ye' : 'zh_ywt',
          remark:'',
          siteId:this.siteId,
          orderType:5,
          source:this.detail.source,
          supplyId:this.detail.supplyId,
          token:this.token,
          groupRecordId:this.recordId,
          mobile:mobile
        }
        return query
      },
      ...mapMutations({
        set_spellInfo:'set_spellInfo'
      })
    },
    computed:{
        showJoin(){
          for(let i = 0 ; i < this.userGroup.length ; i ++){
              if(this.userGroup[i].groupUserName == this.user.id){
                  return false
              }
          }
          return true
        },
      times(){
        if(this.filterTime() == 1){
          return ''
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
        let time =  day + "天" + hour + "时" + minute + "分" + sec + "秒"
        return time
      },
      newPoint(){
        let newPoint = 1
        if(this.detail.activityProductVo){
          if(this.detail.activityProductVo.recordType == 1){
            newPoint = ((this.detail.salePoints / (this.detail.salePrice <= 0 ? 1 :this.detail.salePrice)) * this.detail.activityProductVo.captainPrice).toFixed(2)
            return newPoint
          }
          newPoint = ((this.detail.salePoints / (this.detail.salePrice <= 0 ? 1 :this.detail.salePrice)) * this.detail.activityProductVo.memberPrice).toFixed(2)
        }

        return newPoint
      },
      ...mapGetters(['token','siteId','spellInfo','user','AuthConfig'])
    },
    components:{
      spellAddress
    }
  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import '../../common/css/variable.styl'
  .groupBuyDetail
    background white
    fullScreen(0,0,0,0)
    overflow auto
    -webkit-overflow-scrolling touch
    .photo
      width 100%
      height 10rem
    .status
      text-align center
      line-height 1rem
      font-size 0.35rem
    .itemName
      margin-top 0.3rem
      line-height 0.5rem
      font-size 0.4rem
      padding 0 0.2rem
      text-align center
    .price
      text-align center
      line-height 1.3rem
      border-bottom 1px solid #ccc
      font-size 0.45rem
      color red
      margin-bottom 0.3rem
    .btn,.share
      width 7rem
      height 1.3rem
      margin 0.3rem auto
      background #fd3c4f
      line-height 1.3rem
      text-align center
      color white
      font-size 0.5rem
      border-radius 0.1rem
    .share
      border 1px solid #fd3c4f
      background white
      color #fd3c4f
    .detailTitle
      height 1rem
      line-height 1rem
      width 100%
      float left
      text-align center
      border-top 0.3rem solid #e0e0e0
      border-bottom 1px solid #e0e0e0
      font-size 0.4rem
      color #fd3c4f
    .detail
      width 100%
      overflow hidden
      img
        width 10rem !important
        height auto !important
    .users
      overflow hidden
      margin-bottom 0.3rem
      li
        width 15%
        float left
        box-sizing border-box
        .headImg
          display block
          width 1rem
          height 1rem
          margin 0 auto
          border-radius 0.6rem
          border 1px solid red
        p
          text-align center
          margin 0.2rem 0
</style>
