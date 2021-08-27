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
}
