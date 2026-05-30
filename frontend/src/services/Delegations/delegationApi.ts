import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type {
	IDelegation,
	IDelegationCreateRequest,
	IDelegationUpdateRequest,
	IDelegationListResponse,
} from './typings';

const BASE = `${ip3}/delegations`;

/** POST /delegations — Tạo ủy quyền */
export async function createDelegation(data: IDelegationCreateRequest) {
	return axios.post<IDelegation>(BASE, data);
}

/** GET /delegations — Danh sách ủy quyền */
export async function getDelegations(params?: { page?: number; limit?: number }) {
	return axios.get<IDelegationListResponse>(BASE, { params });
}

/** PUT /delegations/:id — Cập nhật ủy quyền */
export async function updateDelegation(id: string, data: IDelegationUpdateRequest) {
	return axios.put<IDelegation>(`${BASE}/${id}`, data);
}

/** GET /delegations/:id — Chi tiết ủy quyền */
export async function getDelegationById(id: string) {
	return axios.get<IDelegation>(`${BASE}/${id}`);
}

/** DELETE /delegations/:id — Xóa ủy quyền */
export async function deleteDelegation(id: string) {
	return axios.delete(`${BASE}/${id}`);
}
