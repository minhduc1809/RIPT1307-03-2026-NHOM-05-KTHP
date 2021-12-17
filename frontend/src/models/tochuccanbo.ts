import { deleteCanBo, postCanBo, putCanBo } from '@/services/ToChucCanBo/tochuccanbo';
import { getUser } from '@/services/User/user';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<Login.Profile[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [record, setRecord] = useState<Login.Profile>({} as Login.Profile);
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleFormCapLaiMatKhau, setVisibleFormCapLaiMatKhau] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const getCanBoModel = async (payload?: { pageParam?: number; limitParam?: number }) => {
    setLoading(true);
    const response = await getUser({
      page: payload?.pageParam ?? page,
      limit: payload?.limitParam ?? limit,
      condition: { ...condition, vai_tro: 'nhan_vien', containsThinhGiang: false },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postCanBoModel = async (payload: ToChucCanBo.Record) => {
    try {
      setLoading(true);
      await postCanBo(payload);
      message.success('Thêm thành công');
      getCanBoModel();
      setVisibleForm(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const putCanBoModel = async (idCanBo: number, payload: ToChucCanBo.Record) => {
    try {
      setLoading(true);
      await putCanBo(idCanBo, payload);
      message.success('Sửa thành công');
      setVisibleForm(false);
      getCanBoModel();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteCanBoModel = async (idCanBo: number) => {
    setLoading(true);
    await deleteCanBo(idCanBo);
    message.success('Xóa thành công');
    setLoading(false);
    getCanBoModel();
  };

  return {
    deleteCanBoModel,
    putCanBoModel,
    postCanBoModel,
    visibleFormCapLaiMatKhau,
    setVisibleFormCapLaiMatKhau,
    getCanBoModel,
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
