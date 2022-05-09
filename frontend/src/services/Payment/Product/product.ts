import axios from '@/utils/axios';
import { ipPayment } from '@/utils/ip';

const url = 'product';

export const archiveProduct = (productId: string) =>
  axios.put(`${ipPayment}/${url}/archive/${productId}`);

export const unarchiveProduct = (productId: string) =>
  axios.put(`${ipPayment}/${url}/unarchive/${productId}`);
