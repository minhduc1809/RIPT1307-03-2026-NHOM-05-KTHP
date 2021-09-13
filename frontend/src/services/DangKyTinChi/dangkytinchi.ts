import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getDotDangKyByHocKy(idHocKy?: number) {
  return axios.get(`${ip3}/odoo-dang-ky-nhu-cau/dot-dang-ky/sinh-vien/hoc-ky/${idHocKy}`);
}

export async function getPhieuDangKyByDot(idDotDangKy?: number) {
  return axios.get(
    `${ip3}/odoo-dang-ky-nhu-cau/phieu-dang-ky-hoc-phan/dot-dang-ky-nhu-cau/${idDotDangKy}`,
  );
}

export async function getDanhSachHocPhanDangKy() {
  return axios.get(`${ip3}/odoo-sv-hp-ds/sinh-vien/hoc-phan/dang-ky`);
}

export async function getThongTinKyHoc(idHocKy?: number) {
  return axios.get(`${ip3}/odoo-ky-hoc/${idHocKy}/student/info`);
}

export async function khoiTaoPhieuDangKy(idDotDangKy?: number) {
  return axios.get(`${ip3}/odoo-dang-ky-nhu-cau/phieu-dang-ky-hoc-phan/khoi-tao/${idDotDangKy}`);
}

export async function postDanhSachHocPhanDangKy(payload: {
  idPhieuDangKy?: number;
  data: { danhSachHocPhan: { idHocPhan: number }[] };
}) {
  return axios.post(
    `${ip3}/odoo-dang-ky-nhu-cau/phieu-dang-ky-hoc-phan/${payload.idPhieuDangKy}`,
    payload.data,
  );
}
