declare module BieuMau {
  export interface CauHoi {
    loai: string;
    batBuoc: boolean;
    noiDungCauHoi: string;
    cauTraLoiKhac: boolean;
    luaChon: {
      noiDung: string;
      _id: string;
    }[];
    luaChonCot: {
      noiDung: string;
      _id: string;
    }[];
    luaChonHang: {
      noiDung: string;
      _id: string;
    }[];
    gioiHanDuoiTuyenTinh: number;
    gioiHanTrenTuyenTinh: number;
    _id: string;
  }

  export interface Khoi {
    tieuDe: string;
    moTa: string;
    danhSachCauHoi: CauHoi[];
  }

  export interface Record {
    hinhThucDaoTaoId?: number;
    isTatCaHe?: boolean;
    danhSachLopTinChi: string[];
    danhSachLopHanhChinh: string[];
    danhSachNguoiDung: string[];
    danhSachKhoaHoc: string[];
    danhSachNganhHoc: string[];
    loaiDoiTuongSuDung: string[];
    coCamKet: boolean;
    noiDungCamKet: string;
    thoiGian?: string[];
    danhSachVaiTro: string[];
    loai: string;
    tieuDe: string;
    moTa: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    kichHoat: boolean;
    danhSachKhoi: Khoi[];
    doiTuong: string;
    _id: string;
  }

  export interface ThongKeLuaChon {
    noiDungLuaChon: string;
    idLuaChon: string;
    soLuong: number;
  }

  export interface ThongKeCot {
    idCot: string;
    noiDungCot: string;
    soLuong: number;
  }
  export interface ThongKeLuaChonGrid {
    noiDungHang: string;
    idHang: string;
    thongKeCot: ThongKeCot[];
  }

  export interface ThongKeLuaChonNumeric {
    giaTriTuyenTinh: number;
    soLuong: number;
  }

  export interface ThongKeCauHoi {
    _id: string;
    noiDungCauHoi: string;
    loai: string;
    soLuongTraLoi: number;
    ketQua: ThongKeLuaChon[] | ThongKeLuaChonGrid[] | ThongKeLuaChonNumeric[];
  }
  export interface ThongKeKhoi {
    _id: string;
    tieuDe: string;
    moTa: string;
    thongKeCauHoi: ThongKeCauHoi[];
  }

  export interface ThongKe {
    _id: string;
    tieuDe: string;
    moTa: string;
    loai: string;
    thongKeKhoi: ThongKeKhoi[];
  }
}
