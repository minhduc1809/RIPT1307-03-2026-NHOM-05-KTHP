import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function postCanBo(payload: ToChucCanBo.Record) {
  return axios.post(`${ip3}/odoo-user/admin/can-bo`, payload);
}

export async function putCanBo(payload: ToChucCanBo.Record & { id: number }) {
  return axios.put(`${ip3}/odoo-user/admin/can-bo`, payload);
}
