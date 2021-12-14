import {
  getInvoiceByIdentityCode,
  getProductByCode,
  payInvoiceByIdentityCode,
  refundInvoiceByIdentityCode,
} from '@/services/ThanhToan/thanhtoan';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<ThanhToan.Product>();
  const [invoice, setInvoice] = useState<ThanhToan.Invoice>();
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  const getProductByCodeModel = async (code: string) => {
    if (!code) return;
    const response = await getProductByCode(code);
    setRecord(response?.data?.data ?? {});
  };

  const getInvoiceByIdentityCodeModel = async (identityCode?: string) => {
    if (!identityCode) return;
    const response = await getInvoiceByIdentityCode(identityCode);
    setInvoice(response?.data?.data?.data);
  };

  const payInvoiceByIdentityCodeModel = async (
    identityCode: string,
    payload: {
      amountPaid: number;
      transactionDate: string;
    },
  ) => {
    if (!identityCode) return;
    setLoading(true);
    await payInvoiceByIdentityCode(identityCode, payload);
    message.success('Cập nhật thanh toán thành công');
    getInvoiceByIdentityCodeModel(identityCode);
    setLoading(false);
  };

  const refundInvoiceByIdentityCodeModel = async (
    identityCode: string,
    payload: {
      amountPaid: number;
      transactionDate: string;
    },
  ) => {
    if (!identityCode) return;
    setLoading(true);
    await refundInvoiceByIdentityCode(identityCode, payload);
    message.success('Cập nhật thanh toán thành công');
    getInvoiceByIdentityCodeModel(identityCode);
    setLoading(false);
  };

  return {
    refundInvoiceByIdentityCodeModel,
    loading,
    setLoading,
    payInvoiceByIdentityCodeModel,
    getInvoiceByIdentityCodeModel,
    invoice,
    setInvoice,
    visibleForm,
    setVisibleForm,
    getProductByCodeModel,
    record,
    setRecord,
  };
};
