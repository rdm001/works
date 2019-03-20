<template>
    <div class="activeAddress">
        <div class="icon_position"></div>
        <div class="addressInfo">
          <div class="userInfo">
            <span>{{filterActiveAddress.name ||""}}</span>
            <span class="phone">{{filterActiveAddress.phone || ""}}</span>
          </div>
          <div class="addressDetail">
              {{filterActiveAddress.addressDetail||""}}
          </div>
        </div>
    </div>
</template>
<script type='text/javascript'>
    export default {
        props:{
            data:{
                type:Object,
                default:{}
            },
            source:{
                type:Number,
                default:1
            }
        },
      created(){

      },
        data() {
            return {

            }
        },
        methods: {

        },
        computed:{
          filterActiveAddress(){
            let text = ""
            if(this.data.address){
              let sourceAddress = this.data.vo
              text = sourceAddress.provinceName  + sourceAddress.cityName + sourceAddress.countyName + sourceAddress.townName + this.data.addressDetail
            }
            let Address = {
              id : this.data.id || 0,
              name : this.data.receiverName || 0,
              phone : this.data.receiverPhone || 0,
              addressDetail : text
            };
            return Address
          },
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  .activeAddress
    background white
    padding 0.1rem 0.2rem 0.2rem
    overflow hidden
    .icon_position
      float left
      position relative
      top 0.5rem
      width 0.7rem
      height 0.7rem
      margin 0 0.2rem 0 0
      background url("../image/icon_position.png") no-repeat center
      background-size 100% 100%
    .addressInfo
      width 7rem
      padding-right 1.5rem
      float right
      background url("../image/icon_arrow_right.png") no-repeat right center
      background-size 0.5rem 0.5rem
      .userInfo
        height 1rem
        line-height 1rem
        font-size 0.4rem
        .phone
          float right
          height 1rem
      .addressDetail
        line-height 0.5rem


</style>
