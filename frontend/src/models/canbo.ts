import { getCanBoByIdDonVi, getCanBoKiemNhiemIdDonVi } from '@/services/CanBo/canbo';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<ChuDe.Record[]>([]);
  const [danhSachKiemNhiem, setDanhSachKiemNhiem] = useState<ChuDe.Record[]>([]);
  const [record, setRecord] = useState<ChuDe.Record>({} as ChuDe.Record);
  const [loading, setLoading] = useState<boolean>(true);
  const [condition, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const getCanBoByIdDonViModel = async (idDonVi: number) => {
    setLoading(true);
    const response = await getCanBoByIdDonVi(idDonVi, { page, limit });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getCanBoKiemNhiemByIdDonViModel = async (idDonVi: number) => {
    setLoading(true);
    const response = await getCanBoKiemNhiemIdDonVi(idDonVi, { page, limit });
    setDanhSachKiemNhiem(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    danhSachKiemNhiem,
    setDanhSachKiemNhiem,
    filterInfo,
    setFilterInfo,
    danhSach,
    record,
    setRecord,
    loading,
    total,
    setTotal,
    page,
    limit,
    setPage,
    setLimit,
    getCanBoByIdDonViModel,
    condition,
    setCondition,
    getCanBoKiemNhiemByIdDonViModel,
  };
};
