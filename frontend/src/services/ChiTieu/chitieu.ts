import axios from '@/utils/axios';
import type { EModeKhoiTao } from '@/utils/constants';
import { ip3 } from '@/utils/ip';

const url = 'chi-tieu';

export function KhoiTaoKetQuaXetTuyen(idDotTuyenSinh: string, payload: { mode: EModeKhoiTao }) {
  return axios.post(`${ip3}/${url}/admin/khoi-tao-ket-qua-xet-tuyen/${idDotTuyenSinh}`, payload);
}
