import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const BASE = `${ip3}/files`;

/** POST /files/avatar — Upload avatar lên Cloudinary */
export async function uploadAvatar(file: File | Blob) {
	const formData = new FormData();
	formData.append('file', file);
	return axios.post(`${BASE}/avatar`, formData);
}

/** POST /files/upload — Upload file lên hệ thống */
export async function uploadFileAvatar(file: File | Blob) {
	const formData = new FormData();
	formData.append('file', file);
	return axios.post(`${BASE}/upload`, formData);
}

/** GET /files/:id — Tải file theo ID */
export function getFileUrl(fileId: string) {
	return `${BASE}/${fileId}`;
}

/** POST /files/export — Tạo job xuất Excel */
export async function createExportJob(params: {
	formId?: string;
	fromDate?: string;
	toDate?: string;
}) {
	return axios.post(`${BASE}/export`, params);
}

/** GET /files/export/:jobId — Kiểm tra tiến độ export */
export async function getExportJobStatus(jobId: string) {
	return axios.get(`${BASE}/export/${jobId}`);
}

/** POST /files/export/:jobId/retry — Thử lại export job thất bại */
export async function retryExportJob(jobId: string) {
	return axios.post(`${BASE}/export/${jobId}/retry`);
}

/** GET /files/export/:jobId/download — Tải file export */
export function getExportDownloadUrl(jobId: string) {
	return `${BASE}/export/${jobId}/download`;
}
