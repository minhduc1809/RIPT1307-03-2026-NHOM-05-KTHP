import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

// silent: true → interceptor bỏ qua toast global, các trang tự hiển thị lỗi

/** POST /auth/forgot-password — Public, gửi email khôi phục mật khẩu */
export async function forgotPassword(email: string) {
	return axios.post(`${ip3}/auth/forgot-password`, { email, silent: true });
}

/** POST /auth/verify-reset-otp — Public, xác thực mã OTP, trả về resetToken */
export async function verifyResetOtp(email: string, otp: string) {
	return axios.post(`${ip3}/auth/verify-reset-otp`, { email, otp, silent: true });
}

/** POST /auth/reset-password — Public, đặt lại mật khẩu bằng token */
export async function resetPassword(token: string, newPassword: string) {
	return axios.post(`${ip3}/auth/reset-password`, { token, newPassword, silent: true });
}

/** POST /auth/change-password — Bearer JWT, đổi mật khẩu tài khoản đang đăng nhập */
export async function changePassword(oldPassword: string, newPassword: string) {
	return axios.post(`${ip3}/auth/change-password`, { oldPassword, newPassword, silent: true });
}
