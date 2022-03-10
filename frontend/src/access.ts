import type { Login } from './services/ant-design-pro/typings';
import { handlePhanNhom } from './utils/utils';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: {
  currentUser: Login.Profile;
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
  const vaiTro = initialState?.currentUser?.systemRole;
  const verifiedEmail = initialState?.currentUser?.emailVerify?.verified ?? false;
  const verifiedCCCD = initialState?.currentUser?.cmtCccd !== undefined;
  const token = localStorage.getItem('token');
  return {
    admin: token && vaiTro && vaiTro === 'Admin',
    thiSinh: token && vaiTro && verifiedEmail && verifiedCCCD && vaiTro === 'ThiSinh',
    thiSinhChuaKichHoat: token && vaiTro === 'ThiSinh',
    chuyenVien: token && vaiTro && vaiTro === 'ChuyenVien',
    routeFilter: (route: any) => {
      return handlePhanNhom(initialState, route?.maChucNang);
    },
  };
}
