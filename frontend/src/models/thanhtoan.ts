import { getProductByCode } from '@/services/ThanhToan/thanhtoan';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<ThanhToan.Product>();

  const getProductByCodeModel = async (code: string) => {
    if (!code) return;
    const response = await getProductByCode(code);
    setRecord(response?.data?.data ?? {});
  };

  return {
    getProductByCodeModel,
    record,
    setRecord,
  };
};
