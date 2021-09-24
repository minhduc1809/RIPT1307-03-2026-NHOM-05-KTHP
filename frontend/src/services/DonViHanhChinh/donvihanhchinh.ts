import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getTinhS() {
  return axios.get(`${ip3}/don-vi-hanh-chinh/tinh`);
}

export async function getQuanHuyenS(payload: { maTinh: string }) {
  return axios.get(`${ip3}/don-vi-hanh-chinh/quan-huyen/maTinh/${payload?.maTinh}`);
}

export async function getXaPhuongS(payload: { maQH: string }) {
  return axios.get(`${ip3}/don-vi-hanh-chinh/xa-phuong/ma-quan-huyen/${payload?.maQH}`);
}
