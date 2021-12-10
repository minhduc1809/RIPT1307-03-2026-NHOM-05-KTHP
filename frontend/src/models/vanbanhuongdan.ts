import {
  addThuMuc,
  delThuMuc,
  getThuMucAdmin,
  getThuMucUser,
  putThuMuc,
} from '@/services/VanBanHuongDan/vanbanhuongdan';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<VanBanHuongDan.ThuMuc[]>([]);
  const [loaiThuMuc, setLoaiThuMuc] = useState<string>('Tất cả');
  const [record, setRecord] = useState<VanBanHuongDan.ThuMuc>({} as VanBanHuongDan.ThuMuc);
  const [recordFile, setRecordFile] = useState<VanBanHuongDan.TepTin>({} as VanBanHuongDan.TepTin);
  const [loading, setLoading] = useState<boolean>(true);
  const [condition, setCondition] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [editFile, setEditFile] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
  const [visibleFileList, setVisibleFileList] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const getThuMucModel = async (idHinhThuc?: number) => {
    setLoading(true);
    const response = await getThuMucAdmin({
      page,
      limit,
      idHinhThuc:
        idHinhThuc ||
        (condition?.hinhThucDaoTaoId !== -1 ? condition?.hinhThucDaoTaoId : undefined),
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getThuMucUserModel = async () => {
    setLoading(true);
    const response = await getThuMucUser();
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.length ?? 0);
    setLoading(false);
  };

  const addThuMucModel = async (payload: VanBanHuongDan.ThuMuc) => {
    if (!payload?.hinhThucDaoTaoId) return;
    setLoading(true);
    await addThuMuc(payload);
    message.success('Thêm thành công');
    setLoading(false);
    getThuMucModel();
    setVisibleForm(false);
  };
  const putThuMucModel = async (payload: { id: string; data: VanBanHuongDan.ThuMuc }) => {
    setLoading(true);
    const response = await putThuMuc(payload);
    setRecord(response?.data?.data ?? {});
    message.success('Xử lý thành công');
    setLoading(false);
    getThuMucModel();
    setVisibleForm(false);
    setVisibleFormFile(false);
  };

  const delThuMucModel = async (payload: { id: string }) => {
    setLoading(true);
    await delThuMuc(payload);
    message.success('Xóa thành công');
    getThuMucModel();
    setLoading(false);
  };

  return {
    condition,
    setCondition,
    getThuMucUserModel,
    setLoading,
    setRecord,
    recordFile,
    setRecordFile,
    editFile,
    setEditFile,
    visibleFormFile,
    setVisibleFormFile,
    visibleFileList,
    setVisibleFileList,
    addThuMucModel,
    putThuMucModel,
    delThuMucModel,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    setLoaiThuMuc,
    setPage,
    setLimit,
    danhSach,
    record,
    loading,
    total,
    page,
    loaiThuMuc,
    limit,
    getThuMucModel,
  };
};
