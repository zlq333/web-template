declare module 'jsencrypt';
declare module 'vue3-print-nb';
declare let AMap: any;

declare module '*.json' {
  const value: any;
  export default value;
}
interface Window {
  browserType: string;
  animateState: boolean;
}

// config数据结构定义
interface Config {
  tokenKey: string;
  publicKey?: string;
  baseURL: string;
  uploadURL: string;
  checkPermission: boolean;
  keepAlive: boolean;
  systemName: string;
}

// 项目设置数据结构定义
interface Layout {
  theme: string;
  layout: 'TB' | 'LR' | 'MIX';
  style: 'is-dark' | 'is-light';
  fullScreen: boolean; // 全屏模式
  isCollapse: boolean; // 侧栏折叠
  showBreadcrumd: boolean; // 显示面包屑
  showTabs: boolean; // 显示多页签
  showRefresh: boolean; // 显示刷新按钮
  animation: 'fade-left' | 'fade-right' | 'fade-top' | 'fade-bottom' | 'zoom-enlarge' | 'zoom-narrow' | ''; // 路由切换动画
  enableAnimation: boolean; // 是否启用动画  这跟animation设为''不同
}
// 菜单数据结构定义
interface MenuNode {
  description: string;
  domainCode: string;
  menuId: number | string;
  interPermission: string;
  isDefault: number;
  isDeleted: number;
  isDisabled: number;
  isDisabledStr: string;
  menuColor: string;
  menuIcon: string;
  menuName: string;
  menuPermission: string;
  menuTarget: string;
  menuTitle: string;
  menuType: string | number;
  menuTypeStr: string;
  menuUrl: string;
  moduleCode: string;
  parentId: string;
  parentIds: string;
  rowCreateTime: string;
  rowUpdateTime: string;
  treeLevel: number;
  children?: MenuNode[];
  menuLevel: number;
  visible?: boolean;
}
interface DictAll {
  [prop: string]: Dict[];
}
interface Dict {
  createTime: string;
  dictId: string;
  id: number;
  label: string;
  remark: string;
  sort: number;
  type: string;
  typeLabel: string;
  updateTime: string;
  value: string;
}

// 面包屑数据结构定义
interface Breadcrumb {
  title: string;
  path?: string;
  name?: string;
  params?: any;
  query?: any;
}

// axios返回的data 数据结构
interface AxiosResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

// api定义
interface ApiUrl {
  [apiName: string]: string; // 任意属性
}

interface ImageViewer {
  url: string;
  title?: string;
}
interface SegmentReactive {
  [key: string]: any;
  items: SegmentItem[];
}

interface ImagePreview {
  url: string;
  title?: string;
  fit?: string;
  lazy?: boolean;
  title?: String;
}
