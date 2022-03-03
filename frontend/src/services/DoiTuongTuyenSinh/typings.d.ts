declare module DoiTuongTuyenSinh {
  export interface Record {
    _id: string;
    maDoiTuong: string;
    tenDoiTuong: string;
    hinhThucDaoTao: HinhThucDaoTao.Record;
    moTa: string;
  }
}
