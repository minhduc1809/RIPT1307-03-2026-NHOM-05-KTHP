import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function SendEmail(payload?: any) {
  const accessToken = localStorage.getItem('token');
  console.log(payload, 'server');
  return axios.post(`${ip3}/mailer/preview`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function SendEmailPreview(payload?: any) {
  const form = new FormData();
  form.append('file', payload?.file);
  form.append('subject', payload?.subject);
  form.append('content', payload?.content);
  return axios.post(`${ip3}/mailer/preview`, form);
}
