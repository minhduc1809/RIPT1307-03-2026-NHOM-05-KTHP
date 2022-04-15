import useInitModel from '@/hooks/useInitModel';
import type { Login } from '@/services/ant-design-pro/typings';
import type { DotTuyenSinh } from '@/services/DotTuyenSinh/typings';
import {
  adminGetHoSoByIdDot,
  adminGetHoSoByIdHoSo,
  adminKhoaHoSoByIdHoSo,
  adminMoKhoaHoSoByIdHoSo,
  adminTiepNhanHoSoByIdHoSo,
  exportPhieuDangKy,
  getMyHoSoXetTuyen,
  khoaMyHoSo,
  khoiTaoHoSoXetTuyen,
  moKhoaMyHoSo,
  putMyDanhSachNguyenVong,
  putMyThongTinThiSinh,
  putMyThongTinXetTuyen,
  putMyTinhQuyDoiNguyenVong,
} from '@/services/HoSoXetTuyen/hosoxettuyen';
import type { HoSoXetTuyen } from '@/services/HoSoXetTuyen/typings';
import { ETrangThaiHoSo } from '@/utils/constants';
import { message } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import FileDownload from 'js-file-download';

export default () => {
  const [danhSach, setDanhSach] = useState<HoSoXetTuyen.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;
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
  const { setVisibleFormGiayTo, record: recordDot } = useModel('dottuyensinh');

  const khoiTaoHoSoXetTuyenModel = async (idDotXetTuyen: string) => {
    setLoading(true);
    const response = await khoiTaoHoSoXetTuyen(idDotXetTuyen);
    setRecordHoSo(response?.data?.data);
    message.success('Khởi tạo hồ sơ thành công');
    setLoading(false);
  };

  const getMyHoSoXetTuyenModel = async (idDotXetTuyen: string) => {
    if (!idDotXetTuyen) return;
    setLoading(true);
    const response = await getMyHoSoXetTuyen(idDotXetTuyen);
    const isTrongThoiGianDangKy =
      moment(recordDot?.thoiGianMoDangKy).isBefore() &&
      moment(recordDot?.thoiGianKetThucNopHoSo).isAfter();
    if (response?.data?.data === null && isTrongThoiGianDangKy) {
      khoiTaoHoSoXetTuyenModel(idDotXetTuyen);
    } else {
      setRecordHoSo(response?.data?.data ?? null);
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
    try {
      setLoading(true);
      const response = await putMyThongTinXetTuyen(idHoSo, payload);
      if (response?.data?.data?.success === false) {
        response?.data?.data?.errorStrings?.map((item: string) => message?.error(item));
      } else {
        message.success('Lưu thành công');
        setRecordHoSo(response?.data?.data?.result);
        setDanhSachNguyenVong(
          response?.data?.data?.result?.danhSachNguyenVong?.map(
            (item: HoSoXetTuyen.NguyenVong) => ({
              ...item,
              coSoDaoTao: { _id: item?.coSoDaoTao },
            }),
          ) ?? [],
        );
        response?.data?.data?.result?.danhSachNguyenVong?.map((nv: HoSoXetTuyen.NguyenVong) => {
          if (nv?.wrong === true) {
            message.error(
              `Nguyện vọng ${nv?.soThuTu} không hợp lệ, Chi tiết: ${nv?.errorStrings?.join(', ')}`,
              10,
            );
          }
        });
        setCurrent(2);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putMyDanhSachNguyenVongModel = async (
    idHoSo: string,
    payload: {
      danhSachNguyenVong: any[];
    },
  ) => {
    if (!idHoSo) return;
    try {
      setLoading(true);
      const response = await putMyDanhSachNguyenVong(idHoSo, payload);
      let success = response?.data?.data?.success ?? false;
      if (success === false) {
        message?.error(response?.data?.data?.errorStrings || response?.data?.data?.message);
      } else {
        setRecordHoSo(response?.data?.data?.result);
        setDanhSachNguyenVong(
          response?.data?.data?.result?.danhSachNguyenVong?.map(
            (item: HoSoXetTuyen.NguyenVong) => ({
              ...item,
              coSoDaoTao: { _id: item?.coSoDaoTao },
            }),
          ) ?? [],
        );
        response?.data?.data?.result?.danhSachNguyenVong?.map((nv: HoSoXetTuyen.NguyenVong) => {
          if (nv?.wrong === true) {
            success = false;
            message.error(
              `Nguyện vọng ${nv?.soThuTu} không hợp lệ, Chi tiết: ${nv?.errorStrings?.join(', ')}`,
              10,
            );
          }
        });
        if (success === true) message.success('Lưu thành công');
      }
      setLoading(false);
      return success;
    } catch (err) {
      setLoading(false);
    }
  };

  const putMyTinhQuyDoiNguyenVongModel = async (payload: {
    nguyenVong: HoSoXetTuyen.NguyenVong;
  }) => {
    if (!recordHoSo?._id) return;
    setLoading(true);
    const response = await putMyTinhQuyDoiNguyenVong(recordHoSo?._id, payload);
    setLoading(false);
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
    try {
      setLoading(true);
      await adminKhoaHoSoByIdHoSo(idHoSo);
      message.success('Khóa hồ sơ thành công');
      adminGetHoSoByIdDotModel(idDotTuyenSinh, trangThai);
    } catch (err) {
      setLoading(false);
    }
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

  const adminTiepNhanHoSoByIdHoSoModel = async (
    idHoSo: string,
    idDotTuyenSinh: string,
    payload: {
      trangThai: ETrangThaiHoSo;
      thongTinGiayToNopHoSo: DotTuyenSinh.GiayTo[];
      ghiChuTiepNhan: string;
    },
  ) => {
    setLoading(true);
    await adminTiepNhanHoSoByIdHoSo(idHoSo, payload);
    message.success('Xử lý thành công');
    setVisibleForm(false);
    setVisibleFormGiayTo(false);
    adminGetHoSoByIdDotModel(idDotTuyenSinh, ETrangThaiHoSo.dakhoa);
  };

  const khoaMyHoSoModel = async (idHoSo: string) => {
    if (!idHoSo) return;
    try {
      setLoading(true);
      const response = await khoaMyHoSo(idHoSo);
      setRecordHoSo(response?.data?.data);
      message.success('Khóa hồ sơ thành công');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const moKhoaMyHoSoModel = async (idHoSo: string) => {
    if (!idHoSo) return;
    try {
      setLoading(true);
      const response = await moKhoaMyHoSo(idHoSo);
      setRecordHoSo(response?.data?.data);
      message.success('Mở khóa hồ sơ thành công');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const adminGetHoSoByIdHoSoModel = async (idHoSo: string) => {
    if (!idHoSo) return;
    setLoading(true);
    const response = await adminGetHoSoByIdHoSo(idHoSo);
    setRecordHoSo(response?.data?.data ?? {});
    setLoading(false);
  };

  const exportPhieuDangKyModel = async (idHoSo: string) => {
    if (!idHoSo) return;
    try {
      setLoading(true);
      const response = await exportPhieuDangKy(idHoSo);
      const fileName = `${recordHoSo?.maHoSo ?? ''}_${moment().format('DDMMYYYYHHmm')}.pdf`;
      FileDownload(response.data, fileName);
      setLoading(false);
    } catch (err) {
      message.error('Mẫu phiếu đang được cập nhật, vui lòng thử lại sau');
      setLoading(false);
    }
  };

  return {
    exportPhieuDangKyModel,
    moKhoaMyHoSoModel,
    adminGetHoSoByIdHoSoModel,
    khoaMyHoSoModel,
    adminTiepNhanHoSoByIdHoSoModel,
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
