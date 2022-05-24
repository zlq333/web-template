import { Router } from 'vue-router';
import projectConfig from '@/config/config';
import { clearLocalStorage, getPermission as getPermissionFun } from '@/utils/utils';
import { useGlobalStore } from '@/store/globalStore';

// 按住ctrl打开新标签页
export const withCtrlJump = (router: Router) => {
  router.beforeEach((to, from) => {
    if (window.event && ((window.event as any).ctrlKey || (window.event as any).metaKey)) {
      let routeUrl = router.resolve(to);
      window.open(routeUrl.href, '_blank');
      return false;
    } else {
      return true;
    }
  });
};

// 路由钩子 判断登录状态
export const checkLoginState = (router: Router) => {
  router.beforeEach((to, from) => {
    let checkToken = to.meta && to.meta.checkToken;
    if (typeof checkToken !== 'boolean') checkToken = true;
    if (checkToken) {
      const token = localStorage.getItem(projectConfig.tokenKey);
      if (!token) {
        clearLocalStorage();
        return '/login';
      }
    }
    return true;
  });
};

// 路由钩子 获取权限
export const getPermission = async (router: Router) => {
  router.beforeEach(async (to, from) => {
    let checkToken = to.meta && to.meta.checkToken;
    if (typeof checkToken !== 'boolean') checkToken = true;
    const globalStore = useGlobalStore();
    if (checkToken && !globalStore.isAcquiredPermission) {
      // 获取权限
      let res = await getPermissionFun({ isCheck: false });
      if (res.status !== 0) {
        // 若接口调用失败  返回有path就跳转 否则中断导航
        return res.path || false;
      }
    }
    return true;
  });
};

// 路由钩子 判断页面访问权限
export const checkPermission = (router: Router) => {
  router.beforeEach((to, from) => {
    if (projectConfig.checkPermission && to.meta.permission) {
      const permissionList: string[] = useGlobalStore().permission || [];
      if (!permissionList.includes(to.meta.permission as string)) {
        return { path: '/error/403', replace: true };
      }
    }
    return true;
  });
};

// 路由钩子 设置侧栏选中菜单
export const setSideActive = (router: Router) => {
  router.beforeEach((to, from) => {
    if (to.meta.active) {
      const globalStore = useGlobalStore();
      globalStore.setSideActive(to.meta.active as string);
    }
    return true;
  });
};

// 路由钩子 判断页面是否需要缓存
export const setKeepAlive = (router: Router) => {
  router.beforeEach((to, from) => {
    if (projectConfig.keepAlive) {
      if (to.meta.keepAlive && to.meta.keepAlive === true) {
        const globalStore = useGlobalStore();
        const keepAliveRouter = globalStore.keepAliveRouter || [];
        const keepAliveName = to.meta.keepAliveName || to.name;
        const idx = keepAliveRouter.findIndex((name: string) => name === keepAliveName);
        if (idx === -1) {
          globalStore.addKeepAlive(keepAliveName as string);
        }
      }
    }
    return true;
  });
};

// 路由钩子 设置页面title
export const setTitle = (router: Router) => {
  router.beforeEach((to, from) => {
    let title = to.meta && (to.meta.title as string);
    title = projectConfig.systemName + (title ? '-' + title : '');
    document.title = title;
    return true;
  });
};

// 路由钩子 新增tab
export const addTab = (router: Router) => {
  router.beforeEach((to, from) => {
    // path为/ 或者去error的路由不添加tab 不设置侧栏选中
    if (to.name && to.name !== 'Error' && to.name !== 'Login' && to.name !== 'Refresh') {
      const globalStore = useGlobalStore();
      globalStore.addTab(to);
      globalStore.setTabActive(to.name as string);
    }
    return true;
  });
};
