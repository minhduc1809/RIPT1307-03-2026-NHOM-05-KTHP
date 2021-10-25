declare module Login {
  export interface User {
    uid: number;
    partner_id: 27381;
    ho_ten: string;
    ma_dinh_danh: string;
    email: string;
    gioi_tinh: string;
  }

  export interface Profile {
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
  }

  export interface ProfileAdmin {
    _id: string;
    username: string;
    systemRole: string;
    profile: {
      _id: string;
      firstname: string;
      lastname: string;
      dateOfBirth: string;
    };
  }

  export interface Record {
    user: User;
    accessTokens: { vai_tro: string; token: string }[];
  }
}
