import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

/** POST /file — Upload file lên hệ thống */
export async function uploadFileAvatar(file: File | Blob) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('scope', 'Public');
	return axios.post(`${ip3}/file`, formData);
}
