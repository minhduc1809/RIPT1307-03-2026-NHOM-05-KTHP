import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<DichVuMotCua.Record[]>([]);
  const [thuTuc, setThuTuc] = useState<DichVuMotCua.ThuTuc>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [loaiGiayTo, setLoaiGiayTo] = useState<string>('');
  const [loaiPhongBan, setLoaiPhongBan] = useState<string>('');
  const [record, setRecord] = useState<DichVuMotCua.Record>();
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  return {
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
