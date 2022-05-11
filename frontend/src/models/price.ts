import useInitModel from '@/hooks/useInitModel';
import { archivePrice, unarchivePrice } from '@/services/Payment/Price/price';
import { message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const [danhSach, setDanhSach] = useState<ThanhToan.Price[]>([]);
  const [record, setRecord] = useState<ThanhToan.Price>();
  const { record: recordProduct } = useModel('product');
  const objectInit = useInitModel('payment/price-external', 'cond', setDanhSach, setRecord, {
    product: recordProduct?._id,
  });
  const { setLoading, getModel } = objectInit;

  const archivePriceModel = async (idPrice: string) => {
    setLoading(true);
    await archivePrice(idPrice);
    message.success('Lưu trữ thành công');
    getModel({ product: recordProduct?._id }, 'pageable');
    setLoading(false);
  };

  const unarchivePriceModel = async (idPrice: string) => {
    setLoading(true);
    await unarchivePrice(idPrice);
    message.success('Bỏ lưu trữ thành công');
    getModel({ product: recordProduct?._id }, 'pageable');
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
