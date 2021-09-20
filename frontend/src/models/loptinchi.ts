import {
  getDanhSachSinhVienByIdNhomLop,
  getLopTinChiByHocKy,
  getLopTinChiById,
  getNhomLopTinChiById,
  getThongBaoLopTinChiById,
  getThongTinChungLopTinChiById,
} from '@/services/LopTinChi/loptinchi';
import type { IResThongBaoLopTinChi, LopTinChi } from '@/services/LopTinChi/typings';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<LopTinChi.Record[]>([]);
  const [danhSachNhomLop, setDanhSachNhomLop] = useState<LopTinChi.NhomLopTinChi[]>();
  const [idNhomLop, setIdNhomLop] = useState<number>(-1);
  const [danhSachSinhVien, setDanhSachSinhVien] = useState<LopTinChi.SinhVienRecord[]>([]);
  const [record, setRecord] = useState<LopTinChi.Record>({} as any);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [thongTinChung, setThongTinChung] = useState<LopTinChi.ThongTinChungLopTinChiRecord>(
    {} as any,
  );
  const [thongBao, setThongBao] = useState<IResThongBaoLopTinChi.Result[]>({} as any);
  // user
  const getLopTinChiByHocKyModel = async (payload: { idHocKy: number }) => {
    if (!payload.idHocKy) return;
    setLoading(true);
    const response = await getLopTinChiByHocKy(payload.idHocKy);
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.length);
    setLoading(false);
  };

  const getThongTinChungLopTinChi = async (idLop: number) => {
    setLoading(true);
    const response = await getThongTinChungLopTinChiById(idLop);
    setThongTinChung(response?.data?.data);
    setLoading(false);
  };

  const getThongBaoLopTinChi = async (payload: any) => {
    setLoading(true);
    const response = await getThongBaoLopTinChiById(payload);
    setThongBao(response?.data?.data?.result);
    setLoading(false);
  };

  const getLopTinChiByIdLop = async (idLop: number) => {
    setLoading(true);
    const response = await getLopTinChiById(idLop);
    setRecord(response?.data?.data);
    setLoading(false);
  };

  const getNhomLopTinChiByIdModel = async () => {
    if (!record.id) return;
    setLoading(true);
    const response = await getNhomLopTinChiById(record.id);
    setDanhSachNhomLop(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachSinhVienByIdNhomLopModel = async () => {
    if (idNhomLop === -1) return;
    setLoading(true);
    const response = await getDanhSachSinhVienByIdNhomLop(idNhomLop);
    setDanhSachSinhVien(response?.data?.data?.sinhVienList ?? []);
    setLoading(false);
  };

  return {
    getDanhSachSinhVienByIdNhomLopModel,
    danhSachSinhVien,
    idNhomLop,
    setIdNhomLop,
    danhSachNhomLop,
    setDanhSachNhomLop,
    getNhomLopTinChiByIdModel,
    getThongTinChungLopTinChi,
    getThongBaoLopTinChi,
    getLopTinChiByIdLop,
    thongTinChung,
    thongBao,
    danhSach,
    page,
    limit,
    setLimit,
    setPage,
    record,
    setRecord,
    loading,
    setLoading,
    total,
    getLopTinChiByHocKyModel,
  };
};
