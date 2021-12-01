import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function thongKeNhanSu() {
  return axios.get(`${ip3}/dashboard/thong-ke-nhan-su`);
}

export async function thongKeDonVi() {
  return axios.get(`${ip3}/dashboard/thong-ke-theo-don-vi`);
}

export async function thongKeThongBao() {
  return axios.get(`${ip3}/dashboard/thong-ke-thong-bao`);
}

export async function thongKePhanHoi() {
  return axios.get(`${ip3}/dashboard/thong-ke-phan-hoi`);
}
