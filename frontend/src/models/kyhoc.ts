import { getAllKyHocByHinhThucDaoTaoGiangVien, getAllKyHocSinhVien } from '@/services/kyhoc/kyhoc';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<KyHoc.Record[]>([]);
  const [record, setRecord] = useState<KyHoc.Record | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllKyHocByHinhThucDaoTaoGiangVienModel = async (idHinhThuc: number) => {
    const response = await getAllKyHocByHinhThucDaoTaoGiangVien(idHinhThuc);
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const getAllKyHocSinhVienModel = async () => {
    const response = await getAllKyHocSinhVien();
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  return {
    getAllKyHocSinhVienModel,
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getAllKyHocByHinhThucDaoTaoGiangVienModel,
  };
};
