import Footer from '@/components/Footer';
import { adminlogin, getUserInfo } from '@/services/base/api';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { history, useIntl, useModel, Link } from 'umi';
import styles from './index.less';

const Login: React.FC = () => {
	const [count, setCount] = useState<number>(Number(localStorage?.getItem('failed')) || 0);
	const [submitting, setSubmitting] = useState(false);
	const { initialState, setInitialState } = useModel('@@initialState');
	const [isVerified] = useState<boolean>(true);
	const intl = useIntl();
	const [form] = Form.useForm();

	/**
	 * Xử lý token, get info sau khi đăng nhập
	 */
	const handleRole = async (role: { access_token: string; refresh_token: string }) => {
		// Tobe removed
		localStorage.setItem('token', role?.access_token);
		localStorage.setItem('refreshToken', role?.refresh_token);

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
	};

	const handleSubmit = async (values: { email: string; password: string }) => {
		try {
			if (!isVerified) {
				message.error('Vui lòng xác thực Captcha');
				return;
			}
			setSubmitting(true);
			// Adapt email to login payload
			const msg = await adminlogin({ ...values, username: values?.email ?? '' });
			if (msg.status === 200 && msg?.data?.data?.accessToken) {
				handleRole(msg?.data?.data);
				localStorage.removeItem('failed');
			}
		} catch (error) {
			setCount(count + 1);
			localStorage.setItem('failed', (count + 1).toString());
			const defaultloginFailureMessage = intl.formatMessage({
				id: 'pages.login.failure',
				defaultMessage: 'Đăng nhập thất bại',
			});
			message.error(defaultloginFailureMessage);
		}
		setSubmitting(false);
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.top}>
					<div className={styles.header}>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<img alt='logo' className={styles.logo} src='/logo-full.svg' />
						</div>
					</div>
				</div>

				<div className={styles.main}>
					<h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: 24, fontWeight: 'bold' }}>
						Đăng Nhập
					</h2>
					<Form
						form={form}
						onFinish={async (values) => handleSubmit(values as { email: string; password: string })}
						layout='vertical'
						size='large'
					>
						<Form.Item
							label='Email'
							name='email'
							rules={[
								{ required: true, message: 'Vui lòng nhập email!' },
								{ type: 'email', message: 'Email không hợp lệ!' },
							]}
						>
							<Input
								placeholder='Nhập email của bạn'
								prefix={<MailOutlined className={styles.prefixIcon} />}
							/>
						</Form.Item>
						<Form.Item
							label='Mật khẩu'
							name='password'
							rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
						>
							<Input.Password
								placeholder='Nhập mật khẩu'
								prefix={<LockOutlined className={styles.prefixIcon} />}
							/>
						</Form.Item>

						<Button type='primary' block size='large' htmlType='submit' loading={submitting}>
							Đăng Nhập
						</Button>
					</Form>

					<div style={{ textAlign: 'center', marginTop: 16 }}>
						<Link to='/user/register'>Chưa có tài khoản? Đăng ký ngay</Link>
					</div>
				</div>
			</div>

			<div className='login-footer'>
				<Footer />
			</div>
		</div>
	);
};

export default Login;
