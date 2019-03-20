<template>
    <div class="specialExchange">
      <img src="./image/banner2.png" class="banner" alt="">
      <input type="text" class="input" v-model="code"  placeholder="请输入券码" />
      <div class="btn" @click="submit"></div>
    </div>
</template>
<script type='text/javascript'>
  import { Toast } from 'mint-ui';
  import Vue from 'vue'
  import {mapGetters,mapMutations} from 'vuex'
    export default {
        data() {
            return {
                code:''
            }
        },

        methods:{
            submit(){
              if(this.code == ''){
                Toast('请填写券码')
                return
              }
              var that = this
              this.$http.post(
                  '/api/client/bindProvilegeAcc',
                this.$until.getFormData({
                  "token":this.token, // 用户token 必填
                  "siteId":this.siteId, // 站点ID 必填
                  "packsId":this.$route.params.id,// 礼包Id 必填
                  "type":1,// 兑换方式（1券码兑换;2手机号白名单验证） 必填
                  "account":this.code, //券码
                  "mobile":"", //绑定人手机号
                  "smsCode":"" //验证码
                })
              ).then((res) => {
                  if(res.data.success){
                    this.$router.push(`/GiftDetail/${res.data.obj.packsId}?accId=${res.data.obj.packsAccId}&endTime=${this.fmtDate(res.data.obj.accValidEndDate)}`)
                    }else{
                      Toast(res.data.msg)
                    }

              })

            },
          fmtDate(dateStr){
            var date = new Date(dateStr);
            var Month = date.getMonth() + 1;
            var Day = date.getDate();
            var Y = date.getFullYear() + '-';
            var M = Month < 10 ? '0' + Month + '-' : Month + '-';
            var D = Day  < 10 ? '0' + Day : Day;
            return Y + M + D;
          }
        },
        computed:{
          ...mapGetters(['siteId','token'])
        }

    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
.specialExchange
  padding-top 1rem
  fullScreen(0,0,0,0)
  background url("./image/bg2.png") no-repeat center
  background-size 100% 100%
  .banner
    display: block;
    width: 8rem;
    margin: 0 auto 1rem;
  .input
    display: block;
    width: 7rem;
    margin: 0 auto 0.5rem;
    box-sizing: border-box;
    padding: 0.1rem 0.3rem;
    border:2px solid red;
    height:1rem;
    font-size: 0.4rem;
    border-radius: 0.1rem;
    background: transparent;
    -webkit-appearance:none;
  .btn
    width: 7rem;
    margin: 0.5rem auto;
    height:1rem;
    background:url("./image/btn2.png") no-repeat left top;
    background-size: 100% 100%;

</style>
