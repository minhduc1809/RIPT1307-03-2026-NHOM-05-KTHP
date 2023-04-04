import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getByKey(key: string) {
  return axios.get(`${ip3}/setting/${key}`);
}

export async function post(payload: Setting.Record) {
  return axios.post(`${ip3}/setting`, payload);
}

export async function put(payload: { key: string; data: Setting.Record }) {
  return axios.put(`${ip3}/setting/key/${payload.key}`, payload.data);
}
