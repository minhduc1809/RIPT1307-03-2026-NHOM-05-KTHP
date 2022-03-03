import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'ho-so-xet-tuyen';

export function khoiTaoHoSoXetTuyen(idDotTuyenSinh: string) {
  return axios.post(`${ip3}/${url}/thi-sinh/khoi-tao/dot/${idDotTuyenSinh}`);
}

export function getMyHoSoXetTuyen(idDotTuyenSinh: string) {
  return axios.get(`${ip3}/${url}/thi-sinh/my/${idDotTuyenSinh}`);
}
