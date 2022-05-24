import { ElLoading, ElMessage } from 'element-plus';
import { AxiosRequestConfig } from 'axios';
import { getStorage, isArray, isString, randomName, setStorage } from '@fe/utils';
import { useGlobalStore } from '@/store/globalStore';
import projectConfig from '@/config/config';
import useAxios from '@/utils/useAxios';
import api from '@/api/api';
import { unref, onMounted } from 'vue';
import router from '@/router';

/**
 * 获取菜单及权限
 * @param config {AxiosRequestConfig} axios请求配置项
 * @returns {any}
 */
export function getPermission(config?: AxiosRequestConfig): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let isCheck = config && config.isCheck;
    if (typeof isCheck !== 'boolean') isCheck = true;
    // getPermission在登录时 和 路由钩子中都会调用
    // 登录时调用 isCheck不用配置 默认为true正常请求
    // 路由钩子中调用 请配置isCheck===false需要特殊处理 返回状态 由路由钩子retur ptah重定向的方式跳转
    let res: any;
    try {
      res = await useAxios<any>({ ...config, method: 'post', url: api.getUserMenuTree, data: {} });
    } catch (error) {
      if (isCheck) {
        return reject(error);
      } else {
        console.log('get permission axios error', error);
        return resolve({ status: 1, path: '/error/500' });
      }
    }

    let menuData = [];
    let permissionList: string[] = []; // 权限集合
    function loopTree(list: MenuNode[], level: number) {
      list.forEach(item => {
        item.menuLevel = level;
        item.visible = false;
        item.menuUrl = item['menuUri'];

        item.menuUrl = item.menuUrl ? item.menuUrl : randomName();

        if (item.menuType === 1 && item.menuPermission) {
          permissionList.push(item.menuPermission);
        } else {
          if (item.children && item.children.length > 0) {
            loopTree(item.children, item.menuLevel + 1);
          }
        }
      });
    }

    if (isCheck) {
      menuData = res;
    } else {
      if (res.code === 0) {
        menuData = res.data;
      } else {
        // code不为200
        console.log('get permission axios response error', res);
        if (res.code === 403 || res.code === 401) {
          clearLocalStorage();
          ElMessage.error('登录信息失效');
          return resolve({ status: 1, path: '/login' });
        } else {
          ElMessage.error(res.message || '服务器异常');
          return resolve({ status: 1 });
        }
      }
    }

    loopTree(menuData, 1);

    const globalStore = useGlobalStore();
    globalStore.setMenuTree(menuData);
    globalStore.setPermission(permissionList);
    globalStore.setAcquired(true); // 标记用户权限 已获取
    setStorage('permission', permissionList);
    resolve({ status: 0, data: menuData });
  });
}

/**
 * 清除用户token 及其他缓存数据
 */
export function clearLocalStorage() {
  // 保留这些缓存不清除
  const retainStorage = {
    dev_host: localStorage.getItem('dev_host') || '',
    debug_server: localStorage.getItem('debug_server' || ''),
    debug_micro_apps: localStorage.getItem('debug_micro_apps') || '',
    layout: localStorage.getItem('layout') || '',
    theme: localStorage.getItem('theme') || ''
  };
  localStorage.clear();
  Object.keys(retainStorage).forEach((key: string) => {
    retainStorage[key] && localStorage.setItem(key, retainStorage[key]);
  });

  const globalStore = useGlobalStore();
  globalStore.setAcquired(false);
  globalStore.clearKeepAlive([]);
  globalStore.clearTabView([]);
}

/**
 * 获取用户信息
 * @returns {T}
 */
export function getUserInfo<T = any>(): Promise<T> {
  return new Promise(async (resolve, reject) => {
    let userData = await useAxios.get(api.getUserInfo);
    // 存储用户信息
    setStorage('userData', userData);
    resolve(userData);
  });
}

/**
 * 获取企业配置信息
 * @returns {T}
 */
export function getCompanyData<T = any>(): Promise<T> {
  return new Promise(async (resolve, reject) => {
    let companyData = await useAxios.post(api.companyLogo);
    // 存储用户信息
    setStorage('companyData', companyData);
    resolve(companyData);
  });
}

/**
 * 获取字典数据
 * @param key {string} 某个字典key 为空则返回全部字典集合
 * @param reload {boolean} 是否重新请求接口获取最新数据 默认值false
 * @returns {any}
 */

export function getDict(key: string): Promise<Dict[]>;
export function getDict(key: '', reload: boolean): Promise<DictAll>;
export function getDict(key: string, reload: boolean = false): Promise<Dict[] | DictAll> {
  return new Promise(async (resolve, reject) => {
    let _dict = getStorage('sysDict') || {};
    if (reload || !(Object.keys(_dict).length > 0)) {
      let result = await useAxios.post(api.queryDictAll);
      setStorage('sysDict', result);
      _dict = result;
    }
    resolve(key ? _dict[key] : _dict);
  });
}

/**
 * 预览图片
 * @param url 图片路径 支持字符串、字符串数组、逗号隔开的字符串、ImageViewer类型数组
 * @param title 图片预览时的title (url为object数组时 会优先展示object.title || object.name)
 * @returns
 */
export function previewImage(url: string | string[] | ImageViewer[], title?: string) {
  if (!url || (isArray(url) && url.length === 0)) {
    ElMessage.error('暂无图片');
    return;
  }

  let files = [];
  if (isArray(url)) {
    files = (url as Array<any>).map(el => {
      if (isString(el)) {
        return { url: el, title };
      } else {
        return { url: el.url, title: el.title || el.name || title };
      }
    });
  } else {
    files = (url as string).split(',').map(el => {
      return { url: el, title };
    });
  }
  useGlobalStore().showViewer({ data: files });
}

// 刷新路由的方法
export function refreshRouter(reload?: boolean) {
  const globalStore = useGlobalStore();
  globalStore.editLayout('enableAnimation', false); // 刷新的时候禁用路由动画
  globalStore.setRefreshRouter(unref(router.currentRoute));
  const path = reload ? '/refresh/reload' : '/refresh';
  router.replace(path);
}

/**
 * @param fn 需要执行的函数
 * @param wait 等待时间
 * @returns 节流函数
 */
export function throttle(fn: { apply: (arg0: any, arg1: any[]) => void }, wait: number) {
  let flag = true;
  const interval = wait || 500;
  return function(this: any, ...args: any) {
    if (flag) {
      fn.apply(this, args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, interval);
    }
  };
}
/**
 * @param fn 需要执行的函数
 * @param wait 等待时间
 * @returns 防抖函数
 */
export function debounce(fn: { apply: (arg0: any, arg1: any) => void }, wait: number) {
  let timeId: any = null;
  const delay = wait || 500;
  return function(this: any, ...args: any) {
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      timeId = null;
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * @param dom dom选择器
 * @returns dom元素
 */
export const useDom = async (dom: string) => {
  const globalStore = useGlobalStore();
  await new Promise((resolve: any) => {
    const waitAnimate = () => {
      if (!globalStore.animateShow) {
        console.log('done');
        resolve();
        return;
      }
      requestAnimationFrame(waitAnimate);
    };
    waitAnimate();
  });
  return document.querySelector(dom);
};

/**
 * @param cb 生命周期函数
 */
export function onAnimateEnd(cb: Function) {
  onMounted(async () => {
    await new Promise((resolve: any) => {
      const waitAnimate = () => {
        if (!window.animateState) {
          console.log('done');
          cb();
          resolve();
          return;
        }
        requestAnimationFrame(waitAnimate);
      };
      waitAnimate();
    });
  });
}
