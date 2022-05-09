import useInitModel from '@/hooks/useInitModel';
import { archivePrice, unarchivePrice } from '@/services/Payment/Price/price';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<ThanhToan.Price[]>([]);
  const [record, setRecord] = useState<ThanhToan.Price>();

  const objectInit = useInitModel('payment/price/external', 'cond', setDanhSach, setRecord);
  const { setLoading, getPageableModel } = objectInit;

  const archivePriceModel = async (idPrice: string) => {
    setLoading(true);
    await archivePrice(idPrice);
    getPageableModel();
    setLoading(false);
  };

  const unarchivePriceModel = async (idPrice: string) => {
    setLoading(true);
    await unarchivePrice(idPrice);
    getPageableModel();
    setLoading(false);
  };

  return {
    danhSach,
    setDanhSach,
    record,
    setRecord,
    archivePriceModel,
    unarchivePriceModel,
    ...objectInit,
  };
};
