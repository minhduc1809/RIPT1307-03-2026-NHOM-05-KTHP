import { request } from 'umi';

/**  GET /api/currentUser */
export async function get(options?: Record<string, any>) {
  return request<API.UserMe.RootObject>('/v2.2/user/pageable', {
    method: 'GET',
    ...(options || {}),
  });
}

export interface SimpleResponse {
  statusCode: number;
}

export async function add(user: User.Result) {
  return request<SimpleResponse>('/v2.2/user', {
    method: 'POST',
    data: user,
  });
}
