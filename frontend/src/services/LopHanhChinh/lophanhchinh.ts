import axios from '@/utils/axios';
import { ip, ip3 } from '@/utils/constants';
import { request } from 'umi';
import type { APILopHanhChinh } from './index.d';

export async function getDataLopHanhChinh(options?: any) {
  return request<APILopHanhChinh.Data>(`${ip}/odoo-user-service/odoo-lop-hanh-chinh/sinh-vien/me`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getAllHinhThucDaoTao() {
  return axios.get(`${ip3}/odoo-hinh-thuc-dao-tao/all`);
}

export async function getLopHanhChinhAdmin(payload: {
  page: number;
  limit: number;
  condition?: any;
}) {
  return axios.get(`${ip3}/odoo-lop-hanh-chinh/pageable`, { params: payload });
}
