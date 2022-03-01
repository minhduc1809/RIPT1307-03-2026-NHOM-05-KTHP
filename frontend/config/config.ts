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
    siderWidth: 220,
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
      access: 'thiSinh',
    },
    {
      layout: false,
      path: '/dotxettuyen',
      component: './ChonDot',
      access: 'thiSinh',
    },
    {
      path: '/hosothisinh/phuongthucxettuyen/chitiet',
      hideInMenu: true,
      layout: false,
      component: './ChonPhuongThuc/ChiTietPhuongThuc.tsx',
      access: 'thiSinh',
    },
    {
      name: 'DangKyXetTuyen',
      path: '/dangkyxettuyen',
      icon: 'FormOutlined',
      component: './HoSoThiSinh/DangKyXetTuyen',
      access: 'thiSinh',
    },
    {
      name: 'KetQuaXetTuyen',
      path: '/ketquaxettuyen',
      icon: 'CheckSquareOutlined',
      component: './HoSoThiSinh/XacNhanNhapHoc',
      access: 'thiSinh',
    },
    {
      name: 'NhapHoc',
      path: '/nhaphoc',
      icon: 'BankOutlined',
      component: './HoSoThiSinh/NhapHoc',
      access: 'thiSinh',
    },
    {
      name: 'ThanhToan',
      path: '/thanhtoan',
      icon: 'DollarOutlined',
      component: './HoSoThiSinh/ThanhToan',
      access: 'thiSinh',
    },
    {
      name: 'HuongDan',
      path: '/huongdan',
      icon: 'FileTextOutlined',
      component: './HoSoThiSinh/HuongDan',
      access: 'thiSinh',
    },

    {
      name: 'QuanTriChung',
      path: './quantrichung',
      access: 'admin',
      icon: 'SettingOutlined',
      routes: [
        {
          name: 'QuanLyTaiKhoan',
          path: './quanlytaikhoan',
        },
        {
          name: 'QuanLyNganhHoc',
          path: './quanlynganhhoc',
        },
        {
          name: 'QuanLyNamTuyenSinh',
          path: './quanlynamtuyensinh',
        },
        {
          name: 'QuanLyPhuongThucXetTuyen',
          path: './quanlyphuongthucxettuyen',
        },
        {
          name: 'ToChucTuyenSinh',
          path: './tochuctuyensinh',
          routes: [
            {
              name: 'DotTuyenSinh',
              path: './dottuyensinh',
            },
            {
              name: 'DotNhapHoc',
              path: './dotnhaphoc',
            },
          ],
        },
        {
          name: 'QuanLyKinhPhiChung',
          path: './quanlykinhphichung',
        },
        {
          name: 'QuanLyHoSo',
          path: './quanlyhoso',
        },
      ],
    },
    {
      name: 'QuanTriChiTiet',
      path: '/quantrichitiet',
      icon: 'FormOutlined',
      access: 'admin',
      routes: [
        {
          name: 'ThongTinChung',
          path: './thongtinchung',
        },
        {
          name: 'TiepNhanHoSoXetTuyen',
          path: './tiepnhanhoso',
          routes: [
            {
              name: 'HoSoChuaKhoa',
              path: './hosochuakhoa',
            },
            {
              name: 'HoSoDaKhoa',
              path: './hosodakhoa',
            },
            {
              name: 'HoSoDaTiepNhan',
              path: './hosodatiepnhan',
            },
            {
              name: 'HoSoKhongTiepNhan',
              path: './hosokhongtiepnhan',
            },
          ],
        },
        {
          name: 'ThucHienXetTuyen',
          path: './thuchienxettuyen',
          routes: [
            {
              name: 'ChiTieuXetTuyen',
              path: './chitieuxettuyen',
            },
            {
              name: 'KetQuaXetTuyen',
              path: './ketquaxettuyen',
            },
          ],
        },
        {
          name: 'TiepNhanHoSoNhapHoc',
          path: './tiepnhanhosonhaphoc',
          routes: [
            {
              name: 'DanhSachChuaXacNhanNhapHoc',
              path: './danhsachchuaxacnhannhaphoc',
            },
            {
              name: 'DanhSachDaXacNhanNhapHoc',
              path: './danhsachdaxacnhannhaphoc',
            },
            {
              name: 'DanhSachHoanThienHoSoNhapHoc',
              path: './danhsachdahoanthienhosonhaphoc',
            },
            {
              name: 'DanhSachDuDieuKienNhapHoc',
              path: './danhsachdudieukiennhaphoc',
            },
          ],
        },
        {
          name: 'QuanLyHDSD',
          path: './quanlyhdsd',
        },
      ],
    },
    {
      name: 'BieuMau',
      icon: 'FileDoneOutlined',
      path: '/bieumau',
      access: 'admin',
      routes: [
        {
          name: 'KhaoSat',
          path: './khaosat',
          component: './BieuMau/KhaoSat',
          access: 'admin',
          maChucNang: 'khao-sat:read',
        },
        // {
        //   name: 'KhaiBaoSucKhoe',
        //   path: './khaibaosuckhoe',
        //   component: './BieuMau/KhaiBaoSucKhoe',
        //   access: 'adminVaQuanTri',
        //   maChucNang: 'khao-sat:read',
        // },
      ],
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
