declare module TruongTHPT {
  export interface Tinh {
    _id: string;
    maTinh: string;
    tenTinhTP: string;
  }

  export interface QuanHuyen {
    tenQH: string;
    maQH: string;
  }

  export interface Record {
    _id: string;
    STT: string;
    maTinhTP: string;
    tenTinhTP: string;
    maQH: string;
    tenQH: string;
    maTruong: string;
    tenTruong: string;
    diaChiTruong: string;
    khuVuc: string;
    isDTNC: boolean;
    truongChuyen: boolean;
  }
}
