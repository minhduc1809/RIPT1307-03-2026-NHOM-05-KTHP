import { getKhoaHoc } from '@/services/KhoaHoc/khoahoc';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<KhoaHoc.Record[]>([]);
  const [record, setRecord] = useState<KhoaHoc.Record>({} as KhoaHoc.Record);
  const [loading, setLoading] = useState<boolean>(true);
  const [condition, setCondition] = useState<any>({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const getKhoaHocModel = async (payload: { pageParam?: number; limitParam?: number }) => {
    setLoading(true);
    const response = await getKhoaHoc({
      page: payload?.pageParam || page,
      limit: payload?.limitParam || limit,
      condition,
    });

    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    getKhoaHocModel,
    danhSach,
    setDanhSach,
    record,
    setRecord,
    loading,
    setLoading,
    condition,
    setCondition,
    filterInfo,
    setFilterInfo,
    total,
    setTotal,
    page,
    setPage,
    limit,
    setLimit,
  };
};
