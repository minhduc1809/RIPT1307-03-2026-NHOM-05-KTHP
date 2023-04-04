declare module VanBanQuyDinh {
  export interface IRecord {
    _id: string;
    ma: string;
    ten: string;
    hinhThuc?: HinhThucDaoTao.IRecord;
  }
}
