import useInitModel from '@/hooks/useInitModel';
import {
  deleteDotTuyenSinh,
  getAllDotTuyenSinh,
  getDotTuyenSinhById,
  getDotTuyenSinhPageable,
  postDotTuyenSinh,
  putDotTuyenSinh,
} from '@/services/DotTuyenSinh/dottuyensinh';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<DotTuyenSinh.Record>();
  const [danhSach, setDanhSach] = useState<DotTuyenSinh.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;

  const getAllDotTuyenSinhModel = async (phuongThucTuyenSinh?: string) => {
    setLoading(true);
    const response = await getAllDotTuyenSinh({ condition: { phuongThucTuyenSinh } });
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDotTuyenSinhPageableModel = async () => {
    setLoading(true);
    const response = await getDotTuyenSinhPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getDotTuyenSinhByIdModel = async (idDot: string) => {
    setLoading(true);
    const response = await getDotTuyenSinhById(idDot);
    setRecord(response?.data?.data);
    setLoading(false);
  };

  const postDotTuyenSinhModel = async (payload: DotTuyenSinh.Record) => {
    try {
      setLoading(true);
      await postDotTuyenSinh(payload);
      getDotTuyenSinhPageableModel();
      message.success('Thêm thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putDotTuyenSinhModel = async (idDotTuyenSinh: string, data: DotTuyenSinh.Record) => {
    if (!idDotTuyenSinh) return;
    try {
      setLoading(true);
      await putDotTuyenSinh(idDotTuyenSinh, data);
      getDotTuyenSinhPageableModel();
      message.success('Lưu thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteDotTuyenSinhModel = async (idDotTuyenSinh: string) => {
    setLoading(true);
    await deleteDotTuyenSinh(idDotTuyenSinh);
    message.success('Xóa thành công');
    getDotTuyenSinhPageableModel();
    setLoading(false);
  };

  return {
    getDotTuyenSinhByIdModel,
    deleteDotTuyenSinhModel,
    putDotTuyenSinhModel,
    postDotTuyenSinhModel,
    getDotTuyenSinhPageableModel,
    getAllDotTuyenSinhModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
