declare module IRecordTinTuc {
  export interface Result {
    id: number;
    mo_ta: string;
    noi_dung: string;
    ngay_dang: string;
    nguoi_dang: string;
    avatar_path: string;
  }

  export interface Data {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Result[];
  }

  export interface RootObject {
    data?: Data;
    statusCode?: number;
  }
}
