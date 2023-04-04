import { ipGlobal } from '@/utils/ip';
import axios from '@/utils/axios';
import type { EOObject } from './constants';

export async function getOdooObject(
  object: EOObject,
  path: string,
  params: { fields?: any; condition?: any },
) {
  return axios.get(`${ipGlobal}/odoo-object/${object}/${path}`, { params });
}
