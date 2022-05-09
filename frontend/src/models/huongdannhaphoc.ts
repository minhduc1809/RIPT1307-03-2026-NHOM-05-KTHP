import useInitModel from '@/hooks/useInitModel';
import {
  getHuongDanNhapHocByDotNhapHoc,
  thiSinhGetHuongDanNhapHocByDotTuyenSinhAndDotNhapHoc,
} from '@/services/HuongDanNhapHoc/huongdannhaphoc';
import type { HuongDanNhapHoc } from '@/services/HuongDanNhapHoc/typings';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<HuongDanNhapHoc.Record>();
  const [danhSach, setDanhSach] = useState<HuongDanNhapHoc.Record[]>([]);
  const objInitModel = useInitModel('huong-dan-nhap-hoc', 'condition', setDanhSach, setRecord);
  const { setLoading } = objInitModel;

  const thiSinhGetHuongDanNhapHocByDotTuyenSinhAndDotNhapHocModel = async (
    idDotTuyenSinh: string,
    idDotNhapHoc: string,
  ) => {
    setLoading(true);
    const response = await thiSinhGetHuongDanNhapHocByDotTuyenSinhAndDotNhapHoc(
      idDotTuyenSinh,
      idDotNhapHoc,
    );
    setRecord(response?.data?.data ?? null);
    setLoading(false);
  };

  const getHuongDanNhapHocByDotNhapHocModel = async (idDotNhapHoc: string) => {
    setLoading(true);
    const response = await getHuongDanNhapHocByDotNhapHoc(idDotNhapHoc);
    setRecord(response?.data?.data ?? null);
    setLoading(false);
  };

  return {
    getHuongDanNhapHocByDotNhapHocModel,
    record,
    danhSach,
    setRecord,
    setDanhSach,
    ...objInitModel,
    thiSinhGetHuongDanNhapHocByDotTuyenSinhAndDotNhapHocModel,
  };
};
