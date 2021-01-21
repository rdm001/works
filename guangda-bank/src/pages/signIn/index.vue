<template>
  <div class="signIn">
    <input type="telephone" class="tel" placeholder="请输入手机号" v-model="phone" @blur="blur">
    <input type="text" class="vsCode" placeholder="请输入验证码" v-model="vsCode" @blur="blur">
    <button class="post-code" @click="postCode" v-text="postTitle"></button>
    <button class="btn" @click="login">登录</button>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import axios from "axios";

export default {
  data() {
    return {
      phone: "",
      vsCode: "",
      postTitle: "点击发送验证码",
      postFlag: true,
      siteId: 34,
      flag: true,
      baseUrl: "https://gdwx.whecb.com"
    };
  },
  methods: {
    blur() {
      document.body && (document.body.scrollTop = document.body.scrollTop);
    },
    postCode() {
      if (!this.postFlag) {
        return Toast("请勿重复点击!");
      }
      if (!this.flag) {
        return;
      }
      let phoneReg = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
      if (this.phone.trim() == "" || !phoneReg.test(this.phone)) {
        return Toast("请输入正确的手机号");
      } else {
        this.postFlag = false;
        axios
          .post(
            "/api/common/sendSmsCode",
            this.getFormData({
              siteId: this.siteId,
              type: 7,
              mobile: this.phone
            })
          ) /* 发送验证码请求 */
          .then(res => {
            this.postFlag = true;
            if (res.data.success) {
              Toast("发送成功");
              let timeStart = 60;
              this.flag = false;
              let timer = setInterval(() => {
                this.postTitle = timeStart + "s后可再次发送";
                timeStart--;
                if (timeStart == 0) {
                  clearInterval(timer);
                  this.postTitle = "点击发送验证码";
                  this.flag = true; /* 节流阀,在倒计时60S之内限制用户多次点击发送验证码的按钮 */
                }
              }, 1000);
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(err => {
            Toast(err.msg);
          })
          .finally(() => {
            // this.postFlag = false;
            // let timeStart = 60;
            // let timer = setInterval(() => {
            //   this.postTitle = timeStart + "s后可再次发送";
            //   timeStart--;
            //   if (timeStart == 0) {
            //     clearInterval(timer);
            //     this.postTitle = "点击发送验证码";
            //     this.postFlag = true; /* 节流阀,在倒计时60S之内限制用户多次点击发送验证码的按钮 */
            //   }
            // }, 1000);
          });
      }
    },
    getFormData(obj) {
      //参数序列化
      let formData = new FormData();
      Object.keys(obj).forEach(key => {
        formData.append(key, obj[key]);
      });
      return formData;
    },
    login() {
      let phoneReg = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
      if (this.phone.trim() == "" || !phoneReg.test(this.phone)) {
        return Toast("请输入正确的手机号");
      }

      if (this.vsCode.trim() == "") {
        return Toast("请输入验证码");
      }
      axios
        .post(
          "/api/common/checkSmsCodeAndLogin",
          this.getFormData({
            siteId: this.siteId,
            type: 7,
            mobile: this.phone,
            smsCode: this.vsCode
          })
        )
        .then(res => {
          localStorage.setItem("token", res.data.obj.token);

          localStorage.setItem("user", JSON.stringify(res.data.obj.user));

          localStorage.setItem(
            "siteConfig",
            JSON.stringify(res.data.obj.mallSite)
          );
          axios
            .post(
              "/api/checkActivityWhiteCode",
              this.getFormData({ whiteCode: this.phone })
            )
            .then(res2 => {
              // console.log(res2);

              if (res2.data.success) {
                window.location.href =
                  "https://gdwx.whecb.com/#/productDetail/" +
                  res2.data.obj +
                  "?siteId=34";
              } else {
                Toast(res2.data.msg);
              }
            });
        })
        .catch(err => {
          return Toast("登录失败!");
        });
    }
  }
};
</script>
<style lang="less" scoped>
.signIn {
  width: 100%;
  height: 100%;
  background: url(../../assets/login.png);
  background-size: 100% 100%;
  position: fixed;
  .tel,
  .vsCode {
    position: absolute;
    border: 0.026rem solid #359635;
    outline: none;
    background-color: #99eaca;
    padding-left: 0.52rem;
  }
  .tel {
    border-radius: 0.106rem;
    left: 1.6rem;
    top: 8.41rem;
    width: 7.2rem;
    height: 1.3rem;
  }
  .vsCode {
    border-radius: 0.106rem 0 0 0.106rem;
    width: 4rem;
    height: 1.3rem;
    left: 1.6rem;
    top: 10.28rem;
    border-right: 0;
  }
  .post-code {
    position: absolute;
    left: 6.1rem;
    top: 10.28rem;
    width: 3.2rem;
    height: 1.352rem;
    background-color: #359635;
    color: #fff;
    outline: none;
    border-radius: 0.106rem;
  }
  .btn {
    position: absolute;
    width: 7.2rem;
    height: 1.3rem;
    left: 1.6rem;
    top: 12.76rem;
    outline: none;
    font-size: 0.426rem;
    font-family: PingFang-SC-Medium;
    color: #fff;
    background-color: #359635;
    border-radius: 0.653rem;
    // ###########
  }
}
</style>