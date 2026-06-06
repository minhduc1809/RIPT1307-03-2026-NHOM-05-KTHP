import Footer from '@/components/Footer';
import { forgotPassword } from '@/services/base/authApi';
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Result } from 'antd';
import React, { useState } from 'react';
import { history, Link } from 'umi';
import styles from './index.less';

const ForgotPassword: React.FC = () => {
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [form] = Form.useForm();

	const handleSubmit = async (values: { email: string }) => {
		try {
			setSubmitting(true);
			await forgotPassword(values.email);
			setSubmitted(true);
		} catch (error: any) {
			// Backend luôn trả 200 để chống dò tìm tài khoản,
			// nhưng nếu có lỗi mạng/server thì hiển thị thông báo
			if (error?.response?.status === 429) {
				message.warning('Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi một chút rồi thử lại.');
			} else {
				// Vẫn hiển thị thành công cho UX (chống User Enumeration)
				setSubmitted(true);
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.card}>
					{!submitted ? (
						<>
							<div className={styles.iconWrapper}>
								<div className={styles.iconCircle}>
									<MailOutlined className={styles.mainIcon} />
								</div>
							</div>

							<div className={styles.header}>
								<h1>Quên mật khẩu?</h1>
								<p>
									Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
								</p>
							</div>

							<Form
								form={form}
								onFinish={handleSubmit}
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
									Gửi liên kết khôi phục
								</Button>
							</Form>

							<div className={styles.backLink}>
								<Link to="/user/login">
									<ArrowLeftOutlined style={{ marginRight: 6 }} />
									Quay lại Đăng nhập
								</Link>
							</div>
						</>
					) : (
						<div className={styles.successContainer}>
							<div className={styles.successIconWrapper}>
								<CheckCircleOutlined className={styles.successIcon} />
							</div>
							<h2>Kiểm tra hòm thư của bạn</h2>
							<p className={styles.successDescription}>
								Nếu tài khoản với email này tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.
								Vui lòng kiểm tra hòm thư (bao gồm thư mục Spam).
							</p>
							<p className={styles.successNote}>
								Liên kết sẽ hết hạn sau <strong>15 phút</strong>.
							</p>
							<Button
								type="primary"
								size="large"
								className={styles.submitBtn}
								onClick={() => history.push('/user/login')}
								style={{ marginTop: 16 }}
							>
								Quay lại Đăng nhập
							</Button>
							<Button
								type="link"
								onClick={() => { setSubmitted(false); form.resetFields(); }}
								style={{ marginTop: 8 }}
							>
								Gửi lại email
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
