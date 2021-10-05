import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getAllKyHoc() {
  if (localStorage.getItem('vaiTro') === 'giang_vien') {
    return axios.get(`${ip3}/odoo-ky-hoc/all`);
  }
  return axios.get(`${ip3}/odoo-ky-hoc/sinh-vien/me`);
}
