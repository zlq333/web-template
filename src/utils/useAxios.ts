import { AxiosRequestConfig } from 'axios';
import axios from './axios';
import Loading from '@/utils/loading';

/**
 * useAxios 是对axios做的一层包装 直接返回页面代码需要使用的数据结构 不需要手动解析
 * 请求的拦截在axios.ts文件里判断 该文件不做任何逻辑判断
 * config.showLoading  表示是否加载loading 默认为true
 * 当config.isCheck为false。 const res = useAxios.get<TableRow>(); res类型为TableRow
 * 当config.isCheck为true时。const res = useAxios.get<AxiosResponseData<TableRow>>(); res包含code、data、message等 让页面自己处理此次响应
 *
 */

export function useAxios<T = any>(config: AxiosRequestConfig): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      Loading.show(config);
      const res = await axios.request<T, AxiosResponseData<T>>(config);
      Loading.hide(config);
      let isCheck = config && config.isCheck;
      if (typeof isCheck !== 'boolean') isCheck = true;
      resolve((isCheck ? res.data : res) as T);
    } catch (error) {
      Loading.hide(config);
      reject(error);
    }
  });
}
useAxios.get = function <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      Loading.show(config);
      const res = await axios.get<T, AxiosResponseData<T>>(url, config);
      Loading.hide(config);
      let isCheck = config && config.isCheck;
      if (typeof isCheck !== 'boolean') isCheck = true;
      resolve((isCheck ? res.data : res) as T);
    } catch (error) {
      Loading.hide(config);
      reject(error);
    }
  });
};
useAxios.post = function <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      Loading.show(config);
      const res = await axios.post<T, AxiosResponseData<T>>(url, data, config);
      Loading.hide(config);
      let isCheck = config && config.isCheck;
      if (typeof isCheck !== 'boolean') isCheck = true;
      resolve((isCheck ? res.data : res) as T);
    } catch (error) {
      Loading.hide(config);
      reject(error);
    }
  });
};
useAxios.delete = function <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      Loading.show(config);
      const res = await axios.delete<T, AxiosResponseData<T>>(url, config);
      Loading.hide(config);
      let isCheck = config && config.isCheck;
      if (typeof isCheck !== 'boolean') isCheck = true;
      resolve((isCheck ? res.data : res) as T);
    } catch (error) {
      Loading.hide(config);
      reject(error);
    }
  });
};
useAxios.put = function <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      Loading.show(config);
      const res = await axios.put<T, AxiosResponseData<T>>(url, config);
      Loading.hide(config);
      let isCheck = config && config.isCheck;
      if (typeof isCheck !== 'boolean') isCheck = true;
      resolve((isCheck ? res.data : res) as T);
    } catch (error) {
      Loading.hide(config);
      reject(error);
    }
  });
};
export default useAxios;
