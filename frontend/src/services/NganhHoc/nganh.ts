import axios from 'axios';
import { ip3 } from '@/utils/ip';

export async function getAllNganh(payload: { condition: any }) {
  return axios.get(`${ip3}/odoo-nganh/all`, { params: payload });
}
