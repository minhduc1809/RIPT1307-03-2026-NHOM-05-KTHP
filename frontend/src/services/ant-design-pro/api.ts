// @ts-ignore
/* eslint-disable */
import axios from '@/utils/axios';
import { ip, ip3 } from '@/utils/constants';
import { request } from 'umi';
import { IInfoGV, IInfoSV, IRecordCalendar } from './typings';

export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/v2.2/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function currentUser(id: number, options?: { [key: string]: any }) {
  return request<any>(`${ip}/api/res.partner?id=${id}`, {
    method: 'GET',
    params: {
      limit: 1,
    },
    headers: { 'Content-Type': 'multipart/form-data' },
    ...(options || {}),
  });
}

export async function getDataTinTuc(options?: { [key: string]: any }) {
  return request<IRecordTinTuc.RootObject>(`${ip}/odoo-user-service/tin-tuc/me/pageable`, {
    method: 'GET',
    params: { page: 1, limit: 20 },
    ...(options || {}),
  });
}

export async function getInfoSV(options?: { [key: string]: any }) {
  return request<IInfoSV.RootObject>(`${ip}/odoo-user-service/odoo-user/sinh-vien/me`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function putInfoSV(payload: IInfoSV.Data) {
  return axios.put(`${ip3}/odoo-user/sinh-vien/me`, payload);
}

export async function getInfo(options?: { [key: string]: any }) {
  return request<IInfoSV.RootObject>(`${ip3}/user/me`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getInfoGV(options?: { [key: string]: any }) {
  return request<IInfoSV.RootObject>(`${ip3}/odoo-user/giang-vien/me`, {
    method: 'GET',
    // params:{
    //   limit: 1
    // },
    headers: { 'Content-Type': 'multipart/form-data' },
    ...(options || {}),
  });
}

export async function putInfoGV(payload: IInfoGV.Data) {
  return axios.put(`${ip3}/odoo-user/giang-vien/me`, payload);
}

export async function getInfoChung(options?: { [key: string]: any }) {
  return request<IInfoSV.RootObject>(`${ip3}/odoo-user/general`, {
    method: 'GET',
    headers: { 'Content-Type': 'multipart/form-data' },
    ...(options || {}),
  });
}

export async function getCalendar(
  payload: { fields: Array<string> },
  options?: { [key: string]: any },
) {
  //   const form = new FormData();
  // Object.keys(payload).map(key => {
  //
  //     if (Array.isArray(payload[key])) {
  //       for (let i = 0; i < payload[key].length; i += 1) {
  //         form.append(key, payload[key][i]);
  //       }
  //       return;
  //     }
  //     form.set(key, payload[key]);

  // });

  // form.append('fields', '[\'name\', \'attendee_status\', \'display_time\', \'start\', \'stop\', \'allday\', \'start_date\', \'stop_date\', \'duration\', \'location\', \'show_as\']');
  //
  return request<IRecordCalendar.RootObject>(`${ip}/api/calendar.event`, {
    method: 'GET',
    //   data: form,
    params: {
      fields: JSON.stringify(payload.fields),
    },
    // mode: 'cors',
    headers: { 'Content-Type': 'multipart/form-data' },
    ...(options || {}),
  });
}

export async function login(payload: { login?: string; password?: string }) {
  return axios.post(`${ip3}/odoo-auth/login/web`, payload);
}

export async function adminlogin(payload: { login?: string; password?: string }) {
  return axios.post(`${ip3}/auth/login/web`, payload);
}

export async function changePassword(payload: { oldPassword: string; newPassword: string }) {
  return axios.post(`${ip3}/odoo-user/me/change/password`, payload);
}

/**  GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
