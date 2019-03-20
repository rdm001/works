/**
 * Created by Administrator on 2018/5/25.
 */

const apis = {
    getSiteConfig:'/api/client/getSiteConfig',  //获取站点配置
    sendSmsCode:'/api/client/sendSmsCode',//获取短信验证码
    smsCodeLogin:'/api/client/smsCodeLogin',//验证码登录
    getCode:'/api/genVefiyImg', //获取图形验证码接口
    advertList:'/api/advertList',    // 首页专题接口
    productList:'/api/productList',  //商品列表接口
    login:'/api/client/login',       //登录接口
    cateList:'/api/cateList',    //全部分类接口
    advance:'/api/productList/advance', //筛选接口
    brandList:'/api/brandList' ,   //品牌查询接口
    findUserVoucher:'/api/client/findUserVoucher',  //余额查询
    myOrder:'/api/myOrderList',    //订单查询
    getAddress:'/api/getAddressList',  //获取地址列表
    addressDelete:'/api/addressDelete',  //删除地址
    districtList :"/api/districtList", //获省市区列表
    setDefault:'/api/address/setDefault',  //设置默认地址
    addressSave:'/api/addressSave' ,  //修改地址 或 编辑地址
    productDetail:'/api/productDetail',  //商品详情
    getDefaultAddress:'/api/getAddress',  //获取默认地址
    productStock:'/api/productStock',  //库存查询
    getFreightFare:'/api/getFreightFare',  //运费查询
    submitOrder:'/api/client/submitOrder' ,             //下单接口
    payOrder:'/api/client/payOrder' ,             //支付接口
    continuePayOrder:'/api/client/continuePayOrder' ,             //支付接口
    orderDetail:'/api/myOrderDetail',              //订单详情·
    //orderAuditStatus:'/api/act/findHistoryActInstanceList' ,             //订单详情审核状态
    logistics:"/api/orderTrackDetail",  //查看物流信息
    isCancel:"/api/isCancel",  //查看订单是否可撤销
    orderCancel:"/api/orderNormalCancel",  //撤销订单
    orderConfirm:"/api/orderConfirm",  //确认订单
    virtualCode:'/api/orderDetailAccCash', //虚拟商品查询券码
    findVoucherList:"/api/client/findVoucherList",  //电子券查询
    bindVoucherAcc:'/api/client/bindVoucherAcc',  // 兑换电子券
    findPackList:'/api/client/findPackList',     //礼包列表查询
    bindPacksAcc:'/api/client/bindPacksAcc',    //绑定礼包
    getPacksInfo:'/api/client/getPacksInfo',   //获取礼包信息
    findPacksProductList:'/api/client/findPacksProductList',  //获取礼包商品列表
    submitPacksOrder:'/api/client/submitPacksOrder',   //礼包商品预占库存
    payPacksOrder:'/api/client/payPacksOrder',     //礼包商品支付
    productSaleNum:'/api/productSaleNum' , //销量查询接口
    spell:'/api/client/submitOrder',     //发起砍价
    spellDetail:'/api/client/act/cut/view',  //砍价订单详情
    mySpell:'/api/client/act/cut/list',  //我的砍价列表
    helperCut:'/api/client/cut',  //帮砍
    checkProductLimit:'/api/checkSkillLimit',  //限购商品查询
    myGroupBuyList:'/api/client/act/group/list',  //我的拼团列表
    groupBuyDetail:'/api/client/act/group/view',  //拼团订单详情
    joinGroup:'/api/client/joinGroup',  //拼团订单详情
}
export default apis
