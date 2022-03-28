import type { ETrangThaiTrungTuyen, ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import type { Login } from '../ant-design-pro/typings';
import type { DotTuyenSinh } from '../DotTuyenSinh/typings';
import type { HoSoXetTuyen } from '../HoSoXetTuyen/typings';

declare module KetQuaXetTuyen {
  export interface ThongTinKhaiXacNhan {
    maThongTin: string;
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
      danhSachGiayToXacNhanNhapHoc: DotTuyenSinh.GiayTo[];
      danhSachThongTinKhaiXacNhan: ThongTinKhaiXacNhan[];
      ghiChuTiepNhan: string;
      ngayTiepNhan: string;
    };
  }
}
