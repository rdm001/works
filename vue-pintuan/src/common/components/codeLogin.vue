<template>
    <div class="codeLogin">
      <div class="item_wrap">
        <input type="tel" class="input" v-model="phone" @focus="phoneFocus = true" @blur="phoneFocus = false" placeholder="请输入手机号"> <img class="close" src="../../components/Login/image/close.png" @click=" phone = ''" v-show="phoneFocus && phone.length" alt="">
      </div>

      <div class="code_wrap">
        <div class="item_wrap">
          <input type="text" class="input" v-model="code" @focus="codeFocus = true" @blur="codeFocus = false" placeholder="请输入验证码"> <img class="close" src="../../components/Login/image/close.png" @click="code = ''" v-show="codeFocus && code.length" alt="">
        </div>
        <div class="getCode" v-if="!disabled" @click="getCode">获取验证码</div>
        <div class="getCode disabled" v-if="disabled">还剩{{sec}}秒重新获取</div>
      </div>

      <div class="submit" @click="submit">
        登陆
      </div>
    </div>
</template>
<script type='text/javascript'>
    let phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    import { Popup , Toast} from 'mint-ui';
    let toast = null
    const time = 120  //短信发送间隔
    import {mapGetters,mapMutations,mapActions} from 'vuex';
    export default {
        props:['siteId'],
        data() {
            return {
              phoneFocus:false,
              codeFocus:false,
              phone:"",
              code:"",
              httpFlag:true,
              disabled:false,
              sec:time,
              submitFlag:true
            }
        },
        created(){},
        destroyed(){
            let that = this
            if(that.timer){
              clearInterval(that.timer)
            }

        },
        watch:{
          disabled(newVal){
              let that = this
              if(newVal){
                  this.timer = setInterval(()=>{
                    that.sec--
                    if(that.sec ==0){
                        that.disabled = false
                        clearInterval(that.timer)
                        that.sec = time
                    }
                  },1000)
              }
          }
        },
        methods: {
            getCode(){

              let phone = this.phone
              if(toast){toast.close()}   //弹框已存在 先关闭弹框
              if(this.phone == ""){
                  toast = Toast({message:'手机号不能为空',iconClass:'ToastIcon icon-error'})
                  return
                }else if(!phoneReg.test(phone)){
                  toast = Toast({message:'手机号码不正确',iconClass:'ToastIcon icon-error'})
                  return
                }
              //请求验证码
              if(!this.httpFlag) return
              this.httpFlag = false
                this.$http.post(
                    this.$api.sendSmsCode,
                    this.$until.getFormData({
                      siteId:this.siteId,
                      type:2,
                      mobile:this.phone
                    })
                  ).then(({data}) => {
                    this.httpFlag = true
                    if(data.success){
                      toast = Toast({message:data.msg,iconClass:'ToastIcon icon-success'})
                      this.disabled = true
                    }else{
                      toast = Toast({message:data.msg,iconClass:'ToastIcon icon-error'})
                    }
                  }).catch(e => this.httpFlag = true)
            },
            submit(){
              let phone = this.phone
              if(toast){toast.close()}   //弹框已存在 先关闭弹框
              if(this.phone == ""){
                toast = Toast({message:'手机号不能为空',iconClass:'ToastIcon icon-error'})
                return
              }else if(!phoneReg.test(phone)){
                toast = Toast({message:'手机号码不正确',iconClass:'ToastIcon icon-error'})
                return
              }else if(this.code == ""){
                toast = Toast({message:'验证码不能为空',iconClass:'ToastIcon icon-error'})
                return
              }

              if(!this.submitFlag) return
              this.submitFlag = false
                this.$http.post(
                    this.$api.smsCodeLogin,
                    this.$until.getFormData({
                      mobile:this.phone,
                      smsCode:this.code,
                      siteId:this.siteId
                    })
                ).then(({data}) => {
                  this.submitFlag = true;
                    if(data.success){
                      this.set_login_info({token:data.obj.token,user:data.obj.user})
                      localStorage.setItem('token',data.obj.token)
                      localStorage.setItem('user',JSON.stringify(data.obj.user))

                      let CartProduct = localStorage.getItem('jf-shopCarProduct-'+data.obj.user.id) ? localStorage.getItem('jf-shopCarProduct-'+data.obj.user.id) : '[]'
                      this.set_shopCarProduct(JSON.parse(CartProduct))

                      let history = localStorage.getItem('history') //获取上一个路径
                      if (history.indexOf('/login') != -1){
                        //如果上一个页面不存在或者直接从登录页面进入
                        this.$router.push('/home')
                        return
                      }
                      this.$router.push(history)
                      return
                    }else{

                     toast.close();
                     toast = Toast({message:data.msg,iconClass:'ToastIcon icon-error'})
                    }
                }).catch((e) => {this.submitFlag = true})
            },
          ...mapMutations({
            set_shopCarProduct:'set_shopCarProduct'
          }),
          ...mapActions({
            set_login_info:'set_login_info'
          })
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
.codeLogin
  .code_wrap
    justify-content space-between
    .getCode
      float right
      height 0.9rem
      line-height 0.9rem
      text-align center
      width 3rem
      border 1px solid rgb(166, 31, 45)
      border-radius 0.1rem
      color rgb(166, 31, 45)
      &.disabled
        background #e0e0e0
        color white
        border none


</style>
