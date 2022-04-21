import type { Login } from '@/services/ant-design-pro/typings';
import {
  deleteNhomVaiTro,
  getAllChucNang,
  getAllLoaiChucNang,
  getAllNhomVaiTro,
  getAllVaiTro,
  getDoiTuongPhanNhomByMucDo,
  getNhomVaiTro,
  postNhomVaiTro,
  putNhomVaiTro,
  putPhanQuyenChucNangNhomVaiTro,
  putUserPhanNhom,
} from '@/services/PhanQuyen/phanquyen';
import { getUserPageable } from '@/services/QuanLyTaiKhoan/quanlytaikhoan';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSachNhomVaiTro, setDanhSachNhomVaiTro] = useState<PhanQuyen.NhomVaiTro[]>([]);
  const [danhSachVaiTro, setDanhSachVaiTro] = useState<PhanQuyen.VaiTro[]>([]);
  const [danhSachChucNang, setDanhSachChucNang] = useState<PhanQuyen.ChucNang[]>([]);
  const [danhSachLoaiChucNang, setDanhSachLoaiChucNang] = useState<string[]>([]);
  const [danhSachDoiTuong, setDanhSachDoiTuong] = useState<PhanQuyen.DoiTuongPhanNhom[]>([]);
  const [danhSachUser, setDanhSachUser] = useState<Login.Profile[]>([]);
  const [danhSachChuyenVienXuLy, setDanhSachChuyenVienXuLy] = useState<Login.Profile[]>([]);
  const [recordNhomVaiTro, setRecordNhomVaiTro] = useState<PhanQuyen.NhomVaiTro>();
  const [record, setRecord] = useState<PhanQuyen.NhomVaiTro>();
  const [recordUser, setRecordUser] = useState<Login.Profile>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [query, setQuery] = useState<any>({});
  const [vaiTro, setVaiTro] = useState<string>();
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

  const getNhomVaiTroModel = async () => {
    setLoading(true);
    const response = await getNhomVaiTro({
      page,
      limit,
      condition: { ...condition, macDinh: false },
    });
    setDanhSachNhomVaiTro(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
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
    try {
      setLoading(true);
      await postNhomVaiTro(payload);
      message.success('Thêm thành công');
      getNhomVaiTroModel();
      setVisibleForm(false);
    } catch (error: any) {
      setLoading(false);
      const { response } = error;
      if (response?.data?.detail?.code === 11000) message.error('Tên nhóm vai trò đã tồn tại');
    }
  };

  const putNhomVaiTroModel = async (payload: { _id?: string; data: { vaiTro: string[] } }) => {
    if (!payload._id) return;
    setLoading(true);
    await putNhomVaiTro(payload);
    message.success('Sửa thành công');
    getNhomVaiTroModel();
    setVisibleForm(false);
  };

  const deleteNhomVaiTroModel = async (payload: { idNhomVaiTro: string }) => {
    setLoading(true);
    await deleteNhomVaiTro(payload);
    message.success('Xóa thành công');
    getNhomVaiTroModel();
  };

  const getUserPhanNhomModel = async () => {
    if (!vaiTro) return;
    setLoading(true);
    const response = await getUserPageable({
      page,
      limit,
      condition: { ...condition, systemRole: vaiTro },
    });
    setRecord(response?.data?.data?.result ?? []);
    setDanhSachUser(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? '0');
    setLoading(false);
  };

  const putUserPhanNhomModel = async (payload: {
    userId: string;
    danhSachPhanNhom: PhanQuyen.PhanNhom[];
  }) => {
    setLoading(true);
    await putUserPhanNhom(payload);
    message.success('Lưu thành công');
    getUserPhanNhomModel();
    setLoading(false);
    setVisibleForm(false);
  };

  const getDoiTuongPhanNhomByMucDoModel = async (mucDo: string) => {
    setLoading(true);
    const response = await getDoiTuongPhanNhomByMucDo(mucDo);
    setDanhSachDoiTuong(response?.data?.data ?? []);
    setLoading(false);
  };

  const getAllVaiTroModel = async () => {
    setLoading(true);
    const response = await getAllVaiTro();
    setDanhSachVaiTro(response?.data?.data ?? []);
    setVaiTro(response?.data?.data?.[0]?.vaiTro);
    setLoading(false);
  };

  return {
    getAllVaiTroModel,
    danhSachVaiTro,
    setDanhSachVaiTro,
    record,
    setRecord,
    getNhomVaiTroModel,
    putNhomVaiTroModel,
    danhSachChuyenVienXuLy,
    setDanhSachChuyenVienXuLy,
    getDoiTuongPhanNhomByMucDoModel,
    danhSachDoiTuong,
    setDanhSachDoiTuong,
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
