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
    id: number;
    MaSV: string;
    TenDayDu: string;
    anhDaiDien: string;
    soDienThoai: string;
  }

  export interface ThongTinChungLopTinChiRecord {
    giangVien: GiangVienRecord;
    sinhVienList: SinhVienRecord[];
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
