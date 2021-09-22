export declare module IRecordTinh {
  export interface Datum {
    _id: string;
    tenDonVi: string;
    cap: number;
    ma: string;
  }

  export interface RootObject {
    data: Datum[];
    statusCode: number;
  }
}
