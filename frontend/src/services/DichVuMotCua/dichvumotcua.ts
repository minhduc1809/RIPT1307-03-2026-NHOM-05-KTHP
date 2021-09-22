import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function postDonSinhVien(payload: DichVuMotCua.Record, pathDon: string) {
  return axios.post(`${ip3}/dich-vu-mot-cua/${pathDon}/sinh-vien`, payload);
}
