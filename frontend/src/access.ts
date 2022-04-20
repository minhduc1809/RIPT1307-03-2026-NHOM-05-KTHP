import type { Login } from './services/ant-design-pro/typings';
import { ESystemRole } from './utils/constants';
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
    admin: token && vaiTro && vaiTro === ESystemRole.Admin,
    thiSinh: token && vaiTro && verifiedEmail && verifiedCCCD && vaiTro === ESystemRole.ThiSinh,
    thiSinhChuaKichHoat: token && vaiTro === ESystemRole.ThiSinh,
    quanTriVien: token && vaiTro && vaiTro === ESystemRole.QuanTriVien,
    adminVaQuanTriVien:
      token && vaiTro && (vaiTro === ESystemRole.Admin || vaiTro === ESystemRole.QuanTriVien),
    routeFilter: (route: any) => {
      return handlePhanNhom(initialState, route?.maChucNang);
    },
  };
}
