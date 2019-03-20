<template>
  <transition name="opacity">
    <div class="address">
      <!-- 顶部导航 -->
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="地址管理">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
        <mt-button style="font-family: inherit" @click="add"  slot="right"><span>添加新地址</span></mt-button>
      </mt-header>
      <scroll class="scroll" ref="scroll">
        <div>
          <ul class="addressTab">
         <li @click="changeSource(1)" :class="{active:source == 1}">招行专供</li>
           <!-- <li @click="changeSource(3)" :class="{active:source == 3}">苏宁</li>-->
          </ul>
          <AddressListItem @reload="_initData" v-for="item,index in addressList" :data="item" :key="index" ></AddressListItem>
          <div v-if="!addressList.length" class="load_more">无更多数据</div>
        </div>
      </scroll>
      <router-view ></router-view>
    </div>
  </transition>

</template>
<script type='text/javascript'>
    import AddressListItem from '../../common/components/AddressListItem.vue'
    import scroll from '../../common/components/scroll.vue'
    import {mapGetters,mapMutations} from 'vuex'
    import {Toast} from 'mint-ui';
    export default {
        data() {
            return {
                addressList:[],
                source: localStorage.getItem('addSource') ? localStorage.getItem('addSource') : 1
            }
        },
        created(){

            this._initData()
        },
        watch:{
          source(){
              this._initData()
          }
        },
        methods: {
            _initData(){
              this.addressList = []
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
            changeSource(source){
                  this.source = source
            },
            add(){
                this.set_editAddress(null)
                this.$router.push('/editAddress')
            },
          ...mapMutations({
            set_editAddress:"set_editAddress"
          })
        },
        computed:{
          ...mapGetters(['siteId','token'])
        },
        components:{
          AddressListItem,
          scroll
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/transition_name.styl"
  @import "../../common/css/toastIcon/iconfont.css"
  .address
    background #eee
    .topBar
      background #eee
      color #333
    .scroll
      fullScreen(40px,0,0,0)
      padding-top 1rem
      background: #f9f9f9
      .addressTab
        position absolute
        border-bottom: 1px solid #ccc;
        left 0
        top -1rem
        height 1rem
        width 100%
        line-height 1rem
        background white
        li
          float left
          width 3.5rem
          text-align center
          font-size 0.35rem
          &.active
           border-bottom 2px solid red
      .load_more
        loadMore()
</style>
