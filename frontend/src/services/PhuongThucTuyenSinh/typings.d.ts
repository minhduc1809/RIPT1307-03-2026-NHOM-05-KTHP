declare module PhuongThucTuyenSinh {
  export interface Record {
    _id: string;
    tenPhuongThuc: string;
    maPhuongThuc: string;
    hinhThucDaoTao: HinhThucDaoTao.Record;
  }
}
