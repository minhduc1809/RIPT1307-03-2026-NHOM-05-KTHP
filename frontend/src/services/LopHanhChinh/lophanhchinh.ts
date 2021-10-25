import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getDataLopHanhChinh(role: string) {
  return axios.get(`${ip3}/odoo-lop-hanh-chinh/${role}/me`);
}

export async function getAllHinhThucDaoTao() {
  return axios.get(`${ip3}/odoo-hinh-thuc-dao-tao/all`);
}

export async function getThongBaoLopHanhChinhById(payload: {
  idLop: number;
  role: string;
  data: { page: number; limit: number; cond?: any };
}) {
  return axios.get(
    `${ip3}/odoo-lop-hanh-chinh/${payload.idLop}/${payload.role}/notification/pageable`,
    { params: payload.data },
  );
}

export async function getLopHanhChinhAdmin(payload: {
  page: number;
  limit: number;
  condition?: any;
}) {
  return axios.get(`${ip3}/odoo-lop-hanh-chinh/pageable`, { params: payload });
}

/**
 *
 * @param idLop id lớp hành chính
 * @returns anh sách sinh viên lớp hành chính theo idLop
 */

export async function getDSSVLopHanhChinh(idLop: number) {
  return axios.get(`${ip3}/odoo-lop-hanh-chinh/${idLop}/giang-vien/sv`);
}
