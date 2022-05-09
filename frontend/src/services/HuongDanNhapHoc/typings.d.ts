import type { DotNhapHoc } from '../DotNhapHoc/typings';
import type { DotTuyenSinh } from '../DotTuyenSinh/typings';

declare module HuongDanNhapHoc {
  export interface Record {
    danhSachGiayToCanNop: DotTuyenSinh.GiayTo[];
    danhSachGiayToCanNopTheoDoiTuong: DotNhapHoc.GiayToTheoDoiTuong[];
    // danhSachLePhiCanNop: DotNhapHoc.LePhi[];
    // danhSachLePhiCanNopTheoDoiTuong: DotNhapHoc.LePhiTheoDoiTuong[];
    diaDiem: string;
    id: string;
    idDotNhapHoc: string;
    danhSachNganhChuyenNganh: NganhChuyenNganh.Record[];
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
  }
}
