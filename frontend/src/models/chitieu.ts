import useInitModel from '@/hooks/useInitModel';
import {
  deleteChiTieu,
  getAllChiTieu,
  getChiTieuById,
  getChiTieuByIdDotTuyenSinhIdCoSo,
  getChiTieuPageable,
  KhoiTaoKetQuaXetTuyen,
  postChiTieu,
  putChiTieu,
  adminKhoiTaoChiTieu,
} from '@/services/ChiTieu/chitieu';
import type { EModeKhoiTao } from '@/utils/constants';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel();
  const [danhSach, setDanhSach] = useState<ChiTieu.Record[]>([]);
  const [record, setRecord] = useState<ChiTieu.Record>();
  const [recordChiTieuChiTiet, setRecordChiTieuChiTiet] = useState<ChiTieu.ChiTieuChiTiet>();
  const { setLoading, page, limit, condition, setTotal, setVisibleForm } = objInit;
  const KhoiTaoKetQuaXetTuyenModel = async (
    idDotTuyenSinh: string,
    payload: { mode: EModeKhoiTao },
  ) => {
    if (!idDotTuyenSinh) return;
    try {
      setLoading(true);
      await KhoiTaoKetQuaXetTuyen(idDotTuyenSinh, payload);
      message.success('Khởi tạo thành công');
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getChiTieuPageableModel = async () => {
    setLoading(true);
    const response = await getChiTieuPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getAllChiTieuModel = async () => {
    setLoading(true);
    const response = await getAllChiTieu({ ...condition });
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.length ?? 0);
    setLoading(false);
  };

  const getChiTieuByIdModel = async (idChiTieu: string) => {
    setLoading(true);
    const response = await getChiTieuById(idChiTieu);
    setRecord(response?.data?.data);
    setLoading(false);
  };

  const getChiTieuByIdDotTuyenSinhIdCoSoModel = async (idDot: string, idCoSo: string) => {
    if (!idDot || !idCoSo) return;
    setLoading(true);
    const response = await getChiTieuByIdDotTuyenSinhIdCoSo(idDot, idCoSo);
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  const postChiTieuModel = async (payload: ChiTieu.Record) => {
    try {
      setLoading(true);
      await postChiTieu(payload);
      message.success('Thêm thành công');
      getChiTieuPageableModel();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putChiTieuModel = async (payload: {
    dotTuyenSinh: string;
    coSoDaoTao: string;
    danhSachChiTieuChiTiet: any[];
  }) => {
    try {
      setLoading(true);
      await putChiTieu(payload);
      message.success('Lưu thành công');
      getChiTieuByIdDotTuyenSinhIdCoSoModel(payload?.dotTuyenSinh, payload?.coSoDaoTao);
      setLoading(false);
      setVisibleForm(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteChiTieuModel = async (idChiTieu: string) => {
    setLoading(true);
    await deleteChiTieu(idChiTieu);
    message.success('Xóa thành công');
    getChiTieuPageableModel();
    setLoading(false);
  };

  const adminKhoiTaoChiTieuModel = async (payload: ChiTieu.PayloadKhoiTaoChiTieu) => {
    setLoading(true);
    await adminKhoiTaoChiTieu(payload);
    message.success('Khởi tạo thành công');
    getChiTieuByIdDotTuyenSinhIdCoSoModel(payload?.idDotTuyenSinh, payload?.idCoSoDaoTao);
  };

  return {
    adminKhoiTaoChiTieuModel,
    recordChiTieuChiTiet,
    setRecordChiTieuChiTiet,
    getChiTieuByIdDotTuyenSinhIdCoSoModel,
    getChiTieuByIdModel,
    deleteChiTieuModel,
    putChiTieuModel,
    postChiTieuModel,
    getChiTieuPageableModel,
    getAllChiTieuModel,
    danhSach,
    setDanhSach,
    record,
    setRecord,
    KhoiTaoKetQuaXetTuyenModel,
    ...objInit,
  };
};
