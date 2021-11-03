/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getBieuMauAdmin(payload: { condition: any; page: number; limit: number }) {
  return axios.get(`${ip3}/dvmc/pageable`, { params: payload });
}

export async function getDonSinhVien(payload: { condition: any; page: number; limit: number }) {
  return axios.get(`${ip3}/don-dvmc/my/pageable`, { params: payload });
}

export async function getAllBieuMau() {
  return axios.get(`${ip3}/dvmc`);
}

export async function postBieuMauAdmin(payload: DichVuMotCuaV2.BieuMau) {
  return axios.post(`${ip3}/dvmc`, payload);
}

export async function putBieuMauAdmin(payload: { data: DichVuMotCuaV2.BieuMau; id?: string }) {
  return axios.put(`${ip3}/dvmc/${payload.id}`, payload.data);
}

export async function deleteBieuMauAdmin(id: string) {
  return axios.delete(`${ip3}/dvmc/${id}`);
}

export async function postDonSinhVien(payload: {
  duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[];
  dichVuId: string;
}) {
  return axios.post(`${ip3}/don-dvmc/my`, payload);
}
