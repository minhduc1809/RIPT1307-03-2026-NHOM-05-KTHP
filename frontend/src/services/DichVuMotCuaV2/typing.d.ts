declare module DichVuMotCuaV2 {
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

  export interface DonThaoTac {
    _id: string;
    idDon: Don;
    idBuoc: string;
    idThaoTac: string;
    idDonVi: string;
    tenDonVi: string;
    idDichVu: string;
    nguoiTao: Login.Profile;
    trangThai: 'PENDING' | 'OK' | 'NOT_OK';
    nguoiThucHien: Login.Profile;
    cauHinh: any;
    info: any;
  }

  export interface ThaoTacQuyTrinh {
    _id: string;
    idDonVi: string;
    tenDonVi: string;
    soNgayXuLy?: number;
    cauHinh: any;
  }

  export interface BuocQuyTrinh {
    _id: string;
    ten: string;
    danhSachThaoTac: ThaoTacQuyTrinh[];
  }

  export interface QuyTrinh {
    _id?: string;
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

  export interface TrangThaiThaoTac {
    trangThai: string;
    _id: string;
    idThaoTac: string;
    idDonVi: string;
    tenDonVi: string;
    soNgayXuLy: number;
  }
  export interface TrangThaiBuoc {
    _id: string;
    idDichVu: string;
    idDon: string;
    nguoiTao: Login.Profile;
    idBuoc: string;
    tenBuoc: string;
    trangThai: string;
    danhSachThongKeThaoTac: TrangThaiThaoTac[];
  }
}
