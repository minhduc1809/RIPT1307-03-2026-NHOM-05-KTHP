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
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: './TrangChu',
      icon: 'HomeOutlined',
    },
    {
      path: '/baivietchung',
      name: 'BaiVietChung',
      component: './BaiVietChung',
      icon: 'EditOutlined',
      access: 'admin',
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
      access: 'adminVaQuanTri',
      routes: [
        {
          name: 'ChuDeChung',
          icon: 'smile',
          path: './chudechung',
          component: './DanhMuc/ChuDe',
          access: 'adminVaQuanTri',
        },
      ],
    },
    {
      name: 'TinTuc',
      icon: 'FileProtectOutlined',
      path: '/quantritintuc',
      component: './DanhMuc/TinTuc',
      access: 'adminVaQuanTri',
    },
    {
      name: 'KhaoSat',
      icon: 'form',
      path: '/quanlykhaosat',
      component: './BieuMau/KhaoSat',
      access: 'adminVaQuanTri',
    },
    // {
    //   name: 'BieuMau',
    //   icon: 'fileDone',
    //   path: '/bieumau',
    //   access: 'admin',
    //   routes: [

    //   ],
    // },

    {
      name: 'GocHocTap',
      icon: 'EditOutlined',
      path: '/gochoctap',
      access: 'sinhVien',
      component: './LopTinChi/GocHocTap',
    },

    {
      name: 'PhanHoi',
      icon: 'QuestionOutlined',
      path: '/phanhoi',
      component: './PhanHoi',
    },

    {
      name: 'Calendar',
      icon: 'CalendarOutlined',
      path: '/calendar',
      component: './Calendar',
      access: 'sinhVienVaNhanVien',
    },
    {
      name: 'VanBanHuongDanUser',
      icon: 'FileText',
      path: '/vanbanhuongdanuser',
      access: 'sinhVienVaNhanVien',
      component: './VanBanHuongDan',
    },
    {
      name: 'News',
      icon: 'NotificationOutlined',
      path: '/quan-ly-tin-tuc',
      component: './QuanLyTinTuc',
      access: 'sinhVienVaNhanVien',
    },
    {
      name: 'VanBanHuongDan',
      icon: 'FileText',
      path: '/vanbanhuongdan',
      access: 'adminVaQuanTri',
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
      access: 'sinhVienVaNhanVien',
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
      access: 'nhanVien',
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
      access: 'sinhVienVaNhanVien',
    },
    {
      name: 'KhaiBaoSucKhoe',
      icon: 'HeartOutlined',
      path: '/khaibaosuckhoeuser',
      component: './KhaiBaoSucKhoe/User',
      access: 'sinhVienVaNhanVien',
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

    {
      name: 'CoCauToChuc',
      icon: 'ApartmentOutlined',
      path: '/cocautochuc',
      component: './CoCauToChuc',
      access: 'admin',
    },

    {
      name: 'DichVuMotCuaSinhVien',
      icon: 'AuditOutlined',
      path: '/dichvumotcuasv',
      routes: [
        {
          name: 'TaoDon',
          path: './taodon/dvmc',
          component: './DichVuMotCuaV2/SinhVien/GuiDon',
          access: 'sinhVien',
        },
        {
          // name: 'DichVuMotCuaSinhVien',
          hideInMenu: true,
          // icon: 'team',
          access: 'sinhVien',
          path: '/dichvumotcuasv/taodon/dvmc/:id',
          component: './DichVuMotCuaV2/SinhVien/GuiDon/$id',
        },
        {
          name: 'LichSu',
          path: './lichsu/dvmc',
          component: './DichVuMotCuaV2/SinhVien/LichSu',
          access: 'sinhVien',
        },
      ],
      access: 'sinhVien',
    },

    {
      name: 'VanPhongSoNhanVien',
      icon: 'PaperClipOutlined',
      path: '/vanphongsonhanvien',
      routes: [
        {
          name: 'TaoDon',
          path: './taodon/vps',
          component: './DichVuMotCuaV2/SinhVien/GuiDon',
          access: 'nhanVien',
        },
        {
          // name: 'DichVuMotCuaSinhVien',
          hideInMenu: true,
          // icon: 'team',
          access: 'nhanVien',
          path: '/vanphongsonhanvien/taodon/vps/:id',
          component: './DichVuMotCuaV2/SinhVien/GuiDon/$id',
        },
        {
          name: 'LichSu',
          path: './lichsu/vps',
          component: './DichVuMotCuaV2/SinhVien/LichSu',
          access: 'nhanVien',
        },
        {
          name: 'QuanLyDon',
          path: './quanlydondieuphoi/vps',
          access: 'routeFilter',
          maChucNang: 'don-dvmc-thao-tac:read-all',
          component: './DichVuMotCuaV2/QuanLyDon',
        },
        {
          name: 'QuanLyDon',
          path: './quanlydonchuyenvien/vps',
          access: 'routeFilter',
          maChucNang: 'don-dvmc-thao-tac:read-my',
          component: './DichVuMotCuaV2/QuanLyDon',
        },
      ],
      access: 'nhanVien',
    },

    {
      name: 'DichVuMotCuaAdmin',
      icon: 'AuditOutlined',
      path: '/dichvumotcuav2',
      routes: [
        {
          name: 'QuanLyBieuMau',
          path: './quanlybieumau/dvmc',
          component: './DichVuMotCuaV2/QuanLyBieuMau',
          access: 'adminVaQuanTri',
        },
        {
          name: 'QuanLyDon',
          path: './quanlydonadmin/dvmc',
          component: './DichVuMotCuaV2/QuanLyDon/admin',
          access: 'adminVaQuanTri',
        },
      ],
      access: 'adminVaQuanTri',
    },
    {
      name: 'VanPhongSoAdmin',
      icon: 'PaperClipOutlined',
      path: '/vanphongso',
      routes: [
        {
          name: 'QuanLyLichTuan',
          icon: 'calendar',
          path: './lich-tuan',
          access: 'adminVaQuanTri',
          component: './VanPhongSo/QuanLyLichTuan',
        },
        {
          name: 'QuanLyBieuMau',
          path: './quanlybieumau/vps',
          component: './DichVuMotCuaV2/QuanLyBieuMau',
          access: 'adminVaQuanTri',
        },
        {
          name: 'QuanLyDon',
          path: './quanlydonadmin/vps',
          component: './DichVuMotCuaV2/QuanLyDon/admin',
          access: 'adminVaQuanTri',
        },
      ],
      access: 'adminVaQuanTri',
    },
    {
      name: 'DichVuMotCuaCanBo',
      icon: 'AuditOutlined',
      path: './dichvumotcuacanbo',
      routes: [
        {
          name: 'QuanLyDon',
          path: './quanlydondieuphoi/dvmc',
          access: 'routeFilter',
          maChucNang: 'don-dvmc-thao-tac:read-all',
          component: './DichVuMotCuaV2/QuanLyDon',
        },
        {
          name: 'QuanLyDon',
          path: './quanlydonchuyenvien/dvmc',
          access: 'routeFilter',
          maChucNang: 'don-dvmc-thao-tac:read-my',
          component: './DichVuMotCuaV2/QuanLyDon',
        },
      ],
      access: 'nhanVien',
    },

    {
      name: 'ThongBao',
      icon: 'notification',
      path: '/thongbao',
      component: './ThongBao',
      access: 'adminVaQuanTri',
    },
    {
      name: 'QuanLyTaiKhoan',
      icon: 'UserOutlined',
      path: '/quanlytaikhoan',
      component: './QuanLyTaiKhoan',
      access: 'admin',
    },
    {
      name: 'ToChucCanBo',
      icon: 'SolutionOutlined',
      path: '/tochuccanbo',
      component: './ToChucCanBo',
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
      access: 'sinhVienVaNhanVien',
      path: '/loptinchi/:id',
      component: './LopTinChi/$id',
    },
    {
      hideInMenu: true,
      icon: 'team',
      exact: true,
      access: 'nhanVien',
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
  // mfsu: {},
  webpack5: {},
  exportStatic: {},
});
