import {
  getDanhSachHocPhanDangKy,
  getDotDangKyNhuCauByHocKy,
  getDotDangKyTinChiByHocKy,
  getDSLopDaDangKyByIdDot,
  getDSLopTinChiByIdDotAndIdMonHoc,
  getDSNhomLopTinChiByIdLopTinChi,
  getPhieuDangKyByDot,
  getThongTinKyHoc,
  khoiTaoPhieuDangKy,
  postDanhSachHocPhanDangKy,
  postDanhSachLopDangKy,
} from '@/services/DangKyTinChi/dangkytinchi';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<any[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [recordDotNhuCau, setRecordDotNhuCau] = useState<
    DangKyTinChi.DotDangKyNhuCau | undefined | null
  >(undefined);
  const [recordDotTinChi, setRecordDotTinChi] = useState<
    DangKyTinChi.DotDangKyTinChi | undefined | null
  >(undefined);
  const [danhSachLopDaDangKy, setDanhSachLopDaDangKy] = useState<DangKyTinChi.LopDaDangKy[]>([]);
  const [danhSachLopTinChi, setDanhSachLopTinChi] = useState<DangKyTinChi.LopTinChi[]>([]);
  const [danhSachNhomLopTinChi, setDanhSachNhomLopTinChi] = useState<DangKyTinChi.NhomLopTinChi[]>(
    [],
  );
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

  const getDotDangKyNhuCauByKyHocModel = async (idHocKy?: number) => {
    if (!idHocKy) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await getDotDangKyNhuCauByHocKy(idHocKy);
    setRecordDotNhuCau(response?.data?.data ?? null);
    // setLoading(false);
  };

  const getDotDangKyTinChiByKyHocModel = async (idHocKy?: number) => {
    if (!idHocKy) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await getDotDangKyTinChiByHocKy(idHocKy);
    setRecordDotTinChi(response?.data?.data ?? null);
    // setLoading(false);
  };

  const getPhieuDangKyByDotModel = async () => {
    if (!recordDotNhuCau?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await getPhieuDangKyByDot(recordDotNhuCau.id);
      setRecordPhieuDangKy(response?.data?.data?.phieuDangKy ? response?.data?.data : null);
      setLoading(false);
    } catch (error) {
      setRecordPhieuDangKy(null);
      setLoading(false);
    }
  };

  const getDanhSachHocPhanDangKyModel = async () => {
    // setLoading(true);
    const response = await getDanhSachHocPhanDangKy();
    setRecordHocPhan(response?.data?.data);
    // setLoading(false);
  };

  const postDanhSachHocPhanDangKyModel = async (danhSachHocPhan: { idHocPhan: number }[]) => {
    if (!recordPhieuDangKy?.phieuDangKy?.id) return;
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

  const getDSLopDaDangKyByIdDotModel = async () => {
    if (!recordDotTinChi?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await getDSLopDaDangKyByIdDot(recordDotTinChi.id);
    setDanhSachLopDaDangKy(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDSLopTinChiByIdDotAndIdMonHocModel = async (idMonHoc: number) => {
    if (!recordDotTinChi?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await getDSLopTinChiByIdDotAndIdMonHoc(recordDotTinChi.id, idMonHoc);
    setDanhSachLopTinChi(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDSNhomLopTinChiByIdLopModel = async (idLopTinChi: number) => {
    setLoading(true);
    const response = await getDSNhomLopTinChiByIdLopTinChi(idLopTinChi);
    setDanhSachNhomLopTinChi(response?.data?.data ?? []);
    setLoading(false);
    return response?.data?.data ?? [];
  };

  const postDanhSachLopDangKyModel = async (payload: {
    data: { danhSachLop: { lop_tin_chi_id: number; nhom_lop_tin_chi_id: number }[] };
  }) => {
    setLoading(true);
    await postDanhSachLopDangKy({ ...payload, idDotDangKyTinChi: recordDotTinChi?.id });
    message.success('Đăng ký thành công');
    setLoading(false);
  };

  const khoiTaoPhieuDangKyModel = async () => {
    if (!recordDotNhuCau?.id) return;
    try {
      setLoading(true);
      await khoiTaoPhieuDangKy(recordDotNhuCau.id);
      message.success('Khởi tạo thành công');
      setLoading(false);
      getPhieuDangKyByDotModel();
    } catch (error) {
      setLoading(false);
    }
  };

  return {
    postDanhSachLopDangKyModel,
    getDSNhomLopTinChiByIdLopModel,
    danhSachNhomLopTinChi,
    setDanhSachNhomLopTinChi,
    setDanhSachLopTinChi,
    danhSachLopTinChi,
    getDSLopTinChiByIdDotAndIdMonHocModel,
    danhSachLopDaDangKy,
    getDSLopDaDangKyByIdDotModel,
    recordDotTinChi,
    setRecordDotTinChi,
    getDotDangKyTinChiByKyHocModel,
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
    recordDotNhuCau,
    setRecordDotNhuCau,
    loading,
    current,
    setCurrent,
    setLoading,
    getDotDangKyNhuCauByKyHocModel,
  };
};
