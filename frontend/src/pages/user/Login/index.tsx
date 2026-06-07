import { adminlogin } from '@/services/base/api';
import { changePassword } from '@/services/base/authApi';
import { PublicHead } from '@/pages/Home/PublicShell';
import {
	ArrowRightOutlined,
	CheckCircleFilled,
	LockOutlined,
	MailOutlined,
	SafetyCertificateOutlined,
	ThunderboltFilled,
} from '@ant-design/icons';
import { Button, Form, Input, message, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { history, useIntl, useModel, Link } from 'umi';
import styles from './index.less';

const Login: React.FC = () => {
	const [submitting, setSubmitting] = useState(false);
	const { initialState, setInitialState } = useModel('@@initialState');
	const intl = useIntl();
	const [form] = Form.useForm();

	// State cho modal đổi mật khẩu lần đầu
	const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
	const [changePwForm] = Form.useForm();
	const [changingPassword, setChangingPassword] = useState(false);
	const [pendingLoginData, setPendingLoginData] = useState<any>(null);
	const [loginPassword, setLoginPassword] = useState('');

	/** Redirect path based on user role */
	const getRedirectPath = (role?: string) => {
		if (role === 'ADMIN' || role === 'MANAGER') return '/dashboard';
		return '/submissions/new';
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token && initialState?.currentUser) {
			history.replace(getRedirectPath(initialState.currentUser.role));
		}
	}, [initialState?.currentUser]);

	/**
	 * Handle tokens and user info after successful login
	 */
	const handleLoginSuccess = async (data: { accessToken: string; refreshToken: string; user: any }) => {
		// Store tokens client-side as per AUTH_API.md
		localStorage.setItem('token', data.accessToken);
		localStorage.setItem('refreshToken', data.refreshToken);

		// Use user info from login response directly
		setInitialState({
			...initialState,
			currentUser: data.user,
		});

		const defaultloginSuccessMessage = intl.formatMessage({
			id: 'pages.login.success',
			defaultMessage: 'Đăng nhập thành công',
		});
		message.success(defaultloginSuccessMessage);
		history.push(getRedirectPath(data.user?.role));
	};

	const handleSubmit = async (values: { email: string; password: string }) => {
		try {
			setSubmitting(true);
			// Call login endpoint defined in AUTH_API.md
			const response = await adminlogin({ email: values.email, password: values.password });

			if (response.status === 200 && response?.data?.data?.accessToken) {
				const loginData = response.data.data;

				// Kiểm tra cờ passwordChangeRequired
				if (loginData.user?.passwordChangeRequired) {
					// Lưu token trước để có thể gọi API change-password
					localStorage.setItem('token', loginData.accessToken);
					localStorage.setItem('refreshToken', loginData.refreshToken);
					setPendingLoginData(loginData);
					setLoginPassword(values.password);
					setShowChangePasswordModal(true);
					return;
				}

				await handleLoginSuccess(loginData);
			} else {
				throw new Error('Login failed');
			}
		} catch (error: any) {
			const errorMsg = error?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
			message.error(errorMsg);
		} finally {
			setSubmitting(false);
		}
	};

	const handleFirstTimeChangePassword = async (values: { newPassword: string }) => {
		if (!pendingLoginData || !loginPassword) return;
		try {
			setChangingPassword(true);
			await changePassword(loginPassword, values.newPassword);

			const email = pendingLoginData.user?.email;
			const reloginRes = await adminlogin({ email, password: values.newPassword });
			const reloginData = (reloginRes as any)?.data?.data;

			setShowChangePasswordModal(false);
			setPendingLoginData(null);
			setLoginPassword('');
			changePwForm.resetFields();

			if (reloginData?.accessToken) {
				message.success('Đổi mật khẩu thành công!');
				await handleLoginSuccess(reloginData);
			} else {
				message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
				localStorage.clear();
				form.resetFields();
			}
		} catch (error: any) {
			const errorMsg = error?.response?.data?.message || 'Đổi mật khẩu thất bại.';
			message.error(typeof errorMsg === 'string' ? errorMsg : 'Đổi mật khẩu thất bại.');
		} finally {
			setChangingPassword(false);
		}
	};

	/** Bỏ qua đổi MK lần đầu */
	const handleSkipChangePassword = () => {
		setShowChangePasswordModal(false);
		if (pendingLoginData) {
			// Token đã lưu rồi, chỉ cần set initialState và redirect
			setInitialState({
				...initialState,
				currentUser: pendingLoginData.user,
			});
			const defaultloginSuccessMessage = intl.formatMessage({
				id: 'pages.login.success',
				defaultMessage: 'Đăng nhập thành công',
			});
			message.success(defaultloginSuccessMessage);
			history.push(getRedirectPath(pendingLoginData.user?.role));
		}
		setPendingLoginData(null);
		setLoginPassword('');
		changePwForm.resetFields();
	};

	return (
		<div className={styles.container}>
			<PublicHead title="Đăng nhập — FlowForm" />
			<div className={styles.content}>
				<div className={styles.loginBox}>
					{/* Left gradient panel (design 01) */}
					<div className={styles.leftPanel}>
						<Link to='/' className={styles.lpLogo} title='Về trang chủ'>
							<div className={styles.lpLogoSq}>
								<ThunderboltFilled />
							</div>
							<span>FLOWFORM</span>
						</Link>

						<div className={styles.welcomeText}>
							<h1>Chào mừng trở lại!</h1>
							<p>Nền tảng quản lý biểu mẫu và tự động hóa quy trình phê duyệt cho tổ chức của bạn.</p>
						</div>

						<div className={styles.glassCard}>
							<div className={styles.glassItem}>
								<CheckCircleFilled /> Phê duyệt đa cấp theo vai trò
							</div>
							<div className={styles.glassItem}>
								<CheckCircleFilled /> Thông báo thời gian thực
							</div>
							<div className={styles.glassItem}>
								<CheckCircleFilled /> Trình tạo biểu mẫu kéo thả
							</div>
						</div>
					</div>

					{/* Right form panel */}
					<div className={styles.rightPanel}>
						<div className={styles.header}>
							<h2>Đăng Nhập</h2>
							<p>Đăng nhập để tiếp tục với FlowForm</p>
						</div>

						<Form form={form} onFinish={handleSubmit} layout='vertical' size='large' className={styles.loginForm}>
							<Form.Item
								name='email'
								label='Email'
								rules={[
									{ required: true, message: 'Vui lòng nhập email!' },
									{ type: 'email', message: 'Email không hợp lệ!' },
								]}
							>
								<Input
									placeholder='Nhập email của bạn'
									prefix={<MailOutlined className={styles.prefixIcon} />}
									className={styles.customInput}
								/>
							</Form.Item>

							<Form.Item
								name='password'
								label='Mật khẩu'
								rules={[
									{ required: true, message: 'Vui lòng nhập mật khẩu!' },
									({}) => ({
										validator(_, value) {
											if (!value) {
												return Promise.resolve();
											}
											if (value.length < 8) {
												return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 ký tự!'));
											}
											return Promise.resolve();
										},
									}),
								]}
							>
								<Input.Password
									placeholder='••••••••'
									prefix={<LockOutlined className={styles.prefixIcon} />}
									className={styles.customInput}
								/>
							</Form.Item>

							<div className={styles.formActions}>
								<Link to="/user/forgot-password" className={styles.forgotPassword}>
									Quên mật khẩu?
								</Link>
							</div>

							<Button
								type='primary'
								block
								size='large'
								htmlType='submit'
								loading={submitting}
								className={styles.submitBtn}
								icon={<ArrowRightOutlined />}
							>
								Đăng Nhập
							</Button>
						</Form>

						<div className={styles.divider}>hoặc</div>

						{/* TODO: nối luồng Keycloak SSO (APP_CONFIG_KEYCLOAK_AUTHORITY) */}
						<button type="button" className={styles.ssoBtn}>
							<SafetyCertificateOutlined /> Đăng nhập với PTIT SSO (Keycloak)
						</button>

						<div className={styles.copyright}>© 2026 FlowForm Platform. All rights reserved.</div>
					</div>
				</div>
			</div>

			{/* Modal đổi mật khẩu lần đầu */}
			<Modal
				title={null}
				visible={showChangePasswordModal}
				footer={null}
				closable={false}
				maskClosable={false}
				centered
				className={styles.changePasswordModal}
				width={460}
			>
				<div className={styles.modalContent}>
					<div className={styles.modalIconWrapper}>
						<SafetyCertificateOutlined className={styles.modalIcon} />
					</div>
					<h3 className={styles.modalTitle}>Yêu cầu đổi mật khẩu</h3>
					<p className={styles.modalDescription}>
						Tài khoản của bạn đang sử dụng mật khẩu do quản trị viên cấp. Vui lòng đổi mật khẩu để bảo mật tài khoản.
					</p>

					<Form
						form={changePwForm}
						layout="vertical"
						onFinish={handleFirstTimeChangePassword}
					>
						<Form.Item
							name="newPassword"
							label="Mật khẩu mới"
							rules={[
								{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
								{ min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
							]}
						>
							<Input.Password placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)" className={styles.customInput} />
						</Form.Item>

						<Form.Item
							name="confirmPassword"
							label="Xác nhận mật khẩu"
							dependencies={['newPassword']}
							rules={[
								{ required: true, message: 'Vui lòng xác nhận mật khẩu!' },
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue('newPassword') === value) {
											return Promise.resolve();
										}
										return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
									},
								}),
							]}
						>
							<Input.Password placeholder="Nhập lại mật khẩu mới" className={styles.customInput} />
						</Form.Item>

						<div className={styles.modalActions}>
							<Button
								type="primary"
								htmlType="submit"
								loading={changingPassword}
								block
								size="large"
								className={styles.changePwBtn}
							>
								Đổi mật khẩu ngay
							</Button>
							<Button
								type="link"
								onClick={handleSkipChangePassword}
								className={styles.skipBtn}
								disabled={changingPassword}
							>
								Đổi sau
							</Button>
						</div>
					</Form>
				</div>
			</Modal>
		</div>
	);
};

export default Login;
