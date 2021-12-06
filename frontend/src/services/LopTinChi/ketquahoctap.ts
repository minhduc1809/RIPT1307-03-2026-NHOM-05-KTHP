import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function sinhVienGetDiemThanhPhanByHocKy(idHocKy: number) {
  return axios.get(`${ip3}/odoo-sv-ltc-ds/sinh-vien/hoc-ky/${idHocKy}`);
}

export async function sinhVienAllGetDiemTongKet() {
  return axios.get(`${ip3}/odoo-qldt-sinh-vien-hoc-ky/sinh-vien/me/all`);
}

export async function sinhVienGetDiemTongKetByHocKy(idHocKy: number) {
  return axios.get(`${ip3}/odoo-qldt-sinh-vien-hoc-ky/sinh-vien/me/hoc-ky/${idHocKy}`);
}

export async function giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKy(
  idSinhVien: number,
  idHocKy: number,
) {
  return axios.get(`${ip3}/odoo-sv-ltc-ds/nhan-vien/sinh-vien/${idSinhVien}/hoc-ky/${idHocKy}`);
}

export async function giangVienGetDiemTongKetSinhVienByIdSinhVien(idSinhVien: number) {
  return axios.get(`${ip3}/odoo-qldt-sinh-vien-hoc-ky/nhan-vien/sinh-vien/${idSinhVien}/all`);
}
