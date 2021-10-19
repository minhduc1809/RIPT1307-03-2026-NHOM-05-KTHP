import {
  getDanhSachBuoiHocByIdLopTinChi,
  getDanhSachSinhVienDiemDanh,
  giangVienDiemDanh,
  khoiTaoDiemDanhByIdBuoiHoc,
} from '@/services/LopTinChi/diemdanh';
import type { BuoiHoc } from '@/services/LopTinChi/typings';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<BuoiHoc.Record[]>([]);
  const [record, setRecord] = useState<BuoiHoc.Record>();
  const [recordDSSV, setRecordDSSV] = useState<BuoiHoc.ListSinhVien>();
  const [loading, setLoading] = useState<boolean>(false);

  const getDanhSachBuoiHocByIdLopTinChiModel = async (idLopTinChi: number) => {
    setLoading(true);
    const response = await getDanhSachBuoiHocByIdLopTinChi(idLopTinChi);
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachSinhVienDiemDanhModel = async () => {
    setLoading(true);
    if (!record?.id) return;
    const response = await getDanhSachSinhVienDiemDanh(record.id);
    setRecordDSSV(response?.data?.data ?? {});
    setLoading(false);
  };

  const khoiTaoDiemDanhByIdBuoiHocModel = async () => {
    if (!record?.id) return;
    const response = await khoiTaoDiemDanhByIdBuoiHoc(record.id);
    if (response?.data?.statusCode === 201) getDanhSachSinhVienDiemDanhModel();
  };

  const giangVienDiemDanhModel = async (dataDiemDanh: {
    danhSachDiemDanh: { id: number; diem_cong: number; trang_thai: string }[];
  }) => {
    if (!record?.id) return;
    setLoading(true);
    await giangVienDiemDanh(record.id, dataDiemDanh);
    setLoading(false);
    message.success('Lưu thành công');
  };

  return {
    giangVienDiemDanhModel,
    setRecordDSSV,
    recordDSSV,
    getDanhSachSinhVienDiemDanhModel,
    khoiTaoDiemDanhByIdBuoiHocModel,
    loading,
    getDanhSachBuoiHocByIdLopTinChiModel,
    danhSach,
    setDanhSach,
    record,
    setRecord,
  };
};
