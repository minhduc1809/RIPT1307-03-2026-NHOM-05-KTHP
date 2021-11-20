import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getAllKyHoc() {
  if (localStorage.getItem('vaiTro') === 'nhan_vien') {
    return axios.get(`${ip3}/odoo-ky-hoc/all`);
  }
  return axios.get(`${ip3}/odoo-ky-hoc/sinh-vien/me`);
}
