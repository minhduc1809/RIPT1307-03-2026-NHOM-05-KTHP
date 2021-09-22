import type { IInfoSV } from './../services/ant-design-pro/typings.d';
import type { IRecordTinh } from '@/services/DonViHanhChinh/typing';

import { getQuanHuyenS, getTinhS, getXaPhuongS } from '@/services/DonViHanhChinh/donvihanhchinh';
import { useState } from 'react';
import { getInfoSV } from '@/services/ant-design-pro/api';
import { postDonXacNhanTinhTrangHocTap } from '@/services/DichVuMotCua/dichvumotcua';
import { message } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<DichVuMotCua.Record[]>([]);
  const [thuTuc, setThuTuc] = useState<DichVuMotCua.ThuTuc>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [loaiGiayTo, setLoaiGiayTo] = useState<string>('');
  const [infoSv, setInfoSv] = useState<IInfoSV.DataSV>();

  const [loaiPhongBan, setLoaiPhongBan] = useState<string>('');
  const [record, setRecord] = useState<DichVuMotCua.Record>();
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // đơn vị hành chính

  const [danhSachTinh, setDanhSachTinh] = useState<IRecordTinh.Datum[]>([]);
  const [danhSachQuanHuyen, setDanhSachQuanHuyen] = useState<IRecordTinh.Datum[]>([]);
  const [danhSachXaPhuong, setDanhSachXaPhuong] = useState<IRecordTinh.Datum[]>([]);

  const getInfo = async () => {
    setLoading(true);
    const currentUser = await getInfoSV();
    console.log(`currentUser`, currentUser);
    setInfoSv(currentUser?.data);
    setLoading(false);
  };

  const getTinh = async () => {
    setLoading(true);
    const data = await getTinhS();
    console.log(`dsTinh`, data);
    setDanhSachTinh(data?.data?.data ?? []);
    setLoading(false);
  };

  const getQuanHuyen = async (payload: { maTinh: string }) => {
    setLoading(true);
    const data = await getQuanHuyenS(payload);
    console.log(`dsQuanHuyen`, data);
    setDanhSachQuanHuyen(data?.data?.data ?? []);
    setLoading(false);
  };

  const getXaPhuong = async (payload: { maQH: string }) => {
    setLoading(true);
    const data = await getXaPhuongS(payload);
    console.log(`dsXaPhuong`, data);
    setDanhSachXaPhuong(data?.data?.data ?? []);
    setLoading(false);
  };

  const postDonXacNhanTinhTrangHocTapModel = async (payload: DichVuMotCua.Record) => {
    setLoading(true);
    await postDonXacNhanTinhTrangHocTap(payload);
    message.success('Gửi đơn thành công');
    setLoading(false);
  };

  return {
    danhSachQuanHuyen,
    danhSachXaPhuong,
    getQuanHuyen,
    getXaPhuong,
    postDonXacNhanTinhTrangHocTapModel,
    thuTuc,
    getTinh,
    danhSachTinh,
    setThuTuc,
    danhSach,
    getInfo,
    infoSv,
    setDanhSach,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    loaiGiayTo,
    setLoaiGiayTo,
    record,
    setRecord,
    loading,
    setLoading,
    edit,
    setEdit,
    page,
    setPage,
    limit,
    setLimit,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
    loaiPhongBan,
    setLoaiPhongBan,
  };
};
