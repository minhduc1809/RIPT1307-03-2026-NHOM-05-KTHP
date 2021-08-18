import {
  getLopTinChiByHocKy,
  getLopTinChiById,
  getThongBaoLopTinChiById,
  getThongTinChungLopTinChiById,
} from '@/services/LopTinChi/loptinchi';
import type { IResThongBaoLopTinChi, LopTinChi } from '@/services/LopTinChi/typings';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<LopTinChi.Record[]>([]);
  const [record, setRecord] = useState<LopTinChi.Record>({} as any);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [thongTinChung, setThongTinChung] = useState<LopTinChi.ThongTinChungLopTinChiRecord>(
    {} as any,
  );
  const [thongBao, setThongBao] = useState<IResThongBaoLopTinChi.Result[]>({} as any);
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

  return {
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
