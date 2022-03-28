import type { HoSoXetTuyen } from '../HoSoXetTuyen/typings';
import type { Login } from '../ant-design-pro/typings';
import type { ETrangThaiTrungTuyen, ETrangThaiXacNhanNhapHoc } from '@/utils/constants';

declare module KetQuaXetTuyen {
  export interface GiayToKhaiXacNhan {
    tieuDe: string;
    urlGiayTo: string;
    required: boolean;
    textHuongDan: string;
    urlHuongDan: string[];
  }

  export interface ThongTinKhaiXacNhan {
    tieuDe: string;
    noiDung: string;
    required: boolean;
    textHuongDan: string;
    urlHuongDan: string[];
  }
  export interface Record {
    _id: string;
    nguyenVongTrungTuyen: HoSoXetTuyen.NguyenVong;
    idDotTuyenSinh: string;
    idHoSoXetTuyen: string;
    maHoSo: string;
    thongTinThiSinh: Login.Profile;
    trangThai: ETrangThaiTrungTuyen;
    thongTinHoSoXetTuyen: HoSoXetTuyen.Record;
    thongTinXacNhanNhapHoc: {
      trangThaiXacNhan: ETrangThaiXacNhanNhapHoc;
      urlGiayBaoKetQuaTHPT: string[];
      _id: string;
      danhSachGiayToXacNhanNhapHoc: GiayToKhaiXacNhan[];
      danhSachThongTinKhaiXacNhan: ThongTinKhaiXacNhan[];
      ghiChuTiepNhan: string;
      ngayTiepNhan: string;
    };
  }
}
