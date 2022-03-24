import type { EDonViTinh, EToHopXetTuyen } from '@/utils/constants';

declare module DotTuyenSinh {
  export interface GiayTo {
    index: number;
    ten: string;
    soLuong: number;
    ghiChu: string;
    soLuongNop: string;
    ghiChuNop: string;
    urlGiayToNop: string;
    soLuongTiepNhan: number;
    ghiChuTiepNhan: string;
    maGiayTo: string;
    thoiGianNop: string;
  }

  export interface NganhTuyenSinh {
    index: number;
    danhSachCoSoDaoTao: CoSoDaoTao.Record[];
    danhSachToHop: string[];
    _id: string;
    nganh: NganhChuyenNganh.Record;
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
    phuongThucTuyenSinh: PhuongThucTuyenSinh.Record;
    dotTuyenSinh: number;
    tenDotTuyenSinh: string;
    thongTinGiayToNopHoSo: GiayTo[];
    thongTinGiayToNopOnline: GiayTo[];
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
    danhSachDoiTuongTuyenSinh: {
      cauHinhDoiTuong?: CauHinhDoiTuong;
      _id: string;
      maDoiTuong: string;
      thongTinDoiTuong: DoiTuongTuyenSinh.Record;
    }[];
    danhSachNganhTuyenSinh: NganhTuyenSinh[];
  }
}
