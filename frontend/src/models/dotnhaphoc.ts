import useInitModel from '@/hooks/useInitModel';
import { getDotNhapHocById, getDotNhapHocByIdDotTuyenSinh } from '@/services/DotNhapHoc/dotnhaphoc';
import type { DotNhapHoc } from '@/services/DotNhapHoc/typings';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState<number>(0);
  const [record, setRecord] = useState<DotNhapHoc.Record>();
  const [danhSach, setDanhSach] = useState<DotNhapHoc.Record[]>([]);
  const objInitModel = useInitModel('dot-nhap-hoc', 'condition', setDanhSach, setRecord);
  const { setLoading } = objInitModel;
  const [recordGiayTo, setRecordGiayTo] = useState<DotTuyenSinh.GiayTo>();
  const [danhSachGiayToCanNop, setdanhSachGiayToCanNop] = useState<DotTuyenSinh.GiayTo[]>([]);
  const [editGiayTo, setEditGiayTo] = useState<boolean>(false);
  const [visibleFormGiayTo, setVisibleFormGiayTo] = useState<boolean>(false);
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
    debugger;
    setRecord(response?.data?.data ?? null);
    setLoading(false);
  };

  return {
    current,
    setCurrent,
    editGiayTo,
    setEditGiayTo,
    visibleFormGiayTo,
    setVisibleFormGiayTo,
    recordGiayTo,
    setRecordGiayTo,
    danhSachGiayToCanNop,
    setdanhSachGiayToCanNop,
    getDotNhapHocByIdDotTuyenSinhModel,
    getDotNhapHocByIdModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
