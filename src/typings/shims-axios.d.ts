// 重新定义axios
import axios from 'axios';
declare module 'axios' {
  // 扩展AxiosRequestConfig
  export interface AxiosRequestConfig {
    isCheck?: boolean; // 是否对请求结果进行拦截判断 默认为true(当code码异常时 axios里本身会拦截 不想被拦截请传false)
    showLoading?: boolean; // 是否加载loading 默认为true
  }
}
