declare module SuKien {
  export interface Record {
    tenSuKien: string;
    loaiSuKien: string;
    thoiGianDienRa: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    diaDiem: string;
    thu: number;
    info: {
      ten_hoc_phan: string;
      link_zoom_sinh_vien: string;
      link_zoom_giang_vien: string;
      dien_thoai: string;
      giang_vien_id: [number, string];
      id: number;
      id_zoom: string;
      lop_tin_chi_id: [number, string];
      mat_khau: string;
      mat_khau_1: string;
      mon_hoc_id: [number, string];
      nganh: string;
      ngay_bd: string;
      nhom_lop: number;
      nhom_lop_tin_chi_id: [number, string];
      so_tiet: number;
      so_tin_chi: number;
      tai_khoan: string;
      tiet_bd: number;
      tong_so_sinh_vien: number;
    };
  }
}
