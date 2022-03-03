import useInitModel from '@/hooks/useInitModel';
import {
  deleteCoSoDaoTao,
  getAllCoSoDaoTao,
  getCoSoDaoTaoPageable,
  postCoSoDaoTao,
  putCoSoDaoTao,
} from '@/services/CoSoDaoTao/cosodaotao';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<CoSoDaoTao.Record>();
  const [danhSach, setDanhSach] = useState<CoSoDaoTao.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;

  const getAllCoSoDaoTaoModel = async () => {
    setLoading(true);
    const response = await getAllCoSoDaoTao();
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const getCoSoDaoTaoPageableModel = async () => {
    setLoading(true);
    const response = await getCoSoDaoTaoPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postCoSoDaoTaoModel = async (payload: CoSoDaoTao.Record) => {
    try {
      setLoading(true);
      await postCoSoDaoTao(payload);
      getCoSoDaoTaoPageableModel();
      message.success('Thêm thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putCoSoDaoTaoModel = async (idCoSoDaoTao: string, data: CoSoDaoTao.Record) => {
    if (!idCoSoDaoTao) return;
    try {
      setLoading(true);
      await putCoSoDaoTao(idCoSoDaoTao, data);
      getCoSoDaoTaoPageableModel();
      message.success('Lưu thành công');
      setVisibleForm(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteCoSoDaoTaoModel = async (idCoSoDaoTao: string) => {
    setLoading(true);
    await deleteCoSoDaoTao(idCoSoDaoTao);
    message.success('Xóa thành công');
    getCoSoDaoTaoPageableModel();
    setLoading(false);
  };

  return {
    deleteCoSoDaoTaoModel,
    putCoSoDaoTaoModel,
    postCoSoDaoTaoModel,
    getCoSoDaoTaoPageableModel,
    getAllCoSoDaoTaoModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
