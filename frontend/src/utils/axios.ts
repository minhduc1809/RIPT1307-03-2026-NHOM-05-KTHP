import { message, notification } from 'antd';
import axios from 'axios';
import { history } from 'umi';
import data from './data';

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

				const newAccessToken = refreshData.accessToken;
				localStorage.setItem('token', newAccessToken);
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

		if (typeof originData !== 'object' || !Object.keys(originData ?? {}).includes('silent') || !originData?.silent)
			switch (error?.response?.status) {
				case 400:
					notification.error({
						message: 'Dữ liệu chưa đúng (004)',
						description: descriptionError,
					});
					break;

				case 401:
					// Handled above with refresh logic
					break;

				case 403:
				case 405:
					notification.error({
						message: 'Thao tác không được phép (304)',
						description: descriptionError,
					});
					break;

				case 404:
					notification.error({
						message: 'Không tìm thấy dữ liệu (040)',
						description: descriptionError,
					});
					break;

				case 409:
					notification.error({
						message: 'Dữ liệu chưa đúng (904)',
						description: descriptionError,
					});
					break;

				case 500:
				case 502:
					notification.error({
						message: 'Hệ thống đang cập nhật (005)',
						description: descriptionError,
					});
					break;

				default:
					message.error('Hệ thống đang cập nhật. Vui lòng thử lại sau');
					break;
			}
		// Do something with response error
		return Promise.reject(error);
	},
);

export default axios;
