import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTinhS() {
  return axios.get(`${ip3}/don-vi-hanh-chinh/tinh`);
}
