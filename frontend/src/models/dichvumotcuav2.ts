/* eslint-disable no-underscore-dangle */
import {
  getBieuMauAdmin,
  postBieuMauAdmin,
  putBieuMauAdmin,
  deleteBieuMauAdmin,
  getAllBieuMau,
  getDonSinhVien,
  postDonSinhVien,
} from '@/services/DichVuMotCuaV2/dichvumotcuav2';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<DichVuMotCuaV2.BieuMau[]>([]);
  const [danhSachDon, setDanhSachDon] = useState<DichVuMotCuaV2.Don[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [record, setRecord] = useState<DichVuMotCuaV2.BieuMau>();
  const [recordDon, setRecordDon] = useState<DichVuMotCuaV2.Don>();
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleFormBieuMau, setVisibleFormBieuMau] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [typeForm, setTypeForm] = useState<string>('add');

  const getBieuMauAdminModel = async () => {
    setLoading(true);
    const response = await getBieuMauAdmin({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getDonSinhVienModel = async () => {
    setLoading(true);
    const response = await getDonSinhVien({ page, limit, condition });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getAllBieuMauModel = async () => {
    setLoading(true);
    const response = await getAllBieuMau();
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const postBieuMauAdminModel = async (payload: DichVuMotCuaV2.BieuMau) => {
    setLoading(true);
    await postBieuMauAdmin(payload);
    message.success('Thêm thành công');
    setLoading(false);
    setVisibleForm(false);
    getBieuMauAdminModel();
  };

  const putBieuMauAdminModel = async (payload: { data: DichVuMotCuaV2.BieuMau; id?: string }) => {
    setLoading(true);
    await putBieuMauAdmin(payload);
    message.success('Lưu thành công');
    setLoading(false);
    setVisibleForm(false);
    getBieuMauAdminModel();
  };

  const deleteBieuMauAdminModel = async (id: string) => {
    if (!id) return;
    setLoading(true);
    await deleteBieuMauAdmin(id);
    message.success('Xóa thành công');
    setLoading(false);
    getBieuMauAdminModel();
  };

  const postDonSinhVienModel = async (payload: {
    duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[];
    dichVuId: string;
  }) => {
    setLoading(true);
    await postDonSinhVien(payload);
    message.success('Gửi đơn thành công');
    setLoading(false);
    setVisibleFormBieuMau(false);
  };

  return {
    typeForm,
    setTypeForm,
    postDonSinhVienModel,
    danhSachDon,
    setDanhSachDon,
    recordDon,
    setRecordDon,
    getDonSinhVienModel,
    getAllBieuMauModel,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    deleteBieuMauAdminModel,
    putBieuMauAdminModel,
    postBieuMauAdminModel,
    getBieuMauAdminModel,
    danhSach,
    setDanhSach,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    record,
    setRecord,
    loading,
    setLoading,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
    page,
    limit,
    setPage,
    setLimit,
  };
};
