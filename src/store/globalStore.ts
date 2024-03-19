import { nextTick } from 'vue';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

import { defineStore } from 'pinia';
import layout from './layout';

interface GlobalState {
  isAcquiredPermission: boolean; // 是否已获取用户身份权限
  layoutVisible: boolean; // 显示全局配置弹窗
  layout: Layout; // 全局布局配置
  noticeData: any[]; // 消息数据
  menuTree: MenuNode[]; // 导航菜单树结构
  reloadMenu: boolean; // 是否需要重载菜单
  permission: string[]; // 用户权限
  navActive: string; // 一级导航选中项
  sideActive: string; // 二级导航选中项
  tabList: any[]; // 标签页数据
  tabActive: string; // 选中的标签页
  breadcrumb: Breadcrumb[]; // 面包屑导航
  viewerData: any[]; // 图片查看数据源
  keepAliveRouter: any[]; // 缓存的组件
  singleApps: string[]; // 当前已加载的微应用
  refreshRouter: any; // 记录刷新路由来源地址
  animateShow: boolean; // 全局动画显示
}

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useGlobalStore = defineStore('global', {
  // 状态
  state: () => {
    return {
      animateShow: false,
      isAcquiredPermission: false,
      keepAliveRouter: [],
      layoutVisible: false,
      layout: layout,
      noticeData: [],
      menuTree: [],
      reloadMenu: false,
      permission: [],
      navActive: '',
      sideActive: '',
      tabList: [],
      tabActive: '',
      breadcrumb: [],
      viewerData: [],
      singleApps: [],
      refreshRouter: null
    } as GlobalState;
  },
  // 修改状态方法
  actions: {
    // 设置动画是否显示
    setAnimateShow(data: boolean) {
      this.animateShow = data;
    },
    // 设置权限是是否已获取
    setAcquired(data: boolean) {
      this.isAcquiredPermission = data;
    },
    // add keepAlive
    addKeepAlive(routerName: string) {
      this.keepAliveRouter.push(routerName);
    },
    // remove keepAlive
    removeKeepAlive(routerName: string) {
      const idx = this.keepAliveRouter.findIndex((val: string) => val === routerName);
      if (idx !== -1) {
        this.keepAliveRouter.splice(idx, 1);
      }
    },
    // clear keepAlive
    clearKeepAlive(data: any[]) {
      this.keepAliveRouter = data;
    },
    // 弹出全局设置
    showLayout() {
      this.layoutVisible = true;
    },
    // 隐藏全局设置
    hideLayout() {
      this.layoutVisible = false;
    },
    // 设置全局配置
    setLayout(data: Layout) {
      this.layout = data;
    },
    // 修改全局配置
    editLayout(key: keyof Layout, value: any) {
      this.layout[key as string] = value;
    },
    // 设置一级导航选中项
    setNavActive(data: string) {
      this.navActive = data;
    },
    // 设置二级导航选中项
    setSideActive(data: string) {
      this.sideActive = data;
    },
    // 设置权限数据
    setPermission(data: string[]) {
      this.permission = data;
    },
    // 设置导航菜单数据
    setMenuTree(data: MenuNode[]) {
      this.menuTree = data;
    },
    // 设置重载菜单
    setReloadMenu(data: boolean) {
      this.reloadMenu = data;
    },
    // 设置消息数据
    setNoticeData(data: any[]) {
      this.noticeData = data;
    },
    // 添加标签页
    addTab(data: any) {
      let idx = this.tabList.findIndex((item: any) => item.name === data.name);
      if (idx === -1) {
        if (data.meta && data.meta.onetab) {
          idx = this.tabList.findIndex((item: any) => item.meta.onetab === data.meta.onetab);
          if (idx === -1) {
            this.tabList.push(data);
          } else {
            this.tabList.splice(idx, 1, data);
          }
        } else {
          // 超过20个tab  删除第一个
          if (this.tabList.length >= 20) {
            this.tabList.splice(0, 1);
          }
          this.tabList.push(data);
        }
      } else {
        this.tabList.splice(idx, 1, data);
      }
    },
    // 移除标签页
    removeTab(data: string) {
      const idx = this.tabList.findIndex((item: any) => item.name === data);
      if (idx !== -1) {
        this.tabList.splice(idx, 1);
      }
    },
    // 设置标签页选中
    setTabActive(data: string) {
      this.tabActive = data;
    },
    // 重置标签页
    clearTabView(data: any[]) {
      this.tabList = data;
    },
    // set viewer data
    setViewerData({ commit }: any, data: any[]) {
      if (data && Array.isArray(data)) {
        this.viewerData = data;
      }
    },
    // show viewer
    showViewer(data: any) {
      data = data || {};
      data.data = data.data || [];

      let options = data.options || {};
      options.zIndex = 3000;

      let showNavBar = false;
      if (data.data.length > 0) {
        this.viewerData = data.data;
        showNavBar = data.data.length === 1 ? false : true;
      }

      if (typeof options.navbar != 'boolean') {
        options.navbar = showNavBar;
      }

      nextTick(() => {
        const dom = document.getElementById('viewerDom');
        if (dom) {
          const viewer = new Viewer(dom, options);
          viewer.show();
          dom.addEventListener('hidden', () => {
            viewer.destroy(); // 关闭时销毁实例
          });
        }
      });
    },
    // set breadcrumb
    setBreadcrumb(data: Breadcrumb[]) {
      this.breadcrumb = data;
    },
    addSingleApps(data: string) {
      this.singleApps.push(data);
    },
    setRefreshRouter(router: any) {
      this.refreshRouter = router;
    }
  }
});
