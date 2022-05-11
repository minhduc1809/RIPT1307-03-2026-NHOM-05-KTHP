import type { DotTuyenSinh } from '../DotTuyenSinh/typings';

declare module DotNhapHoc {
  export interface ThongTinDotTuyenSinh {
    idDotTuyenSinh: string;
    namTuyenSinh: number;
    dotTuyenSinh: number;
  }

  export interface LePhi {
    maLePhi: string;
    required: boolean;
    ghiChu: number;
  }

  export interface LePhiTheoDoiTuong {
    index: number;
    loaiDoiTuong: string;
    danhSachLePhiCanNop: LePhi[];
  }

  export interface GiayToTheoDoiTuong {
    index: number;
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
    hinhThucDaoTao: HinhThucDaoTao.Record;
  }
}
