// 所有模块公用路由
const publicRouter = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/refresh/:reload?',
    name: 'Refresh',
    meta: {
      title: '刷新页面',
      checkToken: false,
      layoutType: 'none'
    },
    component: () => import('@/components/Refresh.vue')
  },
  {
    path: '/segment/example',
    name: 'SegmentExample',
    meta: {
      title: 'Segment使用示例',
      checkToken: false,
      layoutType: 'none'
    },
    component: () => import('@/components/SegmentExample.vue')
  },
  {
    path: '/error/:code',
    name: 'Error',
    meta: {
      title: 'Error',
      checkToken: false,
      layoutType: 'none'
    },
    component: () => import('@/components/RouterError.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'Error',
      params: {
        code: 404
      }
    }
  }
];
export default publicRouter;
