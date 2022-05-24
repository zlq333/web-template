// 全局注册的组件
declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink'];
    RouterView: typeof import('vue-router')['RouterView'];
    Layout: import('vue').DefineComponent<{ layoutType?: string }>;
  }
}

export {};
