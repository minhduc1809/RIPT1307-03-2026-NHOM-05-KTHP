declare module VanBanHuongDan {
  export interface TepTin {
    index: number;
    ten: string;
    moTa: string;
    url: string;
    _id: string;
    taiLieu?: {
      fileList: any[];
    };
  }

  export interface ThuMuc {
    doiTuong: string;
    vaiTro: string[];
    ten: string;
    moTa: string;
    danhSachTep: TepTin[];
    _id: string;
  }
}
