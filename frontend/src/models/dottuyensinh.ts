import useInitModel from '@/hooks/useInitModel';
import {
  deleteDotTuyenSinh,
  getAllDotTuyenSinh,
  getDotTuyenSinhById,
  getDotTuyenSinhPageable,
  postDotTuyenSinh,
  putDotTuyenSinh,
} from '@/services/DotTuyenSinh/dottuyensinh';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<DotTuyenSinh.Record>();
  const [danhSach, setDanhSach] = useState<DotTuyenSinh.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;
  const [danhSachGiayToNopHoSo, setdanhSachGiayToNopHoSo] = useState<DotTuyenSinh.GiayTo[]>([]);
  const [danhSachGiayToNopOnline, setdanhSachGiayToNopOnline] = useState<DotTuyenSinh.GiayTo[]>([]);
  const [danhSachNganh, setDanhSachNganh] = useState<DotTuyenSinh.NganhTuyenSinh[]>([]);
  const [editGiayTo, setEditGiayTo] = useState<boolean>(false);
  const [visibleFormGiayTo, setVisibleFormGiayTo] = useState<boolean>(false);
  const [visibleFormNganh, setVisibleFormNganh] = useState<boolean>(false);
  const [recordGiayTo, setRecordGiayTo] = useState<DotTuyenSinh.GiayTo>();
  const [recordNganh, setRecordNganh] = useState<DotTuyenSinh.NganhTuyenSinh>();
  const getAllDotTuyenSinhModel = async (
    payload: {
      phuongThucTuyenSinh?: string;
      namTuyenSinh?: number;
    },
    isSetRecord?: boolean,
  ) => {
    setLoading(true);
    const response = await getAllDotTuyenSinh({
      condition: {
        phuongThucTuyenSinh: payload?.phuongThucTuyenSinh,
        namTuyenSinh: payload?.namTuyenSinh,
      },
    });
    setDanhSach(response?.data?.data ?? []);
    if (isSetRecord) setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const getDotTuyenSinhPageableModel = async () => {
    setLoading(true);
    const response = await getDotTuyenSinhPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getDotTuyenSinhByIdModel = async (idDot: string) => {
    setLoading(true);
    const response = await getDotTuyenSinhById(idDot);
    setRecord(response?.data?.data);
    setLoading(false);
  };

  const postDotTuyenSinhModel = async (payload: DotTuyenSinh.Record) => {
    try {
      setLoading(true);
      await postDotTuyenSinh(payload);
      getDotTuyenSinhPageableModel();
      message.success('Thêm thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putDotTuyenSinhModel = async (idDotTuyenSinh: string, data: DotTuyenSinh.Record) => {
    if (!idDotTuyenSinh) return;
    try {
      setLoading(true);
      await putDotTuyenSinh(idDotTuyenSinh, data);
      getDotTuyenSinhPageableModel();
      message.success('Lưu thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteDotTuyenSinhModel = async (idDotTuyenSinh: string) => {
    setLoading(true);
    await deleteDotTuyenSinh(idDotTuyenSinh);
    message.success('Xóa thành công');
    getDotTuyenSinhPageableModel();
    setLoading(false);
  };

  return {
    visibleFormNganh,
    setVisibleFormNganh,
    recordNganh,
    setRecordNganh,
    danhSachNganh,
    setDanhSachNganh,
    recordGiayTo,
    setRecordGiayTo,
    visibleFormGiayTo,
    setVisibleFormGiayTo,
    editGiayTo,
    setEditGiayTo,
    danhSachGiayToNopHoSo,
    danhSachGiayToNopOnline,
    setdanhSachGiayToNopHoSo,
    setdanhSachGiayToNopOnline,
    getDotTuyenSinhByIdModel,
    deleteDotTuyenSinhModel,
    putDotTuyenSinhModel,
    postDotTuyenSinhModel,
    getDotTuyenSinhPageableModel,
    getAllDotTuyenSinhModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
