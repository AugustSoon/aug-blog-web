import { IRoute } from 'umi-types';

export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/admin',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/admin',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/admin',
            redirect: '/admin/welcome',
          },
          {
            path: '/admin/welcome',
            name: '欢迎',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/admin/admins',
            name: '管理员',
            icon: 'crown',
            component: './Admin',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },

  {
    component: './404',
  },
] as IRoute[];
