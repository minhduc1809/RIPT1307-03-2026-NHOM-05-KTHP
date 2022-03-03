import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'nam-tuyen-sinh';

export function getAllNamTuyenSinh(payload?: { condition?: any }) {
  return axios.get(`${ip3}/${url}/all`, { params: payload });
}

export function getNamTuyenSinhPageable(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/${url}`, { params: payload });
}

export function postNamTuyenSinh(payload: NamTuyenSinh.Record) {
  return axios.post(`${ip3}/${url}`, payload);
}

export function putNamTuyenSinh(idNamTuyenSinh: string, data: NamTuyenSinh.Record) {
  return axios.put(`${ip3}/${url}/${idNamTuyenSinh}`, data);
}

export function deleteNamTuyenSinh(id: string) {
  return axios.delete(`${ip3}/${url}/${id}`);
}
