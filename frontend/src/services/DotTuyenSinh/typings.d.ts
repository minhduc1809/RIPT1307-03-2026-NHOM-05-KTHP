import type { EDonViTinh, ELoaiDot, EToHopXetTuyen } from '@/utils/constants';
import type { KetQuaXetTuyen } from '../KetQuaXetTuyen/typings';

declare module DotTuyenSinh {
  export interface GiayTo {
    index: number;
    ten: string;
    tieuDe: string;
    soLuong: number;
    ghiChu: string;
    soLuongNop: string;
    ghiChuNop: string;
    urlGiayToNop: string[];
    soLuongTiepNhan: number;
    ghiChuTiepNhan: string;
    maGiayTo: string;
    thoiGianNop: string;
    required: boolean;
    textHuongDan: string;
    urlHuongDan: string[];
    urlGiayTo: string[];
  }
  export interface NganhTuyenSinh {
    index: number;
    danhSachCoSoDaoTao: CoSoDaoTao.Record[];
    danhSachToHop: string[];
    _id: string;
    nganh: NganhChuyenNganh.Record;
  }

  export interface DoiTuongTuyenSinh {
    index: number;
    cauHinhDoiTuong?: CauHinhDoiTuong;
    _id: string;
    maDoiTuong: string;
    thongTinDoiTuong: DoiTuongTuyenSinh.Record;
    yeuCauLuaChonToHop: boolean;
    phuongThucTuyenSinh: string;
    hienThiDiemQuyDoi: boolean;
  }

  export interface CauHinhDoiTuong {
    cauHinh: any;
    danhSach: any;
  }

  export interface Record {
    mucLePhi: number;
    donViTinh: EDonViTinh;
    yeuCauTraPhi: boolean;
    maLePhi: string;
    soLuongNguyenVongToiDa: number;
    gioiHanDoiTuong: boolean;
    suDungToHopMongMuon: boolean;
    danhSachToHopLuaChon: EToHopXetTuyen[];
    choPhepDangKyKhacCoSo: boolean;
    _id: string;
    namTuyenSinh: number;
    danhSachPhuongThucTuyenSinh: PhuongThucTuyenSinh.Record[];
    dotTuyenSinh: number;
    tenDotTuyenSinh: string;
    thongTinGiayToNopHoSo: GiayTo[];
    thongTinGiayToNopOnline: GiayTo[];
    danhSachGiayToXacNhanNhapHoc: GiayTo[];
    danhSachThongTinKhaiXacNhan: KetQuaXetTuyen.ThongTinKhaiXacNhan[];
    moTa: string;
    maDotTuyenSinh: number;
    thoiGianMoDangKy: string;
    thoiGianKetThucNopHoSo: string;
    thoiGianBatDauKhaiBaoKetQuaThiTHPT: string;
    thoiGianKetThucKhaiBaoKetQuaThiTHPT: string;
    thoiGianCongBoKetQua: string;
    thoiGianBatDauXacNhanNhapHoc: string;
    thoiGianKetThucXacNhanNhapHoc: string;
    maThanhToanDot: string;
    hinhThucDaoTao: HinhThucDaoTao.Record;
    cauHinhPhuongThuc: any;
    soLuongDangKy: number;
    danhSachDoiTuongTuyenSinh: DoiTuongTuyenSinh[];
    danhSachNganhTuyenSinh: NganhTuyenSinh[];
    choPhepHK1HoacCaNamLop12: boolean;
    loaiDot: ELoaiDot;
    thongBaoLoaiDot?: string;
    urlRedirectLoaiDot?: string;
  }
}
