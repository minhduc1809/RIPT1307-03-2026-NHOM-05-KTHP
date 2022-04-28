import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getUser(payload: { page?: number; limit?: number; condition?: any }) {
  return axios.get(`${ip3}/user/pageable`, { params: payload });
}
