declare module BieuMau {
  export interface CauHoi {
    loai: string;
    batBuoc: boolean;
    noiDungCauHoi: string;
    cauTraLoiKhac: boolean;
    luaChon: {
      noiDung: string;
    };
    luaChonCot: {
      noiDung: string;
    };
    luaChonHang: {
      noiDung: string;
    };
    gioiHanDuoiTuyenTinh: number;
    gioiHanTrenTuyenTinh: number;
  }

  export interface Khoi {
    tieuDe: string;
    moTa: string;
    danhSachCauHoi: CauHoi[];
  }

  export interface Record {
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
