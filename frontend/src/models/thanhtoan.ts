import {
  editInvoiceByIdentityCode,
  getInvoice,
  getInvoiceByIdentityCode,
  getMyInvoice,
  getProductByCode,
  importInvoice,
  importInvoicePaid,
  payInvoiceByIdentityCode,
  postInvoice,
  refundInvoiceByIdentityCode,
  thongKeMyInvoice,
} from '@/services/ThanhToan/thanhtoan';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<ThanhToan.Product>();
  const [danhSach, setDanhSach] = useState<ThanhToan.Invoice[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [invoice, setInvoice] = useState<ThanhToan.Invoice>();
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleResponseImport, setVisibleResponseImport] = useState<boolean>(false);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [postTypeCongNo, setPostTypeCongNo] = useState<'normal' | 'import'>('normal');
  const [recordThongKeInvoice, setRecordThongKeInvoice] = useState<ThanhToan.ThongKeInvoice>();
  const [responseImportInvoice, setResponseImportInvoice] =
    useState<ThanhToan.ResponseImportInvoice>();
  const [importType, setImportType] = useState<
    'các khoản chưa thu' | 'các khoản đã thu' | undefined
  >('các khoản chưa thu');
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>('Hình thức đào tạo');

  const getProductByCodeModel = async (code: string) => {
    if (!code) return;
    const response = await getProductByCode(code);
    setRecord(response?.data?.data ?? {});
  };

  const getInvoiceModel = async () => {
    setLoading(true);
    const response = await getInvoice({
      page,
      limit,
      condition: { ...condition, 'metadata.loai': 'Tuyển sinh' },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
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
    isCongNo?: boolean,
  ) => {
    if (!identityCode) return;
    setLoading(true);
    await payInvoiceByIdentityCode(identityCode, payload);
    message.success('Cập nhật thanh toán thành công');
    getInvoiceByIdentityCodeModel(identityCode);
    if (isCongNo === true) {
      getInvoiceModel();
    }
    setLoading(false);
  };

  const refundInvoiceByIdentityCodeModel = async (
    identityCode: string,
    payload: {
      amountPaid: number;
      transactionDate: string;
    },
    isCongNo?: boolean,
  ) => {
    if (!identityCode) return;
    setLoading(true);
    await refundInvoiceByIdentityCode(identityCode, payload);
    message.success('Cập nhật thanh toán thành công');
    getInvoiceByIdentityCodeModel(identityCode);
    if (isCongNo === true) {
      getInvoiceModel();
    }
    setLoading(false);
  };

  const getMyInvoiceModel = async () => {
    setLoading(true);
    const response = await getMyInvoice({
      page,
      limit,
      condition: { ...condition, status: condition?.status ?? 'open' },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postInvoiceModel = async (payload: ThanhToan.PostInvoice) => {
    try {
      setLoading(true);
      await postInvoice(payload);
      message.success('Thêm thành công');
      setLoading(false);
      setVisibleForm(false);
      getInvoiceModel();
    } catch (error) {
      setLoading(false);
    }
  };

  const importInvoiceModel = async (payload: {
    file: any;
    loaiThanhToan: string;
    mocThoiGian: string;
  }) => {
    try {
      setLoading(true);
      await importInvoice(payload);
      message.success('Import thành công');
      setLoading(false);
      getInvoiceModel();
      setVisibleForm(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const importInvoicePaidModel = async (payload: {
    file: any;
    loaiThanhToan: string;
    mocThoiGian: string;
  }) => {
    try {
      setLoading(true);
      const response = await importInvoicePaid(payload);
      setResponseImportInvoice(response?.data?.data);
      // message.success('Import thành công');
      setVisibleResponseImport(true);
      setLoading(false);
      getInvoiceModel();
      setVisibleForm(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const thongKeMyInvoiceModel = async () => {
    const response = await thongKeMyInvoice({ condition: { status: condition?.status ?? 'open' } });
    setRecordThongKeInvoice(response?.data?.data ?? {});
  };

  const editInvoiceByIdentityCodeModel = async (
    identityCode: string,
    payload: {
      amountPaid: number;
      transactionDate?: string;
    },
    isCongNo?: boolean,
  ) => {
    if (!identityCode) return;
    setLoading(true);
    await editInvoiceByIdentityCode(identityCode, payload);
    message.success('Cập nhật thanh toán thành công');
    getInvoiceByIdentityCodeModel(identityCode);
    if (isCongNo === true) {
      getInvoiceModel();
    }
    setLoading(false);
  };

  return {
    phamVi,
    setPhamVi,
    editInvoiceByIdentityCodeModel,
    refundInvoiceByIdentityCodeModel,
    getInvoiceByIdentityCodeModel,
    payInvoiceByIdentityCodeModel,
    getProductByCodeModel,
    record,
    setRecord,
    invoice,
    setInvoice,
    loading,
    setLoading,
    visibleForm,
    setVisibleForm,
    visibleResponseImport,
    setVisibleResponseImport,
    responseImportInvoice,
    setResponseImportInvoice,
    importInvoicePaidModel,
    importType,
    setImportType,
    recordThongKeInvoice,
    setRecordThongKeInvoice,
    thongKeMyInvoiceModel,
    importInvoiceModel,
    postTypeCongNo,
    setPostTypeCongNo,
    postInvoiceModel,
    edit,
    setEdit,
    getInvoiceModel,
    getMyInvoiceModel,
    danhSach,
    setDanhSach,
    page,
    limit,
    setPage,
    setLimit,
    condition,
    setCondition,
    filterInfo,
    setFilterInfo,
    total,
    setTotal,
  };
};
