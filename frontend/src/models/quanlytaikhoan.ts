import useInitModel from '@/hooks/useInitModel';
import {
  getUserPageable,
  deleteUser,
  postUser,
  putUser,
} from '@/services/QuanLyTaiKhoan/quanlytaikhoan';
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

  const getUserPageableModel = async () => {
    setLoading(true);
    const response = await getUserPageable({ page, limit, condition });
    setRecord(response?.data?.data?.result ?? []);
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? '0');
    setLoading(false);
  };

  const deleteUserModal = async (id: any) => {
    setLoading(true);
    await deleteUser(id);
    getUserPageableModel();
    setLoading(false);
  };

  const postUserModal = async (payload: QuanLyTaiKhoan.PostRecord) => {
    setLoading(true);
    await postUser(payload);
    setLoading(false);
  };

  const putUserModal = async (id: string, data: QuanLyTaiKhoan.PostRecord) => {
    try {
      setLoading(true);
      await putUser(id, data);
      getUserPageableModel();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return {
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
    deleteUserModal,
    postUserModal,
    putUserModal,
  };
};
