/**
 * Created by Administrator on 2018/5/25.
 */
import md5 from 'js-md5'
const unitls = {
  getFormData(obj) {   //参数序列化
      let formData = new FormData();
      Object.keys(obj).forEach(key => {
        formData.append(key, obj[key]);
      });
      return formData;
  },
  filterSource(source){
    if(source == 1 || source == 2 || source == 4){
      return 1
    }
    return source
  },
  tel(val){
    var isiPhone = navigator.userAgent.match(/(iPhone|iPod)/i) != null;
    if(isiPhone){
      location.href = "http://cmbiphone/call/" + val;
    }else{
      location.href = "http://cmbandroid/call/" + val;
    }
  },
  closeApp(){
    var isiPhone = navigator.userAgent.match(/(iPhone|iPod)/i) != null;
    if(isiPhone){
      location.href = "http://cmbiphone/tool";
    }else{
      location.href = "http://cmbandroid/tool";
    }
  },
  auth(AuthConfig){
    let href = window.location.href;
    let str = href.split('#')[1];
    let path =  'jump_' + str.substring(1).replace(/\?/g,'@@').replace(/&/g,'@@').replace(/@@siteId=[0-9]{1,9}/g,'').toLowerCase()
    let authCodes = md5(AuthConfig.authUrl + '?param='+ path + '&corpno='+ AuthConfig.authCorpNo + AuthConfig.authCorpKey)
    window.authUrls = AuthConfig.authUrl + '?param='+ path + '&corpno='+ AuthConfig.authCorpNo +'&auth=' + authCodes
    let authUrl = AuthConfig.authUrl + '?param='+ path + '&corpno='+ AuthConfig.authCorpNo +'&auth=' + authCodes
    return authUrl
  }
}
export default unitls
