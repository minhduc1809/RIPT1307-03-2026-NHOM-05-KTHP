import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getKhoaHoc(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/odoo-khoa-sinh-vien/pageable`, { params: payload });
}
