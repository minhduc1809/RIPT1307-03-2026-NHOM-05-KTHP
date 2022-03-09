import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { Login } from '../ant-design-pro/typings';
import type { HoSoXetTuyen } from './typings';

const url = 'ho-so-xet-tuyen';

export function khoiTaoHoSoXetTuyen(idDotTuyenSinh: string) {
  return axios.post(`${ip3}/${url}/thi-sinh/khoi-tao/dot/${idDotTuyenSinh}`);
}

export function getMyHoSoXetTuyen(idDotTuyenSinh: string) {
  return axios.get(`${ip3}/${url}/thi-sinh/my/${idDotTuyenSinh}`);
}

export function putMyThongTinThiSinh(
  idHoSo: string,
  payload: {
    thongTinThiSinh: Login.Profile;
  },
) {
  return axios.put(`${ip3}/${url}/thi-sinh/my/${url}/${idHoSo}/thong-tin-thi-sinh`, payload);
}

export function putMyThongTinXetTuyen(idHoSo: string, payload: HoSoXetTuyen.Record) {
  return axios.put(`${ip3}/${url}/thi-sinh/my/${url}/${idHoSo}/thong-tin-xet-tuyen`, payload);
}

export function putMyDanhSachNguyenVong(
  idHoSo: string,
  payload: {
    danhSachNguyenVong: HoSoXetTuyen.NguyenVong[];
  },
) {
  return axios.put(`${ip3}/${url}/thi-sinh/my/${url}/${idHoSo}/danh-sach-nguyen-vong`, payload);
}

export function putMyTinhQuyDoiNguyenVong(
  idHoSo: string,
  payload: { nguyenVong: HoSoXetTuyen.NguyenVong },
) {
  return axios.put(`${ip3}/${url}/thi-sinh/my/${url}/${idHoSo}/tinh-quy-doi-nguyen-vong`, payload);
}
