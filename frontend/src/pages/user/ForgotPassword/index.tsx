import Footer from '@/components/Footer';
import { PublicHead } from '@/pages/Home/PublicShell';
import { forgotPassword, resetPassword, verifyResetOtp } from '@/services/base/authApi';
import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	LockOutlined,
	MailOutlined,
	SafetyOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useRef, useState } from 'react';
import { history, Link } from 'umi';
import styles from './index.less';

type Step = 'email' | 'otp' | 'password' | 'success';

const OTP_LENGTH = 6;

const maskEmail = (value: string) => {
	const [local, domain] = value.split('@');
	if (!domain) return value;
	return `${local.slice(0, 3)}***@${domain}`;
};

const ForgotPassword: React.FC = () => {
	const [submitting, setSubmitting] = useState(false);
	const [step, setStep] = useState<Step>('email');
	const [email, setEmail] = useState('');
	const [resetToken, setResetToken] = useState('');
	const [otpShake, setOtpShake] = useState(false);
	const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
	const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [emailForm] = Form.useForm();
	const [passwordForm] = Form.useForm();

	const resetOtpInputs = () => {
		setOtpDigits(Array(OTP_LENGTH).fill(''));
		otpRefs.current[0]?.focus();
	};

	// Bước 1: gửi email chứa mã OTP
	const handleSendEmail = async (values: { email: string }) => {
		try {
			setSubmitting(true);
			await forgotPassword(values.email);
			setEmail(values.email);
			setOtpDigits(Array(OTP_LENGTH).fill(''));
			setStep('otp');
		} catch (error: any) {
			if (error?.response?.status === 429) {
				message.warning('Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi một chút rồi thử lại.');
			} else {
				// Backend luôn trả 200 để chống dò tìm tài khoản (User Enumeration)
				setEmail(values.email);
				setOtpDigits(Array(OTP_LENGTH).fill(''));
				setStep('otp');
			}
		} finally {
			setSubmitting(false);
		}
	};

	// Bước 2: xác thực mã OTP → nhận resetToken
	const handleVerifyOtp = async (otp: string) => {
		try {
			setSubmitting(true);
			const res = await verifyResetOtp(email, otp);
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
				setOtpShake(true);
				setTimeout(() => setOtpShake(false), 500);
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

	const handleOtpChange = (index: number, value: string) => {
		const digit = value.replace(/\D/g, '').slice(-1);
		const next = [...otpDigits];
		next[index] = digit;
		setOtpDigits(next);
		if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
	};

	const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
			otpRefs.current[index - 1]?.focus();
		}
	};

	const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
		if (!digits) return;
		e.preventDefault();
		const next = Array(OTP_LENGTH).fill('');
		digits.split('').forEach((d, i) => {
			next[i] = d;
		});
		setOtpDigits(next);
		otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
	};

	const handleOtpSubmit = () => {
		const otp = otpDigits.join('');
		if (!/^\d{6}$/.test(otp)) {
			message.error('Vui lòng nhập đủ 6 chữ số!');
			setOtpShake(true);
			setTimeout(() => setOtpShake(false), 500);
			return;
		}
		handleVerifyOtp(otp);
	};

	const handleResendOtp = async () => {
		try {
			setSubmitting(true);
			await forgotPassword(email);
			resetOtpInputs();
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
			<PublicHead title="Quên mật khẩu — FlowForm" />
			<div className={styles.content}>
				<div className={`${styles.card} ${step === 'success' ? styles.successCard : ''}`}>
					{step === 'email' && (
						<div className={styles.stepPane}>
							<span className={styles.stepBadge}>BƯỚC 1 · EMAIL</span>
							<div className={styles.iconWrapper}>
								<div className={styles.iconCircle}>
									<MailOutlined className={styles.mainIcon} />
								</div>
							</div>

							<div className={styles.header}>
								<h1>Quên mật khẩu?</h1>
								<p>Nhập email của bạn, chúng tôi sẽ gửi mã xác thực để đặt lại mật khẩu.</p>
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
									label="Email"
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
						</div>
					)}

					{step === 'otp' && (
						<div className={styles.stepPane}>
							<span className={styles.stepBadge}>BƯỚC 2 · OTP</span>
							<div className={styles.iconWrapper}>
								<div className={`${styles.iconCircle} ${styles.violet}`}>
									<SafetyOutlined className={styles.mainIcon} />
								</div>
							</div>

							<div className={styles.header}>
								<h1>Xác nhận mã OTP</h1>
								<p>Mã xác thực gồm 6 chữ số đã được gửi đến email {maskEmail(email)}</p>
							</div>

							<div className={`${styles.otpBoxes} ${otpShake ? styles.shake : ''}`}>
								{/* eslint-disable react/no-array-index-key -- 6 ô OTP cố định theo vị trí */}
								{otpDigits.map((digit, index) => (
									<input
										key={index}
										ref={(el) => {
											otpRefs.current[index] = el;
										}}
										value={digit}
										onChange={(e) => handleOtpChange(index, e.target.value)}
										onKeyDown={(e) => handleOtpKeyDown(index, e)}
										onPaste={index === 0 ? handleOtpPaste : undefined}
										className={`${styles.otpBox} ${digit ? styles.filled : ''}`}
										inputMode="numeric"
										maxLength={1}
										autoComplete={index === 0 ? 'one-time-code' : 'off'}
										autoFocus={index === 0}
									/>
								))}
								{/* eslint-enable react/no-array-index-key */}
							</div>

							<Button
								type="primary"
								block
								size="large"
								loading={submitting}
								className={styles.submitBtn}
								onClick={handleOtpSubmit}
							>
								Xác nhận mã
							</Button>

							<div className={styles.backLink}>
								<Button type="link" className={styles.primaryLink} onClick={handleResendOtp} disabled={submitting}>
									Gửi lại mã
								</Button>
								<span className={styles.linkDot}>·</span>
								<Button type="link" onClick={() => setStep('email')} disabled={submitting}>
									Đổi email khác
								</Button>
							</div>
						</div>
					)}

					{step === 'password' && (
						<div className={styles.stepPane}>
							<span className={styles.stepBadge}>BƯỚC 3 · MẬT KHẨU MỚI</span>
							<div className={styles.iconWrapper}>
								<div className={styles.iconCircle}>
									<LockOutlined className={styles.mainIcon} />
								</div>
							</div>

							<div className={styles.header}>
								<h1>Đặt lại mật khẩu</h1>
								<p>Mật khẩu mới phải có tối thiểu 8 ký tự.</p>
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
						</div>
					)}

					{step === 'success' && (
						<div className={`${styles.stepPane} ${styles.successContainer}`}>
							<div className={styles.confetti} aria-hidden="true">
								{Array.from({ length: 12 }).map((_, i) => (
									// eslint-disable-next-line react/no-array-index-key
									<i key={i} />
								))}
							</div>
							<span className={`${styles.stepBadge} ${styles.successBadge}`}>BƯỚC 4 · HOÀN TẤT</span>
							<div className={styles.successIconWrapper}>
								<CheckCircleOutlined className={styles.successIcon} />
							</div>
							<h2>Đặt lại mật khẩu thành công!</h2>
							<p className={styles.successDescription}>Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.</p>
							<Button
								type="primary"
								block
								size="large"
								className={styles.submitBtn}
								onClick={() => history.push('/user/login')}
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
