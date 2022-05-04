declare module DotNhapHoc {
  export interface ThongTinDotTuyenSinh {
    idDotTuyenSinh: string;
    namTuyenSinh: number;
    dotTuyenSinh: number;
  }

  export interface Record {
    _id: string;
    tenDot: string;
    moTa: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    thongTinDotTuyenSinh: ThongTinDotTuyenSinh[];
  }
}
