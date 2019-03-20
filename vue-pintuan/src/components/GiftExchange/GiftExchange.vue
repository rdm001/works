<template>
    <div class="giftExchange">
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="礼包兑换">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>
      <select-address
        v-if="activeAddress && !isVirtual"
        :data="activeAddress "
        @click.native = 'showAddress=true'
        :source="product.itemSource">
      </select-address>

      <div class="addressTip"
           v-if="!activeAddress && !isVirtual"
           @click = 'AddAddress'
      >
          <i class="icon"></i>
          <span class="text">请添加{{sourceText}}收货地址</span>
      </div>

      <div class="title" :style="{marginTop:isVirtual?'0' : '0.3rem'}">您选择的商品</div>
      <div class="giftProduct">
        <giftProduct :data="product"></giftProduct>
      </div>
      <transition name="moveRight">
        <choose-address
          style="position: fixed"
          ref="chooseAddress"
          v-show="showAddress"
          type="gift"
          :query="{id:id,accId:accId}"
          @hide = 'showAddress=false'
          @change = "changeActAddress"
        ></choose-address>
      </transition>

      <div class="Submit" @click="submitOrder">确认兑换</div>
    </div>
</template>
<script type='text/javascript'>
  import selectAddress from '../../common/components/selectAddress.vue'
  import chooseAddress from '../../common/components/chooseAddress.vue'
  import giftProduct from '../../common/components/giftProductItem.vue'
  import {mapGetters,mapMutations} from 'vuex'
  import {Indicator} from 'mint-ui';
  import {commonMethod} from '../../common/js/mixin.js'
  export default {
        data() {
            return {
                id:0,
                activeAddress:null,
                product:null,
                isVirtual:false,
                showAddress:false,
                httpFlag:true,
                payQuery:{},
                source:-1,
                accId: this.$route.query.accId
            }
        },
        mixins:[commonMethod],
        created(){
            if(this.$route.query.addAddress){
              this.showAddress = true
            }
            this.id = this.$route.query.id;
            this.product = JSON.parse(localStorage.getItem('giftSelectProduct'))
            this.isVirtual = this.product.type == 3
            this.source = this.product.itemSource
            this._initData();
        },
        mounted(){
          //如果是实体商品  初始化选择地址列表
          if(this.product.type != 3){
            this.$refs.chooseAddress.initAddress()
          }
        },
        methods: {
          _initData(){
            //================>初始化礼包信息
            this.$http.post(
              this.$api.getPacksInfo,
              this.$until.getFormData({
                packsId:this.id
              })
            ).then(({data}) => {
              if(data.success){
                this.packInfo = data.obj.packsInfo
              }
            })

            if(!this.isVirtual){
                //非虚拟商品 查询地址
              //===================>初始化默认地址
              this.$http.post(  //查询默认地址
                this.$api.getDefaultAddress,
                this.$until.getFormData({
                  token:this.token,
                  siteId:this.siteId,
                  source:this.source
                })
              ).then(({data}) => {
                if(data.success){
                  this.activeAddress = data.obj.entity
                }else{
                  this.Toasts(data.msg,false)
                }

              })
            }

          },
          AddAddress(){
              this.set_editAddress(null)
              this.$router.push('/editAddress?source=' + this.$until.filterSource(this.source))
          },
          changeActAddress(item){
            //修改送货地址
            this.showAddress = false
            this.activeAddress = item
          },
          submitOrder(){
            if(!this.httpFlag) return
            this.httpFlag = false
            Indicator.open()
            this.$http.post(
              this.$api.submitPacksOrder,
              this.submitQuery
            ).then(({data}) => {
                  if(data.success){
                    this.payQuery.token = data.obj.token
                    this.payQuery.orderNo = data.obj.orderNo
                    this.pay()
                  }else{
                    this.Toasts(data.msg,false)
                    Indicator.close()
                    this.httpFlag = true
                  }
            }).catch(e => {
                Indicator.close()
                this.httpFlag = true
            })

          },
          pay(){
            this.$http.post(
              this.$api.payPacksOrder,
              this.payQuery
            ).then(({data}) => {
              if(data.success){
                //=====>支付成功 跳转到支付成功界面
                Indicator.close()
                console.log(data)
                this.$router.push('/pay/success')

              }else{
                this.Toasts(data.msg,false)
                this.httpFlag = true
                Indicator.close()
              }
            }).catch(() => {
                Indicator.close()
                this.httpFlag = true
            })
          },
          ...mapMutations({
            set_editAddress:'set_editAddress'
          })
        },
        computed:{
          sourceText(){
              if(this.source == 1 || this.source == 2 || this.source == 4) {
                  return '京东'
              }else if(this.source == 3){
                  return '苏宁'
              }
              return ''
          },
          submitQuery(){
              let cartItemList = [
                {
                  itemId: this.product.itemId,
                  shopNum: 1
                }
              ]
            let query = {
              cartItemList:cartItemList,
              packsAccId:this.accId,
              remark:'',
              siteId:this.siteId,
              source:this.source,
              supplyId:this.product.supplyId,
              token:this.token,
              userAddressId:this.isVirtual ? '' : this.activeAddress.id
            }
            return query
          },
          ...mapGetters(['unit','token','siteId','payWay','user'])
        },
        components:{
          selectAddress,
          chooseAddress,
          giftProduct
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"
  @import "../../common/css/toastIcon/iconfont.css"
.giftExchange
  fullScreen(40px,0,0,0)
  .title
    position relative
    margin-top 0.3rem
    line-height 1rem
    font-size 0.4rem
    padding 0 0.5rem
    border-bottom 0.5px solid #eee
    background white
    &::after
      content ''
      position absolute
      left 0.2rem
      height 0.6rem
      width 0.1rem
      top 0.2rem
      background $color-theme
  .addressTip
    padding-left 1rem
    overflow hidden
    background white url("../../common/image/icon_arrow_right.png") no-repeat right center
    background-size 0.6rem
    .icon
      float left
      position relative
      top 0.45rem
      width 0.7rem
      height 0.7rem
      margin 0 0.2rem 0 0
      background url("../../common/image/icon_position.png") no-repeat center
      background-size 100% 100%
    .text
      float left
      line-height 1.5rem
      font-size 0.4rem
  .giftProduct
    height 2.6rem
    padding 0.2rem
    background white
    overflow hidden
    .pic
      float left
      height 2.6rem
      width 2.6rem
  .Submit
    position absolute
    left 0
    bottom 0
    width 100%
    height 1.2rem
    line-height 1.2rem
    background $color-theme
    font-size 0.4rem
    text-align center
    color white


</style>
