import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function postDonXacNhanTinhTrangHocTap(payload: DichVuMotCua.Record) {
  return axios.post(`${ip3}/dich-vu-mot-cua/xac-nhan-tinh-trang-hoc-tap/sinh-vien`, payload);
}
