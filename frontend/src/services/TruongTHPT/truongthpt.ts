import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'truong-thpt';

export function getTinhTP() {
  return axios.get(`${ip3}/${url}/tinh-tp`);
}

export function getQuanHuyen(maTinhTP: string) {
  return axios.get(`${ip3}/${url}/quan-huyen/tinh-tp/${maTinhTP}`);
}

export function getTruongTHPT(maTinhTP: string, maQuanHuyen: string) {
  return axios.get(`${ip3}/${url}/maTinhTP/${maTinhTP}/maQuanHuyen/${maQuanHuyen}`);
}
