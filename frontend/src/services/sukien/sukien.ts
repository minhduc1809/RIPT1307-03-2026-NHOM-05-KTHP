import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getSuKienSinhVienByNam(year: number) {
  return axios.get(`${ip3}/odoo-su-kien/sinh-vien/year/${year}`);
}
