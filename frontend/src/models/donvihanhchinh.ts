import { getQuanHuyenS, getTinhS, getXaPhuongS } from '@/services/DonViHanhChinh/donvihanhchinh';
import type { IRecordTinh } from '@/services/DonViHanhChinh/typing';
import { useState } from 'react';

export default () => {
  const [danhSachTinh, setDanhSachTinh] = useState<IRecordTinh.Datum[]>([]);
  const [danhSachQuanHuyen, setDanhSachQuanHuyen] = useState<IRecordTinh.Datum[]>([]);
  const [danhSachXaPhuong, setDanhSachXaPhuong] = useState<IRecordTinh.Datum[]>([]);
  const [tenTinh, setTenTinh] = useState<string>();
  const [tenQuanHuyen, setTenQuanHuyen] = useState<string>();
  const [tenPhuongXa, setTenXaPhuong] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const getDanhSachTinhModel = async () => {
    setLoading(true);
    const response = await getTinhS();
    setDanhSachTinh(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachQuanHuyenModel = async (maTinh: string) => {
    setLoading(true);
    const response = await getQuanHuyenS({ maTinh });
    setDanhSachQuanHuyen(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachXaPhuongModel = async (maQH: string) => {
    setLoading(true);
    const response = await getXaPhuongS({ maQH });
    setDanhSachXaPhuong(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    tenTinh,
    tenQuanHuyen,
    tenPhuongXa,
    setTenTinh,
    setTenQuanHuyen,
    setTenXaPhuong,
    getDanhSachXaPhuongModel,
    getDanhSachQuanHuyenModel,
    loading,
    setLoading,
    getDanhSachTinhModel,
    danhSachQuanHuyen,
    danhSachTinh,
    danhSachXaPhuong,
    setDanhSachQuanHuyen,
    setDanhSachTinh,
    setDanhSachXaPhuong,
  };
};
