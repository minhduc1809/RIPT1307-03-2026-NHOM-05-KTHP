import { chuanHoaObject } from '@/utils/utils';
import { message } from 'antd';
import { useState } from 'react';
import useInitService from './useInitService';
import { type TFilter } from '@/components/Table/typing';

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
  initCondition?: { [k in keyof T]?: any },
) => {
  const [danhSach, setDanhSach] = useState<T[]>([]);
  const [record, setRecord] = useState<T>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
  const [filters, setFilters] = useState<TFilter<T>[]>();
  const [condition, setCondition] = useState<{ [k in keyof T]?: any } | any>(initCondition);
  const [sort, setSort] = useState<{ [k in keyof T]?: 1 | -1 }>();
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const { getAllService, postService, putService, deleteService, getService, getByIdService } =
    useInitService(url);

  /**
   * Get Pageable Model
   * @date 2023-04-05
   * @param {any} paramCondition?:any
   * @param {any} path?:string
   * @param {any} paramPage?:number
   * @param {any} paramLimit?:number
   * @param {any} sortParam?:{[k in key of T]: 1 | -1 }
   * @param {any} queryParam?:any
   * @returns {any}
   */
  const getModel = async (
    paramCondition?: any,
    path?: string,
    paramPage?: number,
    paramLimit?: number,
    sortParam?: { [k in keyof T]: 1 | -1 },
    queryParam?: any,
  ): Promise<T[]> => {
    setLoading(true);
    const payload = {
      page: paramPage || page,
      limit: paramLimit || limit,
      sort: sortParam || sort,
      [fieldNameCondtion ?? 'condition']: {
        ...condition,
        ...paramCondition,
      },
      filters: filters?.filter((item) => item.active)?.map(({ active, ...item }) => item),
    };

    try {
      const response = await getService({ ...payload, ...queryParam }, path ?? 'page');
      if (page > 1 && response?.data?.data?.result?.length === 0) setPage(page - 1);
      else {
        if (setDanhSach) setDanhSach(response?.data?.data?.result ?? []);
        setTotal(response?.data?.data?.total ?? 0);
      }
      return response?.data?.data?.result;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getAllModel = async (
    isSetRecord?: boolean,
    sortParam?: any,
    conditionParam?: any,
  ): Promise<T[]> => {
    setLoading(true);
    try {
      const response = await getAllService({ condition: conditionParam });
      const data: T[] = response?.data?.data ?? [];
      if (sortParam) data.sort(sortParam);
      setDanhSach(data);
      if (isSetRecord) setRecord(data?.[0]);

      return data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getByIdModel = async (id: string | number, isSetRecord?: boolean): Promise<T> => {
    if (!id) return Promise.reject();
    setLoading(true);
    try {
      const response = await getByIdService(id);
      if (isSetRecord !== false) setRecord(response?.data?.data ?? null);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const postModel = async (payload: T, getData?: any, closeModal?: boolean): Promise<T> => {
    if (formSubmiting) Promise.reject('form submiting');
    setFormSubmiting(true);
    try {
      const res = await postService(chuanHoaObject(payload));
      message.success('Thêm mới thành công');
      setLoading(false);
      if (getData) getData();
      else getModel();
      if (closeModal !== false) setVisibleForm(false);

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
    closeModal?: boolean,
  ): Promise<T> => {
    if (formSubmiting) return Promise.reject('form submiting');
    setFormSubmiting(true);
    try {
      const res = await putService(id, chuanHoaObject(payload));
      message.success('Lưu thành công');
      setLoading(false);
      if (getData) getData();
      else if (!notGet) getModel();
      if (closeModal !== false) setVisibleForm(false);

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
    filters,
    setFilters,
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
