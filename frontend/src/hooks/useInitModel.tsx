import { message } from 'antd';
import { useState } from 'react';
import useInitService from './useInitService';

const useInitModel = (
  url: string,
  fieldNameCondtion: string,
  setDanhSach?: any,
  setRecord?: any,
  initCondition?: any,
) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>(initCondition || {});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const { getAllService, postService, putService, deleteService, getService } = useInitService(url);

  const getModel = async (
    paramCondition?: any,
    path?: string,
    paramPage?: number,
    paramLimit?: number,
  ) => {
    setLoading(true);
    const payload = {
      page: paramPage || page,
      limit: paramLimit || limit,
    };
    payload[fieldNameCondtion] = { ...condition, ...paramCondition };
    const response = await getService(payload, path);
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

  const postModel = async (payload: any, getData?: any) => {
    try {
      setLoading(true);
      await postService(payload);
      message.success('Thêm mới thành công');
      if (getData) getData();
      else getModel();
      setVisibleForm(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const putModel = async (id: string | number, payload: any, getData?: any) => {
    try {
      setLoading(true);
      await putService(id, payload);
      message.success('Lưu thành công');
      if (getData) getData();
      else getModel();
      setVisibleForm(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const deleteModel = async (id: string | number, getData?: any) => {
    setLoading(true);
    await deleteService(id);
    message.success('Xóa thành công');
    if (getData) getData();
    else getModel();
  };

  return {
    getModel,
    deleteModel,
    putModel,
    postModel,
    getAllModel,
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
