import { AxiosRequestConfig } from 'axios';
import { ElLoading } from 'element-plus';

interface GlobalLoading {
  count: number;
  instance: any;
  timer: any;
  show: (config?: AxiosRequestConfig) => void;
  hide: (config?: AxiosRequestConfig) => void;
}
// 用于网络请求的全屏loading
const loading: GlobalLoading = {
  count: 0,
  instance: null,
  timer: null,
  show: function(config?: AxiosRequestConfig) {
    let showLoading = config && config.showLoading;
    if (typeof showLoading !== 'boolean') showLoading = true;
    // showLoading默认为true 不想添加loading请设置为false
    if (showLoading === true) {
      this.timer && clearTimeout(this.timer);
      this.count++;
      if (!this.instance) {
        this.instance = ElLoading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0.1)' });
      }
    }
  },
  hide: function(config?: AxiosRequestConfig) {
    let showLoading = config && config.showLoading;
    if (typeof showLoading !== 'boolean') showLoading = true;

    if (showLoading === true) {
      if (this.count > 0) this.count--;
      // 当count减为0 关闭loading
      if (this.count === 0) {
        this.timer = setTimeout(() => {
          // 间隔300毫秒内的loading合并
          if (this.instance && this.count === 0) {
            this.instance.close();
            this.instance = null;
          }
        }, 300);
      }
    }
  }
};
export default loading;
