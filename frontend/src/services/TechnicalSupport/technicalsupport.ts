import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function postIssue(payload: TechnicalSupport.Record) {
  return axios.post(`${ip3}/technical-support`, payload);
}
