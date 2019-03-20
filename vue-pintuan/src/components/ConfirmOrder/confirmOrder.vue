<template>
  <div class="confirmOrder">
    <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="确认订单">
      <div @click="$router.go(-1)" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
    </mt-header>
    <scroll class="scroll">
      <div>
        <select-address
          @click.native="showAddress = true"
          v-if="!isVirtual&&hasAddress"
          :data="activeAddress"
          :source="source">
        </select-address>
        <div class="tips" v-if="isVirtual && siteId != 1">您本次购买的商品不需要收货地址，请仔细确认每个商品所需的购买信息，如手机号码，身份证号码等。</div>
        <div class="tips" v-if="isVirtual && siteId == 1">您本次购买的商品为虚拟票券，为方便工作人员及时与您联系，请您填写以下信息：</div>
        <mt-field v-if="isVirtual && siteId == 1 && confirmOrder[0].id == 7014"  label="网点编码：" placeholder="请填写6位数网点编码" v-model="remark"></mt-field>
        <mt-field v-if="isVirtual && siteId == 1 && confirmOrder[0].id != 7014"  label="联系手机号：" placeholder="请填写手机号" v-model="remark"></mt-field>
        <div class="tips addAddr"
            v-if="!isVirtual&&!hasAddress"
            @click="addAddr">
          <i class="icon_position"></i> 请添加收货地址
        </div>
        <div class="list">
          <div class="supply">{{confirmOrder[0].supplyName}}</div>
          <div v-for="(item,index) in confirmOrder" :key="index" class="confirmOrderList">
            <img :src="item.photo" alt="">
            <div class="info">
              <div class="title">
                {{item.itemName}}
              </div>
              <div class="price_wrap">
                <span class="price">价格：{{item | filterPrice | fulterUnit}}</span>
                <span class="num">x{{item.num}}</span>
              </div>
            </div>
          </div>
          <div class="orderPriceInfo">
            <div><span style="margin-right:0.3rem">共计{{totalNum}}件商品</span> 小计：<span class="price">{{total | fulterUnit}}</span></div>
            <div>运费：<span class="price">{{freight | fulterUnit}}</span></div>
            <div>合计：<span class="price">{{tol | fulterUnit}}</span></div>
          </div>
        </div>

        <mt-field v-if="siteId == 8 || siteId == 11"  label="推荐人：" placeholder="请输入推荐人" v-model="remark"></mt-field>

        <mt-field v-if="siteId == 9 && confirmOrder[0].id == 5398"  label="门店编号" placeholder="请输入门店编号" v-model="remark"></mt-field>

        <div class="payWays" v-if="tol != 0">
          <div
            v-if="payWays.indexOf('ye') >= 0 && confirmOrder[0].id != 7014"
            :class="{active:actPayWay == 'ye'}"
            @click="actPayWay = 'ye'">
            <i class="icon_ye"></i>余额支付
          </div>
          <div
          v-if="payWays.indexOf('zh_ywt') >= 0 || confirmOrder[0].id == 7014"
          :class="{active:actPayWay == 'zh_ywt'}"
          @click="actPayWay = 'zh_ywt'">
            <i class="icon_ywt"></i>
            一网通支付
          </div>

          <div
            v-if="payWays.indexOf('zh_zcj') >= 0 && confirmOrder[0].id != 7014"
            :class="{active:actPayWay == 'zh_zcj'}"
            @click="actPayWay = 'zh_zcj'">
            <i class="icon_zcj"></i>
            一网通支付
          </div>
        </div>
      </div>
    </scroll>

    <!-- 总价显示 -->
    <div class="total">
      <div class="submit" @click="submitOrder">提交订单</div>
      <div class="totalPrice">金额合计：<span>{{tol | fulterUnit}}</span></div>
    </div>

    <!-- 地址选择 -->
    <transition name="moveRight">
      <choose-address
        ref="chooseAddress"
        v-show="showAddress"
        type="product"
        @hide = 'showAddress=false'
        @change = "changeActAddress"
      ></choose-address>
    </transition>

  </div>
</template>
<script type='text/javascript'>
import Scroll from '../../common/components/scroll.vue'
import selectAddress from '../../common/components/selectAddress.vue'
import chooseAddress from '../../common/components/chooseAddress.vue'
import {mapGetters,mapMutations} from 'vuex'
import Vue from 'vue'
import { Picker , Toast,Indicator,Field} from 'mint-ui';
const szProduct = 0
Vue.component(Field.name, Field);
Vue.component(Picker.name, Picker);
export default {
  data() {
      return {
        activeAddress:{},
        payWays:"",
        actPayWay:'',
        freight:0, //运费
        why:"",
        isVirtual:false,
        showAddress:false,
        remark:"",
        submitFlag:true,
        confirmOrder:[],
        hasAddress:false,
        payQuery:{},
        orderType:"",
        source:0,
        picker:[
          {
            divider:false,
            values:[],
            defaultIndex:0,
            flex:1
          }
        ]
      }
  },
  filters:{
    filterPrice(item){
      let tol
      if(item.activityType == 1){
        tol = (item.salePoints / (item.salePrice <=0 ? 1 : item.salePrice) ) * item.activityProductVo.preferentialPrice
      }else {
        tol = item.salePoints
      }
      return tol.toFixed(2)
    }
  },
  created(){
    if(this.$route.query.addAddress){
      this.showAddress = true
    }
    this.confirmOrder = JSON.parse(localStorage.getItem('confirmOrder'))
    
    if(this.confirmOrder[0].id == 7014) {
      this.actPayWay = 'zh_ywt'
    }
    if(this.confirmOrder[0].type == 3){
        //虚拟商品无法加入购物车只能单独购买 只需判断第一个商品的type
      this.isVirtual = true
    } else{

    }
    this.source = this.$until.filterSource( this.confirmOrder[0].source )
    console.log(this.confirmOrder[0])
    this._initData()
  },
  mounted(){
    if(this.confirmOrder[0].type != 3){
      //this.$refs.chooseAddress.initAddress()
    }
  },
  watch:{
    activeAddress(){
      this.$http.post(
        this.$api.getFreightFare,
        this.FreightQuery
      ).then(({data}) =>{
        console.log(data)
        if(data.success){
          this.freight = data.obj.freight
        }
      })
    }
  },
  methods: {
      _initData(){
        //初始化订单数据

        //初始化支付方式
        this.payWays = this.payWay.split(',')
        this.actPayWay = this.payWays[0] //设置默认选中支付方式

        if(!this.isVirtual){
            //=====================================>如果不是虚拟商品 查询地址
          this.$http.post(  //查询默认地址
            this.$api.getDefaultAddress,
            this.$until.getFormData({
              token:this.token,
              siteId:this.siteId,
              source:this.source
            })
          ).then(({data}) => {
              if(!data.success&&data.code == 400){
                  this.hasAddress = false;
                  return
              }
              this.hasAddress = true
              if(!data.obj.entity){
                Toast('系统繁忙')
                return;
              }
            this.activeAddress = data.obj.entity
          })
        }


      },
      pickerChange(picker,values){
          this.why = values[0]
      },
      showPickerFn(){
          this.showPicker = true
      },
      changeActAddress(item){
          //修改送货地址
          this.showAddress = false
          this.activeAddress = item
      },
      addAddr(){
        this.set_editAddress(null)
        this.$router.push('/editAddress?source=' + this.confirmOrder[0].source)
      },
      submitOrder(){
          //防止重复提交
        let phoneReg = /^[0-9]{8,11}$/
        if(!localStorage.getItem('confirmFlag')){
          Toast('请勿重复提交订单')
          return
        }
        if(!this.isVirtual && !this.activeAddress.id){
            Toast('请选择地址');
            return
        }else if(this.siteId == 1 && this.remark == '' && this.isVirtual && this.confirmOrder[0].id == 7014){
          Toast('请填写6位数网点编码');
          return
        }else if(this.siteId == 1 && this.remark == '' && this.isVirtual && this.confirmOrder[0].id != 7014){
          Toast('请填写11位手机号');
          return
        }
        if(this.siteId == 9 && this.remark == '' && this.confirmOrder[0].id == 5398 ){
          Toast('请填写门店编号');
          return
        }else if(this.siteId == 9 && this.remark.length != 3 && this.confirmOrder[0].id == 5398 ){
          Toast('门店编号长度必须为3位');
          return
        }else if(this.siteId == 1 && this.remark.length != 6 && this.isVirtual  && this.confirmOrder[0].id == 7014 ){
          Toast('网点编码必须为6位');
          return
        }else if(this.siteId == 1 && !phoneReg.test(this.remark) && this.isVirtual  && this.confirmOrder[0].id != 7014 ){
          Toast('网点编码必须为6位');
          return
        }
        //下单 预占库存接口
        if(!this.submitFlag){
            return
        }

        Indicator.open()
        this.submitFlag = false
        //=========================>查询运费

        if(this.tol == 0) {
          this.actPayWay = 'ye'
        }
        console.log(this.FreightQuery);
        this.$http.post(
          this.$api.submitOrder,
          this.FreightQuery
        ).then(({data}) => {
            if(data.success){
              this.payQuery = {
                token: data.obj.token,
                orderNo: data.obj.orderNo,
                payWay: this.actPayWay
              }
              this.payQuery.orderType = this.confirmOrder[0].orderType
              this.pay()
            }else{
            Toast(data.msg)
              Indicator.close()
              this.submitFlag = true
            }
        }).catch(() => {
          Indicator.close()
          this.submitFlag = true
        })
      },
      pay(){
          this.$http.post(
            this.$api.payOrder,
            this.payQuery
          ).then(({data}) => {
            if(data.success){
            //=====>支付成功 跳转到支付成功界面
              if(this.actPayWay == 'ye' || this.tol == 0){
                this.ye_successCallBack()
              }else if(this.actPayWay == 'zh_ywt' || this.actPayWay == 'zh_zcj'){
                  this.ywt_successCallBack(data.obj.payHtml)
              }
          }else{
            Toast(data.msg)
            Indicator.close()
            this.submitFlag = true
          }
          Indicator.close()
        }).catch(() => {
            Indicator.close()
          this.submitFlag = true
        })
        /*else if(this.actPayWay == 'zh_ywt'){
          this.$http.post(
            this.$api.payOrder,
            this.payQuery
          ).then(({data}) => {
            if(data.success){
            //=====>支付成功 跳转到支付成功界面
            console.log(data)
            this.deleteShopCar()
            sessionStorage.removeItem('confirmFlag')
            var formHtml = data.obj.payHtml
            //document.getElementById("public").innerHTML = forms
            let form = document.createElement('div');
            form.innerHTML = formHtml
            document.body.append(form)
            document.getElementById('paySubmit').submit()
          }else{
            Toast(data.msg)
            Indicator.close()
            this.submitFlag = true
          }
          Indicator.close()
        }).catch(() => {
            Indicator.close()
          this.submitFlag = true
        })
        },
        */
      },
      ye_successCallBack(){
        this.deleteShopCar()
        localStorage.removeItem('confirmFlag')
        this.$router.push('/pay/success')
      },
      ywt_successCallBack(form){
        this.deleteShopCar()
        localStorage.removeItem('confirmFlag')
        var formHtml = form
        document.write(form)
      },
      deleteShopCar(){
          //支付成功删除购物车 对应商品
        let act = JSON.parse(sessionStorage.getItem('confirmOrder'))

        let shopCar = JSON.parse(localStorage.getItem('jf-shopCarProduct-' + this.user.id))
        if(!shopCar||!shopCar.length) return

        let arr =  shopCar

        for(let j = 0 ; j < act.length;j++){
          for(let i = 0;i < arr.length;i++){
            if (arr[i].id == act[j].id) {
              arr.splice(i, 1);
              break
            }
          }
        }


        /* this.actProduct.forEach((item,index) => {
          this.actProduct.splice(index,1)
        })*/
        this.set_shopCarProduct(arr)
      },

      ...mapMutations({
        set_editAddress:"set_editAddress",
        set_shopCarProduct:'set_shopCarProduct'
      })


    },
  computed:{
      total(){
          //计算订单总价
        let tol = 0;
        if(this.confirmOrder[0].activityType == 1){
          tol = (this.confirmOrder[0].salePoints /(this.confirmOrder[0].salePrice <=0 ? 1 : this.confirmOrder[0].salePrice)) * this.confirmOrder[0].activityProductVo.preferentialPrice * this.confirmOrder[0].num
        }else{
          this.confirmOrder.forEach((item) => {
            console.log(item.salePoints)
            tol += item.salePoints * item.num
          })
        }
        console.log(tol)
        return tol.toFixed(2)
      },
      tol(){
          let tol = Number(this.total)+Number(this.freight)
          return tol.toFixed(2)
      },
      totalNum(){
        //计算订单总件数
        let tol = 0
        this.confirmOrder.forEach((item) => {
          tol +=  parseInt(item.num)
          console.log(item.num)
        })
        console.log(tol)
        return tol.toFixed(0)
      },
      FreightQuery(){
        //运费查询参数
        let cartItemList = this.confirmOrder.map((e) => {
            return {
              itemId:e.id,
              shopNum:e.num
            }
        })
        if(cartItemList[0].itemId == 7014) {
          this.actPayWay = 'zh_ywt'
        }
        let query = {
          cartItemList:cartItemList,
          orgId:this.user&&Number(this.user.organization.id),
          payWay:this.actPayWay ||'ye',
          remark:this.remark,
          siteId:this.siteId,
          orderType:this.confirmOrder[0].orderType,
          source:this.confirmOrder[0].source,
          supplyId:this.confirmOrder[0].supplyId,
          token:this.token,
          userAddressId:this.activeAddress.id
        }
        console.log(query);
        
        return query
      },
      ...mapGetters(['unit','token','siteId','payWay','user'])
    },
  components:{
    Scroll,
    selectAddress,
    chooseAddress
  }
}
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"
  .confirmOrder
    .topBar
      background url("../../common/image/theme.jpg") no-repeat left top
      background-size 100% auto
    .scroll
      fullScreen(40px,0,1.2rem,0)
      &>div
        padding-bottom 0.3rem
      .tips
        padding 0.5rem
        font-size 0.35rem
        line-height 0.5rem
        background white
        margin-bottom 0.3rem
        .icon_position
          float left
          position relative
          bottom 0.2rem
          width 0.7rem
          height 0.7rem
          margin 0 0.2rem 0 0
          background url("../../common/image/icon_position.png") no-repeat center
          background-size 100% 100%
        &.addAddr
          background white url("../../common/image/icon_arrow_right.png") no-repeat right center
          background-size 0.5rem 0.5rem
      .list
        margin 0.3rem auto
        .supply
          height 1rem
          padding-left 1rem
          line-height 1rem
          background white url("../../common/image/icon_store.png") no-repeat 0.4rem center
          background-size 0.5rem 0.5rem
          border-bottom 0.5px solid #ccc
          font-size 0.4rem
      .confirmOrderList
        background white
        border-bottom 0.5px solid #ccc
        padding-left 0.1rem
        overflow hidden
        img
          float left
          width 2.8rem
          height 2.8rem
          padding-top 0.1rem
        .info
          width 6.5rem
          float right
          height 2.6rem
          padding 0.2rem 0.3rem 0.2rem 0.2rem
          .title
            height 1rem
            line-height 0.5rem
            overflow hidden
            font-size 0.35rem
          .price_wrap
            overflow hidden
            font-family '黑体'
            font-size 0.4rem
            .price
              color $color-theme
            .num
              float right
      .why
        height 1rem
        margin 0.3rem 0 0
        padding 0 0.2rem
        line-height 1.05rem
        font-size 0.35rem
        background white
        .text
          background white url("../../common/image/icon_arrow_right.png") no-repeat right center
          background-size 0.5rem 0.5rem
          padding-right 0.6rem
          color #aaa
          float right
      .other
        border-top 1px solid #eee
        background white
        overflow hidden
        width 100%
        .title
          height 1rem
          line-height 1rem
          width 2rem
          padding 0 0.2rem
          font-size 0.35rem
        textarea
          float right
          width 8.5rem
          line-height 1rem
          font-size 0.35rem
          font-family inherit
      .orderPriceInfo
        font-size 0.35rem
        background white
        text-align right
        padding 0.2rem
        line-height 0.5rem
        .price
          display inline-block
          margin 0 0.2rem
          color $color-theme
          font-size 0.4rem
          width 3rem
      .payWays
        background white
        margin-top 0.3rem
        .icon_ye
          background url("./image/ye.png") no-repeat center 0.2rem
        .icon_ywt
          background url("./image/ywt.png") no-repeat center 0.2rem
        .icon_zcj
          background url("./image/zcj.png") no-repeat center 0.2rem
        .icon_ye,.icon_ywt,.icon_zcj
          display inline-block
          width 1rem
          height 100%
          background-size 0.5rem 0.5rem
          vertical-align middle
        div
          height 1rem
          line-height 1rem
          padding-left 1rem
          font-size 0.35rem
          border-bottom 1px solid #eee
          &:last-child
            border-bottom none
          &.active
            background url("./image/icon_check.png") no-repeat 0.2rem center
            background-size 0.7rem 0.7rem
    .total
      position fixed
      height 1.2rem
      width 100%
      bottom 0
      left 0
      background white
      box-shadow 0 0 5px #ccc
      div
        line-height 1.2rem
        float right
      .submit
        float right
        width 3rem
        height 100%
        color white
        text-align center
        font-size 0.35rem
        background $color-theme
        background linear-gradient(to right,orange,$color-theme)
      .totalPrice
        font-size 0.35rem
        padding-right 0.3rem
        span
          color $color-theme
          font-size 0.5rem
    .picker
      position fixed
      bottom 0
      width 100%
      z-index 11
      background white
      .toolBar
        width 100%
        height 100%
        .cancel,.sure
          width 2rem
          line-height 40px
          text-align center
          font-size 0.35rem
        .sure
          float right
          color #108ee9
        .cancel
          float left
          color #aaa
    .shadow
      fullScreen(0,0,0,0)
      z-index 10

</style>
