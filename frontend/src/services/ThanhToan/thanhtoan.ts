import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { buildFormData } from '@/utils/utils';

export async function getProductByCode(code: string) {
  return axios.get(`${ip3}/SLINK-MANUAL/thanh-toan/product/${code}`);
}

export async function getInvoiceByIdentityCode(identityCode: string) {
  return axios.get(`${ip3}/SLINK-MANUAL/thanh-toan/invoice/${identityCode}`);
}

export async function getMyInvoice(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/SLINK-MANUAL/thanh-toan/invoice/my`, { params: payload });
}

export async function getInvoice(payload: { page: number; limit: number; condition?: any }) {
  return axios.get(`${ip3}/SLINK-MANUAL/thanh-toan/invoice`, { params: payload });
}

export async function postInvoice(payload: ThanhToan.PostInvoice) {
  return axios.post(`${ip3}/SLINK-MANUAL/thanh-toan/invoice`, payload);
}

export async function importInvoice(payload: {
  file: any;
  loaiThanhToan: string;
  mocThoiGian: string;
}) {
  const formData = buildFormData(payload);
  return axios.post(`${ip3}/SLINK-MANUAL/thanh-toan/invoice/import`, formData);
}

export async function importInvoicePaid(payload: {
  file: any;
  loaiThanhToan: string;
  mocThoiGian: string;
}) {
  const formData = buildFormData(payload);
  return axios.post(`${ip3}/SLINK-MANUAL/thanh-toan/invoice/import-paid`, formData);
}

export async function payInvoiceByIdentityCode(
  identityCode: string,
  payload: {
    amountPaid: number;
    transactionDate: string;
  },
) {
  return axios.put(`${ip3}/SLINK-MANUAL/thanh-toan/invoice/${identityCode}/pay`, payload);
}

export async function editInvoiceByIdentityCode(
  identityCode: string,
  payload: {
    amountPaid: number;
    transactionDate?: string;
  },
) {
  return axios.put(`${ip3}/SLINK-MANUAL/thanh-toan/invoice/${identityCode}/edit`, payload);
}

export async function refundInvoiceByIdentityCode(
  identityCode: string,
  payload: {
    amountPaid: number;
    transactionDate: string;
  },
) {
  return axios.put(`${ip3}/SLINK-MANUAL/thanh-toan/invoice/${identityCode}/refund`, payload);
}

export async function getLinkThanhToanByIdentityCode(identityCode: string) {
  return axios.post(`${ip3}/SLINK-MANUAL/thanh-toan/init/vnpt-pay/${identityCode}`);
}

export async function thongKeMyInvoice(payload: { condition: any }) {
  return axios.get(`${ip3}/SLINK-MANUAL/thanh-toan/invoice/my/thong-ke`, { params: payload });
}
