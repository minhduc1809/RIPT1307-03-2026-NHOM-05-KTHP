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
      layout: false,
      path: '/kichhoattaikhoan',
      component: './KichHoatTaiKhoan',
      hideInMenu: true,
      access: 'thiSinhChuaKichHoat',
    },
    {
      layout: false,
      path: '/verifycccd',
      component: './VerifyCCCD',
      hideInMenu: true,
      access: 'thiSinhChuaKichHoat',
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
    // {
    //   name: 'KhaoSatTrucTuyen',
    //   path: '/khaosattructuyen',
    //   icon: 'CheckSquareOutlined',
    //   component: './HoSoThiSinh/KhaoSatTrucTuyen',
    //   access: 'thiSinh',
    // },
    {
      name: 'NhapHoc',
      path: '/nhaphoc',
      icon: 'BankOutlined',
      component: './HoSoThiSinh/NhapHoc',
      access: 'thiSinh',
    },
    {
      name: 'ThanhToan',
      icon: 'TransactionOutlined',
      path: '/congnothisinh',
      access: 'thiSinh',
      component: './CongNo/CongNoSinhVien',
    },
    {
      name: 'KhaoSat',
      path: '/khaosattructuyen',
      icon: 'FileTextOutlined',
      component: './HoSoThiSinh/KhaoSatTrucTuyen',
      access: 'thiSinh',
    },

    {
      name: 'QuanTriXetTuyen',
      path: '/quantrixettuyen',
      icon: 'FormOutlined',
      access: 'adminVaQuanTriVien',
      routes: [
        {
          name: 'DotTuyenSinh',
          path: './dottuyensinh',
          component: './DotTuyenSinh',
          access: 'routeFilter',
          maChucNang: 'dot-tuyen-sinh:read-all',
        },
        {
          name: 'TiepNhanHoSoXetTuyen',
          path: './tiepnhanhoso',
          access: 'adminVaQuanTriVien',
          routes: [
            {
              name: 'TatCaHoSo',
              path: './tatcahoso',
              component: './TiepNhanHoSo/TatCa.tsx',
              access: 'routeFilter',
              maChucNang: 'tat-ca-ho-so-xet-tuyen:read-all',
            },
            {
              name: 'HoSoChuaKhoa',
              path: './hosochuakhoa',
              component: './TiepNhanHoSo/ChuaKhoa.tsx',
              access: 'routeFilter',
              maChucNang: 'ho-so-xet-tuyen-chua-khoa:read-all',
            },
            {
              name: 'HoSoDaKhoa',
              path: './hosodakhoa',
              component: './TiepNhanHoSo/DaKhoa.tsx',
              access: 'routeFilter',
              maChucNang: 'ho-so-xet-tuyen-da-khoa:read-all',
            },
            {
              name: 'HoSoDaTiepNhan',
              path: './hosodatiepnhan',
              component: './TiepNhanHoSo/DaTiepNhan.tsx',
              access: 'routeFilter',
              maChucNang: 'ho-so-xet-tuyen-da-tiep-nhan:read-all',
            },
            {
              name: 'HoSoKhongTiepNhan',
              path: './hosokhongtiepnhan',
              component: './TiepNhanHoSo/KhongTiepNhan.tsx',
              access: 'routeFilter',
              maChucNang: 'ho-so-xet-tuyen-khong-tiep-nhan:read-all',
            },
          ],
        },
        {
          name: 'ChiTieuVaGiaLap',
          path: './chitieuvagialap',
          // access: 'admin',
          routes: [
            {
              name: 'ChiTieuXetTuyen',
              path: './chitieuxettuyen',
              access: 'routeFilter',
              component: './ChiTieu',
              maChucNang: 'chi-tieu:read-all',
            },
            {
              name: 'DanhSachTrungTuyen',
              path: './danhSachTrungTuyen',
              component: './KetQuaXetTuyen',
              access: 'routeFilter',
              maChucNang: 'danh-sach-trung-tuyen:read-all',
            },
          ],
        },
      ],
    },

    {
      name: 'QuanTriNhapHoc',
      path: '/quantrinhaphoc',
      icon: 'BankOutlined',
      // access: 'admin',
      routes: [
        {
          name: 'DotNhapHoc',
          path: './dotnhaphoc',
          access: 'routeFilter',
          maChucNang: 'dot-nhap-hoc:read-all',
          component: './DotNhapHoc',
        },
        {
          name: 'TiepNhanHoSoNhapHoc',
          path: './tiepnhanhosonhaphoc',
          // access: 'routeFilter',

          routes: [
            {
              name: 'DanhSachChuaXacNhanNhapHoc',
              path: './danhsachchuaxacnhannhaphoc',
              access: 'routeFilter',
              maChucNang: 'ho-so-nhap-hoc-chua-xac-nhan:read-all',
              component: './TiepNhanHoSoNhapHoc/ChuaXacNhanNhapHoc',
            },
            {
              name: 'DanhSachDaXacNhanNhapHoc',
              path: './danhsachdaxacnhannhaphoc',
              access: 'routeFilter',
              maChucNang: 'ho-so-nhap-hoc-da-xac-nhan:read-all',
              component: './TiepNhanHoSoNhapHoc/DaXacNhanNhapHoc',
            },
            {
              name: 'DanhSachHoanThienHoSoNhapHoc',
              path: './danhsachdahoanthienhosonhaphoc',
              access: 'routeFilter',
              maChucNang: 'ho-so-nhap-hoc-da-hoan-thien:read-all',
              component: './TiepNhanHoSoNhapHoc/DaKhoaHoSoNhapHoc',
            },
            {
              name: 'DanhSachDuDieuKienNhapHoc',
              path: './danhsachdudieukiennhaphoc',
              access: 'routeFilter',
              maChucNang: 'ho-so-nhap-hoc-du-dieu-kien:read-all',
              component: './TiepNhanHoSoNhapHoc/DaTiepNhanHoSoNhapHoc',
            },
          ],
        },
      ],
    },
    {
      name: 'QuanTriThanhToan',
      path: '/quantrithanhtoan',
      icon: 'DollarOutlined',
      // access: 'admin',
      routes: [
        {
          name: 'LoaiLePhi',
          path: './loailephi',
          access: 'routeFilter',
          maChucNang: 'loai-le-phi:read-all',
          component: './Payment/Product',
        },
        {
          name: 'ThongTinCongNo',
          path: './thongtincongno',
          access: 'routeFilter',
          maChucNang: 'thong-tin-cong-no:read-all',
          component: './CongNo/CongNoAdmin.tsx',
        },
      ],
    },
    {
      name: 'TuongTac',
      path: '/tuongtac',
      // access: 'admin',
      icon: 'AppstoreAddOutlined',
      routes: [
        {
          path: './baivietchung',
          name: 'BaiVietChung',
          component: './BaiVietChung',
          icon: 'EditOutlined',
          access: 'admin',
        },
        {
          name: 'Email',
          path: './sendemail',
          component: './SendEmail/index.tsx',
          access: 'routeFilter',
          maChucNang: 'email:read-all',
        },
        {
          name: 'BieuMau',
          path: './quanlybieumau',
          component: './QuanLyBieuMau',
          access: 'routeFilter',
          maChucNang: 'khao-sat:read-all',
        },
        {
          name: 'ThongBao',
          path: './quanlythongbao',
          component: './QuanLyThongBao',
          access: 'routeFilter',
          maChucNang: 'thong-bao:read-all',
        },
        {
          name: 'HuongDanSuDung',
          path: './huongdansudung',
          access: 'routeFilter',
          maChucNang: 'huong-dan-su-dung:read-all',
          component: './HuongDanSuDung',
        },
      ],
    },
    {
      name: 'ThongKeBaoCao',
      path: '/thongkebaocao',
      icon: 'PieChartOutlined',
      routes: [
        {
          name: 'TuyenSinh',
          path: './tuyensinh',
          access: 'routeFilter',
          maChucNang: 'thong-ke-xet-tuyen:read-all',
          component: './Dashboard',
        },
        {
          name: 'NhapHoc',
          path: './nhaphoc',
          access: 'routeFilter',
          maChucNang: 'thong-ke-nhap-hoc:read-all',
        },
      ],
    },
    {
      name: 'QuanTriTaiKhoan',
      path: './quantritaikhoan',
      icon: 'TeamOutlined',
      routes: [
        {
          name: 'TaiKhoanThiSinh',
          path: './taikhoanthisinh',
          component: './QuanLyTaiKhoan/TaiKhoanThiSinh',
          access: 'routeFilter',
          maChucNang: 'tai-khoan-thi-sinh:read-all',
        },
        {
          name: 'TaiKhoanChuyenVien',
          path: './taikhoanchuyenvien',
          component: './QuanLyTaiKhoan/TaiKhoanChuyenVien',
          access: 'routeFilter',
          maChucNang: 'tai-khoan-quan-tri-vien:read-all',
        },
      ],
    },
    {
      name: 'CauHinhHeThong',
      path: './cauhinhhethong',
      access: 'admin',
      icon: 'SettingOutlined',
      routes: [
        {
          name: 'QuanLyNamTuyenSinh',
          path: './quanlynamtuyensinh',
          component: './NamTuyenSinh',
          access: 'admin',
        },
        {
          name: 'QuanLyPhuongThucXetTuyen',
          path: './quanlyphuongthucxettuyen',
          component: './PhuongThucTuyenSinh',
          access: 'admin',
        },

        {
          name: 'QuanLyCoSoDaoTao',
          path: './quanlycosodaotao',
          component: './CoSoDaoTao',
          access: 'admin',
        },
        {
          name: 'QuanLyNganhChuyenNganh',
          path: './quanlynganhchuyennganh',
          component: './NganhChuyenNganh',
          access: 'admin',
        },
        {
          name: 'QuanLyDoiTuongTuyenSinh',
          path: './quanlydoituongtuyensinh',
          component: './DoiTuongTuyenSinh',
          access: 'admin',
        },
        {
          name: 'HinhThucDaoTao',
          path: './hinhthucdaotao',
          component: './HinhThucDaoTao',
          access: 'admin',
        },

        {
          name: 'PhanQuyen',
          icon: 'DeploymentUnitOutlined',
          path: './phanquyen',
          access: 'admin',
          routes: [
            {
              name: 'NhomVaiTro',
              path: './nhomvaitro',
              access: 'admin',
              component: './PhanQuyen/NhomVaiTro',
            },
            {
              name: 'ChucNang',
              path: './phanchucnang',
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
