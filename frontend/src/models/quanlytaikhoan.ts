import useInitModel from '@/hooks/useInitModel';
import {
  getUserPageable,
  deleteUser,
  postUser,
  putUser,
  adminChangePassword,
} from '@/services/QuanLyTaiKhoan/quanlytaikhoan';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInitModel = useInitModel();
  const [record, setRecord] = useState<QuanLyTaiKhoan.Record>();
  const [danhSach, setDanhSach] = useState<QuanLyTaiKhoan.Record[]>([]);
  const {
    page,
    setPage,
    limit,
    setLimit,
    setLoading,
    condition,
    setCondition,
    setTotal,
    visibleForm,
    setVisibleForm,
    loading,
    edit,
    setEdit,
    total,
    filterInfo,
    setFilterInfo,
  } = objInitModel;

  const getUserPageableModel = async (paramCondition?: any) => {
    setLoading(true);
    const response = await getUserPageable({
      page,
      limit,
      condition: { ...condition, ...paramCondition },
    });
    setRecord(response?.data?.data?.result ?? []);
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? '0');
    setLoading(false);
  };

  const deleteUserModel = async (id: string, paramCondition?: any) => {
    setLoading(true);
    await deleteUser(id);
    getUserPageableModel(paramCondition);
  };

  const postUserModel = async (payload: QuanLyTaiKhoan.PostRecord, paramCondition?: any) => {
    setLoading(true);
    await postUser(payload);
    getUserPageableModel(paramCondition);
  };

  const putUserModel = async (
    id: string,
    data: QuanLyTaiKhoan.PostRecord,
    paramCondition?: any,
  ) => {
    try {
      setLoading(true);
      await putUser(id, data);
      getUserPageableModel(paramCondition);
    } catch (err) {
      setLoading(false);
    }
  };

  const adminChangePasswordModel = async (payload: { user_id?: number; password: string }) => {
    if (!payload?.user_id) return;
    setLoading(true);
    await adminChangePassword(payload);
    message.success('Cấp lại mật khẩu thành công');
    setLoading(false);
  };

  return {
    adminChangePasswordModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    page,
    setPage,
    limit,
    setLimit,
    total,
    condition,
    setCondition,
    setTotal,
    visibleForm,
    setVisibleForm,
    setLoading,
    loading,
    edit,
    setEdit,
    getUserPageableModel,
    filterInfo,
    setFilterInfo,
    deleteUserModel,
    postUserModel,
    putUserModel,
  };
};
