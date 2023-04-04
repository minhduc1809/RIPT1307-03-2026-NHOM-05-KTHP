declare module OdooObject {
  export interface ICoSoDaoTao {
    id: number; // 'NUMBER';
    ten_co_so_dao_tao: string; // 'CHAR';
    ky_hieu_co_so_dao_tao: string; // 'CHAR';
    dia_chi: string; // 'CHAR';
    so_dien_thoai: string; // 'CHAR';
  }

  export interface INamHoc {
    id: number;
    ten_nam_hoc: string; // "2021-2022"
    nam_hoc: number; // 2021
  }

  export interface IHocKy {
    id: number; //'NUMBER';
    ma_ky_nam_hoc: string; //'CHAR';
    so_thu_tu_ky: string; //'CHAR';
  }

  export interface ILopTinChi {
    id: number;
    ma_lop: string;
    sinh_vien_ids: number[];
    giang_vien_ids: number[];
    so_thu_tu_lop: number;
    ky_nam_hoc_id: [number, string];
    mon_hoc_ids: [number, string];
  }

  export interface IKhoaSinhVien {
    id: number;
    so_thu_tu_khoa: number;
    ten_hien_thi: string;
  }

  export interface IKhoa {
    id: number; // 'NUMBER';
    ten_don_vi: string; // 'CHAR';
    ma_don_vi: string; // 'CHAR';
    don_vi_cap_tren_id?: [number, string]; // 'MANY2ONE';
    cap_don_vi: string; // 'SELECTION';
  }

  export interface INganh {
    id: number;
    name: [number, string];
    ten_nganh_viet_tat: string;
  }

  export interface ILopHanhChinh {
    id: number;
    ten_lop_hanh_chinh: string;
    nganh: [number, string];
    chuyen_nganh: [number, string];
  }

  export interface IChuyenNganh {
    id: number;
    name: string;
    ma_chuyen_nganh: string;
    nganh_id: [number, string];
  }

  export interface IHinhThucDaoTao {
    id: number;
    ten_hinh_thuc_dao_tao: string;
    ten_hinh_thuc_dao_tao_viet_tat: string;
    url_huong_dan_thanh_toan: string;
  }
}
