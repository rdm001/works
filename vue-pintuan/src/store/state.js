/**
 * Created by Administrator on 2018/5/25.
 */
let state = {
  siteId:0,  //站点
  unit:"",    //货币单位
  token:"",   //身份token
  user:null,  //用户信息
  siteConfig:null,  //站点相关配置
  payWay:"",      //支付方式
  availablePoints:0,   //用户余额
  editAddress:null ,    //地址编辑页面 初始化信息
  shopCarProduct:[],  //购物车商品
  confirmOrder:[],     //准备提交的订单信息
  isApp:false,
  authUrl:null,
  AuthConfig:null,
  spellInfo:{
    source:-1,
    showAddress:false,
    product:null
  },
  oneCount : ['8','11','13']  //单次活动站点Id
}

export default state
