import { request } from 'umi';
import { ip3 } from '@/utils/constants';

export async function get(options?: Record<string, any>) {
  return request<IRecordCTK.RootObject>(`${ip3}/odoo-chuong-trinh-khung/test`, {
    method: 'GET',
    ...(options || {}),
  });
}
