import Footer from '@/components/Footer';
import { adminlogin, getUserInfo } from '@/services/base/api';
import { LockOutlined, MailOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { history, useIntl, useModel, Link } from 'umi';
import styles from './index.less';

const Login: React.FC = () => {
	const [submitting, setSubmitting] = useState(false);
	const { initialState, setInitialState } = useModel('@@initialState');
	const intl = useIntl();
	const [form] = Form.useForm();

	/**
	 * Handle tokens and user info after successful login
	 */
	const handleLoginSuccess = async (data: { accessToken: string; refreshToken: string }) => {
		// Store tokens client-side as per AUTH_API.md
		localStorage.setItem('token', data.accessToken);
		localStorage.setItem('refreshToken', data.refreshToken);

		try {
			// Fetch current user information
			const info = await getUserInfo();
			setInitialState({
				...initialState,
				currentUser: info?.data?.data,
			});

			const defaultloginSuccessMessage = intl.formatMessage({
				id: 'pages.login.success',
				defaultMessage: 'Đăng nhập thành công',
			});
			message.success(defaultloginSuccessMessage);
			history.push('/dashboard');
		} catch (error) {
			console.error('Failed to fetch user info', error);
			message.error('Không thể lấy thông tin người dùng.');
		}
	};

	const handleSubmit = async (values: { email: string; password: string }) => {
		try {
			setSubmitting(true);
			// Call login endpoint defined in AUTH_API.md
			const msg = await adminlogin({ email: values.email, password: values.password });

			if (msg.status === 200 && msg?.data?.data?.accessToken) {
				await handleLoginSuccess(msg.data.data);
			} else {
				throw new Error(msg?.data?.message || 'Login failed');
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
								rules={[
									{ required: true, message: 'Vui lòng nhập mật khẩu!' },
									{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
								]}
							>
								<Input.Password
									placeholder='Mật khẩu'
									prefix={<LockOutlined className={styles.prefixIcon} />}
									className={styles.customInput}
								/>
							</Form.Item>

							<div className={styles.formActions}>
								<Link to='/user/forgot-password' className={styles.forgotPassword}>
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

						<div className={styles.registerLink}>
							Chưa có tài khoản? <Link to='/user/register'>Đăng ký ngay</Link>
						</div>
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
