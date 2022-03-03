import useInitModel from '@/hooks/useInitModel';
import {
  deleteDoiTuongTuyenSinh,
  getAllDoiTuongTuyenSinh,
  getDoiTuongTuyenSinhPageable,
  postDoiTuongTuyenSinh,
  putDoiTuongTuyenSinh,
} from '@/services/DoiTuongTuyenSinh/doituongtuyensinh';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<DoiTuongTuyenSinh.Record>();
  const [danhSach, setDanhSach] = useState<DoiTuongTuyenSinh.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;

  const getAllDoiTuongTuyenSinhModel = async (hinhThucDaoTao?: string) => {
    setLoading(true);
    const response = await getAllDoiTuongTuyenSinh({ condition: { hinhThucDaoTao } });
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const getDoiTuongTuyenSinhPageableModel = async () => {
    setLoading(true);
    const response = await getDoiTuongTuyenSinhPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postDoiTuongTuyenSinhModel = async (payload: DoiTuongTuyenSinh.Record) => {
    try {
      setLoading(true);
      await postDoiTuongTuyenSinh(payload);
      getDoiTuongTuyenSinhPageableModel();
      message.success('Thêm thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putDoiTuongTuyenSinhModel = async (
    idDoiTuongTuyenSinh: string,
    data: DoiTuongTuyenSinh.Record,
  ) => {
    if (!idDoiTuongTuyenSinh) return;
    try {
      setLoading(true);
      await putDoiTuongTuyenSinh(idDoiTuongTuyenSinh, data);
      getDoiTuongTuyenSinhPageableModel();
      message.success('Lưu thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteDoiTuongTuyenSinhModel = async (idDoiTuongTuyenSinh: string) => {
    setLoading(true);
    await deleteDoiTuongTuyenSinh(idDoiTuongTuyenSinh);
    message.success('Xóa thành công');
    getDoiTuongTuyenSinhPageableModel();
    setLoading(false);
  };

  return {
    deleteDoiTuongTuyenSinhModel,
    putDoiTuongTuyenSinhModel,
    postDoiTuongTuyenSinhModel,
    getDoiTuongTuyenSinhPageableModel,
    getAllDoiTuongTuyenSinhModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
