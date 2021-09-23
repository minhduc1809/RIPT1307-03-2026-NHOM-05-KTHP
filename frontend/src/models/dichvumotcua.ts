import type { IRecordTinh } from '@/services/DonViHanhChinh/typing';
import { getQuanHuyenS, getTinhS, getXaPhuongS } from '@/services/DonViHanhChinh/donvihanhchinh';
import { useState } from 'react';
import Data from '@/utils/data';
import { postDonSinhVien } from '@/services/DichVuMotCua/dichvumotcua';
import { message } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<DichVuMotCua.Record[]>([]);
  const [thuTuc, setThuTuc] = useState<DichVuMotCua.ThuTuc>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [loaiGiayTo, setLoaiGiayTo] = useState<string>('');

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

  const getTinh = async () => {
    setLoading(true);
    const data = await getTinhS();
    setDanhSachTinh(data?.data?.data ?? []);
    setLoading(false);
  };

  const getQuanHuyen = async (payload: { maTinh: string }) => {
    setLoading(true);
    const data = await getQuanHuyenS(payload);
    setDanhSachQuanHuyen(data?.data?.data ?? []);
    setLoading(false);
  };

  const getXaPhuong = async (payload: { maQH: string }) => {
    setLoading(true);
    const data = await getXaPhuongS(payload);
    setDanhSachXaPhuong(data?.data?.data ?? []);
    setLoading(false);
  };

  const postDonSinhVienModel = async (payload: DichVuMotCua.Record, pathDon: string) => {
    try {
      setLoading(true);
      await postDonSinhVien(payload, pathDon);
      message.success('Gửi đơn thành công');
      setVisibleForm(false);
    } catch (error) {
      const { response } = error;
      message.error(Data.error[response?.data?.errorCode]);
    } finally {
      setLoading(false);
    }
  };

  return {
    danhSachQuanHuyen,
    danhSachTinh,
    getTinh,
    danhSachXaPhuong,
    getQuanHuyen,
    getXaPhuong,
    postDonSinhVienModel,
    thuTuc,
    setThuTuc,
    danhSach,
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
