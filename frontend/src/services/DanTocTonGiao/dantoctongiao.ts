import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getDanToc() {
  return axios.get(`${ip3}/dan-toc-ton-giao/dan-toc`);
}

export async function getTonGiao() {
  return axios.get(`${ip3}/dan-toc-ton-giao/ton-giao`);
}
