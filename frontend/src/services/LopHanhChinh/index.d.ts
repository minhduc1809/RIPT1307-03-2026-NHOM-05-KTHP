export declare module APILopHanhChinh {
  export interface DanhSachSinhVien {
    anhDaiDien: any;
    id: number;
    TenDayDu: string;
    Phai: boolean;
    NgaySinhC: boolean;
    MaSV: string;
  }

  export interface Data {
    id?: number;
    ten_lop_hanh_chinh?: string;
    khoi_lop_id?: any[];
    nganh?: any[];
    chuyen_nganh?: boolean;
    mentor_id?: any[];
    si_so?: number;
    danhSachSinhVien?: DanhSachSinhVien[];
  }

  export interface RootObject {
    data?: Data;
    statusCode?: number;
  }
}
