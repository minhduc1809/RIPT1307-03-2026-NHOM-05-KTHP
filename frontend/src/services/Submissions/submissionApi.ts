import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type {
	ISubmission,
	ISubmissionListResponse,
	IPendingListResponse,
	IAvailableActionsResponse,
	IWorkflowActionRequest,
	IWorkflowActionResponse,
	IWorkflowHistoryResponse,
} from './typings';

const SUB_BASE = `${ip3}/submissions`;
const WF_BASE = `${ip3}/workflows`;

// ===================== SUBMISSIONS =====================

/** POST /submissions — Nộp form mới */
export async function createSubmission(data: { formId: string; data: Record<string, any> }) {
	return axios.post<ISubmission>(SUB_BASE, data);
}

/** GET /submissions — Danh sách submission của tôi */
export async function getMySubmissions(params?: {
	page?: number;
	limit?: number;
	status?: string;
	formId?: string;
}) {
	return axios.get<ISubmissionListResponse>(SUB_BASE, { params });
}

/** GET /submissions/admin — Tất cả submissions (ADMIN, MANAGER) */
export async function getAllSubmissions(params?: {
	page?: number;
	limit?: number;
	status?: string;
	formId?: string;
}) {
	return axios.get<ISubmissionListResponse>(`${SUB_BASE}/admin`, { params });
}

/** GET /submissions/:id — Chi tiết submission */
export async function getSubmissionById(id: string) {
	return axios.get<ISubmission>(`${SUB_BASE}/${id}`);
}

/** PATCH /submissions/:id/recall — Thu hồi submission */
export async function recallSubmission(id: string) {
	return axios.patch<ISubmission>(`${SUB_BASE}/${id}/recall`);
}

/** POST /submissions/:id/resubmit — Nộp lại submission */
export async function resubmitSubmission(id: string, data?: { data?: Record<string, any> }) {
	return axios.post<ISubmission>(`${SUB_BASE}/${id}/resubmit`, data);
}

/** PATCH /submissions/:id/withdraw — Rút đơn (hủy vĩnh viễn) */
export async function withdrawSubmission(id: string) {
	return axios.patch<ISubmission>(`${SUB_BASE}/${id}/withdraw`);
}

/** GET /submissions/:id/revisions — Lịch sử các phiên bản nộp lại */
export async function getSubmissionRevisions(id: string) {
	return axios.get<ISubmission[]>(`${SUB_BASE}/${id}/revisions`);
}

// ===================== WORKFLOW ACTIONS =====================

/** POST /workflows/action — Thực hiện workflow action */
export async function executeWorkflowAction(data: IWorkflowActionRequest) {
	return axios.post<IWorkflowActionResponse>(`${WF_BASE}/action`, data);
}

/** GET /workflows/pending — Danh sách chờ duyệt */
export async function getPendingSubmissions(params?: { page?: number; limit?: number }) {
	return axios.get<IPendingListResponse>(`${WF_BASE}/pending`, { params });
}

/** GET /workflows/submissions/:submissionId/available-actions — Actions khả dụng */
export async function getAvailableActions(submissionId: string) {
	return axios.get<IAvailableActionsResponse>(
		`${WF_BASE}/submissions/${submissionId}/available-actions`,
	);
}

/** GET /workflows/submissions/:submissionId/history — Lịch sử workflow */
export async function getWorkflowHistory(
	submissionId: string,
	params?: { includeRevisions?: string },
) {
	return axios.get<IWorkflowHistoryResponse>(
		`${WF_BASE}/submissions/${submissionId}/history`,
		{ params },
	);
}
