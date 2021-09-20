import { delDonVi, getAllDonVi, postDonVi, putDonVi } from '@/services/DonVi/donvi';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<DonVi.Record[]>([]);
  const [record, setRecord] = useState<DonVi.Record | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [position, setPosition] = useState<number>(0);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const getAllDonViModel = async () => {
    setLoading(true);
    const response = await getAllDonVi();
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
    if (record?.id) {
      setRecord(response?.data?.data?.find((item: DonVi.Record) => item.id === record.id));
    }
  };

  const postDonViModel = async (payload: DonVi.Record) => {
    setLoading(true);
    await postDonVi(payload);
    message.success('Thêm thành công');
    setVisibleForm(false);
    getAllDonViModel();
  };

  const putDonViModel = async (payload: DonVi.Record, idDonVi?: number) => {
    if (!idDonVi) return;
    setLoading(true);
    await putDonVi(payload, idDonVi);
    message.success('Sửa thành công');
    setVisibleForm(false);
    getAllDonViModel();
  };

  const delDonViModel = async (idDonVi?: number) => {
    if (!idDonVi) return;
    setLoading(true);
    await delDonVi(idDonVi);
    message.success('Xóa thành công');
    getAllDonViModel();
  };

  return {
    position,
    setPosition,
    delDonViModel,
    postDonViModel,
    putDonViModel,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    danhSach,
    setDanhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getAllDonViModel,
    expandedKeys,
    setExpandedKeys,
  };
};
