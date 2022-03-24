import type { HoSoXetTuyen } from '../HoSoXetTuyen/typings';
import type { Login } from '../ant-design-pro/typings';
import type { ETrangThaiTrungTuyen, ETrangThaiXacNhanNhapHoc } from '@/utils/constants';

declare module KetQuaXetTuyen {
  export interface Record {
    _id: string;
    nguyenVongTrungTuyen: HoSoXetTuyen.NguyenVong;
    idDotTuyenSinh: string;
    maHoSo: string;
    thongTinThiSinh: Login.Profile;
    trangThai: ETrangThaiTrungTuyen;
    thongTinXacNhanNhapHoc: {
      trangThaiXacNhan: ETrangThaiXacNhanNhapHoc;
      urlGiayBaoKetQuaTHPT: string[];
      _id: string;
    };
  }
}
