import type {
  ELoaiChungChiTiengAnh,
  EMonHoc,
  EToHopXetTuyen,
  ETrangThaiHoSo,
} from '@/utils/constants';
import type { Login } from '../ant-design-pro/typings';
import type { DotTuyenSinh } from '../DotTuyenSinh/typings';

declare module HoSoXetTuyen {
  export interface Record {
    thongTinThiSinh: Login.Profile;
    thongTinHocTapTHPT: ThongTinHocTapTHPT;
    thongTinChungChiQuocTe: ThongTinChungChiQuocTe;
    thongTinGiaiKHKT: ThongTinGiaiKHKT;
    thongTinGiaiQuocGia: ThongTinGiaiQuocGia;
    thongTinGiaiTinhTP: ThongTinGiaiTinhTP;
    thongTinGiayToNopOnline: DotTuyenSinh.GiayTo[];
    thongTinKetQuaDanhGiaNangLuc: ThongTinKetQuaDanhGiaNangLuc;
    thongTinKetQuaThiTHPT: ThongTinKetQuaThiTHPT;
    thongTinChungChiNgoaiNgu: ThongTinChungChiNgoaiNgu;
    thongTinChungChiTiengAnh: ThongTinChungChiTiengAnh;
    thongTinChungChiTiengPhap: ThongTinChungChiTiengPhap;
    thongTinKhac: any;
    maDoiTuong: string[];
    _id: string;
    namTuyenSinh: number;
    idDotTuyenSinh: string;
    maHoSo: string;
    trangThai: ETrangThaiHoSo;
    danhSachNguyenVong: NguyenVong[];
    trangThaiThanhToan: string;
    thongTinGiayToNopHoSo: DotTuyenSinh.GiayTo[];
    thongTinGiaDinh: any[];
    createdAt: string;
    updatedAt: string;
    ghiChuTiepNhan: string;
    identityCode;
    ngonNgu: string | string[];
    giaiHSG: string | string[];
    toHopMongMuon: EToHopXetTuyen[];
  }

  export interface KetQuaHocTapTHPT {
    tongKetToan: number;
    tongKetLy: number;
    tongKetHoa: number;
    tongKetSu: number;
    tongKetDia: number;
    tongKetVan: number;
    tongKetNgoaiNgu: number;
    diemTBC: number;
  }

  export interface ThongTinLop {
    tenLop: string;
    maTinh: string;
    maQuanHuyen: string;
    maTruong: string;
    tenTruong: string;
    kqhtHK1: KetQuaHocTapTHPT;
    kqhtHK2: KetQuaHocTapTHPT;
    kqhtCaNam: KetQuaHocTapTHPT;
    hanhKiem: string;
    truongChuyen: boolean;
    monChuyen: EMonHoc;
    khuVucUuTienTuyenSinh: string;
  }

  export interface ThongTinChungChiTiengAnh {
    loai: ELoaiChungChiTiengAnh;
    diem?: number;
    urlChungChi?: string[];
    ngayCap?: Date;
    noiCap?: string;
  }

  export interface ThongTinChungChiTiengPhap {
    loai: ELoaiChungChiTiengPhap;
    bac?: EBacChungChiTiengPhap;
    urlChungChi?: string[];
    ngayCap?: Date;
    noiCap?: string;
  }

  export interface ThongTinHocTapTHPT {
    truongLop10: ThongTinLop;
    truongLop11: ThongTinLop;
    truongLop12: ThongTinLop;
    truongChuyen: boolean;
    heChuyen: string;
    monChuyen: EMonHoc;
    thoiGianTotNghiep: string;
    namTotNghiep: number;
    khuVucUuTienTuyenSinh: string;
    doiTuongUuTienTuyenSinh: string;
    urlChungNhanDoiTuongUuTien: string[];
    urlHocBa: string[];
  }

  export interface ThongTinChungChiQuocTe {
    suDungChungChiQuocTe: boolean;
    loaiChungChiQuocTe: string;
    diemChungChiQuocTe: number;
    ngayCapChungChiQuocTe: string;
    donViCapChungChiQuocTe: string;
    maDuThiChungChiQuocTe: string;
    urlChungChiQuocTe: string[];
    diemToanALevel: string;
    mon1ALevel: string;
    diem1ALevel: string;
    mon2ALevel: string;
    diem2ALevel: string;
    mon3ALevel: string;
    diem3ALevel: string;
  }

  export interface ThongTinGiaiKHKT {
    suDungGiaiKHKTQG: boolean;
    linhVucKHKTQG: string;
    tenDeTaiKHKTQG: string;
    loaiGiaiKHKTQG: string;
    xacNhanHopLeKHKTQG: boolean;
    urlBangKhenKHKTQG: string[];
    tomTatDeTaiKHKTQG: string[];
  }

  export interface ThongTinGiaiQuocGia {
    suDungGiaiHGSQG: boolean;
    monThiHSGQG: string;
    giaiHSGQG: string;
    namDatGiaiHSGQG: number;
    noiCapGiaiHSGQG: string;
    urlBangKhenHSGQG: string[];
  }

  export interface ThongTinGiaiTinhTP {
    suDungGiaiHGSTinhTP: boolean;
    monThiHSGTinhTP: string;
    giaiHSGTinhTP: string;
    namDatGiaiHSGTinhTP: number;
    noiCapGiaiHSGTinhTP: string;
    urlBangKhenHSGTinhTP: string[];
  }

  export interface ThongTinKetQuaDanhGiaNangLuc {
    suDungDanhGiaNangLuc: boolean;
    truongDanhGiaNangLuc: string;
    diemDanhGiaNangLuc: number;
    ngayDuThiDanhGiaNangLuc: string;
    urlGiayXacNhanDanhGiaNangLuc: string[];
  }

  export interface ThongTinKetQuaThiTHPT {
    suDungThongTinKetQuaThiTHPT: boolean;
    monNgoaiNguThiTHPT: string;
    thptMonToan: number;
    thptMonVan: number;
    thptMonLy: number;
    thptMonHoa: number;
    thptMonSu: number;
    thptMonDiaLy: number;
    thptMonNgoaiNgu: number;
  }

  export interface ThongTinChungChiNgoaiNgu {
    loaiNgoaiNgu: string;
    loaiChungChiNgoaiNgu: string;
    diemChungChiNgoaiNgu: number;
    bacChungChiNgoaiNgu: string;
    ngayCapChungChiNgoaiNgu: string;
    donViCapChungChiNgoaiNgu: string;
    urlChungChiNgoaiNgu: string[];
    chiTietDiemChungChiTiengTrung: any;
    suDungChungChiNgoaiNgu: boolean;
  }

  export interface DiemQuyDoi {
    _id: string;
    thanhPhan: ThanhPhanDiemQuyDoi[];
    tongDiem: number;
  }

  export interface ThanhPhanDiemQuyDoi {
    _id: string;
    tenThanhPhan: string;
    diem: number;
  }

  export interface NguyenVong {
    tenNganhChuyenNganh: string;
    wrong?: boolean;
    diemQuyDoi?: DiemQuyDoi;
    coSoDaoTao: CoSoDaoTao.Record;
    tenCoSoDaoTao: string;
    idNganhChuyenNganh: string;
    maNganhChuyenNganh: string;
    maDoiTuong: string;
    tenDoiTuong: string;
    soThuTu: number;
    toHopXetTuyen: string;
    _id?: string;
    errorStrings?: string[];
  }
}
