export declare module APILopHanhChinh {
  export interface DanhSachSinhVien {
    ma_sv: string;
    anhDaiDien: any;
    id: number;
    TenDayDu: string;
    Phai: boolean;
    NgaySinhC: boolean;
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

  export interface HinhThucDaoTao {
    id: number;
    ten_hinh_thuc_dao_tao: string;
    ten_hinh_thuc_dao_tao_viet_tat: string;
    thoi_gian_dao_tao: number;
    mo_ta: string;
    nganh_id: number[];
    color: number;
    display_name: string;
  }

  export interface RecordAdmin {
    id: number;
    nganh: number | string[];
    chuyen_nganh: string;
    giang_vien_id: number | string[];
    khoi_lop_id: number | string[];
    si_so: number;
    ten_lop_hanh_chinh: string;
    hinh_thuc_dao_tao_moi: number | string[];
    co_so_dao_tao_moi: number | string[];
  }

  export interface RootObject {
    data?: Data;
    statusCode?: number;
  }
}
