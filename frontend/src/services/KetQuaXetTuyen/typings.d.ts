import type {
  ELoaiThanhVien,
  ETrangThaiNhapHoc,
  ETrangThaiThanhToan,
  ETrangThaiTrungTuyen,
  ETrangThaiXacNhanNhapHoc,
} from '@/utils/constants';
import type { Login } from '../ant-design-pro/typings';
import type { DotTuyenSinh } from '../DotTuyenSinh/typings';
import type { HoSoXetTuyen } from '../HoSoXetTuyen/typings';

declare module KetQuaXetTuyen {
  export interface ThongTinKhaiXacNhan {
    index: number;
    maThongTin: string;
    tieuDe: string;
    noiDung: string;
    required: boolean;
    textHuongDan: string;
    urlHuongDan: string[];
  }

  export interface ThanhVienGiaDinh {
    index: number;
    loaiThanhVien: ELoaiThanhVien;
    hoDem: string;
    ten: string;
    ngaySinh: string;
    namSinh: number;
    ngheNghiep: string;
    soDienThoai?: string;
    email?: string;
    coQuanCongTac?: string;
    quocTich: string;
    soTheBHYT?: string;
    tonGiao?: string;
    danToc?: string;
    diaChiHienNay: DonViHanhChinh.Record;
    hoKhauThuongTru: DonViHanhChinh.Record;
    hoatDongChinhTriXaHoi?: string;
  }
  export interface Record {
    _id: string;
    nguyenVongTrungTuyen: HoSoXetTuyen.NguyenVong;
    namTuyenSinh: number;
    idDotTuyenSinh: string;
    idDotNhapHoc: string;
    idHoSoXetTuyen: string;
    maHoSo: string;
    thongTinThiSinh: Login.Profile;
    trangThai: ETrangThaiTrungTuyen;
    thongTinHoSoXetTuyen: HoSoXetTuyen.Record;
    thongTinXacNhanNhapHoc: {
      trangThaiXacNhan: ETrangThaiXacNhanNhapHoc;
      urlGiayBaoKetQuaTHPT: string[];
      _id: string;
      danhSachGiayToXacNhanNhapHoc: DotTuyenSinh.GiayTo[];
      danhSachThongTinKhaiXacNhan: ThongTinKhaiXacNhan[];
      ghiChuTiepNhan: string;
      ngayTiepNhan: string;
    };
    thongTinGiaDinh: ThanhVienGiaDinh[];
    trangThaiThanhToanNhapHoc: ETrangThaiThanhToan;
    ghiChuTiepNhan?: string;
    trangThaiNhapHoc: ETrangThaiNhapHoc;
    identityCodeNhapHoc: string;
    danhSachGiayToNop: DotTuyenSinh.GiayTo[];
    danhSachLePhiNop: string[];
  }
}
