import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

const auth = localStorage.getItem('vaiTro');
export async function getAllKyHoc() {
  if (auth === 'giang_vien') {
    return axios.get(`${ip3}/odoo-ky-hoc/all`);
  }
  return axios.get(`${ip3}/odoo-ky-hoc/sinh-vien/me`);
}
