import { getAllDonVi } from '@/services/DonVi/donvi';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<DonVi.Record[]>([]);
  const [record, setRecord] = useState<DonVi.Record | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const getAllDonViModel = async () => {
    setLoading(true);
    const response = await getAllDonVi();
    setDanhSach(response?.data?.data ?? []);
    setExpandedKeys(
      response?.data?.data?.map((item: DonVi.Record) => {
        return item?.id;
      }),
    );
    setLoading(false);
  };

  return {
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
