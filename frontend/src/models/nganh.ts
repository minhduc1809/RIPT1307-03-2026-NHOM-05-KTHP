import { getAllNganh } from '@/services/NganhHoc/nganh';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<NganhHoc.Record[]>([]);

  const [condition, setCondition] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getAllNganhModel = async () => {
    setLoading(true);
    const response = await getAllNganh({ condition });
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    danhSach,
    setDanhSach,
    condition,
    setCondition,
    getAllNganhModel,
    loading,
    setLoading,
  };
};
