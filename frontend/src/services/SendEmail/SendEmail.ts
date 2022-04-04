import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function SendEmail(payload?: any) {
  const form = new FormData();
  form.append('file', payload?.file);
  form.append('subject', payload?.subject);
  form.append('content', payload?.content);
  return axios.post(`${ip3}/mailer/send`, form);
}

export async function SendEmailPreview(payload?: any) {
  const form = new FormData();
  form.append('file', payload?.file);
  form.append('subject', payload?.subject);
  form.append('content', payload?.content);
  return axios.post(`${ip3}/mailer/preview`, form);
}

export async function getEmailPageable(payload: {
  page?: number;
  limit?: number;
  condition?: any;
}) {
  return axios.get(`${ip3}/mailer/pageable`, { params: payload });
}
