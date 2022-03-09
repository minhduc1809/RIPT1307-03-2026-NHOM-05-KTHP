import { getQuanHuyenS, getTinhS, getXaPhuongS } from '@/services/DonViHanhChinh/donvihanhchinh';
import type { IRecordTinh } from '@/services/DonViHanhChinh/typing';
import { useState } from 'react';

export default () => {
  const [danhSachTinh, setDanhSachTinh] = useState<IRecordTinh.Datum[]>([]);
  const [danhSachQuanHuyenHoKhauThuongTru, setDanhSachQuanHuyenHoKhauThuongTru] = useState<
    IRecordTinh.Datum[]
  >([]);
  const [danhSachXaPhuongHoKhauThuongTru, setDanhSachXaPhuongHoKhauThuongTru] = useState<
    IRecordTinh.Datum[]
  >([]);
  const [danhSachQuanHuyenDiaChiLienHe, setDanhSachQuanHuyenDiaChiLienHe] = useState<
    IRecordTinh.Datum[]
  >([]);
  const [danhSachXaPhuongDiaChiLienHe, setDanhSachXaPhuongDiaChiLienHe] = useState<
    IRecordTinh.Datum[]
  >([]);
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

  const getDanhSachQuanHuyenModel = async (maTinh: string, type: 'HKTT' | 'DCLH') => {
    setLoading(true);
    const response = await getQuanHuyenS({ maTinh });
    if (type === 'HKTT') setDanhSachQuanHuyenHoKhauThuongTru(response?.data?.data ?? []);
    else setDanhSachQuanHuyenDiaChiLienHe(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachXaPhuongModel = async (maQH: string, type: 'HKTT' | 'DCLH') => {
    setLoading(true);
    const response = await getXaPhuongS({ maQH });
    if (type === 'HKTT') setDanhSachXaPhuongHoKhauThuongTru(response?.data?.data ?? []);
    else setDanhSachXaPhuongDiaChiLienHe(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    danhSachQuanHuyenDiaChiLienHe,
    danhSachQuanHuyenHoKhauThuongTru,
    danhSachXaPhuongDiaChiLienHe,
    danhSachXaPhuongHoKhauThuongTru,
    setDanhSachXaPhuongDiaChiLienHe,
    setDanhSachXaPhuongHoKhauThuongTru,
    setDanhSachQuanHuyenDiaChiLienHe,
    setDanhSachQuanHuyenHoKhauThuongTru,
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

    danhSachTinh,

    setDanhSachTinh,
  };
};
