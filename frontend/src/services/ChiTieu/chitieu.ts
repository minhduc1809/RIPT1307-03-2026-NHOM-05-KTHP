import axios from '@/utils/axios';
import type { EModeKhoiTao } from '@/utils/constants';
import { ip3 } from '@/utils/ip';

const url = 'chi-tieu';

export function KhoiTaoKetQuaXetTuyen(idDotTuyenSinh: string, payload: { mode: EModeKhoiTao }) {
  return axios.post(`${ip3}/${url}/admin/khoi-tao-ket-qua-xet-tuyen/${idDotTuyenSinh}`, payload);
}

export function getAllChiTieu() {
  return axios.get(`${ip3}/${url}/all`);
}

export function getChiTieuPageable(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/${url}/paging`, { params: payload });
}

export function getChiTieuByIdDotTuyenSinh(idDot: string) {
  return axios.get(`${ip3}/${url}/dot/${idDot}`);
}

export function getChiTieuById(id: string) {
  return axios.get(`${ip3}/${url}/${id}`);
}

export function postChiTieu(payload: ChiTieu.Record) {
  return axios.post(`${ip3}/${url}/admin`, payload);
}

export function putChiTieu(payload: ChiTieu.Record, idChiTieu: string) {
  return axios.put(`${ip3}/${url}/admin/${idChiTieu}`, payload);
}

export function deleteChiTieu(idChiTieu: string) {
  return axios.delete(`${ip3}/${url}/admin/${idChiTieu}`);
}

export function adminKhoiTaoChiTieu(payload: ChiTieu.PayloadKhoiTaoChiTieu) {
  return axios.post(`${ip3}/${url}/admin/khoi-tao`, payload);
}
