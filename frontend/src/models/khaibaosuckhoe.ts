/* eslint-disable no-underscore-dangle */
import {
  getBieuMauKhaiBaoYTe,
  getKhaiBaoYTeAdmin,
  getLichSuKhaiBaoByUserId,
  getLichSuKhaiBaoUser,
  khaiBaoYTe,
} from '@/services/KhaiBaoSucKhoe/khaibaosuckhoe';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<KhaiBaoSucKhoe.Record[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [bieuMau, setBieuMau] = useState<BieuMau.Record>({} as BieuMau.Record);
  const [record, setRecord] = useState<KhaiBaoSucKhoe.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleLichSuKhaiBao, setVisibleLichSuKhaiBao] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const getBieuMauKhaiBaoYTeModel = async () => {
    setLoading(true);
    const response = await getBieuMauKhaiBaoYTe();
    setBieuMau(response?.data?.data ?? {});
    setLoading(false);
  };

  const getKhaiBaoYTeAdminModel = async () => {
    if (!bieuMau?._id) return;
    setLoading(true);
    const response = await getKhaiBaoYTeAdmin({
      data: { page, limit, condition },
      id: bieuMau?._id,
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getLichSuKhaiBaoModel = async (userId: string) => {
    setLoading(true);
    await getLichSuKhaiBaoByUserId({ idBieuMau: bieuMau._id, userId });
    setLoading(false);
  };

  const khaiBaoYTeModel = async (payload: {
    idBieuMau: string;
    danhSachTraLoi: KhaiBaoSucKhoe.TraLoiRecord[];
  }) => {
    setLoading(true);
    await khaiBaoYTe(payload);
    message.success('Khai báo thành công');
    setVisibleForm(false);
    setLoading(false);
  };

  const getLichSuKhaiBaoUserModel = async () => {
    if (!bieuMau?._id) return;
    setLoading(true);
    const response = await getLichSuKhaiBaoUser({
      data: { page, limit, condition },
      idBieuMau: bieuMau?._id,
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    visibleLichSuKhaiBao,
    setVisibleLichSuKhaiBao,
    getLichSuKhaiBaoUserModel,
    khaiBaoYTeModel,
    getLichSuKhaiBaoModel,
    filterInfo,
    condition,
    setFilterInfo,
    setCondition,
    getKhaiBaoYTeAdminModel,
    bieuMau,
    setRecord,
    edit,
    setEdit,
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
    getBieuMauKhaiBaoYTeModel,
  };
};
