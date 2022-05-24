import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router';

import * as routerHook from '@/router/routerHook';

import routerPublic from '@/router/routerPublic';
import index from '@/router/index';

const routes: Array<RouteRecordRaw> = [...index, ...routerPublic];
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 路由钩子 按住ctrl打开新标签页
routerHook.withCtrlJump(router);
// 路由钩子 判断登录状态
routerHook.checkLoginState(router);
// 路由钩子 获取用户权限
routerHook.getPermission(router);
// 路由钩子 校验页面访问权限
routerHook.checkPermission(router);
// 路由钩子 设置菜单选中
routerHook.setSideActive(router);
// 路由钩子 设置页面缓存
routerHook.setKeepAlive(router);
// 路由钩子 设置页面title
routerHook.setTitle(router);
// 路由钩子 新增tab
routerHook.addTab(router);

export default router;
