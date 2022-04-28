import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'hinh-thuc-dao-tao';

export function getAllHinhThucDaoTao() {
  return axios.get(`${ip3}/${url}/all`);
}

export function getHinhThucDaoTaoPageable(payload: {
  page: number;
  limit: number;
  condition?: any;
}) {
  return axios.get(`${ip3}/${url}`, { params: payload });
}

export function postHinhThucDaoTao(payload: HinhThucDaoTao.Record) {
  return axios.post(`${ip3}/${url}`, payload);
}

export function putHinhThucDaoTao(payload: { id: string; payload: HinhThucDaoTao.Record }) {
  return axios.put(`${ip3}/${url}/${payload.id}`, payload.payload);
}
export function delHinhThucDaoTao(payload: { id: string }) {
  return axios.delete(`${ip3}/${url}/${payload.id}`);
}
