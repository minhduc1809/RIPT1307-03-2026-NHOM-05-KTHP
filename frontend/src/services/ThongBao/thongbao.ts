import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getThongBaoAdmin(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/notification/pageable`, { params: payload });
}

export async function postThongBaoByDonVi(payload: ThongBao.PostRecord) {
  return axios.post(`${ip3}/notification/type/don-vi`, payload);
}

export async function postThongBaoByVaiTro(payload: ThongBao.PostRecord) {
  return axios.post(`${ip3}/notification/type/vai-tro`, payload);
}

export async function postThongBaoAll(payload: ThongBao.PostRecord) {
  return axios.post(`${ip3}/notification/type/all`, payload);
}
