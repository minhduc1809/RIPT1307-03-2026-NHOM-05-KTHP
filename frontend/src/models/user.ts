import { adminChangePassword, getUser, getUserMetaDataFilter, putUser } from '@/services/User/user';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<Login.Profile[]>([]);
  const [danhSachNguoiDungCuThe, setDanhSachNguoiDungCuThe] = useState<User.NguoiDungCuThe[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [vaiTro, setVaiTro] = useState<string>('sinh_vien');
  const [conditionNguoiDungCuThe, setConditionNguoiDungCuThe] = useState<any>({});
  const [record, setRecord] = useState<Login.Profile>();
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleFormCapLaiMatKhau, setVisibleFormCapLaiMatKhau] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const getUserModel = async (payload?: {
    pageParam?: number;
    limitParam?: number;
    vaiTroParam?: string;
    containsThinhGiang?: boolean;
  }) => {
    setLoading(true);
    const response = await getUser({
      page: payload?.pageParam ?? page,
      limit: payload?.limitParam ?? limit,
      condition: {
        ...condition,
        vai_tro: payload?.vaiTroParam ?? vaiTro,
        containsThinhGiang: payload?.containsThinhGiang,
      },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const adminChangePasswordModel = async (payload: { user_id?: number; password: string }) => {
    if (!payload?.user_id) return;
    setLoading(true);
    await adminChangePassword(payload);
    message.success('Cấp lại mật khẩu thành công');
    setVisibleFormCapLaiMatKhau(false);
    setLoading(false);
  };

  const adminPutProfileUserModel = async (payload: Login.Profile & { partner_id: number }) => {
    if (!payload.partner_id) return;
    setLoading(true);
    await putUser(payload);
    message.success('Lưu thành công');
    setLoading(false);
    getUserModel();
    setVisibleForm(false);
  };

  const getUserMetaDataFilterModel = async (pageParam?: number, limitParam?: number) => {
    const response = await getUserMetaDataFilter(conditionNguoiDungCuThe, pageParam, limitParam);
    setDanhSachNguoiDungCuThe(response?.data?.data?.result ?? []);
  };

  return {
    vaiTro,
    setVaiTro,
    danhSachNguoiDungCuThe,
    setDanhSachNguoiDungCuThe,
    setConditionNguoiDungCuThe,
    conditionNguoiDungCuThe,
    getUserMetaDataFilterModel,
    visibleFormCapLaiMatKhau,
    setVisibleFormCapLaiMatKhau,
    adminPutProfileUserModel,
    adminChangePasswordModel,
    getUserModel,
    danhSach,
    setDanhSach,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    record,
    setRecord,
    loading,
    setLoading,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
    page,
    setPage,
    limit,
    setLimit,
  };
};
