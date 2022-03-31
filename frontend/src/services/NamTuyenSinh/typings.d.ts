import type { EHinhThucDangKyXetTuyen } from '@/utils/constants';

declare module NamTuyenSinh {
  export interface Record {
    _id: string;
    hinhThucDaoTao: HinhThucDaoTao.Record;
    nam: number;
    urlAnhMoTa: string;
    noiDung: string;
    moTa: string;
    hinhThucDangKyXetTuyen: EHinhThucDangKyXetTuyen;
    danhSachPhuongThuc: {
      moTaPhuongThuc: string;
      phuongThucTuyenSinh: PhuongThucTuyenSinh.Record;
    }[];
  }
}
