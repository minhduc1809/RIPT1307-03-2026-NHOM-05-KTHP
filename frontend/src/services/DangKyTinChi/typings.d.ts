declare module DangKyTinChi {
  export interface DotDangKyNhuCau {
    id: number;
    ten_dot_dang_ky_nhu_cau: string;
    ky_hoc_id: (string | number)[];
    ngay_bat_dau_nhu_cau: string;
    ngay_ket_thuc_nhu_cau: string;
    trang_thai: string;
  }

  export interface DotDangKyTinChi {
    id: number;
    ten_dot_dang_ky: string;
    khoi_lop_ids: number[];
    ky_hoc_id: (string | number)[];
    ngay_bat_dau_tin_chi: string;
    ngay_ket_thuc_tin_chi: string;
  }

  export interface LopDaDangKy {
    maHoaLichHoc: LichHoc[];
    hocPhan: string;
    hocPhanId: number;
    idLopTinChi: number;
    soThuTuLop: number;
    soThuTuNhom: number;
    soTinChi: number;
    maHocPhan: string;
    idNhomLopTinChi: number;
  }

  export interface LopTinChi {
    tenGiangVien: string;
    soThuTuLop: number;
    soThuTuNhomLop?: number;
    idLop: number;
    idNhomLop: number | [];
    tongSoSinhVienLop: number;
    siSoLop: number;
    siSoNhomLop: number;
    soLuongNhom: number;
    maHoaLichHoc: LichHoc[];
  }

  export interface NhomLopTinChi {
    idNhomLop: number;
    soThuTuNhomLop: number;
    tongSoSinhVienNhomLop: number;
    siSoNhomLop: number;
    loaiNhom: string;
    maHoaLichHoc: string;
  }

  export interface MonHoc {
    idHocPhan: number;
    maMonHoc: string | boolean;
    soThuTuKyHoc: number;
    soTinChi: number;
    tenMonHoc: string;
    index?: number;
    hocPhi: number;
    trangThaiDangKy: string;
  }

  export interface LichHoc {
    danhSachTuan: number[];
    soTiet: string;
    thu: string;
    tietBatDau: string;
  }

  export interface NguyenVong {
    ghiChu: boolean | string;
    idHocPhan: number;
    maMonHoc: boolean | string;
    tenMonHoc: string;
    hocPhi: number;
    soTinChi: number;
  }

  export interface PhieuDangKy {
    phieuDangKy: {
      id: number;
      dot_dang_ky_id: (string | number)[];
      ky_hoc_id: (string | number)[];
      sinh_vien_id: (string | number)[];
      nv_hoc_phan_id: number[];
      tong_so_tin_chi: number;
      tong_hoc_phi: number;
      ho_va_ten: number;
      ma_sinh_vien: number;
      ten_lop_hanh_chinh: string | boolean;
      so_dien_thoai: string | boolean;
      giang_vien_id: string | boolean;
      display_name: string;
      create_uid: (string | number)[];
      create_date: string;
      write_uid: (string | number)[];
      write_date: string;
    };
    danhSachNguyenVong: NguyenVong[];
  }

  export interface ThongTinKyHoc {
    hocPhi: number;
    tinChiDangKyToiThieu: number;
    tinChiDangKyToiDa: number;
  }

  export interface DanhSachHocPhan {
    chuaHoc: MonHoc[];
    dat: MonHoc[];
    khongDat: MonHoc[];
    mien: MonHoc[];
  }
}
