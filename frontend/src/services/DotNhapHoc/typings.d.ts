import type { DotTuyenSinh } from '../DotTuyenSinh/typings';

declare module DotNhapHoc {
  export interface ThongTinDotTuyenSinh {
    idDotTuyenSinh: string;
    namTuyenSinh: number;
    dotTuyenSinh: number;
  }

  export interface LePhi {
    ten: string;
    maLePhi: string;
    isOptional: boolean;
    gia: number;
  }

  export interface LePhiTheoDoiTuong {
    loaiDoiTuong: string;
    danhSachLePhiCanNop: LePhi[];
  }

  export interface GiayToTheoDoiTuong {
    loaiDoiTuong: string;
    danhSachGiayToCanNop: DotTuyenSinh.GiayTo[];
  }

  export interface Record {
    _id: string;
    tenDot: string;
    moTa: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    thongTinDotTuyenSinh: ThongTinDotTuyenSinh[];
    danhSachGiayToCanNop: DotTuyenSinh.GiayTo[];
  }
}
