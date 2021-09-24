export declare module LopTinChi {
  export interface Record {
    id: number;
    ky_nam_hoc_id: [number, string];
    ma_hoc_phan: string;
    ma_lop: string;
    mon_hoc_ids: [number, string];
  }

  export interface GiangVienRecord {
    id: number;
    TenDayDu: string;
    lop_tin_chi_ids: number[];
    so_cmnd: boolean;
    anhDaiDien: string;
    soDienThoai: string;
  }

  export interface SinhVienRecord {
    ma_sv: string;
    id: number;
    TenDayDu: string;
    anhDaiDien: string;
    soDienThoai: string;
  }

  export interface ThongTinChungLopTinChiRecord {
    giangVien: GiangVienRecord;
    sinhVienList: SinhVienRecord[];
  }

  export interface InfoMonHoc {
    id: number;
    loai_hoc_phan: string;
    ma_hoc_phan_moi: string;
    so_tin_chi: number;
    ten_hoc_phan: string;
    url_danh_sach_hoc_lieu: string;
    gio_tin_chi_yeu_cau: string;
    khoa_bo_mon_phu_trach: string;
    noi_dung_chi_tiet: string;
    objective_kien_thuc: string;
    objective_ky_nang: string;
    objective_thai_do: string;
    tom_tat_noi_dung: string;
    yeu_cau_ve_csvc: string;
  }

  export interface NhomLopTinChi {
    id: number;
    ma_nhom_lop_tin_chi: string;
    so_thu_tu_nhom: number;
    ma_lop_tin_chi_id: (string | number)[];
    loai_nhom_lop: string;
    danh_sach_sinh_vien_ids: number[];
    buoi_hoc_ids: number[];
    display_name: string;
  }
}

export declare module IResThongBaoLopTinChi {
  export interface Result {
    _id?: string;
    senderId?: string;
    senderName?: string;
    title?: string;
    content?: string;
    htmlContent?: string;
    imageUrl?: string;
    idTopic?: string;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
  }

  export interface Data {
    page: number;
    offset: number;
    limit: number;
    total: number;
    result: Result[];
  }

  export interface RootObject {
    data: Data;
    statusCode: number;
  }
}
