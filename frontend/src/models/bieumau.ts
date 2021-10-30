import {
  addBieuMau,
  delBieuMau,
  kichHoatBieuMau,
  getBieuMauById,
  getBieuMauAdmin,
  getBieuMauUser,
  putBieuMau,
  getBieuMauThongKe,
  traLoiBieuMau,
  getIdBieuMauDaTraLoi,
} from '@/services/BieuMau/bieumau';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<BieuMau.Record[]>([]);
  const [loaiBieuMau, setLoaiBieuMau] = useState<string | undefined>(undefined);
  const [listIdBieuMauDaTraLoi, setListIdBieuMauDaTraLoi] = useState<string[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [record, setRecord] = useState<BieuMau.Record>({} as BieuMau.Record);
  const [thongKe, setThongKe] = useState<BieuMau.ThongKe>();
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const getBieuMauAdminModel = async () => {
    setLoading(true);
    const response = await getBieuMauAdmin({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };
  const getBieuMauUserModel = async () => {
    setLoading(true);
    const response = await getBieuMauUser({ page, limit, loai: loaiBieuMau });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getBieuMauByIdModel = async (id: string) => {
    setLoading(true);
    const response = await getBieuMauById({ id });
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  const addBieuMauModel = async (payload: BieuMau.Record) => {
    setLoading(true);
    await addBieuMau(payload);
    message.success('Thêm thành công');
    setLoading(false);
    getBieuMauAdminModel();
    setVisibleForm(false);
  };
  const putBieuMauModel = async (payload: { id: string; data: BieuMau.Record }) => {
    setLoading(true);
    await putBieuMau(payload);
    message.success('Sửa thành công');
    setLoading(false);
    getBieuMauAdminModel();
    setVisibleForm(false);
  };

  const kichHoatBieuMauModel = async (payload: { id: string; data: { kichHoat: boolean } }) => {
    setLoading(true);
    await kichHoatBieuMau(payload);
    message.success('Xử lý thành công');
    setLoading(false);
    getBieuMauAdminModel();
  };

  const delBieuMauModel = async (payload: { id: string }) => {
    setLoading(true);
    await delBieuMau(payload);
    message.success('Xóa thành công');
    getBieuMauAdminModel();
    setLoading(false);
  };

  const getBieuMauThongKeModel = async (id: string) => {
    setLoading(true);
    const response = await getBieuMauThongKe({ id });
    setThongKe(response?.data?.data ?? {});
    setLoading(false);
  };

  const getIdBieuMauDaTraLoiModel = async () => {
    setLoading(true);
    const response = await getIdBieuMauDaTraLoi(loaiBieuMau);
    setListIdBieuMauDaTraLoi(response?.data?.data ?? []);
    setLoading(false);
  };

  const traLoiBieuMauModel = async (payload: {
    idBieuMau: string;
    danhSachTraLoi: KhaiBaoSucKhoe.TraLoiRecord[];
  }) => {
    setLoading(true);
    await traLoiBieuMau(payload);
    message.success('Gửi câu trả lời thành công');
    getIdBieuMauDaTraLoiModel();
    setLoading(false);
    setVisibleForm(false);
  };

  return {
    getIdBieuMauDaTraLoiModel,
    listIdBieuMauDaTraLoi,
    setListIdBieuMauDaTraLoi,
    traLoiBieuMauModel,
    getBieuMauThongKeModel,
    thongKe,
    setThongKe,
    getBieuMauAdminModel,
    filterInfo,
    condition,
    setCondition,
    setFilterInfo,
    kichHoatBieuMauModel,
    getBieuMauByIdModel,
    getBieuMauUserModel,
    setRecord,
    addBieuMauModel,
    putBieuMauModel,
    delBieuMauModel,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    setLoaiBieuMau,
    setPage,
    setLimit,
    danhSach,
    record,
    loading,
    total,
    page,
    loaiBieuMau,
    limit,
  };
};
