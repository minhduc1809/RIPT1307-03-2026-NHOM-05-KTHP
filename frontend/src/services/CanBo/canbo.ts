import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getCanBoByIdDonVi(idDonVi: number, payload: { page: number; limit: number }) {
  return axios.get(`${ip3}/odoo-don-vi/${idDonVi}/can-bo/goc/pageable`, { params: payload });
}

export async function getCanBoKiemNhiemIdDonVi(
  idDonVi: number,
  payload: { page: number; limit: number },
) {
  return axios.get(`${ip3}/odoo-don-vi/${idDonVi}/can-bo/kiem-nhiem/pageable`, { params: payload });
}
