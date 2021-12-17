import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function postCanBo(payload: ToChucCanBo.Record) {
  return axios.post(`${ip3}/odoo-user/admin/can-bo`, payload);
}

export async function putCanBo(idCanBo: number, payload: ToChucCanBo.Record) {
  return axios.put(`${ip3}/odoo-user/admin/can-bo/${idCanBo}`, payload);
}

export async function deleteCanBo(idCanBo: number) {
  return axios.delete(`${ip3}/odoo-user/admin/can-bo/${idCanBo}`);
}
