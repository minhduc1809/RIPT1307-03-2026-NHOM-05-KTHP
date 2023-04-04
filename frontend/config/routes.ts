export default [
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

  ///////////////////////////////////
  // DEFAULT MENU
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: './TrangChu',
    icon: 'HomeOutlined',
  },

  // DANH MUC HE THONG
  {
    name: 'DanhMuc',
    path: '/danh-muc',
    icon: 'copy',
    routes: [
      {
        name: 'VanBanQuyDinh',
        path: 'van-ban-quy-dinh',
        component: './DanhMuc/VanBanQuyDinh',
      },
      {
        name: 'ChucVu',
        path: 'chuc-vu',
        component: './DanhMuc/ChucVu',
      },
      {
        name: 'LoaiPhongBan',
        path: 'loai-phong-ban',
        component: './DanhMuc/LoaiPhongBan',
      },
      {
        name: 'DonVi',
        path: 'don-vi',
        component: './DanhMuc/DonVi',
      },
      {
        name: 'DonViViTri',
        path: 'don-vi-vi-tri',
        component: './DanhMuc/DonViViTri',
      },
    ],
  },

  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './exception/404',
  },
];
