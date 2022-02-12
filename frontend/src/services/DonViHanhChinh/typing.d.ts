export declare module IRecordTinh {
  export interface Datum {
    _id: string;
    tenDonVi: string;
    cap: number;
    ma: string;
  }

  export interface DonViHanhChinhRecord {
    maPhuongXa?: string;
    maQuanHuyen?: string;
    maTinh?: string;
    soNhaTenDuong?: string;
    tenPhuongXa?: string;
    tenQuanHuyen?: string;
    tenTinh?: string;
  }

  export interface RootObject {
    data: Datum[];
    statusCode: number;
  }
}
