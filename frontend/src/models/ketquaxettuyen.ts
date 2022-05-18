import { adminChuyenDotNhapHoc } from './../services/KetQuaXetTuyen/ketquaxettuyen';
import useInitModel from '@/hooks/useInitModel';
import type { Login } from '@/services/ant-design-pro/typings';
import type { DotNhapHoc } from '@/services/DotNhapHoc/typings';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import {
  adminTiepNhanXacNhanNhapHoc,
  getKetQuaXetTuyenPageable,
  getMyKetQuaXetTuyen,
  putMyKetQuaXetTuyenLyLich,
  xacNhanKhongNhapHoc,
  xacNhanNhapHoc,
  thiSinhKhoaHoSoNhapHoc,
  adminTiepNhanHoSoNhapHoc,
  putMyKetQuaXetTuyenGiayToLePhi,
  adminTiepNhanGiayToNopNhapHoc,
} from '@/services/KetQuaXetTuyen/ketquaxettuyen';
import type { KetQuaXetTuyen } from '@/services/KetQuaXetTuyen/typings';
import { ETrangThaiXacNhanNhapHoc } from '@/utils/constants';
import { ETrangThaiNhapHoc } from '@/utils/constants';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<KetQuaXetTuyen.Record>();
  const [danhSach, setDanhSach] = useState<KetQuaXetTuyen.Record[]>([]);
  const objInitModel = useInitModel('ket-qua-xet-tuyen', 'condition');
  const { setLoading, condition, page, limit, setTotal, setVisibleForm } = objInitModel;
  const [recordGiaDinh, setRecordGiaDinh] = useState<KetQuaXetTuyen.ThanhVienGiaDinh>();

  const getMyKetQuaXetTuyenModel = async (idDotTuyenSinh: string) => {
    try {
      setLoading(true);
      const response = await getMyKetQuaXetTuyen(idDotTuyenSinh);
      setRecord(response?.data?.data ?? null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getKetQuaXetTuyenPageableModel = async (
    idDotTuyenSinh: string,
    idCoSoDaoTao?: string,
    paramCondition?: any,
  ) => {
    if (!idDotTuyenSinh) return;
    setLoading(true);
    const response = await getKetQuaXetTuyenPageable(idDotTuyenSinh, {
      page,
      limit,
      condition: {
        ...condition,
        ...paramCondition,
        'nguyenVongTrungTuyen.coSoDaoTao': idCoSoDaoTao,
      },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const xacNhanNhapHocModel = async (
    idKetQua: string,
    payload: {
      danhSachGiayToXacNhanNhapHoc: DotTuyenSinh.GiayTo[];
      danhSachThongTinKhaiXacNhan: KetQuaXetTuyen.ThongTinKhaiXacNhan[];
    },
  ) => {
    if (!idKetQua) return;
    try {
      setLoading(true);
      const response = await xacNhanNhapHoc(idKetQua, payload);
      message.success('Xác nhận thành công');
      setLoading(false);
      setRecord(response?.data?.data);
      setVisibleForm(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const xacNhanKhongNhapHocModel = async (idKetQua: string) => {
    setLoading(true);
    const response = await xacNhanKhongNhapHoc(idKetQua);
    message.success('Xác nhận thành công');
    setLoading(false);
    setRecord(response?.data?.data);
  };

  const adminTiepNhanXacNhanNhapHocModel = async (
    idKetQuaXetTuyen: string,
    payload: {
      danhSachGiayToXacNhanNhapHoc?: DotTuyenSinh.GiayTo[];
      danhSachThongTinKhaiXacNhan?: KetQuaXetTuyen.ThongTinKhaiXacNhan[];
      ghiChuTiepNhan?: string;
      ngayTiepNhan?: string;
      trangThaiXacNhan: ETrangThaiXacNhanNhapHoc;
    },
    idDotTuyenSinh: string,
    idCoSo?: string,
  ) => {
    if (!idKetQuaXetTuyen) return;
    setLoading(true);
    await adminTiepNhanXacNhanNhapHoc(idKetQuaXetTuyen, payload);
    message.success('Xử lý thành công');
    setVisibleForm(false);
    getKetQuaXetTuyenPageableModel(idDotTuyenSinh, idCoSo);
  };

  const putMyKetQuaXetTuyenLyLichModel = async (
    idKetQuaXetTuyen: string,
    payload: {
      thongTinThiSinh: Login.Profile;
      thongTinGiaDinh: KetQuaXetTuyen.ThanhVienGiaDinh[];
    },
  ) => {
    if (!idKetQuaXetTuyen) return;
    try {
      setLoading(true);
      const response = await putMyKetQuaXetTuyenLyLich(idKetQuaXetTuyen, payload);
      setRecord(response?.data?.data ?? {});
      message.success('Lưu thành công');
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putMyKetQuaXetTuyenGiayToLePhiModel = async (
    idKetQuaXetTuyen: string,
    payload: {
      danhSachGiayToNop: DotTuyenSinh.GiayTo[];
      danhSachLePhiNop: DotNhapHoc.LePhi[];
    },
  ) => {
    if (!idKetQuaXetTuyen) return;
    try {
      setLoading(true);
      const response = await putMyKetQuaXetTuyenGiayToLePhi(idKetQuaXetTuyen, payload);
      setRecord(response?.data?.data ?? {});
      message.success('Lưu thành công');
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const thiSinhKhoaHoSoNhapHocModel = async (
    idKetQuaXetTuyen?: string,
    payload?: KetQuaXetTuyen.Record,
  ) => {
    if (!idKetQuaXetTuyen || !payload) return;
    setLoading(true);
    const response = await thiSinhKhoaHoSoNhapHoc(idKetQuaXetTuyen, payload);
    setRecord(response?.data?.data ?? null);
    message.success('Khóa thành công');
    setLoading(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const adminTiepNhanHoSoNhapHocModel = async (
    idDotTuyenSinh: string,
    idKetQuaXetTuyen: string,
    payload: {
      trangThaiNhapHoc: ETrangThaiNhapHoc;
      ghiChuTiepNhan?: string;
    },
    getData?: any,
  ) => {
    if (!idKetQuaXetTuyen || !idDotTuyenSinh) return;
    try {
      setLoading(true);
      await adminTiepNhanHoSoNhapHoc(idKetQuaXetTuyen, payload);
      message.success('Xử lý thành công');
      setVisibleForm(false);
      if (getData) getData();
      else
        getKetQuaXetTuyenPageableModel(idDotTuyenSinh, undefined, {
          trangThaiNhapHoc: ETrangThaiNhapHoc.DA_KHOA,
        });
    } catch (err) {
      setLoading(false);
    }
  };

  const adminTiepNhanGiayToNopNhapHocModel = async (
    idKetQuaXetTuyen: string,
    payload: {
      danhSachGiayToNop: DotTuyenSinh.GiayTo[];
    },
  ) => {
    if (!idKetQuaXetTuyen) return;
    setLoading(true);
    await adminTiepNhanGiayToNopNhapHoc(idKetQuaXetTuyen, payload);
  };

  const adminChuyenDotNhapHocModel = async (
    idKetQuaXetTuyen: string,
    payload: { idDotNhapHoc: string },
    idDotTuyenSinh: string,
    getData?: any,
  ) => {
    if (!idKetQuaXetTuyen) return;
    setLoading(true);
    await adminChuyenDotNhapHoc(idKetQuaXetTuyen, payload);
    message.success('Xử lý thành công');
    setLoading(false);
    if (getData) getData();
    else
      getKetQuaXetTuyenPageableModel(idDotTuyenSinh, undefined, {
        trangThaiNhapHoc: ETrangThaiNhapHoc.CHUA_KHOA,
        'thongTinXacNhanNhapHoc.trangThaiXacNhan': ETrangThaiXacNhanNhapHoc.DA_TIEP_NHAN,
      });
  };

  return {
    adminChuyenDotNhapHocModel,
    adminTiepNhanGiayToNopNhapHocModel,
    adminTiepNhanHoSoNhapHocModel,
    thiSinhKhoaHoSoNhapHocModel,
    putMyKetQuaXetTuyenLyLichModel,
    putMyKetQuaXetTuyenGiayToLePhiModel,
    recordGiaDinh,
    setRecordGiaDinh,
    adminTiepNhanXacNhanNhapHocModel,
    xacNhanKhongNhapHocModel,
    getKetQuaXetTuyenPageableModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    getMyKetQuaXetTuyenModel,
    xacNhanNhapHocModel,
    ...objInitModel,
  };
};
