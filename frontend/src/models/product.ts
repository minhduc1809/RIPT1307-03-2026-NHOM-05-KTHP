import useInitModel from '@/hooks/useInitModel';
import { archiveProduct, unarchiveProduct } from '@/services/Payment/Product/product';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<ThanhToan.Product[]>([]);
  const [record, setRecord] = useState<ThanhToan.Product>();

  const objectInit = useInitModel('payment/product/external', 'cond', setDanhSach, setRecord, {
    'metaData.loai': 'Tuyển sinh',
  });

  const { setLoading, getPageableModel } = objectInit;
  const archiveProductModel = async (idProduct: string) => {
    setLoading(true);
    await archiveProduct(idProduct);
    message.success('Lưu trữ thành công');
    getPageableModel();
    setLoading(false);
  };

  const unarchiveProductModel = async (idProduct: string) => {
    setLoading(true);
    await unarchiveProduct(idProduct);
    message.success('Bỏ lưu trữ thành công');
    getPageableModel();
    setLoading(false);
  };

  return {
    danhSach,
    setDanhSach,
    record,
    setRecord,
    archiveProductModel,
    unarchiveProductModel,
    ...objectInit,
  };
};
