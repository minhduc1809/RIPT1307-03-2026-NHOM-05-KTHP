declare module PhanQuyen {
  export interface NhomVaiTro {
    danhSachChucNang: string[];
    _id: string;
    macDinh: boolean;
    vaiTro: string[];
  }

  export interface ChucNang {
    _id: string;
    loai: string;
    ten: string;
    vaiTro: string;
  }

  export interface PhanNhom {
    nhomVaiTroId: string;
    mucDo: string;
    idDoiTuong: string;
    tenDoiTuong: string;
  }

  export interface UserPhanNhom {
    user: Login.Profile;
    phanNhom: {
      danhSachPhanNhom: PhanNhom[];
      _id: string;
      userId: string;
      vaiTro: string;
      service: string;
    };
  }

  export interface ChucNangAccess {
    danhSachNhomVaiTroId: { _id: string; danhSachChucNang: string[] }[];
    userId: string;
    _id: string;
  }

  export interface DoiTuongPhanNhom {
    code: string;
    id: string;
    name: string;
  }
}
