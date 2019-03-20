<template>
  <div class="login">
   <!-- <img class="logo" src="../../common/image/login.jpg" alt="">-->
    <code-login :siteId="siteId" v-if="loginWay==1"></code-login>
    <pwd-login :siteId="siteId" v-if="loginWay==2"></pwd-login>
    <!--<div class="item_wrap">
      <input type="text" class="input" v-model="username" @focus="nameFocus = true" @blur="nameFocus = false" placeholder="请输入用户名"> <img class="close" src="./image/close.png" @click=" username = ''" v-show="nameFocus && username.length" alt="">
    </div>
    <div class="item_wrap">
      <input type="password" class="input" v-model="pwd" @focus="pwdFocus = true" @blur="pwdFocus = false" placeholder="请输入密码"> <img class="close" src="./image/close.png" @click="pwd = ''" v-show="pwdFocus && pwd.length" alt="">
    </div>

    <div class="code_wrap">
      <div class="item_wrap">
        <input type="text" class="input" v-model="code" @focus="codeFocus = true" @blur="codeFocus = false" placeholder="请输入验证码"> <img class="close" src="./image/close.png" @click="code = ''" v-show="codeFocus && code.length" alt="">
      </div>
      <img :src="'/api/genVefiyImg?rand='+ random" @click="random = (Math.random()*100000000).toFixed(7)" alt="">
    </div>

    <div class="submit" @click="submit">
      登陆
    </div>
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      popup-transition="popup-fade"
      style="width: 100%"
    >
      <div class="siteSelect">
        <div class="siteItem" @click="setSiteId(item.id)" v-for="item in siteSelect">{{item.siteName}}</div>
      </div>
    </mt-popup>-->
  </div>
</template>

<script>
  import { Popup , Toast} from 'mint-ui';
  import Vue from 'vue'
  Vue.component(Popup.name, Popup)
  import {mapGetters,mapMutations,mapActions} from 'vuex';
  import codeLogin from '../../common/components/codeLogin.vue'
  import pwdLogin from '../../common/components/pwdLogin.vue'
    export default{
        data(){
            return {
                nameFocus:false,
                pwdFocus:false,
                codeFocus:false,
                pwd:"",
                username:"",
                code:"",
                popupVisible:false,
                loginWay:0
            }
        },
      created(){
        this.loginWay = this.siteConfig ? this.siteConfig.loginWay.split(',')[0] : 0
      },
      watch:{
        siteConfig(){
          this.loginWay = this.siteConfig ? this.siteConfig.loginWay.split(',')[0] : 0
        }
      },
      methods:{
     /*   submit(){
          if(this.username==""){
            Toast({message:'账号不能为空',iconClass:'ToastIcon icon-error'})
          }else if(this.pow==""){
            Toast({message:'密码不能为空',iconClass:'ToastIcon icon-error'})
          }else if(this.code == ""){
            Toast({message:'验证码不能为空',iconClass:'ToastIcon icon-error'})
          }else{
              this.$http.post(
                  this.$api.login,
                  this.$until.getFormData({username:this.username,password:this.pwd,vefiyCode:this.code})
              ).then((res) => {
                console.log(res.data)
                this.random = (Math.random()*100000000).toFixed(7) //取7位随机数 作为图片流后缀
                if(res.data.code != 200){
                  Toast({message:res.data.msg,iconClass:'ToastIcon icon-error'})
                }else{
                  //存储相关信息
                  this.set_login_info({unit:res.data.obj.page.rows[0].cashUnit,token:res.data.obj.token,siteConfig:res.data.obj.page.rows[0],user:res.data.obj.user,payWay:res.data.obj.page.rows[0].paywayConf})
                  localStorage.setItem('unit',res.data.obj.page.rows[0].cashUnit)
                  localStorage.setItem("token",res.data.obj.token)
                  localStorage.setItem("user",JSON.stringify(res.data.obj.user))
                  localStorage.setItem("payWay",res.data.obj.page.rows[0].paywayConf)
                  localStorage.setItem("siteConfig",JSON.stringify(res.data.obj.page.rows[0]))
                  this.siteSelect = res.data.obj.page.rows;
                  if(this.siteSelect.length == 1){
                      //只有一个站点选择时 直接跳转
                    let history = sessionStorage.getItem('history')
                    console.log(res.data.obj.page.rows[0].id)
                    localStorage.setItem('siteId',res.data.obj.page.rows[0].id)
                    this.set_siteId(res.data.obj.page.rows[0].id)
                    if (history.indexOf('/login') != -1){
                      this.$router.push('/home')
                      return
                    }
                    this.$router.push(history)
                    return
                  }
                  this.popupVisible = true
                }
              })
          }
        },
        setSiteId(id){
          localStorage.setItem('siteId',id)
          this.set_siteId(id)
         let history = sessionStorage.getItem('history')
          if (history.indexOf('/login') != -1){
            this.$router.push('/home')
            return
          }
          this.popupVisible = false
          this.$router.push(history)
        },*/
        ...mapMutations({
            setSiteConfig:'set_siteConfig',
            set_token:'set_token',
            set_user:'set_user',
            set_siteId:'set_siteId',
        }),
        ...mapActions({
          set_login_info:'set_login_info'
        })
      },
      computed: {
        ...mapGetters(['siteConfig','siteId'])
      },
      components:{
        codeLogin,
        pwdLogin
      }
    }
</script>

<style type='text/css' lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/toastIcon/iconfont.css"
  .icon-success,.icon-error
    font-size 1rem
  .login
    position absolute
    padding-top 1.5rem
    left 0
    right 0
    top 0
    bottom 0
    z-index:10;
    background white
    .siteSelect
      background white
      width 100%
      .siteItem
        height 1.2rem
        line-height 1.2rem
        text-align center
        font-size 0.4rem
        border-bottom 0.5px solid #eee
        &:last-child
          border none
    .logo
      display block
      width 3rem
      margin 0 auto
    .item_wrap
      width 8rem
      margin 1rem auto 0
      padding 0.2rem 0.12rem
      border-bottom 1px solid rgb(166, 31, 45)
      .close
        width 0.5rem
      .input
        width 7rem
        height 0.5rem
        margin-right 0.3rem
        line-height 0.5rem
        font-size 0.5rem
    .code_wrap
      overflow hidden
      width 8rem
      margin 1rem auto 0
      img
        width 3rem
        float right
      .item_wrap
        float left
        width 4rem
        margin 0 0.2rem 0 0
        .input
          width 3rem
    .submit
      width 8rem
      height 1rem
      margin 0.5rem auto
      border-radius 0.5rem
      background $color-theme
      text-align center
      line-height 1rem
      color white
      font-size 0.5rem
</style>

