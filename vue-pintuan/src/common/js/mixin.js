/**
 * Created by Administrator on 2018/7/5.
 */
import {Toast} from 'mint-ui';
export const commonMethod = {
  data(){
    return {
      toast:null
    }
  },
  methods:{
    Toasts(msg,flag){
      if(this.toast) this.toast.close()
      if(flag){
        this.toast = Toast({message:msg,iconClass:'ToastIcon icon-success'})
      }else{
        this.toast = Toast({message:msg,iconClass:'ToastIcon icon-error'})
      }
    },
  }
}
