declare module KhaiBaoSucKhoe {
  export interface LuaChonBangRecord {
    _id?: string;
    idCot: string;
    idHang: string;
  }

  export interface TraLoiRecord {
    listLuaChon?: string[];
    listLuaChonBang?: LuaChonBangRecord[];
    traLoiText?: string;
    _id?: string;
    idCauHoi: string;
    luaChonTuyenTinh?: number;
    listUrlFile?: string[];
  }

  export interface Record {
    _id: string;
    idBieuMau: string;
    danhSachTraLoi: TraLoiRecord[];
    userId: string;
    info: {
      anToan: boolean;
    };
    vaiTro: string;
  }
}
