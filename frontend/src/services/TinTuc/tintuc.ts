import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getTinTuc(payload: {
  page: number;
  limit: number;
  condition?: any;
  idHinhThuc: number;
}) {
  return axios.get(`${ip3}/tin-tuc/pageable`, { params: payload });
}

export async function putTinTuc(payload: { id: string; data: TinTuc.Record }) {
  return axios.put(`${ip3}/tin-tuc/${payload.id}`, payload.data);
}

export async function addTinTuc(payload: TinTuc.Record) {
  return axios.post(`${ip3}/tin-tuc`, payload);
}

export async function delTinTuc(payload: { id: string }) {
  return axios.delete(`${ip3}/tin-tuc/${payload.id}`);
}
