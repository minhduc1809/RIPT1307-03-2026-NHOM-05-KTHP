import axios from '@/utils/axios';
import { ipNotif } from '@/utils/ip';

export async function readNotification(payload: { type: 'ONE' | 'ALL'; notificationId?: any }) {
  return axios.post(`${ipNotif}/notification/read`, payload);
}

export async function getThongBao(payload: {
  page: number;
  limit: number;
  condition: any;
  sort: { createdAt: 1 | -1 };
}) {
  return axios.get(`${ipNotif}/notification/me/page`, { params: payload });
}
