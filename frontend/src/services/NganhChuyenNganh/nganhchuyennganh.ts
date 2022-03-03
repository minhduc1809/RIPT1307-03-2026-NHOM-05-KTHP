import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'nganh-chuyen-nganh';

export function getAllNganhChuyenNganh() {
  return axios.get(`${ip3}/${url}/all`);
}

export function getNganhChuyenNganhPageable(payload: {
  page: number;
  limit: number;
  condition?: any;
}) {
  return axios.get(`${ip3}/${url}`, { params: payload });
}

export function postNganhChuyenNganh(payload: NganhChuyenNganh.Record) {
  return axios.post(`${ip3}/${url}`, payload);
}

export function putNganhChuyenNganh(idNganhChuyenNganh: string, data: NganhChuyenNganh.Record) {
  return axios.put(`${ip3}/${url}/${idNganhChuyenNganh}`, data);
}

export function deleteNganhChuyenNganh(id: string) {
  return axios.delete(`${ip3}/${url}/${id}`);
}
