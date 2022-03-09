import { getQuanHuyen, getTinhTP, getTruongTHPT } from '@/services/TruongTHPT/truongthpt';
import { useState } from 'react';

export default () => {
  const [danhSachTinh, setDanhSachTinh] = useState<TruongTHPT.Tinh[]>([]);
  const [danhSachQuanHuyen10, setDanhSachQuanHuyen10] = useState<TruongTHPT.QuanHuyen[]>([]);
  const [danhSachTruongTHPT10, setDanhSachTruongTHPT10] = useState<TruongTHPT.Record[]>([]);
  const [danhSachQuanHuyen11, setDanhSachQuanHuyen11] = useState<TruongTHPT.QuanHuyen[]>([]);
  const [danhSachTruongTHPT11, setDanhSachTruongTHPT11] = useState<TruongTHPT.Record[]>([]);
  const [danhSachQuanHuyen12, setDanhSachQuanHuyen12] = useState<TruongTHPT.QuanHuyen[]>([]);
  const [danhSachTruongTHPT12, setDanhSachTruongTHPT12] = useState<TruongTHPT.Record[]>([]);
  const [tenTruong10, setTenTruong10] = useState<string>();
  const [tenTruong11, setTenTruong11] = useState<string>();
  const [tenTruong12, setTenTruong12] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const getTinhTPModel = async () => {
    setLoading(true);
    const response = await getTinhTP();
    setDanhSachTinh(response?.data?.data ?? []);
    setLoading(false);
  };

  const getQuanHuyenModel = async (maTinhTP: string, type: '10' | '11' | '12') => {
    setLoading(true);
    const response = await getQuanHuyen(maTinhTP);
    const data = response?.data?.data ?? [];
    if (type === '10') setDanhSachQuanHuyen10(data);
    else if (type === '11') setDanhSachQuanHuyen11(data);
    else setDanhSachQuanHuyen12(data);
    setLoading(false);
  };

  const getTruongTHPTModel = async (
    maTinhTP: string,
    maQuanHuyen: string,
    type: '10' | '11' | '12',
  ) => {
    setLoading(true);
    const response = await getTruongTHPT(maTinhTP, maQuanHuyen);
    const data = response?.data?.data ?? [];
    if (type === '10') setDanhSachTruongTHPT10(data);
    else if (type === '11') setDanhSachTruongTHPT11(data);
    else setDanhSachTruongTHPT12(data);
    setLoading(false);
  };

  return {
    tenTruong10,
    setTenTruong10,
    tenTruong11,
    setTenTruong11,
    tenTruong12,
    setTenTruong12,
    danhSachTinh,
    setDanhSachTinh,
    danhSachQuanHuyen12,
    danhSachQuanHuyen11,
    danhSachQuanHuyen10,
    setDanhSachQuanHuyen10,
    setDanhSachQuanHuyen11,
    setDanhSachQuanHuyen12,
    danhSachTruongTHPT10,
    danhSachTruongTHPT11,
    danhSachTruongTHPT12,
    setDanhSachTruongTHPT10,
    setDanhSachTruongTHPT11,
    setDanhSachTruongTHPT12,
    loading,
    setLoading,
    getTinhTPModel,
    getQuanHuyenModel,
    getTruongTHPTModel,
  };
};
