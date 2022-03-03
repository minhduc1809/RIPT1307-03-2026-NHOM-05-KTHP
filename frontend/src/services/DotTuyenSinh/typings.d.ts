declare module DotTuyenSinh {
  export interface Record {
    _id: string;
    namTuyenSinh: number;
    phuongThucTuyenSinh: string;
    dotTuyenSinh: number;
    tenDotTuyenSinh: string;
    danhSachGiayToNop: string[];
    moTa: string;
    maDotTuyenSinh: number;
    thoiGianMoDangKy: string;
    thoiGianKetThucNopHoSo: string;
    thoiGianBatDauKhaiBaoKetQuaThiTHPT: string;
    thoiGianKetThucKhaiBaoKetQuaThiTHPT: string;
    thoiGianCongBoKetQua: string;
    thoiGianBatDauXacNhanNhapHoc: string;
    thoiGianKetThucXacNhanNhapHoc: string;
    maThanhToanDot: string;
    hinhThucDaoTao: HinhThucDaoTao.Record;
    cauHinhPhuongThuc: any;
    soLuongDangKy: number;
  }
}
