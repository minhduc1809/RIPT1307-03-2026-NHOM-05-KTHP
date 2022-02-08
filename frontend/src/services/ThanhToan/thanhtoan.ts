import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getProductByCode(code: string) {
  return axios.get(`${ip3}/SLINK-MANUAL/thanh-toan/product/${code}`);
}

export async function getInvoiceByIdentityCode(identityCode: string) {
  return axios.get(`${ip3}/SLINK-MANUAL/thanh-toan/invoice/${identityCode}`);
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
