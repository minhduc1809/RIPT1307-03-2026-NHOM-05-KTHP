import { handlePhanNhom } from './utils/utils';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: {
  phanNhom: {
    userId: string;
    danhSachPhanNhom: {
      mucDo: string;
      nhomVaiTroId: {
        _id: string;
        danhSachChucNang: string[];
      };
    }[];
    vaiTro: string;
  };
}) {
  const vaiTro = localStorage.getItem('vaiTro');
  const token = localStorage.getItem('token');
  return {
    admin: token && vaiTro && vaiTro === 'Admin',
    giangVien: token && vaiTro && vaiTro === 'giang_vien',
    sinhVien: token && vaiTro && vaiTro === 'sinh_vien',
    quanTri: token && vaiTro && vaiTro === 'quan_tri',
    chuyenVien: token && vaiTro && vaiTro === 'chuyen_vien',
    sinhVienVaGiangVien: token && vaiTro && (vaiTro === 'giang_vien' || vaiTro === 'sinh_vien'),
    canBo: token && vaiTro && vaiTro === 'can_bo',
    giangVienVaCanBo: token && vaiTro && (vaiTro === 'giang_vien' || vaiTro === 'can_bo'),
    sinhVienVaGiangVienVaCanBo:
      token && vaiTro && (vaiTro === 'giang_vien' || vaiTro === 'can_bo' || vaiTro === 'sinh_vien'),
    routeFilter: (route: any) => {
      return handlePhanNhom(initialState, route?.maChucNang);
    },
  };
}
