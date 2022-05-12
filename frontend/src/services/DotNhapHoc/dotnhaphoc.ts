import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { DotNhapHoc } from './typings';

const url = 'dot-nhap-hoc';

export function getDotNhapHocByKetQuaXetTuyen(idKetQuaXetTuyen: string) {
  return axios.get(`${ip3}/${url}/thi-sinh/ket-qua-trung-tuyen/${idKetQuaXetTuyen}`);
}

export function getDotNhapHocPageable(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/${url}`, { params: payload });
}

export function getDotNhapHocById(id: string) {
  return axios.get(`${ip3}/${url}/${id}`);
}

export function postDotNhapHoc(payload: DotNhapHoc.Record) {
  return axios.post(`${ip3}/${url}`, payload);
}

export function putDotNhapHoc(idDotNhapHoc: string, data: DotNhapHoc.Record) {
  return axios.put(`${ip3}/${url}/${idDotNhapHoc}`, data);
}

export function deleteDotNhapHoc(id: string) {
  return axios.delete(`${ip3}/${url}/${id}`);
}
