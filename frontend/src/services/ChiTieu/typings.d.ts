declare module ChiTieu {
  export interface ChiTieuChiTiet {
    danhSachToHopXetTuyen: string[];
    danhSachNganhChuyenNganh: NganhChuyenNganh.Record[];
    danhSachMaDoiTuong: string[];
    phanTramTroi: number;
    _id: string;
    chiTieuDiem: number;
    chiTieuSoLuong: number;
    danhSachThongTinDoiTuong: DoiTuongTuyenSinh.Record[];
  }

  export interface Record {
    _id: string;
    coSoDaoTao: CoSoDaoTao.Record;
    danhSachChiTieuChiTiet: ChiTieuChiTiet[];
    dotTuyenSinh: string;
  }

  export interface PayloadKhoiTaoChiTieu {
    idDotTuyenSinh: string;
    idCoSoDaoTao: string;
    chiTieuDiem?: number;
    chiTieuSoLuong?: number;
    phanTramTroi?: number;
    replace?: boolean;
  }
}
