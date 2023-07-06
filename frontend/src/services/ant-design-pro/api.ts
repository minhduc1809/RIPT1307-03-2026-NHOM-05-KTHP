import axios from '@/utils/axios';
import {
  ip3,
  ipNotif,
  keycloakClientID,
  keycloakTokenEndpoint,
  resourceServerClientId,
} from '@/utils/ip';
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

export async function getPermission() {
  const data = {
    audience: resourceServerClientId,
    grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
    response_mode: 'permissions',
  };

  return axios({
    url: keycloakTokenEndpoint,
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: queryString.stringify(data),
  });
}

export async function initOneSignal(payload: { playerId: string }) {
  return axios.put(`${ipNotif}/one-signal/user`, payload);
}
