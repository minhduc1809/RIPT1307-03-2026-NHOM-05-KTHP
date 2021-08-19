declare module SuKien {
  export interface Record {
    loaiSuKien: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    diaDiem: string;
    thu: number;
    info: {
      so_thu_tu_buoi_hoc: number;
      is_zoom_meeting: boolean;
      ten_buoi_hoc: string;
      loai_hinh: string;
      lop_tin_chi_id: [number, string];
    };
  }
}
