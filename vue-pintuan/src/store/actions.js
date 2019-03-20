/**
 * Created by Administrator on 2018/5/25.
 */
export const set_login_info = ({commit,state},{siteConfig,token,user,payWay,unit}) => {
  token&&commit('set_token',token)
  user&&commit('set_user',user)
  siteConfig&&commit('set_siteConfig',siteConfig)
  payWay&&commit('set_payWay',payWay)
  unit&&commit('set_unit',unit)
}
