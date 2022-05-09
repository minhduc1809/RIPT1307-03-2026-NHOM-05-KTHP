import axios from '@/utils/axios';
import { ipPayment } from '@/utils/ip';

const url = 'price';

export const archivePrice = (priceId: string) =>
  axios.put(`${ipPayment}/${url}/archive/${priceId}`);

export const unarchivePrice = (priceId: string) =>
  axios.put(`${ipPayment}/${url}/unarchive/${priceId}`);
