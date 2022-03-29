import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getThongBaoAdmin(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/notification/pageable`, { params: payload });
}

export async function postThongBaoGeneral(payload: ThongBao.PostRecord) {
  return axios.post(`${ip3}/notification/type/${payload.loaiDoiTuong}`, payload);
}

export async function putThongBao(idThongBao: string, payload: ThongBao.Record) {
  return axios.put(`${ip3}/notification/${idThongBao}`, payload);
}

export async function deleteThongBao(idThongBao: string) {
  return axios.delete(`${ip3}/notification/${idThongBao}`);
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

export async function readOneNotification(payload: { notificationId?: string }) {
  return axios.post(`${ip3}/notification/me/read/one`, payload);
}

export async function readAllNotification() {
  return axios.post(`${ip3}/notification/me/read/all`);
}

export async function getThongBao(payload: {
  page: number;
  limit: number;
  condition: any;
  sort: { createdAt: 1 | -1 };
}) {
  return axios.get(`${ip3}/notification/me`, { params: payload });
}
