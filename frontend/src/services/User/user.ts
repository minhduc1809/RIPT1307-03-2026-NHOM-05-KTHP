import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getUser(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/odoo-user/pageable`, { params: payload });
}

export async function adminChangePassword(payload: { user_id?: number; password: string }) {
  return axios.post(`${ip3}/odoo-user/admin/change-password`, payload);
}

export async function putUser(payload: Login.Profile & { partner_id: number }) {
  return axios.put(`${ip3}/odoo-user/admin/profile`, payload);
}

export async function getUserMetaDataFilter(
  payload: {
    vaiTroList: string[];
    lopHanhChinhIds: string[];
    lopTinChiIds: string[];
    donViIds?: string[];
    khoaSinhVienIds?: string[];
    nganhIds?: string[];
  },
  page?: number,
  limit?: number,
) {
  return axios.post(`${ip3}/user-metadata/filter/pageable?page=${page}&limit=${limit}`, payload);
}
