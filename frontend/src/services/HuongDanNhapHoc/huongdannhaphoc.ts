import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'huong-dan-nhap-hoc';

export const thiSinhGetHuongDanNhapHocByKetQuaXetTuyen = async (idKetQuaXetTuyen: string) => {
  return axios.get(`${ip3}/${url}/thi-sinh/ket-qua-xet-tuyen/${idKetQuaXetTuyen}`);
};

export const adminGetHuongDanNhapHocByKetQuaXetTuyen = async (idKetQua: string) => {
  return axios.get(`${ip3}/${url}/admin/ket-qua-xet-tuyen/${idKetQua}`);
};

export const getHuongDanNhapHocByDotNhapHoc = async (
  idDotNhapHoc: string,
  payload: {
    page: number;
    limit: number;
    condition?: any;
  },
) => {
  return axios.get(`${ip3}/${url}/dot-nhap-hoc/${idDotNhapHoc}`, { params: payload });
};
