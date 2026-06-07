import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';


export async function forgotPassword(email: string) {
	return axios.post(`${ip3}/auth/forgot-password`, { email, silent: true });
}

export async function verifyResetOtp(email: string, otp: string) {
	return axios.post(`${ip3}/auth/verify-reset-otp`, { email, otp, silent: true });
}

export async function resetPassword(token: string, newPassword: string) {
	return axios.post(`${ip3}/auth/reset-password`, { token, newPassword, silent: true });
}

export async function changePassword(oldPassword: string, newPassword: string) {
	return axios.post(`${ip3}/auth/change-password`, { oldPassword, newPassword, silent: true });
}

export interface IRegisterTenantPayload {
	companyName: string;
	domain: string;
	adminEmail: string;
	adminUsername: string;
	adminPassword: string;
	adminFirstName?: string;
	adminLastName?: string;
}

export async function registerTenant(payload: IRegisterTenantPayload) {
	return axios.post(`${ip3}/auth/register-tenant`, { ...payload, silent: true });
}
