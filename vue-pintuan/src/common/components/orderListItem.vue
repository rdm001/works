<template>
    <div class="orderItem" :id="data.orderNo">
      <div class="orderNum"> <i class="icon_order"></i> <span class="orderNo">{{data.orderType == 1 ? "礼包" : "商品"}}订单号：{{data.orderNo}}</span> <span class="statusText">{{statusText}}</span></div>
      <div class="product" v-for="item in data.orderDetailList">
        <img :src="item.productPic" class="productPhoto" alt="">
        <div class="info">
          <div class="productName" :style="{width:data.orderType == 1 ? '7rem' : ''}">
            {{item.itemName}}
          </div>
        </div>
        <div class="productPrice" v-if="data.orderType != 1 ">
          <div>{{item.salePoints.toFixed(2) | fulterUnit}}</div>
          <div>× {{item.saleNum.toFixed(0)}}</div>
        </div>
      </div>

        <div class="total"  v-if="data.orderType != 1 ">共{{productNum.toFixed(0)}}件商品,合计 <span style="font-size: 0.4rem;font-weight:bold ">{{totalPrice.toFixed(2)  | fulterUnit}}</span> (含运费{{data.freight.toFixed(2)  | fulterUnit}})</div>
        <div class="btns" >
          <div class="btn-item"  @click="orderDetails">订单详情</div>
          <div class="btn-item" v-if="continuePay"  @click="continuePayOrder">继续支付</div>
          <div class="btn-item" v-if="seeLogistics&&data.orderDetailList[0].productType != 3" @click="Logistics">查看物流</div>
          <div class="btn-item" v-if="confirmGoods" @click="sure(data.orderNo)">确认收货</div>
          <div class="btn-item" v-if="cancelOrder">取消订单</div>
        </div>

    </div>
</template>
<script type='text/javascript'>
    import {mapGetters} from 'vuex'
    import { Picker , Toast} from 'mint-ui';
    export default {
        props:{
            data:{
                type:Object,
                default:{}
            }
        },
        created(){
            console.log(this.data)
          //待支付  已完成 待收货 已撤销 已过期
          // 23  订单详情  查看物流
          // 22  订单详情  查看物流  确认收货
          //21  订单详情
          //41   订单详情
          // 1  撤销订单 订单详情
        },
        data() {
            return {}
        },
        methods: {
            orderDetails(){
              this.$router.push({path:'/orderDetail' ,query:{orderNo:this.data.orderNo} });
            },
            Logistics(){
              this.$router.push({path:'/logistics/'+this.data.outTradeNo +"/" +this.data.source});
            },
            sure(id){
                this.$http.post(
                    this.$api.orderConfirm,
                    this.$until.getFormData({
                      orderNo:this.data.orderNo,
                      token:this.token
                    })).then(({data}) => {
                        if(data.success){
                            Toast('确认收货成功')
                            document.getElementById(id).remove()
                           this.$emit('reload')
                        }else{
                            Toast(data.msg)
                        }
                    })
            },
            continuePayOrder(){
                this.$emit('continuePay',this.data)
            }
        },
        computed:{
            productNum(){
                //商品总数
              let count = 0
              this.data.orderDetailList.forEach((e) =>{
                  count += e.saleNum
              })
              return count
            },
            totalPrice(){
              //价格总计
              let count = this.data.freight
              this.data.orderDetailList.forEach((e) =>{
                count += (e.saleNum * e.salePoints)
              })
              return count
            },
            statusText(){
                  //中文显示状态
              let text = ""

              switch(this.data.operStatus){
                case 0:
                  text = '新创建';
                  break;
                case 11:
                  text = '待审批';
                  break;
                case 12:
                  text = '待审批';
                  break;
                case 15:
                  text = '待支付';
                  break;
                case 21:
                  text = '不通过';
                  break;
                case 22:
                  text = '待收货';
                  break;
                case 23:
                  text = '已完成';
                  break;
                case 4:
                  text = '撤销';
                  break;
                case 41:
                  text = '过期取消';
                  break;
              }
              return text
            },
            orderDetail(){
                //是否显示订单详情按钮
                let Flag = false;
                let status = this.data.operStatus
                if(status==23||status==22||status==21||status==41||status==1){
                  Flag = true
                }
                return Flag
            },
            continuePay(){
              //是否显示继续支付按钮
              let Flag = false;
              let status = this.data.operStatus
              if(status == 15){
                Flag = true
              }
              return Flag
            },
            seeLogistics(){
              //是否显示查看物流按钮
              let Flag = false;
              let status = this.data.operStatus
              if(status==22 || status==23){
                Flag = true
              }
              return Flag
            },
            confirmGoods(){
                //是否显示确认收货按钮
              let Flag = false;
              let status = this.data.operStatus
              if(status==22){
                Flag = true
              }
              return Flag
            },
            cancelOrder(){
              //是否显示取消订单
              let Flag = false;
              let status = this.data.operStatus
              if(status==1){
                Flag = true
              }
              return Flag
            },
          ...mapGetters(['unit','token'])
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  .orderItem
    background white
    margin-bottom 0.2rem
    .orderNum
      height 1rem
      line-height 1.1rem
      padding 0 0.2rem
      .orderNo
        float left
        height 1rem
        line-height 1.1rem
      .icon_order
        float left
        display inline-block
        height:100%
        width 0.5rem
        background url("../image/icon_order.png") no-repeat center
        background-size 0.35rem 0.35rem
      .statusText
        float right
        height 1rem
        line-height 1.1rem
        color orange
    .product
      padding 0.2rem
      background #f9f9f9
      margin-bottom 0.1rem
      overflow hidden
      .productPhoto
        float left
        width 2.2rem
        height 2.2rem
      .info
        float left
        margin 0 0.2rem
        .productName
          width 5rem
          height 0.9rem
          overflow hidden
          font-family '黑体'
          line-height 0.46rem
          font-size 0.35rem
      .productPrice
        float right
        margin-top 0.5 rem
        div
          text-align right
          line-height 0.5rem
    .total
      height 1rem
      line-height 1rem
      padding 0 0.2rem
      text-align right
      border-bottom 0.5px solid #f9f9f9
    .btns
      height 1.2rem
      overflow hidden
      .btn-item
        position relative
        top 0.3rem
        float right
        width 2rem
        height 0.7rem
        margin 0 0.2rem
        text-align center
        line-height 0.7rem
        border 0.5px solid #ccc
        border-radius 0.5rem


</style>
