import {
  getDanhSachHocPhanDangKy,
  getDotDangKyByHocKy,
  getPhieuDangKyByDot,
  getThongTinKyHoc,
  khoiTaoPhieuDangKy,
  postDanhSachHocPhanDangKy,
} from '@/services/DangKyTinChi/dangkytinchi';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [recordDot, setRecordDot] = useState<DangKyTinChi.DotDangKy | undefined | null>(undefined);
  const [recordThongTinKyHoc, setRecordThongTinKyHoc] = useState<DangKyTinChi.ThongTinKyHoc>({
    tinChiDangKyToiDa: 0,
    tinChiDangKyToiThieu: 0,
    hocPhi: 0,
  });
  const [recordPhieuDangKy, setRecordPhieuDangKy] = useState<
    DangKyTinChi.PhieuDangKy | null | undefined
  >(undefined);
  const [recordHocPhan, setRecordHocPhan] = useState<DangKyTinChi.DanhSachHocPhan | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(true);

  const getDotDangKyByKyHocModel = async (idHocKy?: number) => {
    if (!idHocKy) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await getDotDangKyByHocKy(idHocKy);
    setRecordDot(response?.data?.data ?? null);
    // setLoading(false);
  };

  const getPhieuDangKyByDotModel = async () => {
    if (!recordDot?.id) {
      setLoading(false);
      return;
    }
    // setLoading(true);
    const response = await getPhieuDangKyByDot(recordDot.id);
    setRecordPhieuDangKy(response?.data?.data ?? null);
    setLoading(false);
  };

  const getDanhSachHocPhanDangKyModel = async () => {
    // setLoading(true);
    const response = await getDanhSachHocPhanDangKy();
    setRecordHocPhan(response?.data?.data);
    // setLoading(false);
  };

  const postDanhSachHocPhanDangKyModel = async (danhSachHocPhan: { idHocPhan: number }[]) => {
    setLoading(true);
    const response = await postDanhSachHocPhanDangKy({
      idPhieuDangKy: recordPhieuDangKy?.phieuDangKy.id,
      data: { danhSachHocPhan },
    });
    if (response?.data?.data?.success) {
      message.success('Lưu thành công');
      getPhieuDangKyByDotModel();
    }
    setLoading(false);
  };

  const getThongTinKyHocModel = async (idHocKy?: number) => {
    if (!idHocKy) return;
    // setLoading(true);
    const response = await getThongTinKyHoc(idHocKy);
    setRecordThongTinKyHoc(response?.data?.data);
    // setLoading(false);
  };

  const khoiTaoPhieuDangKyModel = async () => {
    if (!recordDot?.id) return;
    setLoading(true);
    await khoiTaoPhieuDangKy(recordDot.id);
    message.success('Khởi tạo thành công');
    setLoading(false);
  };

  return {
    khoiTaoPhieuDangKyModel,
    getThongTinKyHocModel,
    recordThongTinKyHoc,
    danhSach,
    recordHocPhan,
    postDanhSachHocPhanDangKyModel,
    setRecordHocPhan,
    getDanhSachHocPhanDangKyModel,
    getPhieuDangKyByDotModel,
    recordPhieuDangKy,
    setDanhSach,
    recordDot,
    setRecordDot,
    loading,
    current,
    setCurrent,
    setLoading,
    getDotDangKyByKyHocModel,
  };
};
