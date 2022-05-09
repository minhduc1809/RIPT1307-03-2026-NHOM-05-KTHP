import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'huong-dan-nhap-hoc';

export const thiSinhGetHuongDanNhapHocByDotTuyenSinhAndDotNhapHoc = async (
  idDotTuyenSinh: string,
  idDotNhapHoc: string,
) => {
  return axios.get(
    `${ip3}/${url}/thi-sinh/dot-tuyen-sinh/${idDotTuyenSinh}/dot-nhap-hoc/${idDotNhapHoc}`,
  );
};

export const getHuongDanNhapHocByDotNhapHoc = async (idDotNhapHoc: string) => {
  return axios.get(`${ip3}/${url}/dot-nhap-hoc/${idDotNhapHoc}`);
};
