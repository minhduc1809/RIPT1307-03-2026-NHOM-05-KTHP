import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const BASE = `${ip3}/notifications`;

export interface INotification {
	id: string;
	userId: string;
	title: string;
	content: string;
	message?: string;
	type?: string;
	metadata?: Record<string, any>;
	read: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface INotificationListResponse {
	items: INotification[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface IUnreadCountResponse {
	count: number;
}

/** GET /notifications — Danh sách thông báo */
export async function getNotifications(params?: {
	page?: number;
	limit?: number;
	read?: string;
}) {
	return axios.get<INotificationListResponse>(BASE, { params });
}

/** GET /notifications/unread-count — Đếm chưa đọc */
export async function getUnreadCount() {
	return axios.get<IUnreadCountResponse>(`${BASE}/unread-count`);
}

/** PATCH /notifications/:id/read — Đánh dấu đã đọc */
export async function markAsRead(id: string) {
	return axios.patch(`${BASE}/${id}/read`);
}

/** PATCH /notifications/read-all — Đánh dấu tất cả đã đọc */
export async function markAllAsRead() {
	return axios.patch(`${BASE}/read-all`);
}
