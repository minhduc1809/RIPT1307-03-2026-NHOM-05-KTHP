import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'dot-tuyen-sinh';

export function getAllDotTuyenSinh(payload?: { condition?: any }) {
  return axios.get(`${ip3}/${url}/all`, { params: payload });
}

export function getDotTuyenSinhPageable(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/${url}`, { params: payload });
}

export function getDotTuyenSinhById(idDot: string) {
  return axios.get(`${ip3}/${url}/${idDot}`);
}

export function postDotTuyenSinh(payload: DotTuyenSinh.Record) {
  return axios.post(`${ip3}/${url}`, payload);
}

export function putDotTuyenSinh(idDotTuyenSinh: string, data: DotTuyenSinh.Record) {
  return axios.put(`${ip3}/${url}/${idDotTuyenSinh}`, data);
}

export function deleteDotTuyenSinh(id: string) {
  return axios.delete(`${ip3}/${url}/${id}`);
}
