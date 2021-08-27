import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTinTuc(idTopic: string, page: number, limit: number) {
  return axios.get(
    `${ip3}/tin-tuc/pageable?page=${page}&limit=${limit}${
      idTopic !== 'Tất cả' ? `&idTopic=${idTopic}` : ''
    }`,
  );
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
