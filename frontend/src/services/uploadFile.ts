import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

const handleSingleFile = async (file: any): Promise<string | null> => {
	if (file?.originFileObj) {
		try {
			const response = await uploadFile({
				file: file?.originFileObj,
				isPublic: '1',
			});
			return response?.data?.data?.url;
		} catch (er) {
			return Promise.reject(er);
		}
	} else return file?.url || null;
};

export async function uploadFile(payload: { file: string | Blob; isPublic: '1' | '0' }) {
	const form = new FormData();
	form.append('file', payload?.file);
	form.append('isPublic', payload?.isPublic);
	return axios.post(`${ip3}/file`, form);
}

/**
 * Build upload file from values in form
 * @param values: get from Form
 * @param name: fieldName in Form is Upload
 * @returns Url of file uploaded or NULL
 */
export const buildUpLoadFile = async (values: any, name: string): Promise<string | null> => {
	if (typeof values?.[name] === 'string') return values?.[name];
	else if (values?.[name]?.fileList?.[0]) {
		return handleSingleFile(values?.[name]?.fileList?.[0]);
	}
	return null;
};

/**
 * Build upload multiple files from values in form
 * @param values: get from Form
 * @param name: fieldName in Form is Upload
 * @returns Array Url of files uploaded or NULL
 */
export const buildUpLoadMultiFile = async (values: any, name: string): Promise<string[] | null> => {
	if (Array.isArray(values?.[name])) return values?.[name];
	else if (values?.[name]?.fileList && Array.isArray(values?.[name]?.fileList) && values?.[name]?.fileList?.length) {
		return Promise.all(values?.[name]?.fileList.map((file: any) => handleSingleFile(file)));
	}
	return null;
};
