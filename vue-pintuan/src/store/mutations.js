/**
 * Created by Administrator on 2018/5/25.
 */
export const set_siteId = (state,siteId) => state.siteId = siteId
export const set_siteConfig = (state,siteConfig) => state.siteConfig = siteConfig
export const set_unit = (state,unit) => state.unit = unit
export const set_token = (state,token) => state.token = token
export const set_user = (state,user) => state.user = user
export const set_availablePoints = (state,availablePoints) => state.availablePoints = availablePoints
export const set_editAddress = (state,editAddress) => state.editAddress = editAddress
export const set_shopCarProduct = (state,shopCarProduct) => {
              state.shopCarProduct = shopCarProduct
              localStorage.setItem('jf-shopCarProduct-' + state.user.id,JSON.stringify(shopCarProduct))
          }
export const set_confirmOrder = (state,confirmOrder) => state.confirmOrder = confirmOrder
export const set_authUrl = (state,authUrl) => state.authUrl = authUrl
export const set_AuthConfig = (state,AuthConfig) => state.AuthConfig = AuthConfig
export const set_payWay = (state,payWay) => state.payWay = payWay
export const set_isApp = (state,isApp) => state.isApp = isApp
export const set_spellInfo = (state,{source,showAddress,product}) => {
  source ?  state.spellInfo.source = source : ''
  typeof showAddress == 'boolean'  ?  state.spellInfo.showAddress = showAddress : ''
  product ? state.spellInfo.product = product :''
}
