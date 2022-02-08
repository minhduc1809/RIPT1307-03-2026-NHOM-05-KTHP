import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'thu-muc-van-ban';

export async function getThuMucAdmin(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/${url}/pageable`, { params: payload });
}

export async function getThuMucUser() {
  return axios.get(`${ip3}/${url}/me/all`);
}

export async function addThuMuc(payload: VanBanHuongDan.ThuMuc) {
  return axios.post(`${ip3}/${url}`, payload);
}

export async function putThuMuc(payload: { data: VanBanHuongDan.ThuMuc; id: string }) {
  return axios.put(`${ip3}/${url}/${payload.id}`, payload.data);
}

export async function delThuMuc(payload: { id: string }) {
  return axios.delete(`${ip3}/${url}/${payload.id}`);
}
