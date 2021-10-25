import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getDotDangKyNhuCauByHocKy(idHocKy?: number) {
  return axios.get(`${ip3}/odoo-dang-ky-nhu-cau/dot-dang-ky/sinh-vien/hoc-ky/${idHocKy}`);
}

export async function getDotDangKyTinChiByHocKy(idHocKy?: number) {
  return axios.get(`${ip3}/odoo-dang-ky-tin-chi/dang-ky-tin-chi/dot/hoc-ky/${idHocKy}`);
}

export async function getDSLopDaDangKyByIdDot(idDotDangKyTinChi?: number) {
  return axios.get(
    `${ip3}/odoo-dang-ky-tin-chi/dang-ky-tin-chi/danh-sach-lop-da-dk/dot/${idDotDangKyTinChi}`,
  );
}

export async function getDSLopTinChiByIdDotAndIdMonHoc(
  idDotDangKyTinChi?: number,
  idMonHoc?: number,
) {
  return axios.get(
    `${ip3}/odoo-dang-ky-tin-chi/dang-ky-tin-chi/lop-tin-chi/dot-tin-chi/${idDotDangKyTinChi}/mon-hoc/${idMonHoc}`,
  );
}

export async function getDSNhomLopTinChiByIdLopTinChi(idLopTinChi?: number) {
  return axios.get(
    `${ip3}/odoo-dang-ky-tin-chi/dang-ky-tin-chi/nhom-lop-tin-chi/lop-tin-chi/${idLopTinChi}`,
  );
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
  return axios.post(`${ip3}/odoo-dang-ky-nhu-cau/phieu-dang-ky-hoc-phan/khoi-tao/${idDotDangKy}`);
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

export async function postDanhSachLopDangKy(payload: {
  idDotDangKyTinChi?: number;
  data: { danhSachLop: { lop_tin_chi_id: number; nhom_lop_tin_chi_id: number }[] };
}) {
  return axios.post(
    `${ip3}/odoo-dang-ky-tin-chi/dang-ky-tin-chi/dang-ky/dot/${payload.idDotDangKyTinChi}`,
    payload.data,
  );
}
