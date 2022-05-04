import useInitModel from '@/hooks/useInitModel';
import {
  deleteDotNhapHoc,
  getDotNhapHocById,
  getDotNhapHocPageable,
  postDotNhapHoc,
  putDotNhapHoc,
} from '@/services/DotNhapHoc/dotnhaphoc';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<DotNhapHoc.Record>();
  const [danhSach, setDanhSach] = useState<DotNhapHoc.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;

  const getDotNhapHocByIdModel = async (idDot: string) => {
    if (!idDot) return;
    setLoading(true);
    const response = await getDotNhapHocById(idDot);
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  const getDotNhapHocPageableModel = async () => {
    setLoading(true);
    const response = await getDotNhapHocPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postDotNhapHocModel = async (payload: DotNhapHoc.Record) => {
    try {
      setLoading(true);
      await postDotNhapHoc(payload);
      getDotNhapHocPageableModel();
      message.success('Thêm thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putDotNhapHocModel = async (idDotNhapHoc: string, data: DotNhapHoc.Record) => {
    if (!idDotNhapHoc) return;
    try {
      setLoading(true);
      await putDotNhapHoc(idDotNhapHoc, data);
      getDotNhapHocPageableModel();
      message.success('Lưu thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteDotNhapHocModel = async (idDotNhapHoc: string) => {
    setLoading(true);
    await deleteDotNhapHoc(idDotNhapHoc);
    message.success('Xóa thành công');
    getDotNhapHocPageableModel();
    setLoading(false);
  };

  return {
    deleteDotNhapHocModel,
    putDotNhapHocModel,
    postDotNhapHocModel,
    getDotNhapHocPageableModel,
    getDotNhapHocByIdModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
