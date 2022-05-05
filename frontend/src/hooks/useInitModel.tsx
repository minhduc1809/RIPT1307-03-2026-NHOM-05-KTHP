import { message } from 'antd';
import { useState } from 'react';
import useInitService from './useInitService';

const useInitModel = (url: string, setDanhSach?: any, setRecord?: any) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const { getAllService, getPageableService, postService, putService, deleteService } =
    useInitService(url);

  const getPageableModel = async () => {
    setLoading(true);
    const response = await getPageableService({ page, limit, condition });
    if (setDanhSach) setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getAllModel = async (isSetRecord?: boolean) => {
    setLoading(true);
    const response = await getAllService();
    setDanhSach(response?.data?.data ?? []);
    if (isSetRecord) setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const postModel = async (payload: any) => {
    try {
      setLoading(true);
      await postService(payload);
      message.success('Thêm mới thành công');
      getPageableModel();
    } catch (err) {
      setLoading(false);
    }
  };

  const putModel = async (id: string | number, payload: any) => {
    try {
      setLoading(true);
      await putService(id, payload);
      message.success('Lưu thành công');
      setVisibleForm(false);
      getPageableModel();
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteModel = async (id: string | number) => {
    setLoading(true);
    await deleteService(id);
    message.success('Xóa thành công');
    getPageableModel();
  };

  return {
    deleteModel,
    putModel,
    postModel,
    getAllModel,
    getPageableModel,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    setLoading,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
  };
};

export default useInitModel;
