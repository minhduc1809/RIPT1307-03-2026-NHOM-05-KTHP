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

  export interface UserPhanNhom {
    user: Login.Profile;
    phanNhom: {
      danhSachNhomVaiTroId: string[];
      _id: string;
      userId: string;
    };
  }

  export interface ChucNangAccess {
    danhSachNhomVaiTroId: { _id: string; danhSachChucNang: string[] }[];
    userId: string;
    _id: string;
  }
}
