import axios from '@/utils/axios';
import { ip3, keycloakClientID, keycloakTokenEndpoint } from '@/utils/ip';
import queryString from 'query-string';

export async function getInfo() {
  return axios.get(`${ip3}/user/me`);
}

export async function adminlogin(payload: { username?: string; password?: string }) {
  return axios.post(`${ip3}/auth/login`, { ...payload, platform: 'Web' });
}

export async function refreshAccesssToken(payload: { refreshToken: string }) {
  const data = {
    client_id: keycloakClientID,
    grant_type: 'refresh_token',
    refresh_token: payload.refreshToken,
  };

  return axios({
    url: keycloakTokenEndpoint,
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: queryString.stringify(data),
  });
}
