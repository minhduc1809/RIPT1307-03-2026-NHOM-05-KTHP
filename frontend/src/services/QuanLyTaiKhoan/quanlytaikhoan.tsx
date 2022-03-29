import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export function getUserPageable(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/user/pageable`, { params: payload });
}

export function getUserId(payload: { id: string }) {
  return axios.get(`${ip3}/user`, { params: payload });
}

export function deleteUser(id: string) {
  return axios.delete(`${ip3}/user/${id}`);
}

export function postUser(payload: QuanLyTaiKhoan.PostRecord) {
  return axios.post(`${ip3}/user`, payload);
}

export function putUser(id: string, payload: QuanLyTaiKhoan.PostRecord) {
  return axios.put(`${ip3}/user/${id}`, payload);
}
