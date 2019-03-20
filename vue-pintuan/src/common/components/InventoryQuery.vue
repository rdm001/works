<template>
    <div class="inventoryQuery">
      <div class="icon_close" @click="close"></div>
      <div class="info">
        <img :src='data.photo' class="photo" alt="">
        <div class="text">
          <div class="addAddress" v-if="!address&&data.type!=3" @click="addAddress">
            请先添加默认地址后再购买  》
          </div>
          <div class="price">
            单价：{{salePoint | fulterUnit}}
          </div>
          <div class="addressText" v-if="addressText&&data.type!=3">地址：{{addressText}}</div>
          <div class="stockNum">
            库存：{{stockNum}}</div>
          <div class="steps">
            购买
            <step style="margin: 0 0.2rem;display: inline-block;vertical-align: middle;" :num="num" @changeNum="changeNum" @add="add" @reduce="reduce"></step>
            件
          </div>
        </div>
      </div>
      <div>
        <div class="btn" @click="checkLimit">确定</div>
      </div>
    </div>
</template>
<script type='text/javascript'>
    import {mapGetters,mapMutations} from 'vuex'
    import {Toast,Indicator} from 'mint-ui';
    import Step from '../../common/components/Step.vue'
    export default {
        props:{
            data:{
                type:Object,
                default:{}
            },
            unit:{
              type:String,
              default:""
            },
            type:{
              type:Number,
              default:1
            }
        },
        data() {
            return {
              stockNum:'查询中',
              num:1,
              address:null,
              canShop:false
            }
        },
        created(){
           this._initData()
        },
        methods: {
            _initData(){

                if(this.data.type==3){
                    //虚拟商品直接查询库存
                  this.$http.post(//根据地址 查询库存
                    this.$api.productStock,
                    this.$until.getFormData(this.stockQuery)
                  ).then(({data})=> {
                  if(data.success){
                    let stock = data.obj[0]
                    if(stock.status === "1") {
                      if(stock.stockNum !== "-1" && stock.stockNum !== null) {
                        this.stockNum =  stock.stockNum;
                      } else {
                        this.stockNum = "有货";
                      }
                    } else if(stock.status === "2") {
                      this.stockNum = "库存不足";
                    } else if(stock.status === "4") {
                      this.stockNum = "商品已下架";
                    }
                  }else{
                        Toast(data.msg)
                  }
                })
                    return
                }
                this.$http.post(  //查询默认地址
                    this.$api.getDefaultAddress,
                    this.$until.getFormData({
                      token:this.token,
                      siteId:this.siteId,
                      source:this.$until.filterSource(this.data.source)
                    })
                ).then(({data}) => {
                    if(!data.obj.entity){
                        //无地址信息，并且不是虚拟商品
                        this.stockNum = '暂无信息'
                      return;
                    }
                    let address = data.obj.entity

                    let actAddress =address.vo
                    this.address = actAddress
                    this.$http.post(//根据地址 查询库存
                        this.$api.productStock,
                        this.$until.getFormData(this.stockQuery)
                    ).then(({data})=> {
                        if(data.success){
                          let stock = data.obj[0]
                          if(stock.status === "1") {
                            if(stock.stockNum !== "-1" && stock.stockNum !== null) {
                              this.stockNum =  stock.stockNum;
                            } else {
                              this.stockNum = "有货";
                            }
                          } else if(stock.status === "2") {
                            this.stockNum = "库存不足";
                          } else if(stock.status === "4") {
                            this.stockNum = "商品已下架";
                          }
                        }else{
                            Toast(data.msg)
              }
                    })
                })
            },
          checkLimit(){
            if(this.data.activityType == 1 ) {
              this.$http.post(
                this.$api.checkProductLimit,
                this.$until.getFormData({
                  itemId : this.data.id,
                  shopNum: this.num,
                  token: this.token
                })
              ).then(({data}) => {
                if(data.success){
                  this.commit()
                }else{
                    Toast(data.msg)
                }
              })

            }else{
                this.commit()
            }

          },
            addAddress(){
              this.set_editAddress(null)
              this.$router.push('/editAddress?source=' + this.$until.filterSource(this.data.source))
            },

            close(){
                this.$emit('closed')
            },
            commit(){
                if(!this.address&&this.data.type!=3){
                    //如果没有地址并且不是虚拟商品 提示先添加地址
                  Toast('请添加默认地址后再进行操作')
                  return
                }
              if(this.searchCar() && !this.type){
                    //如果购物车已存在
                Toast('购物车已存在该商品')
                return
              }

              Indicator.open();
              this.$http.post(//再次校验库存
                this.$api.productStock,
                this.$until.getFormData(this.stockQuery)
              ).then(({data}) => {
                  if(data.success){
                    if(data.obj[0].status == 1){
                      //如果库存足够
                      if(!this.type){
                        //加入购物车
                        this.$emit('shopCar',this.num)
                      }else{
                        //进入订单详情
                        //this.set_confirmOrder(this.confirmOrder)
                        Indicator.close();
                        this.confirmOrder.num = this.num
                        let confirmOrder = JSON.stringify(this.confirmOrder)
                        localStorage.setItem('confirmOrder',confirmOrder)
                        localStorage.setItem('confirmFlag','true')
                        this.$router.push('/confirmOrder')
                      }
                    }else{
                      Toast('库存不足')
                    }
                  }else{
                    Toast(data.msg)
                  }
                Indicator.close();
              }).catch((e) =>  Indicator.close())

                //console.log(this.stockQuery)
            },
            add(){
                this.num++;
            },
            searchCar(){
                //用于校验购物车是否存在该商品
              let CartProduct = this.shopCarProduct
              let product = this.data  //获取当前商品信息
              let  flag = false
              CartProduct.forEach((e) => {
                if(e.id == product.id){
                    //遍历购物车 是否存在该商品
                  flag = true
                }
              })

              return  flag
            },
            changeNum(num){
                this.num = num
            },
            reduce(){
              this.num--;
              if(this.num < 1){
                Toast('购买数量已达到最少！')
                this.num = 1
                return
              }
            },
          ...mapMutations({
            set_confirmOrder:'set_confirmOrder',
            set_editAddress:'set_editAddress'
          })
        },
        computed:{
          stockQuery(){
              let query = null
              if(this.data.type == 3){
                  //如果是虚拟商品 不传地址
                query = {
                  token:this.token,
                  siteId:this.siteId,
                  supplyId:this.data.supplyId,
                  itemId:this.data.id,
                  skuId:this.data.itemCode,
                  num:this.num,
                  source:this.data.source
                }
                return query
              }
              query = {
                token:this.token,
                siteId:this.siteId,
                supplyId:this.data.supplyId,
                itemId:this.data.id,
                skuId:this.data.itemCode,
                num:this.num,
                source:this.data.source,
                provinceId:this.address?this.address.province : "",
                cityId:this.address?this.address.city : "",
                countyId:this.address?this.address.county : "",
                townId:this.address?this.address.town : 0
              }

              return query

          },
          salePoint(){
              if(this.data.activityType == 1){
                let newPoint = this.data.activityType ? ((this.data.salePoints / (this.data.salePrice <= 0 ? 1 :this.data.salePrice)) * this.data.activityProductVo.preferentialPrice).toFixed(2) :0
                return newPoint
              }
            return this.data.salePoints
          },
          addressText(){
              let text = ""
              if(this.address){
                  text = this.address.provinceName + this.address.cityName + this.address.countyName + this.address.townName
              }
              return text
          },
          confirmOrder(){
              //准备提交的订单
            let order = []
            this.data.num = this.num
            let product = this.data
            order.push(product)
            return order
          },

          ...mapGetters(['siteId','token','shopCarProduct'])
        },
        components:{
          Step
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  .inventoryQuery
    box-sizing border-box
    padding 0.2rem
    border-top-left-radius 0.3rem
    border-top-right-radius 0.3rem
    padding-top 1rem
    .icon_close
      position absolute
      right 0.2rem
      top 0.15rem
      width 0.6rem
      height 0.6rem
      background url("../image/icon_close.png") no-repeat center
      background-size 0.6rem 0.6rem
    .info
      width 100%
      overflow hidden
      padding-bottom 0.2rem
      border-bottom 0.5px solid #eee
      .photo
        float left
        width 3rem
        height 3rem

        background #ccc
        border-radius 0.2rem
        box-shadow 0 0 5px #f5f5f5
      .text
        float right
        width 6.2rem
        .addAddress
          color deepskyblue
          font-size 0.35rem
          width 6rem
          margin 0.2rem 0
        .addressText
          font-size 0.4rem
          margin-bottom 0.2rem
          line-height 0.5rem
        .price
          color orangered
          font-size 0.4rem
          margin 0 0 0.2rem
        .stockNum
          font-size 0.4rem
        .steps
          margin 0.2rem 0
          font-size 0.4rem
          height 1rem
          line-height 1rem
    .btn
      width 100%
      height 1.2rem
      margin 0.4rem auto 0.2rem
      line-height 1.2rem
      text-align center
      border-radius 0.7rem
      background $color-theme
      background linear-gradient(to right,orange,$color-theme)
      color white
      font-size 0.5rem

</style>
