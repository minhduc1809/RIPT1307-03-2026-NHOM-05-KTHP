import { chuanHoaObject } from '@/utils/utils';
import { message } from 'antd';
import { useState } from 'react';
import useInitService from './useInitService';

/**
 *
 * @param url path api
 * @param fieldNameCondtion condition | cond
 * @param initCondition initConditionValue
 * @returns
 */
const useInitModel = <T,>(
  url: string,
  fieldNameCondtion?: 'condition' | 'cond',
  initCondition?: { [k in keyof T]: any },
) => {
  const [danhSach, setDanhSach] = useState<T[]>([]);
  const [record, setRecord] = useState<T>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
  const [filterInfo, setFilterInfo] = useState<{ [k in keyof T]: any }>();
  const [condition, setCondition] = useState<{ [k in keyof T]: any } | undefined>(initCondition);
  const [sort, setSort] = useState<{ [k in keyof T]: any }>();
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const { getAllService, postService, putService, deleteService, getService, getByIdService } =
    useInitService(url);

  const getModel = async (
    paramCondition?: any,
    path?: string,
    paramPage?: number,
    paramLimit?: number,
    sortParam?: any,
    queryParam?: any,
  ) => {
    setLoading(true);
    const payload = {
      page: paramPage || page,
      limit: paramLimit || limit,
      sort: { ...sort, ...sortParam },
      [fieldNameCondtion ?? 'condition']: { ...condition, ...paramCondition },
    };

    const response = await getService({ ...payload, ...queryParam }, path ?? 'page');
    if (page > 1 && response?.data?.data?.result?.length === 0) setPage(page - 1);
    else {
      if (setDanhSach) setDanhSach(response?.data?.data?.result ?? []);
      setTotal(response?.data?.data?.total ?? 0);
      setLoading(false);
    }
  };

  const getAllModel = async (isSetRecord?: boolean, sortParam?: any, conditionParam?: any) => {
    setLoading(true);
    const response = await getAllService({ condition: conditionParam });
    const data: any[] = response?.data?.data ?? [];
    if (sortParam) data.sort(sortParam);
    setDanhSach(data);
    if (isSetRecord) setRecord(data?.[0]);
    setLoading(false);
  };

  const getByIdModel = async (id: string | number): Promise<T> => {
    if (!id) return Promise.reject();
    setLoading(true);
    const response = await getByIdService(id);
    if (setRecord) setRecord(response?.data?.data ?? null);
    setLoading(false);
    return response?.data?.data ?? null;
  };

  const postModel = async (payload: T, getData?: any): Promise<T> => {
    if (formSubmiting) Promise.reject('form submiting');
    setFormSubmiting(true);
    try {
      const res = await postService(chuanHoaObject(payload));
      message.success('Thêm mới thành công');
      setLoading(false);
      if (getData) getData();
      else getModel();
      setVisibleForm(false);

      return res.data?.data;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setFormSubmiting(false);
    }
  };

  const putModel = async (
    id: string | number,
    payload: T,
    getData?: any,
    notGet?: boolean,
  ): Promise<T> => {
    if (formSubmiting) return Promise.reject('form submiting');
    setFormSubmiting(true);
    try {
      const res = await putService(id, chuanHoaObject(payload));
      message.success('Lưu thành công');
      setLoading(false);
      if (getData) getData();
      else if (!notGet) getModel();
      setVisibleForm(false);

      return res.data?.data;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setFormSubmiting(false);
    }
  };

  const deleteModel = async (id: string | number, getData?: any): Promise<any> => {
    setLoading(true);
    try {
      const res = await deleteService(id);
      message.success('Xóa thành công');

      const maxPage = Math.ceil((total - 1) / limit);
      let newPage = page;
      if (newPage > maxPage) {
        newPage = maxPage || 1;
        setPage(newPage);
      }

      if (getData) getData();
      else getModel(undefined, undefined, newPage);

      return res.data;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    sort,
    setSort,
    getByIdModel,
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
    formSubmiting,
    setFormSubmiting,
    danhSach,
    setDanhSach,
    record,
    setRecord,
  };
};

export default useInitModel;
