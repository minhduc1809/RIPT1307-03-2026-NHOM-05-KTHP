import { ip3 } from '@/utils/ip';
import request from 'umi-request';

export async function queryCurrent() {
  const role = localStorage.getItem('vaiTro');
  let path = 'sinh-vien';
  if (role === 'nhan_vien') path = 'giang-vien';
  return request(`${ip3}/odoo-user/${path}/me`);
}

export async function queryFakeList(params: { count: number }) {
  return request('/api/fake_list', {
    params,
  });
}
