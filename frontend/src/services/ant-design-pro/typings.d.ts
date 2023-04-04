declare module Login {
  export interface User {
    uid: number;
    partner_id: 27381;
    ho_ten: string;
    ma_dinh_danh: string;
    email: string;
    gioi_tinh: string;
    vai_tro: string;
  }

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
    _id: string;
    username: string;
    systemRole: string;
    profile: {
      _id: string;
      firstname: string;
      lastname: string;
      dateOfBirth: string;
    };
    odooProfile?: {
      _id?: string;
      maDinhDanh: string;
      userId: number;
      partnerId: number;
    };
  }

  export interface Record {
    user: User;
    accessTokens: { vai_tro: string; token: string }[];
  }
}
