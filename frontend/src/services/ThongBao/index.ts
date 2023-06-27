import axios from '@/utils/axios';
import { ipNotif } from '@/utils/ip';
import { type ThongBao } from './typing';

export async function getThongBaoAdmin(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ipNotif}/notification/pageable`, { params: payload });
}

export async function postThongBaoGeneral(payload: ThongBao.PostRecord) {
  return axios.post(`${ipNotif}/notification/general`, payload);
}

export async function putThongBao(idThongBao: string, payload: ThongBao.IRecord) {
  return axios.put(`${ipNotif}/notification/${idThongBao}`, payload);
}

export async function deleteThongBao(idThongBao: string) {
  return axios.delete(`${ipNotif}/notification/${idThongBao}`);
}

export async function postThongBaoByDonVi(payload: ThongBao.PostRecord) {
  return axios.post(`${ipNotif}/notification/type/don-vi`, payload);
}

export async function postThongBaoByVaiTro(payload: ThongBao.PostRecord) {
  return axios.post(`${ipNotif}/notification/type/vai-tro`, payload);
}

export async function postThongBaoAll(payload: ThongBao.PostRecord) {
  return axios.post(`${ipNotif}/notification/type/all`, payload);
}

export async function readOneNotification(payload: { notificationId?: any }) {
  return axios.post(`${ipNotif}/notification/me/read/one`, payload);
}

export async function readAllNotification() {
  return axios.post(`${ipNotif}/notification/me/read/all`);
}

export async function getThongBao(payload: {
  page: number;
  limit: number;
  condition: any;
  sort: { createdAt: 1 | -1 };
}) {
  return axios.get(`${ipNotif}/notification/me/page`, { params: payload });
}
