import { getAllKyHoc } from '@/services/kyhoc/kyhoc';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<KyHoc.Record[]>([]);
  const [record, setRecord] = useState<KyHoc.Record | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllKyHocModel = async () => {
    const response = await getAllKyHoc();
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  return { danhSach, record, setRecord, loading, setLoading, getAllKyHocModel };
};
