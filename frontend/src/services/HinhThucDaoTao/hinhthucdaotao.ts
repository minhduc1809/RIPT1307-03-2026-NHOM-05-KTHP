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
