import useInitModel from '@/hooks/useInitModel';
import {
  deletePhuongThucTuyenSinh,
  getAllPhuongThucTuyenSinh,
  getPhuongThucTuyenSinhById,
  getPhuongThucTuyenSinhPageable,
  postPhuongThucTuyenSinh,
  putPhuongThucTuyenSinh,
} from '@/services/PhuongThucTuyenSinh/phuongthuctuyensinh';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<PhuongThucTuyenSinh.Record>();
  const [danhSach, setDanhSach] = useState<PhuongThucTuyenSinh.Record[]>([]);
  const objInitModel = useInitModel('phuong-thuc-tuyen-sinh');
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;

  const getAllPhuongThucTuyenSinhModel = async () => {
    setLoading(true);
    const response = await getAllPhuongThucTuyenSinh();
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
  };

  const getPhuongThucTuyenSinhPageableModel = async () => {
    setLoading(true);
    const response = await getPhuongThucTuyenSinhPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getPhuongThucTuyenSinhByIdModel = async (idPhuongThuc: string) => {
    setLoading(true);
    const response = await getPhuongThucTuyenSinhById(idPhuongThuc);
    setRecord(response?.data?.data);
    setLoading(false);
  };

  const postPhuongThucTuyenSinhModel = async (payload: PhuongThucTuyenSinh.Record) => {
    try {
      setLoading(true);
      await postPhuongThucTuyenSinh(payload);
      getPhuongThucTuyenSinhPageableModel();
      message.success('Thêm thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putPhuongThucTuyenSinhModel = async (
    idPhuongThuc: string,
    data: PhuongThucTuyenSinh.Record,
  ) => {
    if (!idPhuongThuc) return;
    try {
      setLoading(true);
      await putPhuongThucTuyenSinh(idPhuongThuc, data);
      getPhuongThucTuyenSinhPageableModel();
      message.success('Lưu thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deletePhuongThucTuyenSinhModel = async (idPhuongThuc: string) => {
    setLoading(true);
    await deletePhuongThucTuyenSinh(idPhuongThuc);
    message.success('Xóa thành công');
    getPhuongThucTuyenSinhPageableModel();
    setLoading(false);
  };

  return {
    putPhuongThucTuyenSinhModel,
    deletePhuongThucTuyenSinhModel,
    getPhuongThucTuyenSinhByIdModel,
    postPhuongThucTuyenSinhModel,
    getPhuongThucTuyenSinhPageableModel,
    getAllPhuongThucTuyenSinhModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
