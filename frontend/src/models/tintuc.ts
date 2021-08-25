import { getTinTuc, putTinTuc, addTinTuc, delTinTuc } from '@/services/TinTuc/tintuc';
import { message } from 'antd';
import { useState } from 'react';
import chude from './chude';

export default () => {
  const [danhSach, setDanhSach] = useState<TinTuc.Record[]>([]);

  const [chuDe, setChuDe] = useState<string>('Tất cả');
  const [record, setRecord] = useState<TinTuc.Record>({} as TinTuc.Record);
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const getTinTucModel = async () => {
    setLoading(true);
    const response = await getTinTuc(chuDe, page, limit);
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const addTinTucModel = async (payload: TinTuc.Record) => {
    setLoading(true);
    await addTinTuc(payload);
    message.success('Thêm thành công');
    setLoading(false);
    getTinTucModel();
    setVisibleForm(false);
  };
  const putTinTucModel = async (payload: { id: string; data: TinTuc.Record }) => {
    setLoading(true);
    await putTinTuc(payload);
    message.success('Sửa thành công');
    setLoading(false);
    getTinTucModel();
    setVisibleForm(false);
  };

  const delTinTucModel = async (payload: { id: string }) => {
    setLoading(true);
    await delTinTuc(payload);
    message.success('Xóa thành công');
    getTinTucModel();
    setLoading(false);
  };

  return {
    setRecord,
    addTinTucModel,
    putTinTucModel,
    delTinTucModel,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    setChuDe,
    setPage,
    setLimit,
    danhSach,
    record,
    loading,
    total,
    page,
    chuDe,
    limit,
    getTinTucModel,
  };
};
