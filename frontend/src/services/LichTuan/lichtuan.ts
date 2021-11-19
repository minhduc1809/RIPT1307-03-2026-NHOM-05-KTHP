/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getBanChinhThuc(payload: { from: any; to: any }) {
  return axios.get(`${ip3}/lich-tuan/from/${payload.from}/to/${payload.to}`);
}

export async function get(payload: any) {
  return axios.get(`${ip3}/lich-tuan`, { params: payload });
}

export async function del(payload: { _id: any }) {
  const { _id } = payload;
  return axios.delete(`${ip3}/lich-tuan/${_id}`);
}

export async function add(payload: LichTuan.Record) {
  return axios.post(`${ip3}/lich-tuan/`, payload);
}

export async function upd(payload: LichTuan.Record) {
  const { _id } = payload;
  delete payload._id;
  return axios.put(`${ip3}/lich-tuan/${_id}`, payload);
}

export async function phatHanhLichTuan(payload: { tuan: number; nam: number }) {
  return axios.post(`${ip3}/lich-tuan/phat-hanh-lich-tuan/${payload.tuan}/${payload.nam}`);
}
