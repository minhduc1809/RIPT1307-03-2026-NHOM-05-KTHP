import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getAllDonVi() {
  return axios.get(`${ip3}/odoo-don-vi/all`);
}
