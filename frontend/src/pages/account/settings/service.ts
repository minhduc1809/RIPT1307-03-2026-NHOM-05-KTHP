import { ip3 } from '@/utils/constants';
import request from 'umi-request';

export async function queryCurrent() {
  return request(`${ip3}/odoo-user/sinh-vien/me`);
}

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province: string) {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}
