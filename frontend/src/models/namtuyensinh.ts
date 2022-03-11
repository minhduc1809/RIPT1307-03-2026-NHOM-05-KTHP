import useInitModel from '@/hooks/useInitModel';
import {
  deleteNamTuyenSinh,
  getAllNamTuyenSinh,
  getNamTuyenSinhPageable,
  postNamTuyenSinh,
  putNamTuyenSinh,
} from '@/services/NamTuyenSinh/namtuyensinh';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<NamTuyenSinh.Record>();
  const [danhSach, setDanhSach] = useState<NamTuyenSinh.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;

  const getAllNamTuyenSinhModel = async (hinhThucDaoTao?: string) => {
    setLoading(true);
    const response = await getAllNamTuyenSinh({ condition: { hinhThucDaoTao } });
    setDanhSach(response?.data?.data ?? []);
    if (!record?._id) setRecord(response?.data?.data?.[response?.data?.data?.length - 1 ?? 0]);
    setLoading(false);
  };

  const getNamTuyenSinhPageableModel = async () => {
    setLoading(true);
    const response = await getNamTuyenSinhPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postNamTuyenSinhModel = async (payload: NamTuyenSinh.Record) => {
    try {
      setLoading(true);
      await postNamTuyenSinh(payload);
      getNamTuyenSinhPageableModel();
      message.success('Thêm thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putNamTuyenSinhModel = async (idNamTuyenSinh: string, data: NamTuyenSinh.Record) => {
    if (!idNamTuyenSinh) return;
    try {
      setLoading(true);
      await putNamTuyenSinh(idNamTuyenSinh, data);
      getNamTuyenSinhPageableModel();
      message.success('Lưu thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteNamTuyenSinhModel = async (idNamTuyenSinh: string) => {
    setLoading(true);
    await deleteNamTuyenSinh(idNamTuyenSinh);
    message.success('Xóa thành công');
    getNamTuyenSinhPageableModel();
    setLoading(false);
  };

  return {
    deleteNamTuyenSinhModel,
    putNamTuyenSinhModel,
    postNamTuyenSinhModel,
    getNamTuyenSinhPageableModel,
    getAllNamTuyenSinhModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
