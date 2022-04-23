import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'huong-dan-su-dung';

export function getAllHuongDanSuDung(payload?: { condition?: any }) {
  return axios.get(`${ip3}/${url}/all`, { params: payload });
}

export function getHuongDanSuDungPageable(payload: {
  page: number;
  limit: number;
  condition?: any;
}) {
  return axios.get(`${ip3}/${url}`, { params: payload });
}

export function postHuongDanSuDung(payload: HuongDanSuDung.Record) {
  return axios.post(`${ip3}/${url}`, payload);
}

export function putHuongDanSuDung(idHuongDanSuDung: string, data: HuongDanSuDung.Record) {
  return axios.put(`${ip3}/${url}/${idHuongDanSuDung}`, data);
}

export function deleteHuongDanSuDung(id: string) {
  return axios.delete(`${ip3}/${url}/${id}`);
}
