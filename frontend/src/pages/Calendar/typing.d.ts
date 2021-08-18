export declare module IrecordSuKien {
  export interface Info {
    id: number;
    ten_buoi_hoc: string;
    ma_mon_hoc: string;
    ten_mon_hoc: string;
    is_zoom_meeting: boolean;
    loai_hinh: string;
    tiet_bat_dau: number;
    tiet_ket_thuc: number;
    ma_buoi_hoc: boolean;
    so_thu_tu_buoi_hoc: number;
    lop_tin_chi_id: any[];
  }

  export interface RootObject {
    loaiSuKien: string;
    thoiGianDienRa: Date;
    thoiGianBatDau: Date;
    thoiGianKetThuc: Date;
    diaDiem: string;
    thu: number;
    info: Info;
  }
}
