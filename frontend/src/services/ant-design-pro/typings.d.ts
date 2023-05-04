import { type EModuleKey } from './constant';

declare module Login {
  export interface User {
    createdAt: string; //'2023-04-18T07:59:56.850Z';
    dob: string; // null;
    email: string; // 'admin@administrator.com';
    firstname: string; //null;
    fullname: string; // 'Administrator';
    gender: string; // null;
    lastname: string; // null;
    ssoId: string; // null;
    systemRole: string; // 'Admin';
    updatedAt: string; //'2023-04-18T07:59:56.850Z';
    username: string; // 'admin';
    roles?: string[];
    _id: string; // '643e4dfc013057d9f766d613';
  }

  export interface IPermission {
    scopes: string[]; //['cong-tac-sinh-vien:ho-so'];
    rsid: string; // '8f2c194a-fdfc-49e2-a3ba-a0af0325ecd4';
    rsname: EModuleKey; // 'cong-tac-sinh-vien';
  }

  export type TModule = {
    title: string;
    url: string;
    icon?: string;
  };

  export interface Profile {
    soDienThoai: string;
    ma_thanh_toan_bidv: string;
    url_huong_dan_thanh_toan: string;
    hinhThucDaoTaoId: [string, number];
    khoaNganh: [number, string];
    maDinhDanh: string;
    don_vi_id: [number, string];
    systemRole: string;
    partner_id: any;
    vai_tro: string;
    hinh_thuc_dao_tao_id: number;
    ma_dinh_danh: string;
    id: number;
    avatar_path: string;
    name: string;
    ngay_sinh: string;
    gioi_tinh: string;
    email: string;
    so_cmnd: string;
    so_dien_thoai: string;
    so_dien_thoai_thay_the: string;
    so_nha_ten_duong_hk: string;
    phuong_xa_hk: string;
    tinh_tp_hk: string;
    so_nha_ten_duong_no: string;
    phuong_xa_no: string;
    tinh_tp_no: string;
    so_nha_ten_duong_ns: string;
    phuong_xa_ns: string;
    tinh_tp_ns: string;
    so_so_bhxh: string;
    ten_goi_khac: string;
    dan_toc: string;
    ton_giao: string;
    ten_nganh: string;
    ten_don_vi: string;
    ma_nganh: string;
    lop_hanh_chinh_id: [number, string];
    gioiTinh: string;
    hoTen: string;
    idDonVi: string;
    maDonVi: string;
    maNganh: string;
    ngaySinh: string;
    tenDonVi: string;
    tenNganh: string;
    tenLopHanhChinh: string;
    maSinhVien: string;
    don_vi_goc: number;
    chuc_danh: string;
    email_to_chuc: string;
    user_id: [number, string];
  }

  export interface ProfileAdmin {
    exp: number; // 1682582215;
    iat: number; //1682495816;
    iss: string; //'https://ais.aisenote.com/keycloak/realms/vwa';
    aud: string; // 'vwa-auth';
    sub: string; // '5ff45518-a2aa-4a19-ab9e-ab7a902482da';
    typ: string; //'ID';
    session_state: string; //'973838b2-582b-4dc9-8fe2-803c04b7022e';
    sid: string; // '973838b2-582b-4dc9-8fe2-803c04b7022e';
    email_verified: boolean; // false;
    preferred_username: string; // 'admin';
    given_name: string; // '';
    family_name: string; //'';
  }

  export interface Record {
    user: User;
    accessTokens: { vai_tro: string; token: string }[];
  }
}
