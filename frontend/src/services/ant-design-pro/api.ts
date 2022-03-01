// @ts-ignore
/* eslint-disable */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getInfo() {
  return axios.get(`${ip3}/user/me`);
}

export async function getInfoSinhVien() {
  return axios.get(`${ip3}/odoo-user/sinh-vien/me`);
}

export async function putInfo(payload: Login.Profile) {
  return axios.put(`${ip3}/odoo-user/me/profile`, payload);
}

export async function getInfoAdmin() {
  return axios.get(`${ip3}/user/me`);
}

export async function login(payload: { username?: string; password?: string }) {
  return axios.post(`${ip3}/auth/login/web`, payload);
}

export async function adminlogin(payload: { username?: string; password?: string }) {
  return axios.post(`${ip3}/auth/login/web`, payload);
}

export async function changePassword(payload: { oldPassword: string; newPassword: string }) {
  return axios.post(`${ip3}/odoo-user/me/change/password`, payload);
}
