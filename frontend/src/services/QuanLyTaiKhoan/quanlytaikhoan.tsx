import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { Login } from '../ant-design-pro/typings';

export function getUserPageable(payload: { page: number; limit: number; condition: any }) {
  return axios.get(`${ip3}/user/pageable`, { params: payload });
}

export async function adminChangePassword(userId: string, payload: { password: string }) {
  return axios.put(`${ip3}/user/${userId}/password`, payload);
}

export function getUserId(payload: { id: string }) {
  return axios.get(`${ip3}/user`, { params: payload });
}

export function deleteUser(id: string) {
  return axios.delete(`${ip3}/user/${id}`);
}

export function postUser(payload: Login.Profile) {
  return axios.post(`${ip3}/user`, payload);
}

export function putUser(id: string, payload: Login.Profile) {
  return axios.put(`${ip3}/user/${id}`, payload);
}
