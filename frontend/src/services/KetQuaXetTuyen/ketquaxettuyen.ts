import axios from '@/utils/axios';
import type { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { ip3 } from '@/utils/ip';
import type { Login } from '../ant-design-pro/typings';
import type { DotTuyenSinh } from '../DotTuyenSinh/typings';
import type { KetQuaXetTuyen } from './typings';

const url = 'ket-qua-xet-tuyen';

export function getMyKetQuaXetTuyen(idDotTuyenSinh: string) {
  return axios.get(`${ip3}/${url}/thi-sinh/my/dot/${idDotTuyenSinh}`);
}

export function putMyKetQuaXetTuyenLyLich(
  idKetQuaXetTuyen: string,
  payload: {
    thongTinThiSinh: Login.Profile;
    thongTinGiaDinh: KetQuaXetTuyen.ThanhVienGiaDinh[];
  },
) {
  return axios.put(`${ip3}/${url}/thi-sinh/my/ly-lich/${idKetQuaXetTuyen}`, payload);
}

export function getKetQuaXetTuyenPageable(
  idDotTuyenSinh: string,
  payload: { page: number; limit: number; condition?: any },
) {
  return axios.get(`${ip3}/${url}/admin/dot/${idDotTuyenSinh}`, { params: payload });
}

export const xacNhanNhapHoc = (
  idKetQua: string,
  payload: {
    danhSachGiayToXacNhanNhapHoc: DotTuyenSinh.GiayTo[];
    danhSachThongTinKhaiXacNhan: KetQuaXetTuyen.ThongTinKhaiXacNhan[];
  },
) => {
  return axios.put(`${ip3}/${url}/thi-sinh/my/xac-nhan/${idKetQua}`, payload);
};

export const xacNhanKhongNhapHoc = (idKetQua: string) => {
  return axios.put(`${ip3}/${url}/thi-sinh/my/khong-xac-nhan/${idKetQua}`);
};

export const adminTiepNhanXacNhanNhapHoc = (
  idKetQuaXetTuyen: string,
  payload: {
    danhSachGiayToXacNhanNhapHoc: DotTuyenSinh.GiayTo[];
    danhSachThongTinKhaiXacNhan: KetQuaXetTuyen.ThongTinKhaiXacNhan[];
    ghiChuTiepNhan?: string;
    ngayTiepNhan: string;
    trangThaiXacNhan: ETrangThaiXacNhanNhapHoc;
  },
) => {
  return axios.put(`${ip3}/${url}/admin/tiep-nhan-xac-nhan/${idKetQuaXetTuyen}`, payload);
};
