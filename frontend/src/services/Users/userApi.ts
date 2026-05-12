import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type {
	IAssignRoleRequest,
	ICreateUserRequest,
	IUpdateProfileRequest,
	IUpdateUserRequest,
	IUser,
	IUserListResponse,
	IUserPageRequest,
	IUserPageResponse,
} from './typings';

const BASE = `${ip3}/users`;

/** GET /users/me — Lấy profile hiện tại (tất cả role) */
export async function getMyProfile() {
	return axios.get<IUser>(`${BASE}/me`);
}

/** PUT /users/me — Cập nhật profile cá nhân (tất cả role) */
export async function updateMyProfile(data: IUpdateProfileRequest) {
	return axios.put<IUser>(`${BASE}/me`, data);
}

/** POST /users — Tạo người dùng mới (ADMIN) */
export async function createUser(data: ICreateUserRequest) {
	return axios.post<IUser>(BASE, data);
}

/** GET /users — Danh sách người dùng query params (ADMIN) */
export async function getUsers(params?: {
	search?: string;
	role?: string;
	status?: string;
	page?: number;
	limit?: number;
	sort?: string;
}) {
	return axios.get<IUserListResponse>(BASE, { params });
}

/** POST /users/page — Danh sách người dùng body (ADMIN, MANAGER) */
export async function getUsersPage(payload: IUserPageRequest) {
	return axios.post<IUserPageResponse>(`${BASE}/page`, payload);
}

/** GET /users/:id — Chi tiết người dùng (ADMIN, MANAGER) */
export async function getUserById(id: string) {
	return axios.get<IUser>(`${BASE}/${id}`);
}

/** PATCH /users/:id — Cập nhật người dùng (ADMIN) */
export async function updateUser(id: string, data: IUpdateUserRequest) {
	return axios.patch<IUser>(`${BASE}/${id}`, data);
}

/** DELETE /users/:id — Xóa người dùng (ADMIN) */
export async function deleteUser(id: string) {
	return axios.delete(`${BASE}/${id}`);
}

/** PUT /users/:id/roles — Gán vai trò (ADMIN) */
export async function assignRole(id: string, data: IAssignRoleRequest) {
	return axios.put<IUser>(`${BASE}/${id}/roles`, data);
}

/** GET /roles — Danh sách vai trò (ADMIN) */
export async function getRoles() {
	return axios.get<string[]>(`${ip3}/roles`);
}

/** GET /permissions — Danh sách quyền (ADMIN) */
export async function getPermissions() {
	return axios.get<string[]>(`${ip3}/permissions`);
}
