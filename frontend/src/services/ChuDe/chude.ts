import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getAllLoaiChuDe() {
  return axios.get(`${ip3}/common-topic/type/all`);
}

export async function getAllChuDe() {
  return axios.get(`${ip3}/common-topic/all`);
}

export async function getChuDe(type: string, page: number, limit: number) {
  return axios.get(
    `${ip3}/common-topic/pageable?page=${page}&limit=${limit}${
      type !== 'Tất cả' ? `&type=${type}` : ''
    }`,
  );
}

export async function putChuDe(payload: { id: string; data: ChuDe.Record }) {
  return axios.put(`${ip3}/common-topic/${payload.id}`, payload.data);
}

export async function addChuDe(payload: ChuDe.Record) {
  return axios.post(`${ip3}/common-topic`, payload);
}

export async function delChuDe(payload: { id: string }) {
  return axios.delete(`${ip3}/common-topic/${payload.id}`);
}
