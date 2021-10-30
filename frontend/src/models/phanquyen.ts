import {
  deleteNhomVaiTro,
  getAllChucNang,
  getAllLoaiChucNang,
  getAllNhomVaiTro,
  getUserPhanNhom,
  postNhomVaiTro,
  putPhanQuyenChucNangNhomVaiTro,
  putUserPhanNhom,
} from '@/services/PhanQuyen/phanquyen';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSachNhomVaiTro, setDanhSachNhomVaiTro] = useState<PhanQuyen.NhomVaiTro[]>([]);
  const [danhSachChucNang, setDanhSachChucNang] = useState<PhanQuyen.ChucNang[]>([]);
  const [danhSachLoaiChucNang, setDanhSachLoaiChucNang] = useState<string[]>([]);
  const [danhSachUser, setDanhSachUser] = useState<PhanQuyen.UserPhanNhom[]>([]);
  const [recordNhomVaiTro, setRecordNhomVaiTro] = useState<PhanQuyen.NhomVaiTro>();
  const [recordUser, setRecordUser] = useState<PhanQuyen.UserPhanNhom>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [query, setQuery] = useState<any>({});
  const [vaiTro, setVaiTro] = useState<string>('can_bo');
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [edit, setEdit] = useState<boolean>(false);

  const getAllNhomVaiTroModel = async () => {
    setLoading(true);
    const response = await getAllNhomVaiTro({ condition: { ...condition, vaiTro } });
    setDanhSachNhomVaiTro(response?.data?.data ?? []);
    setLoading(false);
  };

  const getAllChucNangModel = async () => {
    setLoading(true);
    const response = await getAllChucNang({ condition: { ...condition, vaiTro } });
    setDanhSachChucNang(response?.data?.data ?? []);
    setLoading(false);
  };

  const getAllLoaiChucNangModel = async () => {
    setLoading(true);
    const response = await getAllLoaiChucNang();
    setDanhSachLoaiChucNang(response?.data?.data ?? []);
    setLoading(false);
  };

  const putPhanQuyenChucNangNhomVaiTroModel = async (
    payload: { idNhomVaiTro: string; idChucNang: string }[],
  ) => {
    setLoading(true);
    await putPhanQuyenChucNangNhomVaiTro(payload);
    message.success('Lưu thành công');
    getAllNhomVaiTroModel();
  };

  const postNhomVaiTroModel = async (payload: { _id: string; vaiTro: string }) => {
    setLoading(true);
    await postNhomVaiTro(payload);
    message.success('Thêm thành công');
    getAllNhomVaiTroModel();
    setVisibleForm(false);
  };

  const deleteNhomVaiTroModel = async (payload: { idNhomVaiTro: string }) => {
    setLoading(true);
    await deleteNhomVaiTro(payload);
    message.success('Xóa thành công');
    getAllNhomVaiTroModel();
  };

  const getUserPhanNhomModel = async () => {
    setLoading(true);
    const response = await getUserPhanNhom({ page, limit, vaiTro, ...query });
    setDanhSachUser(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const putUserPhanNhomModel = async (payload: {
    userId: string;
    danhSachNhomVaiTroId: string[];
    vaiTro: string;
  }) => {
    setLoading(true);
    await putUserPhanNhom(payload);
    message.success('Lưu thành công');
    getUserPhanNhomModel();
    setLoading(false);
    setVisibleForm(false);
  };

  return {
    putUserPhanNhomModel,
    recordUser,
    setRecordUser,
    query,
    setQuery,
    danhSachUser,
    setDanhSachUser,
    getUserPhanNhomModel,
    deleteNhomVaiTroModel,
    postNhomVaiTroModel,
    putPhanQuyenChucNangNhomVaiTroModel,
    getAllLoaiChucNangModel,
    danhSachLoaiChucNang,
    setDanhSachLoaiChucNang,
    edit,
    setEdit,
    getAllNhomVaiTroModel,
    getAllChucNangModel,
    danhSachChucNang,
    setDanhSachChucNang,
    setDanhSachNhomVaiTro,
    setRecordNhomVaiTro,
    danhSachNhomVaiTro,
    recordNhomVaiTro,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    vaiTro,
    setVaiTro,
    loading,
    setLoading,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
    page,
    setPage,
    limit,
    setLimit,
  };
};
