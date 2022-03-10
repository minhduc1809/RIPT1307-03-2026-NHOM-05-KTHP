import type { Login } from '@/services/ant-design-pro/typings';
import {
  getMyHoSoXetTuyen,
  khoiTaoHoSoXetTuyen,
  putMyDanhSachNguyenVong,
  putMyThongTinThiSinh,
  putMyThongTinXetTuyen,
  putMyTinhQuyDoiNguyenVong,
} from '@/services/HoSoXetTuyen/hosoxettuyen';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState<number>(0);
  const [danhSachNguyenVong, setDanhSachNguyenVong] = useState<HoSoXetTuyen.NguyenVong[]>([]);
  const [recordNguyenVong, setRecordNguyenVong] = useState<HoSoXetTuyen.NguyenVong>();
  const [visibleFormNguyenVong, setVisibleFormNguyenVong] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recordHoSo, setRecordHoSo] = useState<HoSoXetTuyen.Record>();
  const [khuVucUuTienLop10, setKhuVucUuTienLop10] = useState<string>();
  const [khuVucUuTienLop11, setKhuVucUuTienLop11] = useState<string>();
  const [khuVucUuTienLop12, setKhuVucUuTienLop12] = useState<string>();

  const [isTruongChuyenLop10, setIsTruongChuyenLop10] = useState<boolean>(false);
  const [isTruongChuyenLop11, setIsTruongChuyenLop11] = useState<boolean>(false);
  const [isTruongChuyenLop12, setIsTruongChuyenLop12] = useState<boolean>(false);

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

  return {
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
    loading,
    recordHoSo,
    getMyHoSoXetTuyenModel,
    khoiTaoHoSoXetTuyenModel,
    recordNguyenVong,
    setRecordNguyenVong,
    edit,
    setEdit,
    visibleFormNguyenVong,
    setVisibleFormNguyenVong,
    danhSachNguyenVong,
    setDanhSachNguyenVong,
    current,
    setCurrent,
  };
};
