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
    siderWidth: 190,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // enable: true,
    default: 'vi-VN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
    // baseSeparator: '_',
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
      ],
    },
    {
      layout: false,
      path: '/phuongthucxettuyen',
      component: './ChonPhuongThuc',
      access: 'sinhVien',
    },
    // {
    //   name: 'HoSoThiSinh',
    //   path: '/hosothisinh/dottuyensinh',
    //   icon: 'UserOutlined',
    //   component: './HoSoThiSinh',
    // },
    {
      path: '/hosothisinh/dottuyensinh/dot',
      hideInMenu: true,
      layout: false,
      component: './HoSoThiSinh/components/DanhSachPhuongThuc.tsx',
    },
    {
      path: '/hosothisinh/dottuyensinh/phuongthuctuyensinh',
      hideInMenu: true,
      component: './HoSoThiSinh/components/ChiTietHoSo.tsx',
    },
    {
      name: 'DangKyXetTuyen',
      path: '/dangkyxettuyen',
      icon: 'FormOutlined',
      component: './HoSoThiSinh/components/DangKyXetTuyen',
    },
    {
      name: 'KetQuaXetTuyen',
      path: '/ketquaxettuyen',
      icon: 'CheckSquareOutlined',
      component: './HoSoThiSinh/components/XacNhanNhapHoc',
    },
    {
      name: 'NhapHoc',
      path: '/nhaphoc',
      icon: 'BankOutlined',
      component: './HoSoThiSinh/components/NhapHoc',
    },
    {
      name: 'ThanhToan',
      path: '/thanhtoan',
      icon: 'DollarOutlined',
      component: './HoSoThiSinh/components/ThanhToan',
    },
    {
      name: 'HuongDan',
      path: '/huongdan',
      icon: 'FileTextOutlined',
      component: './HoSoThiSinh/components/HuongDan',
    },
    {
      path: '/',
      redirect: '/user/login',
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
