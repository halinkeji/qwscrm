import MainLayout from 'layouts/MainLayout.vue'
import BlankLayout from 'layouts/BlankLayout.vue'
const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/',
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('pages/Index.vue'),
        meta: { title: '控制台', icon: 'home', affix: true, noCache: true,auth:true }
      }
    ]
  },{
    path: '/system',
    component: MainLayout,
    name: 'system',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '企微管理', icon: 'lab la-weixin' },
    children: [
      {
        path: 'Setting',
        name: 'SystemSet',
        component: () => import('pages/system/Setting.vue'),
        meta: { title: '基础配置', icon: 'las la-cog' }
      },
      {
        path: 'worker',
        name: 'SystemWorker',
        component: () => import('pages/system/Worker.vue'),
        meta: { title: '通讯录', icon: 'las la-id-card-alt', caption: '' }
      },
      {
        path: 'department',
        name: 'SystemWorkerDepartment',
        component: () => import('pages/system/Department.vue'),
        meta: { title: '部门管理', icon: 'las la-sitemap' }
      },
      {
        path: 'tag',
        name: 'SystemWorkerTag',
        component: () => import('pages/system/Tag.vue'),
        meta: { title: '企业员工标签', icon: 'las la-tags'}
      },
      {
        path: 'analysis',
        name: 'SystemWorkerAnalysis',
        component: () => import('pages/system/Analysis.vue'),
        meta: { title: '工作分析统计', icon: 'las la-chart-pie' }
      }
    ]
  },{
    path: '/contact',
    component: MainLayout,
    name: 'contact',
    alwaysShow: true,
    redirect: 'noredirect',
    meta: { title: '客户管理', icon: 'las la-id-card' },
    children: [
      {
        path: '/contact',
        name: 'Contact',
        component: () => import('pages/contact/Index.vue'),
        meta: { title: '客户列表', icon: 'las la-id-card' }
      },
      {
        path: '/contact/delfollowuser',
        name: 'DelFollowUser',
        component: () => import('pages/contact/DelFollowUser.vue'),
        meta: { title: '流失客户', icon: 'las la-user-slash' }
      },
      {
        path: '/contact/tag',
        // component: BlankLayout,
        name: 'ContactTag',
        meta: { title: '客户标签', icon: 'las la-user-tag'},
        component: () => import('pages/contact/tag/Index.vue'),
        // children: [
        //   {
        //     path: 'type',
        //     name: 'ContactTagType',
        //     component: () => import('pages/contact/tag/Type.vue'),
        //     meta: { title: '二级', icon: 'las la-project-diagram' }
        //   }, {
        //     path: 'list',
        //     name: 'ContactTagList',
        //     component: () => import('pages/contact/tag/Index.vue'),
        //     meta: { title: '二级', icon: 'las la-list-alt' }
        //   }
        // ]
      }
    ]
  },{
    path: '/groupchat',
    component: MainLayout,
    name: 'GroupChat',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '客户群运营', icon: 'las la-users' },
    children: [
      {
        path: '/contact/groupchat',
        name: 'GroupChat',
        component: () => import('pages/contact/groupchat/Index.vue'),
        meta: { title: '群管理', icon: 'las la-user-shield' }
      },
      // {
      //   path: '/contact/delfollowuser',
      //   name: 'DelFollowUser',
      //   component: () => import('pages/contact/DelFollowUser.vue'),
      //   meta: { title: '自动拉群', icon: 'las la-user-friends' }
      // },
      {
        path: '/contact/groupchat/type',
        name: 'GroupChatType',
        component: () => import('pages/contact/groupchat/Type.vue'),
        meta: { title: '群分组标签', icon: 'las la-tag' }
      },
      {
        path: '/contact/groupchat/analysis',
        name: 'GroupChatAnalysis',
        component: () => import('pages '),
        meta: { title: '群分析统计', icon: 'las la-chart-area' }
      },
    ]
  },
  // {
  //   path: '/chattool',
  //   component: MainLayout,
  //   name: 'chattool',
  //   redirect: 'noredirect',
  //   alwaysShow: true,
  //   meta: { title: '聊天侧边栏', icon: 'las la-comment-dots' },
  //   children: [
  //     {
  //       path: 'Setting',
  //       name: 'chatSet',
  //       component: () => import('pages/chattool/Setting.vue'),
  //       meta: { title: '基础配置', icon: 'las la-cog' }
        
  //     }
  //   ]
  // },
  // {
  //   path: '/flow',
  //   component: MainLayout,
  //   name: 'flow',
  //   redirect: 'noredirect',
  //   alwaysShow: true,
  //   meta: { title: '引流获客', icon: 'lab la-stack-overflow' },
  //   children: [
      
  //   ]
  // },
  {
    path: '/plugins',
    component: MainLayout,
    name: 'plugins',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '应用中心', icon: 'lab la-windows' },
    children: [
      {
        path: '/plugins/media',
        name: 'pluginsMedia',
        component: BlankLayout,
        meta: { title: '素材管理', icon: 'las la-photo-video' },
        children: [
          {
            path: 'type',
            name: 'MediaType',
            meta: { title: '素材分类', icon: 'las la-project-diagram' },
            component: () => import('pages/plugins/media/Type.vue'),
          },
          {
            path: 'list',
            name: 'MediaList',
            component: () => import('pages/plugins/media/Index.vue'),
            meta: { title: '素材列表' , icon: 'las la-list-alt' }
          }
        ]
      }
    ]
  }, {
    path: 'https://www.halin.net',
    component: MainLayout,
    meta: { title: '哈林官网', icon: 'las la-home' }
  },
  {
    path: 'https://wiki.halin.net',
    component: MainLayout,
    meta: { title: '帮助手册', icon: 'las la-question-circle' }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: MainLayout,
    hidden: true,
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  }
]

export default routes
