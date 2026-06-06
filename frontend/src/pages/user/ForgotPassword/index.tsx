import Footer from '@/components/Footer';
import { forgotPassword, resetPassword, verifyResetOtp } from '@/services/base/authApi';
import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	LockOutlined,
	MailOutlined,
	SafetyOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { history, Link } from 'umi';
import styles from './index.less';

type Step = 'email' | 'otp' | 'password' | 'success';

const ForgotPassword: React.FC = () => {
	const [submitting, setSubmitting] = useState(false);
	const [step, setStep] = useState<Step>('email');
	const [email, setEmail] = useState('');
	const [resetToken, setResetToken] = useState('');
	const [emailForm] = Form.useForm();
	const [otpForm] = Form.useForm();
	const [passwordForm] = Form.useForm();

	// Bước 1: gửi email chứa mã OTP
	const handleSendEmail = async (values: { email: string }) => {
		try {
			setSubmitting(true);
			await forgotPassword(values.email);
			setEmail(values.email);
			otpForm.resetFields();
			setStep('otp');
		} catch (error: any) {
			if (error?.response?.status === 429) {
				message.warning('Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi một chút rồi thử lại.');
			} else {
				// Backend luôn trả 200 để chống dò tìm tài khoản (User Enumeration)
				setEmail(values.email);
				otpForm.resetFields();
				setStep('otp');
			}
		} finally {
			setSubmitting(false);
		}
	};

	// Bước 2: xác thực mã OTP → nhận resetToken
	const handleVerifyOtp = async (values: { otp: string }) => {
		try {
			setSubmitting(true);
			const res = await verifyResetOtp(email, values.otp);
			const token = res?.data?.data?.resetToken;
			if (!token) {
				message.error('Không nhận được mã xác thực từ máy chủ. Vui lòng thử lại.');
				return;
			}
			setResetToken(token);
			passwordForm.resetFields();
			setStep('password');
		} catch (error: any) {
			if (error?.response?.status === 429) {
				message.warning('Bạn đã thử quá nhiều lần. Vui lòng đợi một chút rồi thử lại.');
			} else {
				message.error('Mã OTP không đúng hoặc đã hết hạn. Vui lòng kiểm tra lại.');
			}
		} finally {
			setSubmitting(false);
		}
	};

	// Bước 3: đặt mật khẩu mới bằng resetToken
	const handleResetPassword = async (values: { newPassword: string }) => {
		try {
			setSubmitting(true);
			await resetPassword(resetToken, values.newPassword);
			setStep('success');
		} catch (error: any) {
			if (error?.response?.status === 429) {
				message.warning('Bạn đã thao tác quá nhanh. Vui lòng đợi một chút rồi thử lại.');
			} else if (error?.response?.status === 400 || error?.response?.status === 401) {
				message.error('Phiên đặt lại mật khẩu đã hết hạn. Vui lòng thực hiện lại từ đầu.');
				setStep('email');
			} else {
				message.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
			}
		} finally {
			setSubmitting(false);
		}
	};

	const handleResendOtp = async () => {
		try {
			setSubmitting(true);
			await forgotPassword(email);
			otpForm.resetFields();
			message.success('Đã gửi lại mã OTP. Vui lòng kiểm tra hòm thư.');
		} catch (error: any) {
			if (error?.response?.status === 429) {
				message.warning('Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi một chút rồi thử lại.');
			} else {
				message.success('Đã gửi lại mã OTP. Vui lòng kiểm tra hòm thư.');
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.card}>
					{step === 'email' && (
						<>
							<div className={styles.iconWrapper}>
								<div className={styles.iconCircle}>
									<MailOutlined className={styles.mainIcon} />
								</div>
							</div>

							<div className={styles.header}>
								<h1>Quên mật khẩu?</h1>
								<p>Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác thực (OTP) gồm 6 chữ số.</p>
							</div>

							<Form
								form={emailForm}
								onFinish={handleSendEmail}
								layout="vertical"
								size="large"
								className={styles.form}
							>
								<Form.Item
									name="email"
									rules={[
										{ required: true, message: 'Vui lòng nhập email!' },
										{ type: 'email', message: 'Email không hợp lệ!' },
									]}
								>
									<Input
										placeholder="Nhập email của bạn"
										prefix={<MailOutlined className={styles.prefixIcon} />}
										className={styles.customInput}
										autoFocus
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
									Gửi mã xác thực
								</Button>
							</Form>

							<div className={styles.backLink}>
								<Link to="/user/login">
									<ArrowLeftOutlined style={{ marginRight: 6 }} />
									Quay lại Đăng nhập
								</Link>
							</div>
						</>
					)}

					{step === 'otp' && (
						<>
							<div className={styles.iconWrapper}>
								<div className={styles.iconCircle}>
									<SafetyOutlined className={styles.mainIcon} />
								</div>
							</div>

							<div className={styles.header}>
								<h1>Nhập mã xác thực</h1>
								<p>
									Chúng tôi đã gửi mã OTP gồm 6 chữ số tới <strong>{email}</strong>. Mã có hiệu lực
									trong <strong>10 phút</strong>.
								</p>
							</div>

							<Form
								form={otpForm}
								onFinish={handleVerifyOtp}
								layout="vertical"
								size="large"
								className={styles.form}
							>
								<Form.Item
									name="otp"
									rules={[
										{ required: true, message: 'Vui lòng nhập mã OTP!' },
										{ pattern: /^\d{6}$/, message: 'Mã OTP gồm đúng 6 chữ số!' },
									]}
								>
									<Input
										placeholder="••••••"
										maxLength={6}
										inputMode="numeric"
										autoComplete="one-time-code"
										className={styles.customInput}
										style={{ textAlign: 'center', fontSize: 24, letterSpacing: 12, fontWeight: 600 }}
										autoFocus
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
									Xác nhận mã
								</Button>
							</Form>

							<div className={styles.backLink}>
								<Button type="link" onClick={handleResendOtp} disabled={submitting}>
									Gửi lại mã
								</Button>
								<Button type="link" onClick={() => setStep('email')} disabled={submitting}>
									Đổi email khác
								</Button>
							</div>
						</>
					)}

					{step === 'password' && (
						<>
							<div className={styles.iconWrapper}>
								<div className={styles.iconCircle}>
									<LockOutlined className={styles.mainIcon} />
								</div>
							</div>

							<div className={styles.header}>
								<h1>Đặt lại mật khẩu</h1>
								<p>Mã xác thực hợp lệ. Nhập mật khẩu mới cho tài khoản của bạn (ít nhất 8 ký tự).</p>
							</div>

							<Form
								form={passwordForm}
								onFinish={handleResetPassword}
								layout="vertical"
								size="large"
								className={styles.form}
							>
								<Form.Item
									name="newPassword"
									label="Mật khẩu mới"
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

					{step === 'success' && (
						<div className={styles.successContainer}>
							<div className={styles.successIconWrapper}>
								<CheckCircleOutlined className={styles.successIcon} />
							</div>
							<h2>Đặt lại mật khẩu thành công!</h2>
							<p className={styles.successDescription}>
								Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.
							</p>
							<Button
								type="primary"
								size="large"
								className={styles.submitBtn}
								onClick={() => history.push('/user/login')}
								style={{ marginTop: 16 }}
							>
								Đăng nhập ngay
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

export default ForgotPassword;
