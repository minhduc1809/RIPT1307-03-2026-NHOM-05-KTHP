import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getByKey(key: string) {
  return axios.get(`${ip3}/setting/${key}`);
}

export async function upsertSetting(payload: Setting.Record) {
  return axios.post(`${ip3}/setting/upsert`, payload);
}
