declare module PhanQuyen {
  export interface NhomVaiTro {
    danhSachChucNang: string[];
    _id: string;
    macDinh: boolean;
    vaiTro: string;
  }

  export interface ChucNang {
    _id: string;
    loai: string;
    ten: string;
    vaiTro: string;
  }
}
