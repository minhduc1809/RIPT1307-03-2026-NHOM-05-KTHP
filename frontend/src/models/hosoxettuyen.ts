import { getMyHoSoXetTuyen, khoiTaoHoSoXetTuyen } from '@/services/HoSoXetTuyen/hosoxettuyen';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState<number>(0);
  const [danhSachNguyenVong, setDanhSachNguyenVong] = useState<any[]>([]);
  const [visibleFormNguyenVong, setVisibleFormNguyenVong] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [recordNguyenVong, setRecordNguyenVong] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [recordHoSo, setRecordHoSo] = useState<HoSoXetTuyen.Record>();

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
      setLoading(false);
    }
  };

  return {
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
