import useInitModel from '@/hooks/useInitModel';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import {
  getKetQuaXetTuyenPageable,
  getMyKetQuaXetTuyen,
  xacNhanKhongNhapHoc,
  xacNhanNhapHoc,
} from '@/services/KetQuaXetTuyen/ketquaxettuyen';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<KetQuaXetTuyen.Record>();
  const [danhSach, setDanhSach] = useState<KetQuaXetTuyen.Record[]>([]);
  const objInitModel = useInitModel();
  const { setLoading, condition, page, limit, setTotal, setVisibleForm } = objInitModel;

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

  const xacNhanNhapHocModel = async (
    idKetQua: string,
    payload: {
      danhSachGiayToXacNhanNhapHoc: DotTuyenSinh.GiayTo[];
      danhSachThongTinKhaiXacNhan: KetQuaXetTuyen.ThongTinKhaiXacNhan[];
    },
  ) => {
    if (!idKetQua) return;
    try {
      setLoading(true);
      const response = await xacNhanNhapHoc(idKetQua, payload);
      message.success('Xác nhận thành công');
      setLoading(false);
      setRecord(response?.data?.data);
      setVisibleForm(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const xacNhanKhongNhapHocModel = async (idKetQua: string) => {
    setLoading(true);
    const response = await xacNhanKhongNhapHoc(idKetQua);
    message.success('Xác nhận thành công');
    setLoading(false);
    setRecord(response?.data?.data);
  };

  return {
    xacNhanKhongNhapHocModel,
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
