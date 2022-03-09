import type { EMonHoc } from '@/utils/constants';
import type { Login } from '../ant-design-pro/typings';

declare module HoSoXetTuyen {
  export interface Record {
    thongTinThiSinh: Login.Profile;
    thongTinHocTapTHPT: ThongTinHocTapTHPT;
    thongTinChungChiQuocTe: ThongTinChungChiQuocTe;
    thongTinGiaiKHKT: ThongTinGiaiKHKT;
    thongTinGiaiQuocGia: ThongTinGiaiQuocGia;
    thongTinGiaiTinhTP: ThongTinGiaiTinhTP;
    thongTinGiayToNopOnline: GiayToNopOnline[];
    thongTinKetQuaDanhGiaNangLuc: ThongTinKetQuaDanhGiaNangLuc;
    thongTinKetQuaThiTHPT: ThongTinKetQuaThiTHPT;
    thongTinChungChiNgoaiNgu: ThongTinChungChiNgoaiNgu;
    thongTinKhac: any;
    maDoiTuong: string;
    _id: string;
    namTuyenSinh: number;
    idDotTuyenSinh: string;
    maHoSo: string;
    trangThai: string;
    danhSachNguyenVong: any[];
    trangThaiThanhToan: string;
    thongTinGiayToNopHoSo: any[];
    thongTinGiaDinh: any[];
    createdAt: string;
    updatedAt: string;
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

  export interface ThongTinHocTapTHPT {
    truongLop10: ThongTinLop;
    truongLop11: ThongTinLop;
    truongLop12: ThongTinLop;
    isTruongChuyen: boolean;
    heChuyen: string;
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

  export interface GiayToNopOnline {
    ten: string;
    soLuong: number;
    ghiChu: string;
    soLuongNop: number;
    ghiChuNop: string;
    urlGiayToNop: string[];
    soLuongTiepNhan: number;
    ghiChuTiepNhan: string;
    maGiayTo: string;
    thoiGianNop: string;
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
  }

  export interface DiemQuyDoi {
    _id: string;
    thanhPhan: { _id: string; tenThanhPhan: string; diem: number }[];
    tongDiem: number;
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
  }
}
