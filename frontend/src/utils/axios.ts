import { refreshAccesssToken } from '@/services/ant-design-pro/api';
import { message, notification } from 'antd';
import axios from 'axios';
import { history } from 'umi';
import data from './data';

function routeLogin(errorCode: string) {
  notification.warning({
    message: 'Vui lòng đăng nhập lại',
    description: data.error[errorCode],
  });
  localStorage.clear();
  history.replace({
    pathname: '/user/login',
  });
}

// for multiple request
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    if (
      // config.baseURL === baseApiAddress &&
      !config.headers.Authorization
    ) {
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
  (error) => {
    const descriptionError =
      data.error[error?.response?.data?.detail?.errorCode || error?.response?.data?.errorCode] ||
      (Array.isArray(error?.response?.data?.detail?.exception?.response?.message) &&
        error?.response?.data?.detail?.exception?.response?.message?.join(', ')) ||
      error?.response?.data?.message ||
      error?.response?.data?.errorDescription ||
      error?.data?.detail?.message ||
      error?.message;

    const originalRequest = error.config;
    switch (error?.response?.status) {
      case 400: {
        if (descriptionError !== 'Đã khai báo đánh giá') {
          notification.error({
            message: 'Bad request',
            description: descriptionError,
          });
        }
        break;
      }

      case 401:
        if (originalRequest._retry) break;
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken || error?.request?.responseURL?.includes('refresh')) {
          return routeLogin(error?.response?.data?.errorCode);
        }
        // Nếu đang có 1 cái refresh thì thêm request này vào queue;
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              // gán lại token mới cho request này rồi gửi lại nó
              originalRequest.headers.Authorization = 'Bearer ' + token;
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true; // Request đầu tiên bị lỗi => call refresh token => isRefreshing

        return new Promise((resolve, reject) => {
          refreshAccesssToken({ refreshToken })
            .then((response) => {
              // Lưu token mới vào localStorage
              localStorage.setItem('token', response?.data?.access_token);
              localStorage.setItem('id_token', response?.data?.id_token);
              localStorage.setItem('refreshToken', response?.data?.refresh_token);
              // Set lại token cho axios
              axios.defaults.headers.common.Authorization = `Bearer ${response?.data?.access_token}`;
              originalRequest.headers.Authorization = `Bearer ${response?.data?.access_token}`;
              processQueue(null, response?.data?.access_token); // Chạy lại các request ở trong queue với token mới
              resolve(axios(originalRequest)); // Gửi lại request đầu tiên
            })
            .catch((err) => {
              // Nếu get refresh cũng lỗi => refresh hết hạn => logout
              processQueue(err, null);
              reject(err);
              routeLogin(error?.response?.data?.errorCode);
            })
            .then(() => {
              isRefreshing = false;
            });
        });

      case 403:
      case 405:
        notification.error({
          message: 'Thao tác không được phép',
          description: error?.response?.data?.detail?.message || error.message,
        });
        break;

      case 404:
        notification.error({
          message:
            'Lỗi không tìm thấy dữ liệu, bạn hãy thử f5 refresh lại trình duyệt để cập nhật phiên bản mới nhất',
          description: descriptionError,
        });
        break;

      case 409:
        notification.error({
          message: 'Dữ liệu chưa đúng',
          description: descriptionError,
        });
        break;

      case 500:
      case 502:
        notification.error({
          message: 'Server gặp lỗi',
          description: error?.response?.data?.detail?.message || error?.message,
        });
        break;

      default:
        message.error('Có lỗi xảy ra. Vui lòng thử lại');
        break;
    }
    // Do something with response error
    return Promise.reject(error);
  },
);

export default axios;
