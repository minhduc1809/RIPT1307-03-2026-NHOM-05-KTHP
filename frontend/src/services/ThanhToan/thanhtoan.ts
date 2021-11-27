import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getProductByCode(code: string) {
  return axios.get(`${ip3}/SLINK-MANUAL/thanh-toan/product/${code}`);
}
