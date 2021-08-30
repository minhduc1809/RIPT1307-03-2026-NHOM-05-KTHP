import axios from '@/utils/axios';
import { ip3 } from '@/utils/constants';

export async function getKhaiBaoYTeAdmin(payload: {
  data: {
    page: number;
    limit: number;
    condition: any;
  };

  id: string;
}) {
  return axios.get(`${ip3}/bieu-mau/khai-bao-y-te/${payload.id}/pageable`, {
    params: payload.data,
  });
}

export async function getBieuMauKhaiBaoYTe() {
  return axios.get(`${ip3}/bieu-mau/khai-bao-y-te/current`);
}

export async function getLichSuKhaiBaoByUserId(payload: { idBieuMau: string; userId: string }) {
  return axios.get(
    `${ip3}/bieu-mau/khai-bao-y-te/${payload.idBieuMau}/user/${payload.userId}/pageable`,
  );
}
