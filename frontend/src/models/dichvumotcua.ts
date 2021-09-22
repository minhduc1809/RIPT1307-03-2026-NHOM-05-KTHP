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
  const getInfo = async () => {
    setLoading(true);
    const currentUser = (await getInfoSV())?.data;
    setInfoSv(currentUser);
    setLoading(false);
  };
  const postDonXacNhanTinhTrangHocTapModel = async (payload: DichVuMotCua.Record) => {
    setLoading(true);
    await postDonXacNhanTinhTrangHocTap(payload);
    message.success('Gửi đơn thành công');
    setLoading(false);
  };

  return {
    postDonXacNhanTinhTrangHocTapModel,
    thuTuc,
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
