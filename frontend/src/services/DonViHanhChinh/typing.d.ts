declare module DonViHanhChinh {
  export interface Datum {
    _id: string;
    tenDonVi: string;
    cap: number;
    ma: string;
  }

  export interface Record {
    maTP?: string;
    tenTP?: string;
    maQH?: string;
    tenQH?: string;
    maXaPhuong?: string;
    tenXaPhuong?: string;
    diaChi?: string;
  }

  export interface RootObject {
    data: Datum[];
    statusCode: number;
  }
}
