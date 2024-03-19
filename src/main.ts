import '@fe/extend';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import theme from '@/utils/theme';
import router from './router';
import { useGlobalStore } from '@/store/globalStore';
import App from './App.vue';
import Layout from '@/components/Layout.vue';
import useComponents from '@/utils/useComponents';

// 设置主题
theme.setTheme();
const app = createApp(App);
// 组件注册
useComponents(app);
// 注册路由 store
app.use(router);
app.use(createPinia());
// 注册layout
app.component('layout', Layout);

// 挂载
app.mount('#app');
