<template>
    <form class="pwdLogin">
        <div class="item_wrap">
           <input type="text" class="input" v-model="username" @focus="nameFocus = true" @blur="nameFocus = false" placeholder="请输入用户名"> <img class="close" src="../../components/Login/image/close.png" @click=" username = ''" v-show="nameFocus && username.length" alt="">
         </div>
         <div class="item_wrap">
           <input type="password" class="input" v-model="pwd" @focus="pwdFocus = true" @blur="pwdFocus = false" placeholder="请输入密码"> <img class="close" src="../../components/Login/image/close.png" @click="pwd = ''" v-show="pwdFocus && pwd.length" alt="">
         </div>

         <div class="code_wrap">
           <div class="item_wrap">
             <input type="text" class="input" v-model="code" @focus="codeFocus = true" @blur="codeFocus = false" placeholder="请输入验证码"> <img class="close" src="../../components/Login/image/close.png" @click="code = ''" v-show="codeFocus && code.length" alt="">
           </div>
           <img :src="'/api/genVefiyImg?rand='+ random" @click="random = (Math.random()*100000000).toFixed(0)" alt="">
         </div>

         <div class="submit" @click="submit">
           登陆
         </div>
    </form>

</template>
<script type='text/javascript'>
   import { Popup , Toast} from 'mint-ui';
   import {mapGetters,mapMutations,mapActions} from 'vuex';
   let phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
   let toast = null
   export default{
     data(){
       return {
         nameFocus:false,
         pwdFocus:false,
         codeFocus:false,
         pwd:"",
         username:"",
         code:"",
         random:0,
         popupVisible:false,
       }
     },
     created(){
       this.random = (Math.random()*100000000).toFixed(0)
     },
     methods:{
        submit(){
          if(toast){toast.close()}
          if(this.username==""){
            toast = Toast({message:'账号不能为空',iconClass:'ToastIcon icon-error'})
            return
          }else if(this.pow==""){
            toast = Toast({message:'密码不能为空',iconClass:'ToastIcon icon-error'})
            return
          }else if(this.code == ""){
            toast = Toast({message:'验证码不能为空',iconClass:'ToastIcon icon-error'})
            return
          }else if(!phoneReg.test(this.username)){
            toast = Toast({message:'用户名不正确',iconClass:'ToastIcon icon-error'})
            return
          }else{
            this.$http.post(
              this.$api.login,
              this.$until.getFormData({username:this.username,password:this.pwd,vefiyCode:this.code,siteId:this.siteId})
            ).then(({data}) => {
              this.random = (Math.random()*100000000).toFixed(0) //取7位随机数 作为图片流后缀
              if(data.success){
                this.set_login_info({token:data.obj.token,user:data.obj.user})
                localStorage.setItem('token',data.obj.token)
                localStorage.setItem('user',JSON.stringify(data.obj.user))

                let CartProduct = localStorage.getItem('jf-shopCarProduct-'+data.obj.user.id) ? localStorage.getItem('jf-shopCarProduct-'+res.data.obj.user.id) : '[]'
                this.set_shopCarProduct(JSON.parse(CartProduct))

                let history = localStorage.getItem('history') //获取上一个路径
                if (history.indexOf('/login') != -1){
                  //如果上一个页面不存在或者直接从登录页面进入
                  this.$router.push('/home')
                  return
                }
                this.$router.push(history)
              }else{
                this.submitFlag = true
                toast = Toast({message:data.msg,iconClass:'ToastIcon icon-error'})
              }
            })
          }
        },
       ...mapMutations({
         setSiteConfig:'set_siteConfig',
         set_token:'set_token',
         set_user:'set_user',
         set_siteId:'set_siteId',
         set_shopCarProduct:'set_shopCarProduct'
       }),
       ...mapActions({
         set_login_info:'set_login_info'
       })
     },
     computed: {
       ...mapGetters(['siteConfig','siteId'])
     },
     components:{
     }
   }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>

</style>
