<template>
    <div class="addressListItem" >
      <div class="info">
        <div class="contact"><span class="name">{{data.receiverName}}</span>  <span style="float: right">{{data.receiverPhone}}</span></div>
        <div class="addressDetail">{{getAddressText}}</div>
      </div>
      <div class="btnWrap">
        <div class="default" @click="setDefault"><i class="radio" :class="{active:isDefault}"></i> <span v-if="!isDefault">设为</span>默认地址</div>
        <div class="btn" v-if="!isDefault" @click="deleteAddress">删除</div>
        <div class="btn" @click="edit">编辑</div>
      </div>

    </div>
</template>
<script type='text/javascript'>
  import {mapMutations,mapGetters} from 'vuex'
  import { Toast,MessageBox} from 'mint-ui';
    export default {
        props:{
          data:{
              type:Object,
              default:{}
          }
        },
        data() {
            return {
                address : [],
                isDefault: false,
                deleteFlag:true
            }
        },
        created(){
              this.source = this.data.source
              this.address = this.data.vo
              this.isDefault = this.data.isDefault == 1 ? true:false
        },
        methods:{
            setDefault(isdefault){ //============>设置默认地址
              if(!this.isDefault){
                this.$http.post(
                  this.$api.setDefault,
                  this.$until.getFormData({
                    addrId:this.data.id,
                    siteId:this.siteId,
                    token:this.token,
                    source:this.source
                  })).then(({data}) => {
                      if(data.success){
                          this.$emit('reload')
                      }
                })
              }
            },
            edit(){
                this.set_editAddress(this.data)
                this.$router.push('/editAddress')
            },
          deleteAddress(){
            let that = this
            MessageBox.confirm('确定删除地址?').then(action => {

              if(!that.deleteFlag) return
              that.deleteFlag = false
              that.$http.post(
                that.$api.addressDelete,
                that.$until.getFormData({
                  token:that.token,
                  addrId:that.data.id
                })
              ).then(({data}) => {
                if(data.success){
                  Toast({message:'删除成功',iconClass:'ToastIcon icon-success'})
                  that.$emit('reload')
                }else{
                  Toast({message:data.msg,iconClass:'ToastIcon icon-error'})
                  that.deleteFlag = true
                }

              }).catch(() => {
                that.deleteFlag = true
              })
            });

          },
          ...mapMutations({
              set_editAddress:"set_editAddress"
          })
        },
        computed:{
            getAddressText(){
                let address = this.address
                let text = address.provinceName + address.cityName + address.countyName + address.townName + this.data.addressDetail
                return text
            },
          ...mapGetters(['siteId','token'])

        },
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  .addressListItem
    padding 0.2rem
    overflow hidden
    background white
    border-bottom 1px solid #eee
    .info
      padding 0 0.1rem
      width 100%
      .contact
        height 0.6rem
        color #bbb
        .name
          margin-right 0.4rem
          font-size 0.4rem
          font-family '黑体'
          color #333
    .btnWrap
      overflow hidden
      margin-top 0.3rem
      .default
        float left
        padding-top 0.1rem
        line-height 0.5rem
        .radio
          float left
          box-sizing border-box
          width 0.5rem
          height 0.5rem
          border-radius 0.3rem
          border 1px solid #bbb
          margin-right 0.2rem
          extend-click()
          &.active
            background url("../../common/image/radio-checked.png") no-repeat center
            background-size 100% 100%
            border none
      .btn
        float right
        width 1.4rem
        text-align center
        margin-left 0.3rem
        padding 0.2rem
        border 1px solid #ccc
        border-radius 0.1rem
    .addressDetail
      line-height 0.5rem
      font-size 0.3rem
      .isDefault
        color orange
        margin-right 0.2rem

</style>
