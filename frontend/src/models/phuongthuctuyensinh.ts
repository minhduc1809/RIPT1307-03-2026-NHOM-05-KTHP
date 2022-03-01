import useInitModel from '@/hooks/useInitModel';
import {
  getAllPhuongThucTuyenSinh,
  getPhuongThucTuyenSinhPageable,
  postPhuongThucTuyenSinh,
} from '@/services/PhuongThucTuyenSinh/phuongthuctuyensinh';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<PhuongThucTuyenSinh.Record>();
  const [danhSach, setDanhSach] = useState<PhuongThucTuyenSinh.Record[]>([]);
  const objInitModel = useInitModel();
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

  return {
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
