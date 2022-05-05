import useInitModel from '@/hooks/useInitModel';
import {
  deleteNganhChuyenNganh,
  getAllNganhChuyenNganh,
  getNganhChuyenNganhPageable,
  postNganhChuyenNganh,
  putNganhChuyenNganh,
} from '@/services/NganhChuyenNganh/nganhchuyennganh';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<NganhChuyenNganh.Record>();
  const [danhSach, setDanhSach] = useState<NganhChuyenNganh.Record[]>([]);
  const objInitModel = useInitModel('nganh-chuyen-nganh');
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;

  const getAllNganhChuyenNganhModel = async () => {
    setLoading(true);
    const response = await getAllNganhChuyenNganh();
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const getNganhChuyenNganhPageableModel = async () => {
    setLoading(true);
    const response = await getNganhChuyenNganhPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postNganhChuyenNganhModel = async (payload: NganhChuyenNganh.Record) => {
    try {
      setLoading(true);
      await postNganhChuyenNganh(payload);
      getNganhChuyenNganhPageableModel();
      message.success('Thêm thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putNganhChuyenNganhModel = async (
    idNganhChuyenNganh: string,
    data: NganhChuyenNganh.Record,
  ) => {
    if (!idNganhChuyenNganh) return;
    try {
      setLoading(true);
      await putNganhChuyenNganh(idNganhChuyenNganh, data);
      getNganhChuyenNganhPageableModel();
      message.success('Lưu thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteNganhChuyenNganhModel = async (idNganhChuyenNganh: string) => {
    setLoading(true);
    await deleteNganhChuyenNganh(idNganhChuyenNganh);
    message.success('Xóa thành công');
    getNganhChuyenNganhPageableModel();
    setLoading(false);
  };

  return {
    deleteNganhChuyenNganhModel,
    putNganhChuyenNganhModel,
    postNganhChuyenNganhModel,
    getNganhChuyenNganhPageableModel,
    getAllNganhChuyenNganhModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
