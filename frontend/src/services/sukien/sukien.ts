import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getSuKienUserByNam(year: number) {
  return axios.get(`${ip3}/odoo-su-kien/user/year/${year}`);
}
