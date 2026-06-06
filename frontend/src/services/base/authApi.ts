import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

/** POST /auth/forgot-password — Public, gửi email khôi phục mật khẩu */
export async function forgotPassword(email: string) {
	return axios.post(`${ip3}/auth/forgot-password`, { email });
}

/** POST /auth/reset-password — Public, đặt lại mật khẩu bằng token */
export async function resetPassword(token: string, newPassword: string) {
	return axios.post(`${ip3}/auth/reset-password`, { token, newPassword });
}

/** POST /auth/change-password — Bearer JWT, đổi mật khẩu tài khoản đang đăng nhập */
export async function changePassword(oldPassword: string, newPassword: string) {
	return axios.post(`${ip3}/auth/change-password`, { oldPassword, newPassword });
}
