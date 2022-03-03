import type { Login } from '../ant-design-pro/typings';

declare module HoSoXetTuyen {
  export interface Record {
    _id: string;
    namTuyenSinh: number;
    idDotTuyenSinh: string;
    maHoSo: string;
    thongTinThiSinh: Login.Profile;
    trangThai: string;
    danhSachNguyenVong: any[];
    trangThaiThanhToan: string;
    thongTinGiayToNopHoSo: any[];
    thongTinGiayToNopOnline: any[];
    thongTinHocTapTHPT: any[];
    thongTinGiaDinh: any[];
    createdAt: string;
    updatedAt: string;
  }
}
