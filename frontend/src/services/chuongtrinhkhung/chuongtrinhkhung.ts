import { request } from 'umi';
import { ip3 } from '@/utils/constants';

export async function get(options: Record<string, any>) {
  return request<ChuongTrinhKhung.RootObject>(
    `${ip3}/api/danh_sach_chuong_trinh_khung?domain=[("nganh_id","=",${options.id})]&fields=["ky_hoc_id", "name", "so_tin_chi"]`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
