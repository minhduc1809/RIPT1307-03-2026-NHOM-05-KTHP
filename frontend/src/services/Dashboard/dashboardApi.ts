import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const BASE = `${ip3}/dashboard`;

/** GET /dashboard/summary — Tổng quan nhanh (ADMIN) */
export async function getDashboardSummary() {
	return axios.get(`${BASE}/summary`);
}

/** GET /dashboard/my-summary — Tổng quan nhanh của tôi (tất cả role) */
export async function getMyDashboardSummary() {
	return axios.get(`${BASE}/my-summary`);
}

/** GET /dashboard/submissions-by-status — Phân bổ submission theo trạng thái (ADMIN) */
export async function getSubmissionsByStatus() {
	return axios.get(`${BASE}/submissions-by-status`);
}

/** GET /dashboard/submissions-by-day — Số lượng submission theo ngày (ADMIN) */
export async function getSubmissionsByDay(days?: number) {
	return axios.get(`${BASE}/submissions-by-day`, { params: { days } });
}

/** GET /dashboard/top-forms — Top forms được sử dụng nhiều nhất (ADMIN) */
export async function getTopForms(limit?: number) {
	return axios.get(`${BASE}/top-forms`, { params: { limit } });
}

/** GET /dashboard/sla-metrics — SLA compliance metrics per workflow step (ADMIN) */
export async function getSlaMetrics(days?: number) {
	return axios.get(`${BASE}/sla-metrics`, { params: { days } });
}
