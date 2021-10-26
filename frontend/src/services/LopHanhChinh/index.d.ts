export declare module APILopHanhChinh {
  export interface Data {
    id: number;
    ten_lop_hanh_chinh?: string;
    khoi_lop_id?: any[];
    nganh?: any[];
    chuyen_nganh?: boolean;
    canBo: Login.Profile;
    can_bo_id: (string | number)[];
    si_so?: number;
    danhSachSinhVien?: Login.Profile[];
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
    can_bo_id: number | string[];
    khoi_lop_id: number | string[];
    si_so: number;
    ten_lop_hanh_chinh: string;
    hinh_thuc_dao_tao_id: (number | string)[];
    co_so_dao_tao_moi: number | string[];
  }

  export interface RootObject {
    data?: Data;
    statusCode?: number;
  }
}
