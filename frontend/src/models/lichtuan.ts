/* eslint-disable no-underscore-dangle */
import {
  getBanChinhThuc,
  phatHanhLichTuan,
  get,
  add,
  upd,
  del,
  exportLichTuan,
} from '@/services/LichTuan/lichtuan';
import { message } from 'antd';
import moment from 'moment';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<LichTuan.Record[]>([]);
  const [danhSachChinhThuc, setDanhSachChinhThuc] = useState<LichTuan.Record[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [record, setRecord] = useState<LichTuan.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const getBanChinhThucModel = async () => {
    setLoading(true);
    const response = await getBanChinhThuc({
      from: moment().subtract(1, 'years').valueOf(),
      to: moment().add(1, 'years').valueOf(),
    });
    setDanhSachChinhThuc(response?.data?.data ?? []);
    setLoading(false);
  };
  const getModel = async () => {
    const response = await get({
      page: 1,
      limit: 1000,
    });
    setDanhSach(response?.data?.data?.result ?? []);
  };
  const phatHanhLichTuanModel = async (tuan: number, nam: number) => {
    setLoading(true);
    try {
      await phatHanhLichTuan({
        tuan,
        nam,
      });
      message.success('Phát hành thành công');
      getBanChinhThucModel();
      getModel();
      setLoading(false);
    } catch (error: any) {
      const { response } = error;
      message.error(response?.data?.errorDescription);
      setLoading(false);
    }
  };

  const addModel = async (payload: LichTuan.Record) => {
    setLoading(true);
    await add(payload);
    getModel();
    message.success('Thêm mới thành công');
    setLoading(false);
  };

  const updModel = async (payload: LichTuan.Record) => {
    setLoading(true);
    const response = await upd(payload);
    setRecord(response?.data?.data);
    getModel();
    message.success('Cập nhật thành công');
    setLoading(false);
  };

  const delModel = async (_id: any) => {
    setLoading(true);
    await del({ _id });
    message.success('Xóa thành công');
    setLoading(false);
    getModel();
  };

  const exportLichTuanModel = async (tuan: number, nam: number) => {
    setLoading(true);
    const response = await exportLichTuan({ tuan, nam });
    window.open(response?.data?.data?.url, '_blank');
    setLoading(false);
  };

  return {
    exportLichTuanModel,
    danhSachChinhThuc,
    getModel,
    getBanChinhThucModel,
    delModel,
    phatHanhLichTuanModel,
    updModel,
    addModel,
    filterInfo,
    condition,
    setFilterInfo,
    setCondition,
    setRecord,
    edit,
    setEdit,
    setTotal,
    visibleForm,
    setVisibleForm,
    setPage,
    setLimit,
    danhSach,
    record,
    loading,
    total,
    page,
    limit,
  };
};
