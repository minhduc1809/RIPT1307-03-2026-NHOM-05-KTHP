declare module CanBo {
  export interface Record {
    id: number;
    can_bo_id: number | string[];
    TenDayDu: string;
    ma_dinh_danh: string;
    gioiTinh: boolean | string;
    vai_tro_goc: string;
    so_cmnd: string;
    email_dang_nhap: string;
    dan_toc: string;
    ton_giao: string;
    tinh_tp_no: string;
    quan_huyen_no: string;
    phuong_xa_no: string;
    so_nha_ten_duong_no: string;
    so_dien_thoai: string;
  }
}
