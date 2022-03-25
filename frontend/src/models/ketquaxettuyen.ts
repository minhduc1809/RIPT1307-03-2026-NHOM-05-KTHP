import useInitModel from '@/hooks/useInitModel';
import {
  getKetQuaXetTuyenPageable,
  getMyKetQuaXetTuyen,
  xacNhanNhapHoc,
} from '@/services/KetQuaXetTuyen/ketquaxettuyen';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<KetQuaXetTuyen.Record>();
  const [danhSach, setDanhSach] = useState<KetQuaXetTuyen.Record[]>([]);
  const objInitModel = useInitModel();
  const { setLoading, condition, page, limit, setTotal } = objInitModel;

  const getMyKetQuaXetTuyenModel = async (idDotTuyenSinh: string) => {
    setLoading(true);
    const response = await getMyKetQuaXetTuyen(idDotTuyenSinh);
    setRecord(response?.data?.data);
    setLoading(false);
  };

  const getKetQuaXetTuyenPageableModel = async (idDotTuyenSinh: string) => {
    if (!idDotTuyenSinh) return;
    setLoading(true);
    const response = await getKetQuaXetTuyenPageable(idDotTuyenSinh, { page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const xacNhanNhapHocModel = async (mode: 'xac-nhan' | 'khong-xac-nhan', idKetQua: string) => {
    setLoading(true);
    const response = await xacNhanNhapHoc(mode, idKetQua);
    message.success('Xác nhận thành công');
    setLoading(false);
    setRecord(response?.data?.data);
  };

  return {
    getKetQuaXetTuyenPageableModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    getMyKetQuaXetTuyenModel,
    xacNhanNhapHocModel,
    ...objInitModel,
  };
};
