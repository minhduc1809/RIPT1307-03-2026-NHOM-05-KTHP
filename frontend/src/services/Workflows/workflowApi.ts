import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type {
	IWorkflowDefinition,
	IWorkflowDefinitionCreate,
	IWorkflowDefinitionUpdate,
	IWorkflowDefinitionListResponse,
} from './typings';

const BASE = `${ip3}/workflows/definitions`;

/** POST /workflows/definitions — Tạo workflow definition (ADMIN, MANAGER) */
export async function createWorkflowDefinition(data: IWorkflowDefinitionCreate) {
	return axios.post<IWorkflowDefinition>(BASE, data);
}

/** GET /workflows/definitions — Danh sách workflow definitions có phân trang */
export async function getWorkflowDefinitions(params?: { page?: number; limit?: number }) {
	return axios.get<IWorkflowDefinitionListResponse>(BASE, { params });
}

/** GET /workflows/definitions/:id — Chi tiết workflow definition */
export async function getWorkflowDefinitionById(id: string) {
	return axios.get<IWorkflowDefinition>(`${BASE}/${id}`);
}

/** PUT /workflows/definitions/:id — Cập nhật workflow definition (ADMIN, MANAGER) */
export async function updateWorkflowDefinition(id: string, data: IWorkflowDefinitionUpdate) {
	return axios.put<IWorkflowDefinition>(`${BASE}/${id}`, data);
}

/** DELETE /workflows/definitions/:id — Xóa workflow definition (ADMIN only) */
export async function deleteWorkflowDefinition(id: string) {
	return axios.delete(`${BASE}/${id}`);
}
