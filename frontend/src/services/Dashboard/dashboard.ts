import { ip3 } from '@/utils/ip';
import axios from 'axios';

const url = 'dashboard';

export function getSoLuongHoSoByIdDot(
  idDot: string,
  payload?: { condition?: any; today?: number },
) {
  return axios.get(`${ip3}/${url}/so-luong/ho-so/dot/${idDot}`, { params: payload });
}

export function getSoLuongNguyenVongByIdDot(
  idDot: string,
  payload: { condition?: any; groupBy: 'coSo' | 'nganh' | 'doiTuong' | 'phuongThuc' },
) {
  return axios.get(`${ip3}/${url}/so-luong/nguyen-vong/dot/${idDot}`, { params: payload });
}
