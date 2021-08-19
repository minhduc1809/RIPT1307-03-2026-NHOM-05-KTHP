declare module IRecordCTK {
  export interface MonHocDieuKienId {
    soTinChi?: number;
    id: number;
    ma_hoc_phan: string;
    hoc_phan_id: any[];
    hoc_ky: any;
    tinh_chat: any;
    display_name: string;
  }

  export interface Nganh {
    id: number;
    ten_chuong_trinh_khung: string;
    khoa_sinh_vien_id: number[];
    nganh_id: any[];
    chuyen_nganh_id: boolean;
    mon_hoc_dieu_kien_ids: MonHocDieuKienId[];
    display_name: string;
    create_uid: any[];
    create_date: string;
    write_uid: any[];
    write_date: string;
    __last_update: string;
  }

  export interface ChuyenNganh {
    id?: number;
    ten_chuong_trinh_khung?: string;
    khoa_sinh_vien_id?: number[];
    nganh_id?: any[];
    chuyen_nganh_id?: any[];
    mon_hoc_dieu_kien_ids?: MonHocDieuKienId[];
    display_name?: string;
    create_uid?: any[];
    create_date?: string;
    write_uid?: any[];
    write_date?: string;
    __last_update?: string;
  }

  export interface Data {
    nganh: Nganh;
    chuyenNganh: ChuyenNganh[];
  }

  export interface RootObject {
    data?: Data;
    statusCode?: number;
  }
}
