import Footer from '@/components/Footer';
import { adminlogin } from '@/services/base/api';
import { LockOutlined, MailOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { history, useIntl, useModel, Link } from 'umi';
import styles from './index.less';

const Login: React.FC = () => {
	const [submitting, setSubmitting] = useState(false);
	const { initialState, setInitialState } = useModel('@@initialState');
	const intl = useIntl();
	const [form] = Form.useForm();

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
				await handleLoginSuccess(response.data.data);
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

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.loginBox}>
					<div className={styles.leftPanel}>
						<div className={styles.welcomeText}>
							<h1>Chào mừng trở lại!</h1>
							<p>
								Đăng nhập để truy cập vào hệ thống quản lý của chúng tôi. Quản lý công việc hiệu quả và nhanh chóng hơn.
							</p>
						</div>
						<div className={styles.illustration}>
							{/* Placeholder for an abstract shape or illustration */}
							<div className={styles.abstractShape1}></div>
							<div className={styles.abstractShape2}></div>
						</div>
					</div>
					<div className={styles.rightPanel}>
						<div className={styles.header}>
							<h2>Đăng Nhập</h2>
							<p>Vui lòng điền thông tin đăng nhập của bạn</p>
						</div>

						<Form form={form} onFinish={handleSubmit} layout='vertical' size='large' className={styles.loginForm}>
							<Form.Item
								name='email'
								rules={[
									{ required: true, message: 'Vui lòng nhập email!' },
									{ type: 'email', message: 'Email không hợp lệ!' },
								]}
							>
								<Input
									placeholder='Email của bạn'
									prefix={<MailOutlined className={styles.prefixIcon} />}
									className={styles.customInput}
								/>
							</Form.Item>

							<Form.Item
								name='password'
								dependencies={['email']}
								rules={[
									{ required: true, message: 'Vui lòng nhập mật khẩu!' },
									({ getFieldValue }) => ({
										validator(_, value) {
											const email = getFieldValue('email');
											const isAdmin = email?.toLowerCase() === 'admin@example.com';
											if (isAdmin) {
												return Promise.resolve();
											}
											if (!value || value.length < 8) {
												return Promise.reject(new Error('Mật khẩu phải có ít nhất 8 ký tự!'));
											}
											return Promise.resolve();
										},
									}),
								]}
							>
								<Input.Password
									placeholder='Mật khẩu'
									prefix={<LockOutlined className={styles.prefixIcon} />}
									className={styles.customInput}
								/>
							</Form.Item>

							<div className={styles.formActions}></div>

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
					</div>
				</div>
			</div>

			<div className={styles.footerContainer}>
				<Footer />
			</div>
		</div>
	);
};

export default Login;
