
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue'), meta: { auth: true }, name: 'home' },
      { path: '/track', component: () => import('pages/Track.vue'), meta: { auth: true } },
      { path: '/event', component: () => import('pages/event/Index.vue'), meta: { auth: true } },
      { path: '/contract', component: () => import('pages/contract/Index.vue'), meta: { auth: true } },
      { path: '/bill', component: () => import('pages/bill/Index.vue'), meta: { auth: true } },
      { path: '/store', component: () => import('pages/store/Index.vue'), meta: { auth: true } },
      { path: '/servicelog', component: () => import('pages/servicelog/Index.vue'), meta: { auth: true } }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/bind',
    name: 'bindUser',
    component: () => import('pages/BindUser.vue')
  },

  {
    path: '/bind-woker',
    name: 'BindWorker',
    component: () => import('pages/BindWorker.vue')
  },

  {
    path: '/bind-success',
    name: 'bindSuccess',
    component: () => import('pages/Success.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    name: 'error',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
