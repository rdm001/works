<template>
    <div class="myTicket">
      <mt-header :fixed="true" class="topBar" style="font-size: 0.4rem" title="我的电子券">
        <div @click="$router.go(-1)" slot="left">
          <mt-button icon="back"></mt-button>
        </div>
      </mt-header>
      <div class="exchange">
        <input class="input" type="text" v-model="ticket" placeholder="请输入兑换券号">
        <div class="submit" @click="_submit">绑定</div>
      </div>

      <ul class="ticketStatus">
        <li v-for="(item,index) in status" :key="index" :class='{active:item.key == selected}' @click="changeSelect(item.key)">{{item.text}}</li>
      </ul>
      <Scroll class="ticketListScroll" :listenScroll="true" :probeType="3" ref="ticketScroll"  @scroll="ScrollGetNewData">
        <div>
          <ticketListItem v-for="(item,index) in lists" :key="index" :data="item"></ticketListItem>
          <div class="loadMore">{{lastPage?'无更多数据' : '正在加载'}}</div>
        </div>
      </Scroll>
    </div>
</template>
<script type='text/javascript'>
  import  Scroll from '../../common/components/scroll.vue'
  import  ticketListItem from '../../common/components/TicketListItem.vue'
  import {mapGetters} from 'vuex'
  const GET_NEWDATA_Y = 200;
  import {commonMethod} from '../../common/js/mixin.js'
    export default {
        data() {
            return {
                status:[
                  {key:0,text:'未使用'},
                  {key:1,text:'已兑换'},
                  {key:-1,text:'已过期'}
                ],
                ticket:"",
                selected:0,
                page:0,
                lists:[],
                httpFlag:true,
                lastPage:false,
                submitFlag:true
            }
        },
        mixins:[commonMethod],
        created(){
            this._initData()
        },
        watch:{
          selected(){
              this._initData()
          },
          lists(){
              this.$nextTick(() => {
                this.$refs.ticketScroll.refresh()
              })
          }
        },
        methods: {
            _initData(){
                this.page = 0;
                this.lastPage = false
                this.lists = []
                if(!this.httpFlag) return  //同步请求
                this.httpFlag = false
                //=========>初始化数据
                this.$http.post(
                    this.$api.findVoucherList,
                    this.query
                ).then(({data}) => {
                  this.httpFlag = true
                    if(data.success){
                       this.lists = data.obj.page.rows
                       this.page++;
                       if(data.obj.page.rows.length < 10){
                           this.lastPage = true  //当前数据为最后一页
                       }
                    }else{
                      this.Toasts(data.msg,false)
                    }
                }).catch(e => this.httpFlag = true)
            },
            _submit(){
                if(this.ticket == ""){
                  this.Toasts('卡券不能为空',false)
                  return
                }
                if(!this.submitFlag) return
                this.submitFlag = true
                this.$http.post(
                    this.$api.bindVoucherAcc,
                    this.$until.getFormData({
                        siteId:this.siteId,
                        token:this.token,
                        account:this.ticket
                    })
                ).then(({data}) => {
                  this.submitFlag = true
                    if(data.success){
                      this.ticket = ""
                      this.Toasts(data.msg,true)
                        if(this.selected === 0){
                            this._initData() //如果选项卡选中未使用 刷新list
                        }
                    }else{
                      this.Toasts(data.msg,false)
                    }
                }).catch(e => {
                  this.submitFlag = true
                })
            },

            ScrollGetNewData(pos,maxY){
              if(pos && pos.y < maxY + GET_NEWDATA_Y){
                this.getNewData()
              }
            },
            getNewData(){
              //如果 请求返回 或 已加载全部
              if(!this.httpFlag||this.lastPage) return
              this.httpFlag = false
              //=========>初始化数据
              this.$http.post(
                this.$api.findVoucherList,
                this.query
              ).then(({data}) => {
                this.httpFlag = true
                if(data.success){
                  let oldList = this.lists
                  this.lists = oldList.concat(data.obj.page.rows)
                  this.page++;
                  if(data.obj.page.rows.length < 10){
                    this.lastPage = true  //当前数据为最后一页
                  }
                }
              }).catch(e => this.httpFlag = true)
            },
            changeSelect(key){
                if(!this.httpFlag) return
                this.selected = key
            }
        },
        computed:{
          query(){
              let query = {
                token:this.token,
                status:this.selected,
                siteId:this.siteId,
                pageNo:this.page
              };
              return this.$until.getFormData(query)
          },
          ...mapGetters(['siteId','token'])
        },
        components:{
          Scroll,
          ticketListItem
        }
    }
</script>
<style lang='stylus' rel="stylesheet/stylus" type='text/css'>
  @import "../../common/css/variable.styl"
  @import "../../common/css/toastIcon/iconfont.css"
.myTicket
  fullScreen(50px,0,0,0)
  .exchange
    height 1.2rem
    background white
    .input
      float left
      width 70%
      height 100%
      box-sizing border-box
      padding 0 0.5rem
    .submit
      width 30%
      height 100%
      float left
      background $color-theme
      text-align center
      line-height 1.2rem
      font-size 0.4rem
      color white
  .ticketStatus
    position relative
    z-index 10
    margin-top 0.3rem
    height 1.2rem
    width 100%
    background white
    box-shadow 0 0 3px #ccc
    li
      position relative
      height 1.2rem
      float left
      width 33.3%
      text-align center
      line-height 1.2rem
      font-size 0.3rem
      &:last-child
        float right
      &.active
       color $color-theme
      &.active::after
        content ''
        position absolute
        left 0
        bottom 0
        width 100%
        border 1px solid $color-theme

  .ticketListScroll
    overflow hidden
    fullScreen(2.7rem,0,0,0)
  .loadMore
    loadMore()
</style>
