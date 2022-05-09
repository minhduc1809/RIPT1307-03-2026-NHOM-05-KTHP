import useInitModel from '@/hooks/useInitModel';
import type { Login } from '@/services/ant-design-pro/typings';
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
  const objInitModel = useInitModel('user', 'condition');
  const [record, setRecord] = useState<Login.Profile>();
  const [danhSach, setDanhSach] = useState<Login.Profile[]>([]);
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
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? '0');
    setLoading(false);
  };

  const deleteUserModel = async (id: string, paramCondition?: any) => {
    setLoading(true);
    await deleteUser(id);
    message.success('Xóa thành công');
    getUserPageableModel(paramCondition);
  };

  const postUserModel = async (payload: Login.Profile) => {
    try {
      // setLoading(true);
      await postUser(payload);
      message.success('Thêm thành công');
      getUserPageableModel({ systemRole: payload?.systemRole });
      setVisibleForm(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putUserModel = async (id: string, data: Login.Profile) => {
    try {
      setLoading(true);
      await putUser(id, data);
      getUserPageableModel({ systemRole: data?.systemRole });
      message.success('Lưu thành công');
      setVisibleForm(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const adminChangePasswordModel = async (userId: string, payload: { password: string }) => {
    if (!userId) return;
    try {
      setLoading(true);
      await adminChangePassword(userId, payload);
      message.success('Cập nhật mật khẩu thành công');
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
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
