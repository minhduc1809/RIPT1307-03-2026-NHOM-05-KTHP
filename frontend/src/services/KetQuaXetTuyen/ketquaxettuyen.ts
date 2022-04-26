import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { DotTuyenSinh } from '../DotTuyenSinh/typings';
import type { KetQuaXetTuyen } from './typings';

const url = 'ket-qua-xet-tuyen';

export function getMyKetQuaXetTuyen(idDotTuyenSinh: string) {
  return axios.get(`${ip3}/${url}/thi-sinh/my/dot/${idDotTuyenSinh}`);
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
  return axios.put(`${ip3}/${url}/thi-sinh/xac-nhan/${idKetQua}`, payload);
};

export const xacNhanKhongNhapHoc = (idKetQua: string) => {
  return axios.put(`${ip3}/${url}/thi-sinh/khong-xac-nhan/${idKetQua}`);
};
