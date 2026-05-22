import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { IFormCreateRequest, IFormPageRequest, IFormPageResponse, IForm, IFormUpdateRequest } from './typings';

const BASE = `${ip3}/forms`;

/** POST /forms — Tạo form mới (ADMIN, MANAGER) */
export async function createForm(data: IFormCreateRequest) {
	return axios.post<IForm>(BASE, data);
}

/** POST /forms/page — Danh sách form có phân trang (ADMIN, MANAGER) */
export async function getFormsPage(payload: IFormPageRequest) {
	return axios.post<IFormPageResponse>(`${BASE}/page`, payload);
}

/** GET /forms/many — Lấy tất cả form đang hoạt động (tất cả role) */
export async function getActiveForms() {
	return axios.get<IForm[]>(`${BASE}/many`);
}

/** GET /forms/:id — Lấy chi tiết form theo ID (tất cả role) */
export async function getFormById(id: string) {
	return axios.get<IForm>(`${BASE}/${id}`);
}

/** PUT /forms/:id — Cập nhật form (ADMIN, MANAGER) */
export async function updateForm(id: string, data: IFormUpdateRequest) {
	return axios.put<IForm>(`${BASE}/${id}`, data);
}

/** DELETE /forms/:id — Xóa mềm form (ADMIN only) */
export async function deleteForm(id: string) {
	return axios.delete<IForm>(`${BASE}/${id}`);
}
