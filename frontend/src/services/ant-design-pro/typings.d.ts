import type { ESystemRole, EThanhPhanXuatThan } from '@/utils/constants';

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

  export interface RegisterPayload {
    email: string;
    password: string;
    hoDem: string;
    ten: string;
    ngaySinh: string;
    gioiTinh: string;
    soDienThoai: string;
  }

  export interface Profile {
    idThiSinh: string;
    diaChi: string;
    cmtCccd: string;
    ngayCapCmtCccd: string;
    noiCapCmtCccd: string;
    createdAt: string;
    email: string;
    gioiTinh: string;
    hoDem: string;
    ngaySinh: string;
    systemRole: ESystemRole;
    ten: string;
    updatedAt: string;
    username: string;
    __v: 0;
    _id: string;
    anhDaiDien: string;
    emailVerify: {
      verified: boolean;
      _id: string;
      availableAfter: number;
    };
    soDienThoai: string;
    quocTich: string;
    soTheBHYT: string;
    tonGiao: string;
    danToc: string;
    anhDaiDien: string;
    hoKhauThuongTru: DonViHanhChinh.DonViHanhChinhRecord;
    loaiNoiSinh: 'TRONG_NUOC' | 'NUOC_NGOAI';
    noiSinhTrongNuoc: DonViHanhChinh.DonViHanhChinhRecord;
    noiSinhNuocNgoai: string;
    tenNguoiLienHe: string;
    diaChiLienHe: DonViHanhChinh.DonViHanhChinhRecord;
    soDienThoaiNguoiLienHe: string;
    idCoSoDaoTao: string;
    idHinhThucDaoTao: string;
    thanhPhanXuatThan: EThanhPhanXuatThan;
    ngayVaoDoan: string;
    ngayVaoDang: string;
    facebook: string;
  }

  export interface ProfileAdmin {
    _id: string;
    username: string;
    systemRole: string;
    hoDem: string;
    ten: string;
    gioiTinh: string;
    email: string;
  }

  export interface Record {
    user: User;
    accessTokens: { vai_tro: string; token: string }[];
  }
}
