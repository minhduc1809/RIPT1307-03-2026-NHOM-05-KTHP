declare module PhuongThucTuyenSinh {
  export interface Record {
    _id: string;
    tenPhuongThuc: string;
    loaiPhuongThuc: 'Xét tuyển thăng BGD' | 'Thi THPT' | 'Kết hợp';
    maPhuongThuc: string;
    hinhThucDaoTao: HinhThucDaoTao.Record;
  }
}
