import { ip } from '@/utils/constants';
import { request } from 'umi';
import type { APILopHanhChinh } from './index.d';

export async function getDataLopHanhChinh(options?: any) {
  return request<APILopHanhChinh.Data>(`${ip}/odoo-user-service/odoo-lop-hanh-chinh/sinh-vien/me`, {
    method: 'GET',
    ...(options || {}),
  });
}
