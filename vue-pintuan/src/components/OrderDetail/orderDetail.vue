<template>
  <transition name="opacity">
    <div class="orderDetail">
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="订单详情">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>
      <scroll class="scroll" ref="orderDetailScroll">
        <div>
          <div class="activeAddress" v-if="orderDetail.address&&list.length&&list[0].productType != 3">
            <div class="icon_position"></div>
            <div class="addressInfos">
              <div class="userInfo">
                <span>{{orderDetail.receiver || ""}}</span>
                <span class="phone">{{orderDetail.receiverPhone || ""}}</span>
              </div>
              <div class="addressDetail">
                {{orderDetail.address||""}}
              </div>
            </div>
          </div>

          <div class="shopDetail">
            订单明细
            <i class="icon_up" @click="showDetails" :class="{icon_down:!showDetail}"></i>
          </div>
          <transition name="slide">
            <div v-show="showDetail">

              <div @click="$router.push('/productDetail/'+item.itemId)" v-for="(item,index) in list" :key="index" class="orderProduct">
                <img :src="item.productPic" alt="">
                <div class="info">
                  <div class="title">
                    {{item.itemName}}
                  </div>
                  <div class="price_wrap"  v-if="orderDetail.orderType != 1 && orderDetail.orderType != 4">
                    <span class="price">价格：{{item.salePoints | fulterUnit}}</span>
                    <span class="num">x{{item.saleNum}}</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <div class="orderPriceInfo" >
            <div class="seeCode" v-if="list.length&&list[0].productType == 3&&orderDetail.operStatus==23">
              <div class="btn" @click="$router.push('/virtualCode?id='+list[0].id + '&itemId=' + list[0].itemId)">查看券码</div>
            </div>
            <div v-if="orderDetail.orderType != 4 && orderDetail.orderType != 1">
              <div><span style="margin-right:0.3rem">共计{{totalNum}}件商品</span> 小计：<span class="price">{{total | fulterUnit}}</span></div>
              <div>运费：<span class="price">{{orderDetail.freight | fulterUnit}}</span></div>
              <div>合计：<span class="price">{{tol | fulterUnit}}</span></div>
            </div>
            <div class="cancel" v-if="isCancel">
              <div @click="cancel">
                撤销订单
              </div>
            </div>
          </div>


          <div class="orderInfo">
            <div class="title"> 订单信息</div>
            <div><span class="infoName">状态：</span> <span :class="statusColor =='red' ? 'red' : 'blue'">{{status}}</span></div>
            <div><span class="infoName">订单编号：</span>{{orderDetail.orderNo||""}}</div>
            <div><span class="infoName">下单时间：</span>{{orderDetail.cashtime||""}}</div>
            <div><span class="infoName">备注：</span>{{orderDetail.remarks||""}}</div>

          </div>
          <div class="merchants">
            <span @click="tel" >联系商家</span>
            <span v-if="orderDetail.source == 1 ||orderDetail.source == 3">渠道订单:{{orderDetail.outTradeNo}}</span>
          </div>


        </div>

      </scroll>
    </div>
  </transition>

</template>

<script>
  import Scroll from '../../common/components/scroll.vue'
  import selectAddress from '../../common/components/selectAddress.vue'
  import {mapGetters} from 'vuex'
  import { Picker ,MessageBox, Toast} from 'mint-ui';
  export default{
        data(){
            return {
                orderNo:0,
                orderDetail:{},
                showDetail:true,
                auditLoad:[],
                isCancel:0,
                list:[]
            }
        },
        created(){
            this.orderNo = this.$route.query.orderNo
            console.log(this.$route.query.orderNo)
            this._initData()
        },
        watch:{

        },
        methods:{
          tel(){
            this.$until.tel(this.orderDetail.contactLink)
          },
          _initData(){
               /*this.$http.post(
                    this.$api.isCancel,
                    this.$until.getFormData({
                        token:this.token,
                        orderNo:this.orderNo
                    })
                ).then(({data}) => {
                    console.log(data)
                    if(data.code == 200){
                        this.isCancel = data.obj.isCancel
                    }
                })*/
                this.isCancel = 0
                this.$http.post( //初始化订单详情
                    this.$api.orderDetail,
                     this.$until.getFormData({
                         orderNo:this.orderNo
                     })
                ).then(({data}) => {
                    if(data.success) {
                      this.orderDetail = data.obj.entity;
                      if(data.obj.entity.operStatus  == 15){
                          //如果是待支付订单
                          this.isCancel = 1
                      }
                      this.list = this.orderDetail.orderDetailList
                    }else{
                        Toast(data.msg)
                    }
                })
            },
          showDetails(){
            this.showDetail = !this.showDetail
            this.$nextTick(() => {
              this.$refs.orderDetailScroll.refresh()
            })

          },
          cancel(){
           let that = this
             MessageBox.confirm('确认撤销订单?').then(action => {
             that.$http.post(
              that.$api.orderCancel,
               that.$until.getFormData({
               token:that.token,
               orderNo:that.orderNo,
               })
             ).then(({data}) => {
               if(data.success){
                that._initData() //页面数据重载
               }else{
                Toast(data.msg)
               }
             })
          })
          /* this.$http.post(
              this.$api.orderCancel,
              this.$until.getFormData({
                token:this.token,
                orderNo:this.orderNo,
                processInstanceId:this.orderDetail.taskProcessId
              })
            ).then(({data}) => {
              if(data.success){
               this._initData() //页面数据重载
              }else{
                  Toast(data.msg)
              }
            })*/

        }
        },
      computed:{
        totalNum(){
            //商品件数
            let num = 0
            if(this.orderDetail.orderDetailList){
                for(let i = 0 ; i < this.orderDetail.orderDetailList.length ; i++){
                num += this.orderDetail.orderDetailList[i].saleNum
            }
          }

          return num
        },
        total(){
            //商品总价
          let total = 0
          if(this.orderDetail.orderDetailList){
            for(let i = 0 ; i < this.orderDetail.orderDetailList.length ; i++){
              total +=(  this.orderDetail.orderDetailList[i].saleNum *   this.orderDetail.orderDetailList[i].salePoints)
            }
          }

          return total.toFixed(2)
        },
        statusColor(){
            let status = this.orderDetail.auditStatus
            let color = ''
            if(status == 4|| status == 41 || status == 21){
                color = 'red'
            }else{
                color = 'blue'
            }
            return color
        },
        status(){
            let status = '未知'
            switch(this.orderDetail.auditStatus){
              case 0:
                status = '新创建';
                break;
              case 11:
                status = '一级审批';
                break;
              case 12:
                status = '二级审批';
                break;
              case 15:
                status = '待支付';
                break;
              case 21:
                status = '不通过';
                break;
              case 22:
                status = '待收货';
                break;
              case 23:
                status = '已完成';
                break;
              case 4:
                status = '撤销';
                break;
              case 41:
                status = '过期取消';
                break;
            }
            return status
        },
        tol(){
            let tol = Number(this.orderDetail.freight || 0) +  Number(this.total)
            return tol.toFixed(2)
        },
        ...mapGetters(['unit','token'])
    },
      components:{
        Scroll,
        selectAddress
      }
    }
</script>

<style type='text/css' lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"

  .orderDetail
    .activeAddress
      background white
      padding 0.1rem 0.2rem 0.2rem
      overflow hidden
      margin-bottom 0.3rem
      .icon_position
        float left
        position relative
        top 0.5rem
        width 0.7rem
        height 0.7rem
        margin 0 0.2rem 0 0
        background url("../../common/image/icon_position.png") no-repeat center
        background-size 100% 100%
      .addressInfos
        float right
        width 8rem
        padding-right 0.5rem
        .userInfo
          height 1rem
          line-height 1rem
          font-size 0.4rem
          .phone
            float right
            height 1rem
        .addressDetail
          line-height 0.5rem
    .scroll
      fullScreen(40px,0,0,0)
      .merchants
        display flex
        width 100%
        align-items center
        height 1rem
        margin-bottom 0.3rem
        line-height 1rem
        background white
        padding 0 0.2rem
        span
          display inline-block
          height 0.6rem
          line-height 0.6rem
          padding 0 0.2rem
          text-align center
          color #111
          border 1px solid black
          border-radius 3px
          margin-right 0.3rem
      .cancel
        border-top 0.5px solid #eee
        background white
        padding 0.3rem 0
        div
          width 5rem
          height 1rem
          line-height 1rem
          text-align center
          font-size 0.4rem
          background $color-theme
          color white
          margin 0 auto
          border-radius 0.6rem
      .shopDetail
        height 1rem
        line-height 1rem
        background white
        font-size 0.4rem
        padding 0 0.2rem
        border 1px solid #eee
        .icon_up
          float right
          height 1rem
          width 1rem
          background url("../../common/image/icon_arrow_up.png") no-repeat center
          background-size 0.4rem 0.4rem
          &.icon_down
            transform  rotate(180deg)
      .orderProduct
        background white
        display flex
        border-bottom 0.5px solid #eee
        align-items center
        padding-left 0.1rem
        img
          width 2.8rem
          height 2.8rem
          margin-right 0.1rem
        .info
          width: 6.4rem;
          height 2.6rem
          padding 0.2rem 0.3rem 0.2rem 0.2rem
          .title
            height 1rem
            line-height 0.5rem
            overflow hidden
            font-size 0.35rem
          .price_wrap
            display flex
            justify-content space-between
            font-family '黑体'
            font-size 0.4rem
            .price
              color $color-theme
      .orderPriceInfo
        font-size 0.35rem
        background white
        text-align right
        padding 0.2rem
        line-height 0.5rem
        .seeCode
          overflow hidden
          .btn
            width 2.5rem
            float right
            background $color-theme
            color white
            text-align center
            line-height 0.8rem
            margin-bottom 0.2rem
            border-radius 0.1rem
        .price
          display inline-block
          margin 0 0.2rem
          color $color-theme
          font-size 0.4rem
          width 3rem
      .orderInfo
        margin 0.3rem 0
        padding 0.2rem
        background white
        font-size 0.35rem
        line-height 0.7rem
        overflow hidden
        & > div
          text-align right
        .title
          width 100%
          text-align left
          font-size 0.4rem
          border-bottom 0.5px solid #eee
        .infoName
          display inline-block
          width 2rem
          float left
          text-align left
      .red
        color red
      .blue
        color #1296db


</style>

