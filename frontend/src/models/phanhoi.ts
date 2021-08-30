import { getPhanHoiAdmin, traLoiPhanHoi } from '@/services/PhanHoi/phanhoi';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<PhanHoi.Record[]>([]);
  const [record, setRecord] = useState<PhanHoi.Record>({} as PhanHoi.Record);
  const [daTraLoi, setDaTraLoi] = useState<boolean>(false);
  const [vaiTro, setVaiTro] = useState<string>('sinh_vien');
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const getPhanHoiAdminModel = async () => {
    setLoading(true);
    const response = await getPhanHoiAdmin({ page, limit, daTraLoi, vaiTro });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.total);
    setLoading(false);
  };

  const traLoiPhanHoiModel = async (payload: { id: string; data: { noiDungTraLoi: string } }) => {
    setLoading(true);
    await traLoiPhanHoi(payload);
    message.success('Trả lời thành công');
    setLoading(false);
    setVisibleForm(false);
    getPhanHoiAdminModel();
  };

  return {
    daTraLoi,
    vaiTro,
    getPhanHoiAdminModel,
    traLoiPhanHoiModel,
    setDaTraLoi,
    setVaiTro,
    setRecord,
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
