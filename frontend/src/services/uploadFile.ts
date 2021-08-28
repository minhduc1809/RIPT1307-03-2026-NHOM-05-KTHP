import { ip3 } from '@/utils/constants';
import axios from 'axios';

export async function uploadFile(payload: {
  file: string | Blob;
  filename: string;
  public: string;
}) {
  const form = new FormData();
  form.append('file', payload?.file);
  form.append('filename', payload?.filename);
  form.append('public', payload?.public);
  return axios.post(`${ip3}/file/data/single`, form);
}
