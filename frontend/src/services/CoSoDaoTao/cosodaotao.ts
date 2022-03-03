import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'co-so-dao-tao';

export function getAllCoSoDaoTao() {
  return axios.get(`${ip3}/${url}/all`);
}

export function getCoSoDaoTaoPageable(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/${url}`, { params: payload });
}

export function postCoSoDaoTao(payload: CoSoDaoTao.Record) {
  return axios.post(`${ip3}/${url}`, payload);
}

export function putCoSoDaoTao(idCoSoDaoTao: string, data: CoSoDaoTao.Record) {
  return axios.put(`${ip3}/${url}/${idCoSoDaoTao}`, data);
}

export function deleteCoSoDaoTao(id: string) {
  return axios.delete(`${ip3}/${url}/${id}`);
}
