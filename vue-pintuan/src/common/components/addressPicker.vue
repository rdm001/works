<template>
  <div class="AddressPicker">
    <div class="header">
      选择国家地区
      <i class="icon_close" @click="close"></i>

    </div>
    <div class="detailList">
      <div class="item" :class="{active:type == 'province'}" @click="changType('province')">{{provinceName}}</div>
      <div class="item" :class="{active:type == 'city'}"  @click="changType('city')" v-show="province != ''">{{cityName}}</div>
      <div class="item" :class="{active:type == 'county'}" @click="changType('county')" v-show="city != ''">{{countyName}}</div>
      <div class="item" :class="{active:type == 'town'}" @click="changType('town')" v-show="county != ''">{{townName}}</div>
    </div>
    <div class="content" ref="scroll">
      <div class="content_wrap">
        <div class="contentList" v-show="type == 'province'">
          <span :class="{active:item.districtId == province}" @click="selectProvince(item)" v-for="item in provinceList">{{item.name}}</span>
        </div>

        <div class="contentList" v-show="type == 'city'">
          <span :class="{active:item.districtId == city}" @click="selectCity(item)" v-for="item in cityList">{{item.name}}</span>
        </div>

        <div class="contentList" v-show="type == 'county'">
          <span :class="{active:item.districtId == county}" @click="selectCounty(item)" v-for="item in countyList">{{item.name}}</span>
        </div>

        <div class="contentList" v-show="type == 'town'">
          <span :class="{active:item.districtId == town}" @click="selectTown(item)" v-for="item in townList">{{item.name}}</span>
          <span :class="{active:town == 0 && town != ''}" v-show="townList.length == 0" @click="selectTown({districtId:0,name:'全区'})">全区</span>
        </div>

      </div>
    </div>
    <div class="sure" @click="save">确定</div>
  </div>
</template>

<script>
  import { Toast} from 'mint-ui';
    import Scroll from './scroll.vue'
    export default{
        props:{
            data:{
                type:Object,
                default:null
            },
            source:{
              type:Number
            }
        },
        data(){
            return {
              province:"",
              provinceList:[],
              city:"",
              cityList:[],
              county:"",
              countyList:[],
              town:"",
              townList:[],
              type:'province'
            }
        },
        watch:{

        },
        created(){

         /* if(this.data != null){
            this.province = this.data.province
            this.city = this.data.city
            if(this.data.source){
              this.county = this.data.city+ this.data.county

              this.town = this.data.city + this.data.county + this.data.town
            }else{
              this.county = this.data.county
              this.town = this.data.town
            }
          }*/
          this._initData()


        },
        methods:{
          _initData(){//=======================>picker 地址显示
              console.log(this.data)
              let that = this
              //======== 初始化省级
              this.getDistrictList(0,
                function(data){
                  that.provinceList = data.obj.page.rows
                }
              )

              if(this.data != null){ //==如果data为null  则为新增地址 智初始化 省级
              /*    //=======>初始化市级
                if(this.data.city != ""){
                  console.log(this.city)
                  this.getDistrictList(this.province,
                    function(data){
                      that.cityList = data.obj.page.rows
                    }
                  )
                }
                //=======>初始化区级
                if(this.data.county != ""){
                  this.getDistrictList(this.city,
                    function(data){
                      that.countyList = data.obj.page.rows
                    }
                  )
                }
                //=======>初始化镇级

                  this.getDistrictList(this.county,
                    function(data){
                      that.townList = data.obj.page.rows
                    }
                  )
*/
              }

          },
          changType(type){
              //对应显示个等级 区域列表
              this.type = type
          },
          getDistrictList(parentId,success){
              //查询对应等级列表
            this.$http.post(
              this.$api.districtList,
              this.$until.getFormData({
                source:this.source,
                parentId:parentId
              })
            ).then(({data}) => {
              if(success) success(data)
            })
          },
          selectProvince(Province){
              //选中省级
              let that = this;
              if(this.province == Province.districtId) return
              that.province = Province.districtId.toString()
              this.getDistrictList(Province.districtId,
                function(data){
                  that.cityList = data.obj.page.rows
                 /* that.$nextTick(function () {
                    that.$refs.scroll.refresh()
                  })*/
                  if(that.cityList.length){
                    that.type = 'city'
                  }
                  that.city = ""
                  that.county = ""
                  that.town = ""
                })

          },
          selectCity(City){
              //========>选中市级
            let that = this;
            if(this.city == City.districtId) return
            that.city = City.districtId.toString()
            this.getDistrictList(City.districtId,
              function(data){
                that.countyList = data.obj.page.rows
               /* that.$nextTick(function () {
                  that.$refs.scroll.refresh()
                })*/
                if(that.countyList.length){
                  that.type = 'county'
                }
                that.town = ""
                that.county = ""
              })
          },
          selectCounty(County){
            //========>选中区级
            let that = this;
            if(this.county == County.districtId) return
            that.county = County.districtId.toString()

            this.getDistrictList(County.districtId,
              function(data){
                that.townList = data.obj.page.rows
                /*that.$nextTick(function () {
                  that.$refs.scroll.refresh()
                })*/
                that.type = 'town'
                that.town = ""
              })
          },
          selectTown(Town){
            //========>选中镇级
            let that = this;

            if(this.town === Town.districtId) return
            console.log(this.town === Town.districtId)
            that.town = Town.districtId.toString()
          },
          close(){
              this.$emit('closed')
          },
          save(){
              //触发自定义事件  将选中结果 传递给 父组件
              if(!this.RegArea){
                  Toast('地址选择不完整')
                return
              }
              this.$emit('saveAddress',this.addressQuery)
          }
        },
        computed:{
          RegArea(area){
            //渠道地址验证
            if(this.province == "" ||this.city =="" || this.county == "" || this.town == ''){
              return false
            }
            return true
          },
            //======>选中个对应 地区 名字显示
          provinceName(){
              let that = this
              if(this.province != ''){
                let name = ""
                if(this.province != "" && this.provinceList.length > 0){
                  for(let i = 0 ; i < this.provinceList.length;i++){
                    if(this.province == this.provinceList[i].districtId){
                      name = this.provinceList[i].name;
                      break
                    }
                  }
                  return name
                }
              }
              return '请选择'
          },
          cityName(){
            let that = this
            if(this.city != ''){
              let name = ""
              if(this.city != "" && this.cityList.length > 0){
                for(let i = 0 ; i < this.cityList.length;i++){
                  if(this.city == this.cityList[i].districtId){
                    name = this.cityList[i].name;
                    break
                  }
                }
                return name
              }
            }
            return '请选择'
          },
          countyName(){
            let that = this
            if(this.county != ''){
              if(this.county != "" && this.countyList.length > 0){
                for(let i = 0 ; i < this.countyList.length;i++){
                  if(this.county == this.countyList[i].districtId){
                    name = this.countyList[i].name;
                    break
                  }
                }

                return name
              }
            }
            return '请选择'
          },
          townName(){
            let that = this
            if(this.town != ''){
              let name = ""
              if(this.town != "" && this.townList.length > 0){
                for(let i = 0 ; i < this.townList.length;i++){
                  if(this.town == this.townList[i].districtId){
                    name = this.townList[i].name;
                    break
                  }
                }
                return name
              }
            }
            if(this.town == 0 && this.town != ''){
                return '全区'
            }
            return '请选择'
          },
          //处理选择的结果
          addressQuery(){
              let address = {
                  source:this.source,
                  province:this.province.toString(),
                  provinceName:this.province != '' ? this.provinceName :'',
                  city:this.city.toString(),
                  cityName:this.city != '' ? this.cityName :'',
                  county:this.county.toString(),
                  countyName:this.county != '' ? this.countyName :'',
                  town:this.town.toString() || '0',
                  townName:this.town != '' ? this.townName : ""
              }
              return address
          }
        },
        components:{
          Scroll
        }
    }
</script>

<style type='text/css' lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/css/variable.styl"
  .AddressPicker
    background white
    border-top-left-radius 0.3rem
    border-top-right-radius 0.3rem
    .header
      width 100%
      height 1rem
      line-height 1rem
      text-align center
      font-size 0.4rem
      font-weight bold
      .icon_close
        float right
        width 1rem
        height 1rem
        background url("../image/icon_close.png") no-repeat center
        background-size 0.6rem 0.6rem
    .detailList
      height 1rem
      line-height 1rem
      background #eee
      .item
        float left
        width 25%
        text-align center
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      .active
        position relative
        color $color-theme
        &::after
          position absolute
          content ""
          width 1rem
          height 2px
          background $color-theme
          left 50%
          margin-left -0.5rem
          bottom 0
          border-radius 1px
    .content
      position absolute
      overflow-y auto
      -webkit-overflow-scrolling touch
      overflow-scrolling touch
      fullScreen(2rem,0,2rem,0)
      .content_wrap
        position relative
      .contentList
        overflow hidden
        span
          width 2.8rem
          height 0.8rem
          float left
          line-height 0.8rem
          background #f5f5f5
          margin 0.2rem 0 0.2rem 0.35rem
          text-align center
          border-radius 2px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          &.active
            background $color-theme
            color white

    .sure
      position absolute
      bottom 0.8rem
      left 50%
      margin-left -1rem
      width 2rem
      height 0.8rem
      line-height 0.8rem
      background $color-theme
      text-align center
      color white
      font-size 0.3rem
      border-radius 0.5rem
      z-index 10
</style>

