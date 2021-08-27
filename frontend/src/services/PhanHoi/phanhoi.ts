import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getPhanHoiAdmin(payload: {
  page: number;
  limit: number;
  daTraLoi?: boolean;
  vaiTro?: string;
}) {
  return axios.get(`${ip3}/phan-hoi/pageable`, { params: payload });
}

export async function traLoiPhanHoi(payload: { id: string; data: { noiDungTraLoi: string } }) {
  return axios.post(`${ip3}/phan-hoi/${payload.id}/tra-loi`, payload.data);
}
