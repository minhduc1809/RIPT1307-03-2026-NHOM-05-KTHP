declare module DichVuMotCuaV2 {
  export interface DataSource {
    choice: string;
    relatedElement: CauHinhBieuMau[];
  }

  export interface CauHinhBieuMau {
    dataSource: CauHinhBieuMau[];
    isRequired: boolean;
    _id: string;
    label: string;
    type: string;
    min: number;
    max: number;
    fileType: string[];
    note: string;
    value: any;
    level: number;
    relatedElement: CauHinhBieuMau[];
  }

  export interface ThaoTacQuyTrinh {
    _id: string;
    idDonVi: string;
  }

  export interface BuocQuyTrinh {
    _id: string;
    ten: string;
    danhSachThaoTac: ThaoTacQuyTrinh[];
  }

  export interface QuyTrinh {
    _id: string;
    danhSachBuoc: BuocQuyTrinh[];
  }

  export interface BieuMau {
    _id: string;
    ten: string;
    ghiChu: string;
    cauHinhBieuMau: CauHinhBieuMau[];
    quyTrinh: QuyTrinh;
  }

  export interface Don {
    _id: string;
    thongTinNguoiTao: Login.Profile;
    thongTinDichVu: {
      _id: string;
      cauHinhBieuMau: CauHinhBieuMau[];
      ten: string;
      ghiChu: string;
      quyTrinh: QuyTrinh;
    };
  }
}
