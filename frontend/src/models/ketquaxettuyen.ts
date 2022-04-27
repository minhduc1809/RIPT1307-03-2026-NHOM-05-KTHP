import useInitModel from '@/hooks/useInitModel';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import {
  adminTiepNhanXacNhanNhapHoc,
  getKetQuaXetTuyenPageable,
  getMyKetQuaXetTuyen,
  xacNhanKhongNhapHoc,
  xacNhanNhapHoc,
} from '@/services/KetQuaXetTuyen/ketquaxettuyen';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import type { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<KetQuaXetTuyen.Record>();
  const [danhSach, setDanhSach] = useState<KetQuaXetTuyen.Record[]>([]);
  const objInitModel = useInitModel();
  const { setLoading, condition, page, limit, setTotal, setVisibleForm } = objInitModel;

  const getMyKetQuaXetTuyenModel = async (idDotTuyenSinh: string) => {
    try {
      setLoading(true);
      const response = await getMyKetQuaXetTuyen(idDotTuyenSinh);
      setRecord(response?.data?.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getKetQuaXetTuyenPageableModel = async (idDotTuyenSinh: string, idCoSoDaoTao?: string) => {
    if (!idDotTuyenSinh) return;
    setLoading(true);
    const response = await getKetQuaXetTuyenPageable(idDotTuyenSinh, {
      page,
      limit,
      condition: { ...condition, 'nguyenVongTrungTuyen.coSoDaoTao': idCoSoDaoTao },
    });
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

  const adminTiepNhanXacNhanNhapHocModel = async (
    idKetQuaXetTuyen: string,
    payload: {
      danhSachGiayToXacNhanNhapHoc: DotTuyenSinh.GiayTo[];
      danhSachThongTinKhaiXacNhan: KetQuaXetTuyen.ThongTinKhaiXacNhan[];
      ghiChuTiepNhan?: string;
      ngayTiepNhan: string;
      trangThaiXacNhan: ETrangThaiXacNhanNhapHoc;
    },
    idDotTuyenSinh: string,
    idCoSo?: string,
  ) => {
    if (!idKetQuaXetTuyen) return;
    setLoading(true);
    await adminTiepNhanXacNhanNhapHoc(idKetQuaXetTuyen, payload);
    message.success('Xử lý thành công');
    setVisibleForm(false);
    getKetQuaXetTuyenPageableModel(idDotTuyenSinh, idCoSo);
  };

  return {
    adminTiepNhanXacNhanNhapHocModel,
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
