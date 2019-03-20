<template>
  <transition name="opacity">
    <div class="spellAddress">
        <div class="shadow" @click="cancel"></div>

      <confirm v-if="showConfirm" @sure="sure" @cancel="cancel">
        <div class="header" slot="header">确认收货地址</div>
        <div class="body" slot="body">{{actAddress}}</div>
      </confirm>

      <transition name="moveBottom">
        <div class="addressList" v-show="showAddress">
          <div class="title">请选择收货地址</div>
          <selectAddress @click.native="showMsg(item)" class="Address" :data='item' :key="index" v-for="item,index in addressList"></selectAddress>
          <div class="addAddress" @click="addAddress">添加收货地址</div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script type='text/javascript'>
  import selectAddress  from './selectAddress.vue'
  import confirm  from './confirm.vue'
  import {mapGetters,mapMutations} from 'vuex'
  import {MessageBox ,Toast} from 'mint-ui'
    export default {
        data() {
            return {
              addressList:[],
              showAddress:true,
              showConfirm:false,
              actAddress:'',
              id:-1
            }
        },
        created(){
            //console.log(this.spellInfo.product)
            this.initData()
        },
        watch:{
          spellInfo(newval){
            console.log(newval)
            if(newval.showAddress){
              console.log(this.spellInfo.source)
              this.initData()
            }
          }
        },
        methods: {
            initData(){
              this.addressList = []
              this.$http.post(
                this.$api.getAddress,
                this.$until.getFormData({
                  siteId:this.siteId,
                  token:this.token,
                  source:this.spellInfo.source
                })
              ).then(({data}) => {
                if(data.success){
                  this.addressList = data.obj.addressList
                }else{
                  Toast(data.msg)
                }
              })
            },
          addAddress(){
            this.set_spellInfo({
              showAddress:false
            })
            this.set_editAddress(null)
            this.$router.push('/editAddress?source=' + this.$until.filterSource(this.spellInfo.source))
          },
            cancel(){
              this.set_spellInfo({
                showAddress:false
              })
            },
            groupBuy(){
              let product = this.spellInfo.product
              let query = {
                cartItemList:[{itemId:product.id,shopNum:1}],
                orgId:this.user&&Number(this.user.organization.id),
                payWay:product.payWay ? product.payWay : 'zh_ywt',
                remark:'',
                siteId:this.siteId,
                orderType:5,
                source:product.source,
                supplyId:product.supplyId,
                token:this.token,
                userAddressId:this.id,
                groupRecordId:product.recordId ? product.recordId : ''
              };
              this.$http.post(
                product.groupType == 2 ? this.$api.joinGroup : this.$api.submitOrder,
                query
              ).then(({data}) => {
                console.log(data)
                if(data.success){
                    this.cancel()
                    this.$emit('fn')
                    if(product.recordId){
                      Toast('参团成功')
                    }else{
                      Toast('开团成功');
                      this.$router.push('/groupBuyDetail?id=' + data.obj.groupRecordId)
                    }
                }else{
                    this.cancel()
                    Toast(data.msg)
                }
              })
            },
            sure(){
              let product = this.spellInfo.product
              if(product.activityType == 2){
                  this.spell()
              }else if(product.activityType == 3){
                  this.groupBuy()
              }
            },
            spell(){
              let product = this.spellInfo.product
                let query = {
                  cartItemList:[{itemId:product.id,shopNum:1}],
                  orgId:product.orgId,
                  payWay:this.payWay,
                  remark:localStorage.getItem('cq_phone') || "",
                  siteId:this.siteId,
                  source:product.source,
                  supplyId:product.supplyId,
                  token:this.token,
                  userAddressId:this.id,
                  orderType:4
                };
                this.$http.post(
                  this.$api.spell,
                  JSON.stringify(query),
                  {
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }
                  }
                ).then(({data}) => {
                  if(data.success){
                    this.$router.push('/SpellGroupDetail?id=' + data.obj.recordsId + '&alert=true')
                  }else{
                    this.cancel();
                    Toast(data.msg)
                  }
                })
            },
            showMsg(item){
              this.id = item.id
              this.actAddress = item.receiverName + ',' + item.receiverPhone + ', ' + item.vo.provinceName  + item.vo.cityName + item.vo.countyName + item.vo.townName + item.addressDetail
              this.showConfirm = true
              this.showAddress = false
            },
          ...mapMutations({
            set_spellInfo:'set_spellInfo',
            set_editAddress:"set_editAddress"
          })
        },
        computed:{
          ...mapGetters(['spellInfo','user','token','siteId','payWay','AuthConfig'])
        },
        components:{
          selectAddress,confirm
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../css/variable.styl"
  @import "../css/transition_name.styl"
.spellAddress
  fullScreen(0,0,0,0)
  position fixed
  z-index 100
  .mint-msgbox-message
    color #333
  .shadow
    fullScreen(0,0,0,0)
    background rgba(0,0,0,0.8)
  .addressList
    position fixed
    width 100%
    bottom 0
    z-index 100
    height 10rem
    overflow-y auto
    overflow-scrolling touch
    -webkit-overflow-scrolling touch
    background white
    .title
      height 1rem
      text-align center
      line-height 1rem
      font-size 0.5rem
      border-bottom 1px solid #e6e6e6
    .Address
      border-bottom 1px solid #e6e6e6
    .addAddress
      line-height 1.5rem
      padding 0 1rem
      font-size 0.4rem
      background url("../../common/image/icon_arrow_right.png") no-repeat 9.3rem center
      background-size 0.5rem auto
      border-bottom 1px solid #e6e6e6

</style>
