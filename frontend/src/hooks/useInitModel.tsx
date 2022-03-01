import { useState } from 'react';

const useInitModel = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  return {
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
