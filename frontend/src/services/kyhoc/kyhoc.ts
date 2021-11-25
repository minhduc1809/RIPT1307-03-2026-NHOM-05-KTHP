import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getAllKyHocSinhVien() {
  return axios.get(`${ip3}/odoo-ky-hoc/sinh-vien/me`);
}

export async function getAllKyHocByHinhThucDaoTaoGiangVien(idHinhThuc: number) {
  return axios.get(`${ip3}/odoo-ky-hoc/giang-vien/me?idHinhThuc=${idHinhThuc}`);
}
