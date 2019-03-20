<template>
  <div class="editAddress">
    <!-- 顶部导航 -->
    <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="编辑地址">
      <div @click="back" slot="left">
        <mt-button icon="back"></mt-button>
      </div>
      <mt-button style="font-family: inherit" @click="save"  slot="right"><span>保存</span></mt-button>
    </mt-header>
    <div class="info_wrap">
      <div class="address info-item" >
        <span>选择渠道：</span>
        <div class="address" :style="{background:!addAddress ? 'white' : ''}" @click="showSelect">{{actSourceText}}</div>
      </div>
      <div class="name info-item">
        <span>收货人：</span>
        <input type="text" v-model="name" @blur="nameFocus = false" @focus="nameFocus = true" class="input">
        <i class="clear" @click="name = ''" v-show="name!=''&&nameFocus"></i>
      </div>
      <div class="phone info-item">
        <span>联系电话：</span>
        <input type="tel" v-model="phone" @blur="phoneFocus = false" @focus="phoneFocus = true" class="input">
        <i class="clear"  @click="phone = ''" v-show="phone!=''&&phoneFocus"></i>
      </div>
      <div class="address info-item">
        <span>地区选择：</span>
        <div class="address" @click="selectAddress(actAddress)">{{actAddressText}}</div>
      </div>
      <!-- <div class="address info-item">
         <span>齐心地区：</span>
         <div class="address" @click="selectAddress(qxAddress,5)">{{qxAddressText}}</div>
       </div>-->

      <div class="addressDetail info-item">
        <span>详细地址：</span>
        <textarea name="" id="detail" @blur="addressDetailFocus = false" @focus="addressDetailFocus = true" v-model="addressDetail"></textarea>
        <i class="clear"  @click="addressDetail = ''" v-show="addressDetail!=''&&addressDetailFocus"></i>
      </div>

    </div>
    <transition name="moveBottom">
      <Picker @closed="close" @saveAddress="updateAddress" v-if="showPicker" :data='actAddress' :source="Number(source)"  class="picker"></Picker>
    </transition>

    <transition  name="opacity">
      <div class="shadow" v-show="shadow" @click="close"></div>
    </transition>

    <mt-actionsheet
      :actions="actions"
      v-model="showSheet">
    </mt-actionsheet>
  </div>
</template>
<script type='text/javascript'>
  import {mapGetters} from 'vuex'
  import Picker from '@/common/components/addressPicker'
  import { Switch ,Toast,Button,MessageBox,Actionsheet} from 'mint-ui';
  import Vue from 'vue'
  Vue.component(Actionsheet.name, Actionsheet);
  Vue.component(Switch.name, Switch);
  Vue.component(Button.name, Button);
  export default {
    data() {
      let that = this
      return {
        name:'',
        deleteFlag:true,
        isDefault:false,
        nameFocus:false,
        phone:'',
        source:0,
        phoneFocus:false,
        addressDetail:"",
        addressDetailFocus:false,
        actAddress:null,
        showPicker:false,
        shadow:false,
        saveFlag:true,
        addAddress:false,
        showSheet:false,
        actSourceText:"",
        goBack:false,
        actions:[
          {name:'招行专供',method() {
            if( that.source != 1 && that.source !=0 && that.actAddress != null){
              Toast('地址渠道变更,请重新选择地址');
              that.actAddress = null
            }
            that.source = 1;
            that.actSourceText = '招行专供'

          }}/*,
          {name:'苏宁',method() {
            if( that.source != 3 && that.source !=0 &&  that.actAddress != null){
              Toast('地址渠道变更,请重新选择地址');
              that.actAddress = null
            }
            that.source = 3;
            that.actSourceText = '苏宁'
          }}*/
        ]
      }
    },
    watch:{
      $route(){

      }
    },
    created(){
      if(this.$route.query.from){
        this.goBack = true
      }
      if(!this.editAddress){
        //如果不存在编辑地址 则为新增地址
        this.addAddress = true
      }
      //设置渠道名字
      let source = 0
      this.$route.query.source ? source = this.$until.filterSource(this.$route.query.source) : this.source

      this.source =  this.editAddress ? this.editAddress.source : source
      this.actSourceText = this.source == 1 ? '招行专供':this.source == 3 ? '苏宁' :''
      //获取收件人
      this.name =  this.editAddress ? this.editAddress.receiverName : ""
      //获取联系电话
      this.phone =  this.editAddress ? this.editAddress.receiverPhone : ""
      //获取地址详情
      this.addressDetail = this.editAddress ? this.editAddress.addressDetail : ""
      //source  京东 1 ， 齐心 5 ， 苏宁  3
      //获取地区
      this.actAddress = this.editAddress ? this.editAddress.vo : null
      console.log(this.addAddress)
      console.log(this.source)
      if(this.addAddress&&this.source && this.source != 3 ){
          //如果添加非苏宁地址
        this.actAddress ? (this.actAddress.town = (this.actAddress != null && this.actAddress.town != "")? this.actAddress.town:'0') : ""
      }else if( this.source == 3){
        //添加 苏宁地址 做特殊处理
        this.actAddress ?(this.actAddress.county = this.actAddress.city + this.actAddress.county) :""
        this.actAddress ?(this.actAddress.town = (this.actAddress != null&&this.actAddress.town != "" )? this.actAddress.county + this.actAddress.town:'0') :""
      }


      // console.log((this.jdAddress != null && this.jdAddress.town != ""))
      // this.jdAddress ? (this.jdAddress.town = (this.jdAddress != null && this.jdAddress.town != "")? this.jdAddress.town:'0') : ""

      //this.snAddress ?(this.snAddress.county = this.snAddress.city + this.snAddress.county) :""
      //this.snAddress ?(this.snAddress.town = (this.snAddress != null&&this.snAddress.town != "" )? this.snAddress.county + this.snAddress.town:'0') :""
      this.isDefault = this.editAddress ? (this.editAddress.isDefault != 1 ? false :true) : false
    },
    methods: {
      back(){
        this.$router.go(-1)
      },
      save(){

        let that = this
        var phoneReg = /^[0-9]{8,11}$/;
        var nameReg=/^[\u2E80-\u9FFF]+$/
        if(this.name == ''){
          Toast({message:'收货人不能为空',iconClass:'ToastIcon icon-error'})
          return
        }else if(!nameReg.test(this.name)){
          Toast({message:'姓名格式必须为中文字符',iconClass:'ToastIcon icon-error'})
          return
        }else if(this.source == 0){
          Toast({message:'请选择添加地址渠道',iconClass:'ToastIcon icon-error'})
          return
        }else if(this.phone == ''){
          Toast({message:'手机号码不能为空',iconClass:'ToastIcon icon-error'})
          return
        }else if(!phoneReg.test(this.phone)){
          Toast({message:'手机号码格式不正确',iconClass:'ToastIcon icon-error'})
          return
        }else if(!this.RegArea(this.actAddress)/*||!this.RegArea(this.qxAddress)*/){
          Toast({message:'地区请至少选择三级地址',iconClass:'ToastIcon icon-error'})
          return
        }else if(this.addressDetail == ""){
          Toast({message:'请填写详细地址',iconClass:'ToastIcon icon-error'})
          return
        }
        if(!this.saveFlag) return
        this.saveFlag = false

        this.$http.post(
          this.$api.addressSave,
          this.saveAddressQuery
        ).then(({data}) => {
          if(data.success){
          Toast({message:'保存成功',iconClass:'ToastIcon icon-success'})
          if(this.goBack){
            //this.$router.push(this.$route.query.from+'?addAddress=true');
            var obj = Object.assign({addAddress:true},that.$route.query);
            this.$router.push({
              path:this.$route.query.from,
              query:obj
            });
            return
          }
            localStorage.setItem('addSource',that.source)
          this.$router.go(-1)
        }else{
          Toast({message:data.msg,iconClass:'ToastIcon icon-error'})
          this.saveFlag = true
        }

      }).catch(()=>{this.saveFlag = true})
      },

      showSelect(){
        console.log(this.addAddress)
        if(!this.addAddress) return
        this.showSheet = true
      },
      selectAddress(address){   //地址联动 选择
        console.log(this.source)
        if(this.source == 0){
          Toast({message:'请先选择地址渠道',iconClass:'ToastIcon icon-error'})
          return
        }
        this.source = this.source
        this.showPicker = true
        this.shadow = true

        this.actAddress = address
      },
      updateAddress(address){  //picker地址选择器 选择好 之后保存
        console.log(address)
        this.actAddress = address;
        this.showPicker = false
        this.shadow = false
      },
      close(){  //关闭picker
        this.showPicker = false
        this.shadow = false
      },
      RegArea(area){
        //渠道地址验证
        if(!area) return false
        if(area.province == "" ||area.city =="" || area.county == "" ){
          return false
        }
        return true
      }
    },
    computed:{
      actAddressText(){
        let Address = this.actAddress !== null ? this.actAddress.provinceName + this.actAddress.cityName + this.actAddress.countyName + this.actAddress.townName : ""
        return Address
      },
      saveAddressQuery(){
        let Query = {
          addressDetail:this.addressDetail,
          token:this.token,
          source:this.source,
          siteId:this.siteId,
          receiverName:this.name,
          receiverPhone:this.phone,
          receiverPhone1:this.phone,
          vo:this.actAddress
        }
        if(this.editAddress != null){
          Query.id = this.editAddress.id
        }
        return Query
      },
      ...mapGetters(['editAddress','siteId','token'])
    },
    components:{
      Picker
    }

  }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/toastIcon/iconfont.css"
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"
  .editAddress
    padding-top 40px
    min-height 100%
    .topBar
      background #eee
      color #333
    .info_wrap
      background white
      .info-item
        width 100%
        height 1rem
        border-bottom 0.5px solid #eee
        background white
        &.addressDetail
          float left
          height 2rem
          box-sizing border-box
          #detail
            float left
            line-height 0.5rem
            box-sizing border-box
            width 6.5rem
            padding 0.25rem 0.5rem 0.25rem 0
            font-family inherit
            height 99%
          .clear
            margin-top 0.5rem
        &>span
          float left
          width 2rem
          height 1rem
          padding 0 0.2rem
          font-size 0.35rem
          line-height 1rem
          text-align right
          overflow hidden
          text-overflow ellipsis
          white-space:nowrap
        .input,.address
          float left
          line-height 1rem
          width 6rem
          font-family inherit
          background transparent
        .clear
          float left
          width 1rem
          height 1rem
          background url("./image/input_clear.png") no-repeat center
          background-size 0.5rem 0.5rem
        .address
          padding-right 1rem
          height 1rem
          background url("./image/arrow_right.png") no-repeat right center
          background-size 0.4rem auto
    .picker
      fullScreen(5rem,0,0,0)
      box-shadow 0 0 5px #ccc
      z-index 12
    .shadow
      fullScreen(0,0,0,0)
      background rgba(0,0,0,0.6)
      z-index 11
</style>
