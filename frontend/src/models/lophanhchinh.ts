import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { getAllHinhThucDaoTao, getLopHanhChinhAdmin } from '@/services/LopHanhChinh/lophanhchinh';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<APILopHanhChinh.RecordAdmin[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [danhSachHinhThucDaoTao, setDanhSachHinhThucDaoTao] = useState<
    APILopHanhChinh.HinhThucDaoTao[]
  >([]);
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<number>(-1);
  const [record, setRecord] = useState<APILopHanhChinh.Data>();
  const [loading, setLoading] = useState<boolean>(true);

  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const getAllHinhThucDaoTaoModel = async () => {
    setLoading(true);
    const response = await getAllHinhThucDaoTao();
    setDanhSachHinhThucDaoTao(response?.data?.data ?? []);
    setLoading(false);
    // setHinhThucDaoTao(response?.data?.data?.[0]?.id);
  };

  const getLopHanhChinhAdminModel = async (payload?: { page: number; limit: number }) => {
    setLoading(true);
    const response = await getLopHanhChinhAdmin({
      page: payload ? payload.page : page,
      limit: payload ? payload.limit : limit,
      condition: {
        ...condition,
        hinh_thuc_dao_tao_id: hinhThucDaoTao === -1 ? undefined : hinhThucDaoTao,
      },
    });
    setTotal(response?.data?.data?.total ?? 0);
    setDanhSach(response?.data?.data?.result ?? []);
    setLoading(false);
  };

  return {
    getAllHinhThucDaoTaoModel,
    getLopHanhChinhAdminModel,
    record,
    setRecord,
    total,
    setTotal,
    danhSach,
    setDanhSach,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    danhSachHinhThucDaoTao,
    setDanhSachHinhThucDaoTao,
    hinhThucDaoTao,
    setHinhThucDaoTao,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    setLoading,
  };
};
