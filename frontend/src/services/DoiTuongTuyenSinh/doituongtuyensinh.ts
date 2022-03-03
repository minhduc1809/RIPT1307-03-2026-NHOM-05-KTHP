import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'doi-tuong-tuyen-sinh';

export function getAllDoiTuongTuyenSinh(payload?: { condition?: any }) {
  return axios.get(`${ip3}/${url}/all`, { params: payload });
}

export function getDoiTuongTuyenSinhPageable(payload: {
  page: number;
  limit: number;
  condition?: any;
}) {
  return axios.get(`${ip3}/${url}`, { params: payload });
}

export function postDoiTuongTuyenSinh(payload: DoiTuongTuyenSinh.Record) {
  return axios.post(`${ip3}/${url}`, payload);
}

export function putDoiTuongTuyenSinh(idDoiTuongTuyenSinh: string, data: DoiTuongTuyenSinh.Record) {
  return axios.put(`${ip3}/${url}/${idDoiTuongTuyenSinh}`, data);
}

export function deleteDoiTuongTuyenSinh(id: string) {
  return axios.delete(`${ip3}/${url}/${id}`);
}
