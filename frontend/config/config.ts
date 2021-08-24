// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    default: 'vi-VN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/admin/login',
      layout: false,
      hideInMenu: true,
      name: 'login',
      component: './user/Login/adminlogin',
    },
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },

        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      hideInMenu: true,
      name: 'account',
      icon: 'user',
      path: '/account',
      routes: [
        {
          name: 'center',
          icon: 'smile',
          path: '/account/center',
          component: './account/center',
        },
        {
          name: 'settings',
          icon: 'smile',
          path: '/account/settings',
          component: './account/settings',
        },
      ],
    },
    // {
    //   name: 'dva-sample',
    //   icon: 'CalendarOutlined',
    //   path: '/dva-sample',
    //   component: './DvaSample',
    // },
    {
      name: 'DanhMuc',
      icon: 'file',
      path: '/danhmuc',
      access: 'Admin',
      routes: [
        {
          name: 'ChuDeChung',
          icon: 'smile',
          path: './chudechung',
          component: './ChuDe',
        },
        {
          name: 'TinTuc',
          icon: 'smile',
          path: './tintuc',
        },
      ],
    },
    {
      name: 'Calendar',
      icon: 'CalendarOutlined',
      path: '/calendar',
      component: './Calendar',
    },
    {
      name: 'News',
      icon: 'FileDoneOutlined',
      path: '/quan-ly-tin-tuc',
      component: './QuanLyTinTuc',
    },
    {
      name: 'Structure',
      icon: 'table',
      path: '/chuongtrinhkhung',
      component: './ChuongTrinhKhung',
      access: 'sinhVien',
    },
    {
      name: 'LopTinChi',
      icon: 'team',
      path: '/loptinchi',
      component: './LopTinChi',
    },
    {
      name: 'LopHanhChinh',
      icon: 'team',
      path: '/lophanhchinh',
      component: './LopHanhChinh',
      access: 'sinhVien',
    },
    {
      hideInMenu: true,
      icon: 'team',
      exact: true,
      access: 'sinh_vien',
      path: '/loptinchi/:id',
      component: './LopTinChi/$id',
    },
    {
      path: '/',
      redirect: '/chuongtrinhkhung',
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},

  nodeModulesTransform: {
    type: 'none',
  },
  // mfsu: {},
  webpack5: {},
  exportStatic: {},
});
