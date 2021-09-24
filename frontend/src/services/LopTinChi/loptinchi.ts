/* eslint-disable no-param-reassign */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const auth = localStorage.getItem('vaiTro');
export async function getLopTinChiByHocKy(idHocKy: number) {
  return axios.get(
    `${ip3}/odoo-lop-tin-chi/${
      auth === 'giang_vien' ? 'giang-vien' : 'sinh-vien'
    }/hoc-ky/${idHocKy}`,
  );
}

export async function getThongBaoLopTinChiById(payload: {
  idLop?: string;
  role?: string;
  page: number;
  limit: number;
  cond?: any;
}) {
  const idLop = payload?.idLop;
  const role = payload?.role;
  delete payload.idLop;
  delete payload.role;
  return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}/${role}/notification/pageable`, {
    params: payload,
  });
}

export async function getURLImg(payload: any) {
  const form = new FormData();
  // eslint-disable-next-line array-callback-return
  Object.keys(payload).map((key) => {
    form.set(key, payload[key]);
  });
  return axios.post(`${ip3}/file/image/single`, form);
}

export async function addThongBao(payload: { idLop: any; newValues: any }) {
  const { idLop, newValues } = payload;
  return axios.post(`${ip3}/odoo-lop-tin-chi/${idLop}/giang-vien/notification`, {
    ...newValues,
  });
}

/**
 *
 * @param idLop
 * @returns dùng cho get ds sv cho sv + giảng viên
 */
export async function getThongTinChungLopTinChiById(idLop: number) {
  if (auth === 'giang_vien') {
    return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}/giang-vien/sv`);
  }
  return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}/sinh-vien/gv-sv`);
}

export async function getLopTinChiById(idLop: number) {
  return axios.get(`${ip3}/odoo-lop-tin-chi/${idLop}`);
}

export async function getNhomLopTinChiById(idLop: number) {
  return axios.get(`${ip3}/odoo-nhom-lop-tin-chi/user/lop-tin-chi/${idLop}`);
}

export async function getDanhSachSinhVienByIdNhomLop(idNhomLop: number) {
  return axios.get(`${ip3}/odoo-nhom-lop-tin-chi/${idNhomLop}/user/danh-sach-sv`);
}

export async function getInfoMonHoc(idMonHoc: number) {
  return axios.get(`${ip3}/odoo-slide-channel/${idMonHoc}`);
}
