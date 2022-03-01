import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'phuong-thuc-tuyen-sinh';

export function getAllPhuongThucTuyenSinh() {
  return axios.get(`${ip3}/${url}/all`);
}

export function getPhuongThucTuyenSinhPageable(payload: {
  page: number;
  limit: number;
  condition?: any;
}) {
  return axios.get(`${ip3}/${url}`, { params: payload });
}

export function postPhuongThucTuyenSinh(payload: PhuongThucTuyenSinh.Record) {
  return axios.post(`${ip3}/${url}`, payload);
}

export function putPhuongThucTuyenSinh(id: string, data: PhuongThucTuyenSinh.Record) {
  return axios.put(`${ip3}/${url}/${id}`, data);
}

export function deletePhuongThucTuyenSinh(id: string) {
  return axios.delete(`${ip3}/${url}/${id}`);
}
