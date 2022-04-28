import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { BieuMau } from './typings';

export async function getBieuMauAdminHe(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/bieu-mau/all`, { params: payload });
}

export async function getBieuMauAdmin(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/bieu-mau/pageable`, { params: payload });
}

export async function getBieuMauUser(
  idDotTuyenSinh: string,
  payload: {
    page: number;
    limit: number;
    condition?: any;
  },
) {
  return axios.get(`${ip3}/bieu-mau/thi-sinh/my/dot/${idDotTuyenSinh}`, {
    params: { ...payload, loai: 'Khảo sát' },
  });
}

export async function getBieuMauById(payload: { id: string }) {
  return axios.get(`${ip3}/bieu-mau/${payload.id}`);
}

export async function addBieuMau(payload: BieuMau.Record) {
  return axios.post(`${ip3}/bieu-mau`, payload);
}

export async function putBieuMau(payload: { data: BieuMau.Record; id: string }) {
  return axios.put(`${ip3}/bieu-mau/${payload.id}`, payload.data);
}

export async function kichHoatBieuMau(payload: { id: string; data: { kichHoat: boolean } }) {
  return axios.post(`${ip3}/bieu-mau/${payload.id}/kich-hoat`, payload.data);
}

export async function getBieuMauThongKe(payload: { id: string }) {
  return axios.get(`${ip3}/bieu-mau/${payload.id}/thong-ke`);
}

export async function getIdBieuMauDaTraLoi() {
  return axios.get(`${ip3}/cau-tra-loi-bieu-mau/id-bieu-mau/da-tra-loi?loai=Khảo sát`);
}

export async function delBieuMau(payload: { id: string }) {
  return axios.delete(`${ip3}/bieu-mau/${payload.id}`);
}

export async function traLoiBieuMau(payload: {
  bieuMauId: string;
  danhSachTraLoi: BieuMau.TraLoiRecord[];
}) {
  return axios.post(`${ip3}/cau-tra-loi-bieu-mau/me`, payload);
}

export async function exportKetQuaKhaoSat(payload: { idKhaoSat: string }) {
  return axios.get(`${ip3}/bieu-mau/${payload.idKhaoSat}/tong-hop`, {
    responseType: 'arraybuffer',
  });
}

export async function getMyCauTraLoi(idBieuMau: string) {
  return axios.get(`${ip3}/cau-tra-loi-bieu-mau/me/bieu-mau/${idBieuMau}`);
}
