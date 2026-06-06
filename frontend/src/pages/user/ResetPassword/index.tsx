import Footer from '@/components/Footer';
import { resetPassword } from '@/services/base/authApi';
import { LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Result } from 'antd';
import React, { useState, useMemo } from 'react';
import { history } from 'umi';
import styles from './index.less';

const ResetPassword: React.FC = () => {
	const [submitting, setSubmitting] = useState(false);
	const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
	const [errorMessage, setErrorMessage] = useState('');
	const [form] = Form.useForm();

	// Đọc token từ URL query string
	const token = useMemo(() => {
		const params = new URLSearchParams(window.location.search);
		return params.get('token') || '';
	}, []);

	const handleSubmit = async (values: { newPassword: string }) => {
		if (!token) {
			setErrorMessage('Liên kết đặt lại mật khẩu không hợp lệ. Vui lòng yêu cầu liên kết mới.');
			setStatus('error');
			return;
		}

		try {
			setSubmitting(true);
			await resetPassword(token, values.newPassword);
			setStatus('success');
		} catch (error: any) {
			const msg = error?.response?.data?.message;
			if (error?.response?.status === 400 || error?.response?.status === 401) {
				setErrorMessage(
					typeof msg === 'string'
						? msg
						: 'Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu liên kết mới.'
				);
				setStatus('error');
			} else if (error?.response?.status === 429) {
				message.warning('Bạn đã thao tác quá nhanh. Vui lòng đợi một chút rồi thử lại.');
			} else {
				message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
			}
		} finally {
			setSubmitting(false);
		}
	};

	// Nếu không có token ngay từ đầu
	if (!token && status === 'form') {
		return (
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.card}>
						<div className={styles.statusContainer}>
							<CloseCircleOutlined className={styles.errorIcon} />
							<h2>Liên kết không hợp lệ</h2>
							<p className={styles.statusDescription}>
								Liên kết đặt lại mật khẩu không chứa mã xác thực. Vui lòng kiểm tra lại email hoặc yêu cầu liên kết mới.
							</p>
							<Button
								type="primary"
								size="large"
								className={styles.submitBtn}
								onClick={() => history.push('/user/forgot-password')}
							>
								Yêu cầu liên kết mới
							</Button>
						</div>
					</div>
				</div>
				<div className={styles.footerContainer}>
					<Footer />
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.card}>
					{status === 'form' && (
						<>
							<div className={styles.iconWrapper}>
								<div className={styles.iconCircle}>
									<LockOutlined className={styles.mainIcon} />
								</div>
							</div>

							<div className={styles.header}>
								<h1>Đặt lại mật khẩu</h1>
								<p>Nhập mật khẩu mới cho tài khoản của bạn. Mật khẩu phải có ít nhất 8 ký tự.</p>
							</div>

							<Form
								form={form}
								onFinish={handleSubmit}
								layout="vertical"
								size="large"
								className={styles.form}
							>
								<Form.Item
									name="newPassword"
									label={<span className={styles.fieldLabel}>Mật khẩu mới</span>}
									rules={[
										{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
										{ min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
									]}
								>
									<Input.Password
										placeholder="Nhập mật khẩu mới"
										prefix={<LockOutlined className={styles.prefixIcon} />}
										className={styles.customInput}
										autoFocus
									/>
								</Form.Item>

								<Form.Item
									name="confirmPassword"
									label={<span className={styles.fieldLabel}>Xác nhận mật khẩu</span>}
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
									<Input.Password
										placeholder="Nhập lại mật khẩu mới"
										prefix={<LockOutlined className={styles.prefixIcon} />}
										className={styles.customInput}
									/>
								</Form.Item>

								<Button
									type="primary"
									block
									size="large"
									htmlType="submit"
									loading={submitting}
									className={styles.submitBtn}
								>
									Đặt lại mật khẩu
								</Button>
							</Form>
						</>
					)}

					{status === 'success' && (
						<div className={styles.statusContainer}>
							<CheckCircleOutlined className={styles.successIcon} />
							<h2>Đặt lại mật khẩu thành công!</h2>
							<p className={styles.statusDescription}>
								Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.
							</p>
							<Button
								type="primary"
								size="large"
								className={styles.submitBtn}
								onClick={() => history.push('/user/login')}
							>
								Đăng nhập ngay
							</Button>
						</div>
					)}

					{status === 'error' && (
						<div className={styles.statusContainer}>
							<CloseCircleOutlined className={styles.errorIcon} />
							<h2>Không thể đặt lại mật khẩu</h2>
							<p className={styles.statusDescription}>{errorMessage}</p>
							<Button
								type="primary"
								size="large"
								className={styles.submitBtn}
								onClick={() => history.push('/user/forgot-password')}
							>
								Yêu cầu liên kết mới
							</Button>
							<Button
								type="link"
								onClick={() => history.push('/user/login')}
								style={{ marginTop: 8 }}
							>
								Quay lại Đăng nhập
							</Button>
						</div>
					)}
				</div>
			</div>

			<div className={styles.footerContainer}>
				<Footer />
			</div>
		</div>
	);
};

export default ResetPassword;
