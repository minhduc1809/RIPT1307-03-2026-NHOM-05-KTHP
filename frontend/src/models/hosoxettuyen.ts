import useInitModel from '@/hooks/useInitModel';
import type { Login } from '@/services/ant-design-pro/typings';
import {
  adminGetHoSoByIdDot,
  adminKhoaHoSoByIdHoSo,
  adminMoKhoaHoSoByIdHoSo,
  getMyHoSoXetTuyen,
  khoiTaoHoSoXetTuyen,
  putMyDanhSachNguyenVong,
  putMyThongTinThiSinh,
  putMyThongTinXetTuyen,
  putMyTinhQuyDoiNguyenVong,
} from '@/services/HoSoXetTuyen/hosoxettuyen';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import type { ETrangThaiHoSo } from '@/utils/constants';
import { message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const [danhSach, setDanhSach] = useState<HoSoXetTuyen.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal } = objInitModel;
  const [current, setCurrent] = useState<number>(0);
  const [danhSachNguyenVong, setDanhSachNguyenVong] = useState<HoSoXetTuyen.NguyenVong[]>([]);
  const [recordNguyenVong, setRecordNguyenVong] = useState<HoSoXetTuyen.NguyenVong>();
  const [visibleFormNguyenVong, setVisibleFormNguyenVong] = useState<boolean>(false);
  const [recordHoSo, setRecordHoSo] = useState<HoSoXetTuyen.Record>();
  const [khuVucUuTienLop10, setKhuVucUuTienLop10] = useState<string>();
  const [khuVucUuTienLop11, setKhuVucUuTienLop11] = useState<string>();
  const [khuVucUuTienLop12, setKhuVucUuTienLop12] = useState<string>();
  const [isTruongChuyenLop10, setIsTruongChuyenLop10] = useState<boolean>(false);
  const [isTruongChuyenLop11, setIsTruongChuyenLop11] = useState<boolean>(false);
  const [isTruongChuyenLop12, setIsTruongChuyenLop12] = useState<boolean>(false);
  const { record: recordHinhThuc } = useModel('hinhthucdaotao');
  const { record: recordNam } = useModel('namtuyensinh');

  const khoiTaoHoSoXetTuyenModel = async (idDotXetTuyen: string) => {
    const response = await khoiTaoHoSoXetTuyen(idDotXetTuyen);
    setRecordHoSo(response?.data?.data);
    message.success('Khởi tạo hồ sơ thành công');
  };

  const getMyHoSoXetTuyenModel = async (idDotXetTuyen: string) => {
    setLoading(true);
    const response = await getMyHoSoXetTuyen(idDotXetTuyen);
    if (response?.data?.data === null) {
      khoiTaoHoSoXetTuyenModel(idDotXetTuyen);
    } else {
      setRecordHoSo(response?.data?.data);
      setDanhSachNguyenVong(response?.data?.data?.danhSachNguyenVong ?? []);
      setLoading(false);
    }
  };

  const putMyThongTinThiSinhModel = async (
    idHoSo: string,
    payload: {
      thongTinThiSinh: Login.Profile;
    },
  ) => {
    if (!idHoSo) return;
    setLoading(true);
    const response = await putMyThongTinThiSinh(idHoSo, payload);
    setRecordHoSo(response?.data?.data);
    message.success('Lưu thành công');
    setLoading(false);
    setCurrent(1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const putMyThongTinXetTuyenModel = async (idHoSo: string, payload: HoSoXetTuyen.Record) => {
    if (!idHoSo) return;
    setLoading(true);
    const response = await putMyThongTinXetTuyen(idHoSo, payload);
    if (response?.data?.data?.success === false) {
      message?.error(response?.data?.data?.errorStrings);
    } else {
      message.success('Lưu thành công');
      setRecordHoSo(response?.data?.data?.result);
      setCurrent(2);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    setLoading(false);
  };

  const putMyDanhSachNguyenVongModel = async (
    idHoSo: string,
    payload: {
      danhSachNguyenVong: HoSoXetTuyen.NguyenVong[];
    },
  ) => {
    if (!idHoSo) return;
    setLoading(true);
    const response = await putMyDanhSachNguyenVong(idHoSo, payload);
    if (response?.data?.data?.success === false) {
      message?.error(response?.data?.data?.errorStrings);
    } else {
      const dot = localStorage.getItem('dot');
      if (dot) getMyHoSoXetTuyenModel(dot);
      message.success('Lưu thành công');
    }
    setLoading(false);
  };

  const putMyTinhQuyDoiNguyenVongModel = async (payload: {
    nguyenVong: HoSoXetTuyen.NguyenVong;
  }) => {
    if (!recordHoSo?._id) return;
    setLoading(true);
    const response = await putMyTinhQuyDoiNguyenVong(recordHoSo?._id, payload);
    return response;
  };

  const adminGetHoSoByIdDotModel = async (idDotTuyenSinh: string, trangThai: ETrangThaiHoSo) => {
    if (!idDotTuyenSinh || !recordHinhThuc?._id || !recordNam?._id) return;
    setLoading(true);
    const response = await adminGetHoSoByIdDot(idDotTuyenSinh, {
      page,
      limit,
      condition: { ...condition, trangThai },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const adminKhoaHoSoByIdHoSoModel = async (
    idHoSo: string,
    idDotTuyenSinh: string,
    trangThai: ETrangThaiHoSo,
  ) => {
    setLoading(true);
    await adminKhoaHoSoByIdHoSo(idHoSo);
    message.success('Khóa hồ sơ thành công');
    adminGetHoSoByIdDotModel(idDotTuyenSinh, trangThai);
  };

  const adminMoKhoaHoSoByIdHoSoModel = async (
    idHoSo: string,
    idDotTuyenSinh: string,
    trangThai: ETrangThaiHoSo,
  ) => {
    setLoading(true);
    await adminMoKhoaHoSoByIdHoSo(idHoSo);
    message.success('Mở khóa hồ sơ thành công');
    adminGetHoSoByIdDotModel(idDotTuyenSinh, trangThai);
  };

  return {
    setRecordHoSo,
    setDanhSach,
    adminMoKhoaHoSoByIdHoSoModel,
    adminKhoaHoSoByIdHoSoModel,
    danhSach,
    adminGetHoSoByIdDotModel,
    putMyTinhQuyDoiNguyenVongModel,
    putMyDanhSachNguyenVongModel,
    putMyThongTinXetTuyenModel,
    isTruongChuyenLop10,
    setIsTruongChuyenLop10,
    isTruongChuyenLop11,
    setIsTruongChuyenLop11,
    isTruongChuyenLop12,
    setIsTruongChuyenLop12,
    khuVucUuTienLop10,
    setKhuVucUuTienLop10,
    khuVucUuTienLop11,
    setKhuVucUuTienLop11,
    khuVucUuTienLop12,
    setKhuVucUuTienLop12,
    putMyThongTinThiSinhModel,
    recordHoSo,
    getMyHoSoXetTuyenModel,
    khoiTaoHoSoXetTuyenModel,
    recordNguyenVong,
    setRecordNguyenVong,
    visibleFormNguyenVong,
    setVisibleFormNguyenVong,
    danhSachNguyenVong,
    setDanhSachNguyenVong,
    current,
    setCurrent,
    ...objInitModel,
  };
};
