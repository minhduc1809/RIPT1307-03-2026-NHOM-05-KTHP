import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function uploadFile(payload: { file: string | Blob; public: '1' | '0' }) {
  const form = new FormData();
  form.append('file', payload?.file);
  form.append('isPublic', payload?.public);
  return axios.post(`${ip3}/file`, form);
}

export async function uploadFileAndExportPdf(payload: {
  file: string | Blob;
  filename: string;
  public: any;
  exportPdf: '0' | '1';
  loai: string;
}) {
  const form = new FormData();
  form.append('file', payload?.file);
  form.append('exportPdf', payload?.exportPdf);
  form.append('filename', payload?.filename);
  form.append('public', payload?.public);
  form.append('loai', payload?.loai);
  return axios.post(`${ip3}/file-object`, form);
}
