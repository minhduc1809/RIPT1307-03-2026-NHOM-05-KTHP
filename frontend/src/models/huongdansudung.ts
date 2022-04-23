import useInitModel from '@/hooks/useInitModel';
import {
  deleteHuongDanSuDung,
  getAllHuongDanSuDung,
  getHuongDanSuDungPageable,
  postHuongDanSuDung,
  putHuongDanSuDung,
} from '@/services/HuongDanSuDung/huongdansudung';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<HuongDanSuDung.Record>();
  const [danhSach, setDanhSach] = useState<HuongDanSuDung.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;

  const getAllHuongDanSuDungModel = async (hinhThucDaoTao?: string) => {
    setLoading(true);
    const response = await getAllHuongDanSuDung({ condition: { hinhThucDaoTao } });
    setDanhSach(response?.data?.data ?? []);
    if (!record?._id) setRecord(response?.data?.data?.[response?.data?.data?.length - 1 ?? 0]);
    setLoading(false);
  };

  const getHuongDanSuDungPageableModel = async () => {
    setLoading(true);
    const response = await getHuongDanSuDungPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postHuongDanSuDungModel = async (payload: HuongDanSuDung.Record) => {
    try {
      setLoading(true);
      await postHuongDanSuDung(payload);
      getHuongDanSuDungPageableModel();
      message.success('Thêm thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putHuongDanSuDungModel = async (idHuongDanSuDung: string, data: HuongDanSuDung.Record) => {
    if (!idHuongDanSuDung) return;
    try {
      setLoading(true);
      await putHuongDanSuDung(idHuongDanSuDung, data);
      getHuongDanSuDungPageableModel();
      message.success('Lưu thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteHuongDanSuDungModel = async (idHuongDanSuDung: string) => {
    setLoading(true);
    await deleteHuongDanSuDung(idHuongDanSuDung);
    message.success('Xóa thành công');
    getHuongDanSuDungPageableModel();
    setLoading(false);
  };

  return {
    deleteHuongDanSuDungModel,
    putHuongDanSuDungModel,
    postHuongDanSuDungModel,
    getHuongDanSuDungPageableModel,
    getAllHuongDanSuDungModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
