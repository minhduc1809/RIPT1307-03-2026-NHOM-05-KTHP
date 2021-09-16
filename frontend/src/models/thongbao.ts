import {
  getThongBaoAdmin,
  postThongBaoAll,
  postThongBaoByDonVi,
  postThongBaoByVaiTro,
} from '@/services/ThongBao/thongbao';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<ThongBao.Record[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [loaiThongBao, setLoaiThongBao] = useState<string>('TAT_CA');
  const [record, setRecord] = useState<ThongBao.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const getThongBaoAdminModel = async () => {
    setLoading(true);
    const response = await getThongBaoAdmin({
      page,
      limit,
      condition: { ...condition, notifType: loaiThongBao },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postThongBaoByVaiTroModel = async (payload: ThongBao.PostRecord) => {
    setLoading(true);
    await postThongBaoByVaiTro(payload);
    message.success('Gửi thành công');
    getThongBaoAdminModel();
    setLoading(false);
    setVisibleForm(false);
  };

  const postThongBaoAllModel = async (payload: ThongBao.PostRecord) => {
    setLoading(true);
    await postThongBaoAll(payload);
    message.success('Gửi thành công');
    getThongBaoAdminModel();
    setLoading(false);
    setVisibleForm(false);
  };

  const postThongBaoByDonViModel = async (payload: ThongBao.PostRecord) => {
    setLoading(true);
    await postThongBaoByDonVi(payload);
    message.success('Gửi thành công');
    getThongBaoAdminModel();
    setLoading(false);
    setVisibleForm(false);
  };

  return {
    postThongBaoByDonViModel,
    loaiThongBao,
    setLoaiThongBao,
    postThongBaoAllModel,
    postThongBaoByVaiTroModel,
    getThongBaoAdminModel,
    danhSach,
    setDanhSach,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    record,
    setRecord,
    loading,
    setLoading,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
    page,
    limit,
    setPage,
    setLimit,
  };
};
