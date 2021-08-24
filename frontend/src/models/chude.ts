import { addChuDe, delChuDe, getAllLoaiChuDe, getChuDe, putChuDe } from '@/services/ChuDe/chude';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<ChuDe.Record[]>([]);
  const [danhSachLoaiChuDe, setDanhSachLoaiChuDe] = useState<string[]>([]);
  const [loaiChuDe, setLoaiChuDe] = useState<string>('Tất cả');
  const [record, setRecord] = useState<ChuDe.Record>({} as ChuDe.Record);
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const getAllLoaiChuDeModel = async () => {
    setLoading(true);
    const response = await getAllLoaiChuDe();
    setDanhSachLoaiChuDe(response?.data?.data ?? []);
    setLoading(false);
  };
  const getChuDeModel = async () => {
    setLoading(true);
    const response = await getChuDe(loaiChuDe, page, limit);
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const addChuDeModel = async (payload: ChuDe.Record) => {
    setLoading(true);
    await addChuDe(payload);
    message.success('Thêm thành công');
    setLoading(false);
    getChuDeModel();
    setVisibleForm(false);
  };
  const putChuDeModel = async (payload: { id: string; data: ChuDe.Record }) => {
    setLoading(true);
    await putChuDe(payload);
    message.success('Sửa thành công');
    setLoading(false);
    getChuDeModel();
    setVisibleForm(false);
  };

  const delChuDeModel = async (payload: { id: string }) => {
    setLoading(true);
    await delChuDe(payload);
    message.success('Xóa thành công');
    getChuDeModel();
    setLoading(false);
  };

  return {
    setRecord,
    addChuDeModel,
    putChuDeModel,
    delChuDeModel,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    setLoaiChuDe,
    setPage,
    setLimit,
    danhSach,
    record,
    loading,
    total,
    page,
    loaiChuDe,
    limit,
    getAllLoaiChuDeModel,
    danhSachLoaiChuDe,
    getChuDeModel,
  };
};
