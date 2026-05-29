import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const BASE = `${ip3}/files`;

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
