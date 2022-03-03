declare module NamTuyenSinh {
  export interface Record {
    _id: string;
    hinhThucDaoTao: HinhThucDaoTao.Record;
    nam: number;
    urlAnhMoTa: string;
    noiDung: string;
    moTa: string;
    danhSachPhuongThuc: {
      moTaPhuongThuc: string;
      phuongThucTuyenSinh: PhuongThucTuyenSinh.Record;
    }[];
  }
}
