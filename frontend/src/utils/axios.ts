import { message, notification } from 'antd';
import axios from 'axios';
import { history } from 'umi';
import data from './data';

const ERROR_MESSAGES: Record<string, string> = {
	'error.FORBIDDEN': 'Bạn không có quyền thực hiện thao tác này',
	'error.UNAUTHORIZED': 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
	'auth.UNAUTHORIZED': 'Phiên đăng nhập đã hết hạn',
	'error.INVALID_CREDENTIALS': 'Email hoặc mật khẩu không đúng',
	'error.INVALID_REFRESH_TOKEN': 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
	'error.TOKEN_REUSE_DETECTED': 'Phiên đăng nhập bị xung đột. Vui lòng đăng nhập lại',
	'error.CONFLICT': 'Dữ liệu đã tồn tại trong hệ thống',
	'ThrottlerException: Too Many Requests': 'Bạn đã thao tác quá nhanh. Vui lòng đợi một chút rồi thử lại',
	'workflow.INVALID_TRANSITION': 'Không thể thực hiện thao tác này ở trạng thái hiện tại',
	'workflow.INVALID_DELEGATION': 'Ủy quyền không hợp lệ hoặc đã hết hạn',
	'workflow.DELEGATION_SCOPE_FORM': 'Ủy quyền không áp dụng cho biểu mẫu này',
	'workflow.DELEGATION_SCOPE_WORKFLOW': 'Ủy quyền không áp dụng cho quy trình này',
	'workflow.NOT_ALLOWED': 'Bạn không có quyền duyệt bước này',
	'workflow.COMMENT_REQUIRED': 'Vui lòng nhập ghi chú trước khi thực hiện',
	'workflow.ALREADY_VOTED': 'Bạn đã bỏ phiếu cho bước này rồi',
	'workflow.ACTION_ALREADY_PERFORMED': 'Thao tác này đã được thực hiện trước đó',
	'workflow.INSTANCE_NOT_FOUND': 'Không tìm thấy quy trình duyệt cho yêu cầu này',
	'delegation.NOT_ALLOWED': 'Bạn không có quyền tạo ủy quyền này',
	'delegation.USER_NOT_FOUND': 'Không tìm thấy người dùng',
	'delegation.TENANT_MISMATCH': 'Hai người dùng không cùng đơn vị',
	'delegation.INVALID_FORM_IDS': 'Một hoặc nhiều biểu mẫu không tồn tại',
	'delegation.INVALID_WORKFLOW_DEFINITION_IDS': 'Một hoặc nhiều quy trình không tồn tại',
	'file.INVALID_FORMAT': 'Định dạng file không được hỗ trợ',
	'file.NOT_FOUND': 'Không tìm thấy file',
	'file.PHYSICAL_NOT_FOUND': 'File đã bị xóa hoặc không tồn tại trên hệ thống',
	'job.NOT_FOUND': 'Không tìm thấy tác vụ xuất dữ liệu',
	'job.NOT_DONE': 'Tác vụ xuất dữ liệu chưa hoàn tất',
	'job.NOT_FAILED': 'Tác vụ không ở trạng thái lỗi, không thể thử lại',
};

function translateError(raw: string | undefined): string {
	if (!raw) return '';
	if (ERROR_MESSAGES[raw]) return ERROR_MESSAGES[raw];
	// Match partial keys
	for (const [key, val] of Object.entries(ERROR_MESSAGES)) {
		if (raw.includes(key)) return val;
	}
	// Clean up common patterns
	if (raw.startsWith('Validation failed')) return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại';
	if (raw.includes('must be') || raw.includes('should not be')) return 'Vui lòng điền đầy đủ thông tin bắt buộc';
	if (raw.includes('already exists') || raw.includes('Unique constraint')) return 'Dữ liệu đã tồn tại trong hệ thống';
	return raw;
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function routeLogin(errorCode: string) {
  // notification.warning({
  //   message: 'Vui lòng đăng nhập lại',
  //   description: data.error[errorCode],
  // });
  localStorage.clear();
  history.replace({
    pathname: '/user/login',
  });
}

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
axios.interceptors.response.use(
	(response) =>
		// Do something with response data
		response,
	async (error) => {
		let er = error?.response?.data;
		// Convert response data to JSON
		if ((error?.response?.config?.responseType as string)?.toLowerCase() === 'arraybuffer') {
			const decoder = new TextDecoder('utf-8');
			er = JSON.parse(decoder.decode(er));
		}
		const descriptionError = Array.isArray(er?.detail?.exception?.response?.message)
			? er?.detail?.exception?.response?.message?.join(', ')
			: // Sequelize validation Errors
			Array.isArray(er?.detail?.exception?.errors)
			? er?.detail?.exception?.errors?.map((e: any) => e?.message)?.join(', ')
			: data.error[er?.detail?.errorCode || er?.errorCode] ||
			  er?.detail?.message ||
			  er?.message ||
			  er?.errorDescription;

		const originalRequest = error.config;
		let originData = originalRequest?.data;
		if (typeof originData === 'string') originData = JSON.parse(originData);

		// Handle 401 with token refresh
		if (error?.response?.status === 401 && !originalRequest._retry) {
			const refreshToken = localStorage.getItem('refreshToken');

			// If no refresh token or this is the login/refresh request itself, redirect to login
			if (!refreshToken || originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
				return routeLogin('Unauthorize');
			}

			if (isRefreshing) {
				// Queue requests while refreshing
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then((token) => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return axios(originalRequest);
				}).catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const { data: refreshData } = await axios.post(
					originalRequest.url?.split('/auth/')[0] + '/auth/refresh',
					{ refreshToken },
					{ headers: {} } // Don't send expired token
				);

				const responseData = refreshData?.data ?? refreshData;
				const newAccessToken = responseData.accessToken;
				localStorage.setItem('token', newAccessToken);

				// Store rotated refresh token if backend returned one
				if (responseData.refreshToken) {
					localStorage.setItem('refreshToken', responseData.refreshToken);
				}

				processQueue(null, newAccessToken);

				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return axios(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				localStorage.clear();
				history.replace('/user/login');
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		const friendlyError = translateError(descriptionError);

		if (typeof originData !== 'object' || !Object.keys(originData ?? {}).includes('silent') || !originData?.silent)
			switch (error?.response?.status) {
				case 400:
					message.warning(friendlyError || 'Vui lòng kiểm tra lại thông tin đã nhập');
					break;

				case 401:
					break;

				case 403:
				case 405:
					message.warning(friendlyError || 'Bạn không có quyền thực hiện thao tác này');
					break;

				case 404:
					message.info(friendlyError || 'Dữ liệu không tồn tại hoặc đã bị xóa');
					break;

				case 409:
					message.warning(friendlyError || 'Dữ liệu đã tồn tại trong hệ thống');
					break;

				case 429:
					message.warning('Bạn đã thao tác quá nhanh. Vui lòng đợi một chút');
					break;

				case 500:
				case 502:
					notification.error({
						message: 'Lỗi hệ thống',
						description: 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút',
					});
					break;

				default:
					message.error('Đã xảy ra lỗi. Vui lòng thử lại sau');
					break;
			}
		// Do something with response error
		return Promise.reject(error);
	},
);

export default axios;
