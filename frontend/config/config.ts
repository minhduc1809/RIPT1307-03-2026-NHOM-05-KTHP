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
        // {
        //   name: 'settings',
        //   icon: 'smile',
        //   path: '/account/settings',
        //   component: './account/settings',
        // },
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
      icon: 'container',
      path: '/danhmuc',
      access: 'admin',
      routes: [
        {
          name: 'ChuDeChung',
          icon: 'smile',
          path: './chudechung',
          component: './DanhMuc/ChuDe',
        },
        {
          name: 'TinTuc',
          icon: 'smile',
          path: './tintuc',
          component: './DanhMuc/TinTuc',
        },
      ],
    },
    {
      name: 'BieuMau',
      icon: 'fileDone',
      path: '/bieumau',
      access: 'admin',
      routes: [
        {
          name: 'KhaoSat',
          icon: 'smile',
          path: './khaosat',
          component: './BieuMau/KhaoSat',
        },
      ],
    },
    {
      name: 'PhanHoi',
      icon: 'QuestionOutlined',
      path: '/phanhoi',
      access: 'admin',
      component: './PhanHoi',
    },

    {
      name: 'Calendar',
      icon: 'CalendarOutlined',
      path: '/calendar',
      component: './Calendar',
      access: 'sinhVienVaGiangVienVaCanBo',
    },
    {
      name: 'VanBanHuongDanUser',
      icon: 'FileText',
      path: '/vanbanhuongdanuser',
      access: 'sinhVienVaGiangVienVaCanBo',
      component: './VanBanHuongDan',
    },
    {
      name: 'News',
      icon: 'NotificationOutlined',
      path: '/quan-ly-tin-tuc',
      component: './QuanLyTinTuc',
      access: 'sinhVienVaGiangVienVaCanBo',
    },
    {
      name: 'VanBanHuongDan',
      icon: 'FileText',
      path: '/vanbanhuongdan',
      access: 'admin',
      component: './VanBanHuongDan',
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
      icon: 'SolutionOutlined',
      path: '/loptinchi',
      component: './LopTinChi',
      access: 'sinhVienVaGiangVien',
    },
    {
      name: 'LopHanhChinh',
      icon: 'TeamOutlined',
      path: '/lophanhchinh',
      component: './LopHanhChinh/SinhVien',
      access: 'sinhVien',
    },
    {
      name: 'LopHanhChinh',
      icon: 'TeamOutlined',
      path: '/lophanhchinhgiangvien',
      component: './LopHanhChinh/GiangVien',
      access: 'canBo',
    },
    {
      name: 'DangKyTinChi',
      icon: 'CheckSquareOutlined',
      path: '/dangkytinchi',
      component: './DangKyTinChi',
      access: 'sinhVien',
    },
    {
      name: 'KhaoSat',
      icon: 'FormOutlined',
      path: '/khaosat',
      component: './KhaoSatSVGV',
      access: 'sinhVienVaGiangVienVaCanBo',
    },
    {
      name: 'KhaiBaoSucKhoe',
      icon: 'HeartOutlined',
      path: '/khaibaosuckhoeuser',
      component: './KhaiBaoSucKhoe/User',
      access: 'sinhVienVaGiangVienVaCanBo',
    },
    {
      name: 'KhaiBaoSucKhoe',
      icon: 'HeartOutlined',
      path: '/khaibaosuckhoe',
      access: 'admin',
      component: './KhaiBaoSucKhoe',
    },

    {
      name: 'LopHanhChinhAdmin',
      icon: 'TeamOutlined',
      path: '/lophanhchinhadmin',
      component: './LopHanhChinh/Admin',
      access: 'admin',
    },
    // {
    //   name: 'LopTinChiAdmin',
    //   icon: 'TeamOutlined',
    //   path: '/loptinchiadmin',
    //   component: './LopTinChi/Admin',
    //   access: 'admin',
    // },

    {
      name: 'CoCauToChuc',
      icon: 'team',
      path: '/cocautochuc',
      component: './CoCauToChuc',
      access: 'admin',
    },
    // {
    //   name: 'DichVuMotCuaSinhVien',
    //   icon: 'BankOutlined',
    //   path: '/dichvumotcuasv',
    //   routes: [
    //     {
    //       name: 'CTCTSV',
    //       path: './ctctsv',
    //       component: './DichVuMotCua/SinhVien',
    //       access: 'sinhVien',
    //     },
    //   ],
    //   access: 'sinhVien',
    // },

    {
      name: 'DichVuMotCuaSinhVien',
      icon: 'Smile',
      path: '/dichvumotcuasv',
      routes: [
        {
          name: 'TaoDon',
          path: './taodon',
          component: './DichVuMotCuaV2/SinhVien/GuiDon',
          access: 'sinhVien',
        },
        {
          name: 'LichSu',
          path: './lichsu',
          component: './DichVuMotCuaV2/SinhVien/LichSu',
          access: 'sinhVien',
        },
      ],
      access: 'sinhVien',
    },

    {
      name: 'DichVuMotCuaAdmin',
      icon: 'HeartOutlined',
      path: '/dichvumotcuav2',
      routes: [
        {
          name: 'QuanLyBieuMau',
          path: './quanlybieumau',
          component: './DichVuMotCuaV2/QuanLyBieuMau',
          access: 'admin',
        },
      ],
      access: 'admin',
    },
    {
      name: 'DichVuMotCuaCanBo',
      icon: 'AuditOutlined',
      path: './dichvumotcuacanbo',
      routes: [
        {
          name: 'QuanLyDon',
          path: './quanlydondieuphoi',
          // access: 'canBo',
          access: 'routeFilter',
          maChucNang: 'don-dvmc-thao-tac:read-all',
          component: './DichVuMotCuaV2/QuanLyDon',
        },
        {
          name: 'QuanLyDon',
          path: './quanlydonchuyenvien',
          access: 'canBo',
          // access: 'routeFilter',
          maChucNang: 'don-dvmc-thao-tac:read-all',
          component: './DichVuMotCuaV2/QuanLyDon',
        },
      ],

      access: 'canBo',
    },
    {
      name: 'ThongBao',
      icon: 'notification',
      path: '/thongbao',
      component: './ThongBao',
      access: 'admin',
    },
    {
      name: 'PhanQuyen',
      icon: 'DeploymentUnitOutlined',
      path: '/phanquyen',
      access: 'admin',
      routes: [
        {
          name: 'ChucNangNhomVaiTro',
          path: './chucnangvanhomvaitro',
          access: 'admin',
          component: './PhanQuyen',
        },
        {
          name: 'PhanNhom',
          path: './phannhom',
          access: 'admin',
          component: './PhanQuyen/UserQLDT',
        },
      ],
    },
    {
      hideInMenu: true,
      icon: 'team',
      exact: true,
      access: 'sinhVienVaGiangVien',
      path: '/loptinchi/:id',
      component: './LopTinChi/$id',
    },
    {
      hideInMenu: true,
      icon: 'team',
      exact: true,
      access: 'canBo',
      path: '/lophanhchinhgiangvien/:id',
      component: './LopHanhChinh/GiangVien/$id',
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
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
