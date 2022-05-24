import projectConfig from '@/config/config';
import axios, { AxiosInstance } from 'axios';
import { ElMessage } from 'element-plus';
import { clearLocalStorage } from './utils';

let instance: AxiosInstance = axios.create();

instance.defaults.timeout = 60000;
instance.defaults.headers['Content-Type'] = 'application/json';
instance.defaults.headers[projectConfig.tokenKey] = '';

// 请求发出拦截器
instance.interceptors.request.use(
  (config: any) => {
    if (!config.headers[projectConfig.tokenKey]) {
      config.headers[projectConfig.tokenKey] = localStorage.getItem(projectConfig.tokenKey) || '';
    }
    if (config.method === 'post') {
      config.data = config.data || {};
    }
    return config;
  },
  error => {
    console.log(error, 'error');
    ElMessage.error('请求参数配置错误');
    return Promise.reject('请求参数配置错误');
  }
);
// 请求响应拦截器
instance.interceptors.response.use(
  async res => {
    if (res.data) {
      if (res.data.code === 0) {
        return Promise.resolve(res.data);
      } else {
        if (res.config.isCheck === false) {
          // isCheck==false 将不会对code进行判断 返回给页面自己处理
          return Promise.resolve(res.data);
        } else {
          if (res.data.code === 403 || res.data.code === 401) {
            clearLocalStorage(); // 清除localStorage缓存信息
            ElMessage.error('登录信息失效');
            window.location.hash = '/login';
            return Promise.reject('登录信息失效');
          } else {
            ElMessage.error(res.data.message || '未知错误');
            return Promise.reject(res.data.message || '未知错误');
          }
        }
      }
    } else {
      return Promise.reject('服务器未响应数据');
    }
  },
  async error => {
    let message = '未知错误';
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '错误的请求';
          break;
        case 401:
          message = '登录信息失效';
          break;
        case 403:
          message = '请求资源无权访问';
          break;
        case 404:
          message = '请求资源不存在';
          break;
        case 500:
          message = '服务器错误';
          break;
        case 504:
          message = '网关超时';
          break;
        default:
          message = '服务器异常' + error.response.code;
          break;
      }
    } else if (error.request) {
      // 已正常发出请求 但未收到响应
      if (error.message == 'Network Error') {
        // Network Error
        message = '无法连接服务器';
      } else if (error.message.indexOf('timeout of') > -1) {
        // timeout of 1000ms exceeded
        message = '客户端请求超时';
      } else {
        message = '未收到响应';
      }
    } else {
      // 请求未发出就已报错  前端请求配置出问题
      message = '无效的请求';
    }
    console.log('error', error);

    ElMessage.error(message);
    return Promise.reject(message);
  }
);

export default instance;
