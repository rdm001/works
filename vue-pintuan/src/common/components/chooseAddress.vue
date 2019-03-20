<template>
  <div class="chooseAddress-wrap" >
    <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="选择地址">
      <div slot="left">
        <mt-button icon="back" @click.native="$emit('hide')"></mt-button>
      </div>
      <mt-button style="font-family: inherit" @click="addAddress"  slot="right"><span>添加新地址</span></mt-button>
    </mt-header>
    <scroll class="addressScroll" ref="addressScroll">
      <div>
        <select-address v-for="item,index in addressList" :key="index" @click.native="$emit('change',item)" style="border-bottom: 1px solid #eee" :data="item" :source="source"></select-address>
      </div>
    </scroll>
    <!--<div class="addAddress">
      <div class="btn" @click="addAddress"> 添加新地址</div>
    </div>-->
  </div>
</template>
<script type='text/javascript'>
  import selectAddress from '../../common/components/selectAddress.vue'
  import Scroll from '../../common/components/scroll.vue'
  import {mapGetters,mapMutations} from 'vuex'
  export default {
        props:['type','query'],
        data() {
            return {
              addressList:[],
              confirmOrder:[],
              source:-1
            }
        },
        watch:{
          source(newVal){
              if(newVal == 2 || newVal == 4){
                this.source = 1
              }
          },
          addressList(){
            this.$refs.addressScroll.refresh()
          }
        },
        created(){
            if(this.type=='gift'){
             JSON.parse(localStorage.getItem('giftSelectProduct'))
             this.source = JSON.parse(localStorage.getItem('giftSelectProduct')).itemSource
            }else if(this.type=='product'){
             this.source = this.$until.filterSource(JSON.parse(localStorage.getItem('confirmOrder'))[0].source)
            }
            this.initAddress()
        },
        methods: {
          initAddress(){
            //初始化所有地址
            this.$http.post(
              this.$api.getAddress,
              this.$until.getFormData({
                siteId:this.siteId,
                token:this.token,
                source:this.source
              })
            ).then(({data}) => {
              if(data.success){
                this.addressList = data.obj.addressList




              }else{
                Toast({message:data.msg,iconClass:'ToastIcon icon-error'})
              }
            })
          },
          addAddress(){
            this.set_editAddress(null)
            let path = this.$route.path
           // this.$router.push('/editAddress?source=' + this.source + '&from=' + path)
            let that = this
            let obj1 = {
              source :that.source,
              from : path
            }
            let obj
            if(this.query){
              obj = Object.assign(obj1,that.query);
            }else{
                obj = obj1
            }
            this.$router.push({
                    path:'/editAddress',
                    query:obj
                })
          },
          ...mapMutations({
            set_editAddress:"set_editAddress",
          })
        },
        computed:{
                ...mapGetters(['token','siteId'])
        },
        components:{
          selectAddress,
          Scroll
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"
  .chooseAddress-wrap
    fullScreen(0,0,0,0)
    z-index 20
    background #eee
    padding-top 40px
    .addressScroll
      fullScreen(40px,0,0,0)
      &>div
        padding-bottom 1.5rem
    .addAddress
      position fixed
      padding 0.3rem 0
      bottom 0
      left 0
      width 100%
      background white
      box-shadow 0 0 10px #eee
      .btn
        height 1rem
        width 80%
        margin 0 auto
        border-radius 0.6rem
        text-align center
        color white
        line-height 1rem
        font-size 0.4rem
        background $color-theme
        background linear-gradient(to right,orange,$color-theme)
</style>
