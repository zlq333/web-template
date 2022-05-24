const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      checkToken: false,
      layoutType: 'none'
    },
    component: () => import('@/views/index/Login.vue')
  }
];

export default routes;
