import useInitModel from '@/hooks/useInitModel';
import { getDotNhapHocById, getDotNhapHocByIdDotTuyenSinh } from '@/services/DotNhapHoc/dotnhaphoc';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<DotNhapHoc.Record>();
  const [danhSach, setDanhSach] = useState<DotNhapHoc.Record[]>([]);
  const objInitModel = useInitModel('dot-nhap-hoc', setDanhSach, setRecord);
  const { setLoading } = objInitModel;

  const getDotNhapHocByIdModel = async (idDot: string) => {
    if (!idDot) return;
    setLoading(true);
    const response = await getDotNhapHocById(idDot);
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  const getDotNhapHocByIdDotTuyenSinhModel = async (idDotTuyenSinh: string) => {
    if (!idDotTuyenSinh) return;
    setLoading(true);
    const response = await getDotNhapHocByIdDotTuyenSinh(idDotTuyenSinh);
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  return {
    getDotNhapHocByIdDotTuyenSinhModel,
    getDotNhapHocByIdModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
