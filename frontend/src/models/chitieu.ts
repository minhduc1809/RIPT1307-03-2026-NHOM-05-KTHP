import useInitModel from '@/hooks/useInitModel';
import {
  deleteChiTieu,
  getAllChiTieu,
  getChiTieuById,
  getChiTieuByIdDotTuyenSinh,
  getChiTieuPageable,
  KhoiTaoKetQuaXetTuyen,
  postChiTieu,
  putChiTieu,
} from '@/services/ChiTieu/chitieu';
import type { EModeKhoiTao } from '@/utils/constants';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel();
  const [danhSach, setDanhSach] = useState<ChiTieu.Record[]>([]);
  const [record, setRecord] = useState<ChiTieu.Record>();
  const { setLoading, page, limit, condition, setTotal } = objInit;
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
    const response = await getAllChiTieu();
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

  const getChiTieuByIdDotTuyenSinhModel = async (idDot: string) => {
    setLoading(true);
    const response = await getChiTieuByIdDotTuyenSinh(idDot);
    setRecord(response?.data?.data);
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

  const putChiTieuModel = async (payload: ChiTieu.Record, idChiTieu: string) => {
    try {
      setLoading(true);
      await putChiTieu(payload, idChiTieu);
      message.success('Lưu thành công');
      getChiTieuPageableModel();
      setLoading(false);
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

  return {
    getChiTieuByIdDotTuyenSinhModel,
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
