// design: smartadmin.pen · frame 24
import { ClockCircleOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, SendOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, Input, message, Row, Select } from 'antd';
import React, { useState } from 'react';
import homeStyles from '../Home/index.less';
import { PageHero, PublicFooter, PublicHead, PublicNavbar, Reveal } from '../Home/PublicShell';
import styles from './index.less';

const INFO_CARDS = [
	{ icon: <MailOutlined />, label: 'Email hỗ trợ', value: 'support@flowform.vn' },
	{ icon: <PhoneOutlined />, label: 'Hotline', value: '(+84) 24 3756 2186' },
	{ icon: <EnvironmentOutlined />, label: 'Văn phòng', value: '122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội' },
	{ icon: <ClockCircleOutlined />, label: 'Giờ hỗ trợ', value: 'Thứ 2 – Thứ 6 · 8:00 – 17:30' },
];

const SUBJECT_OPTIONS = [
	'Tư vấn triển khai cho tổ chức',
	'Báo giá gói Business / Enterprise',
	'Hỗ trợ kỹ thuật',
	'Hợp tác & đối tác',
	'Khác',
];

const Contact: React.FC = () => {
	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);

	const onFinish = async () => {
		setSubmitting(true);
		// TODO: nối API gửi liên hệ khi backend bổ sung endpoint
		await new Promise((resolve) => setTimeout(resolve, 600));
		setSubmitting(false);
		message.success('Đã gửi tin nhắn! Chúng tôi sẽ phản hồi trong 24 giờ làm việc.');
		form.resetFields();
	};

	return (
		<div className={homeStyles.homeContainer}>
			<PublicHead title="Liên hệ — FlowForm" />
			<PublicNavbar />

			<PageHero
				label="LIÊN HỆ"
				title="Chúng tôi luôn sẵn sàng hỗ trợ bạn"
				sub="Đội ngũ FlowForm phản hồi trong vòng 24 giờ làm việc."
			/>

			<div className={styles.contactBody}>
				{/* Info cards */}
				<Reveal stagger className={styles.infoCol}>
					{INFO_CARDS.map((c) => (
						<div key={c.label} className={styles.infoCard}>
							<div className={styles.infoIcon}>{c.icon}</div>
							<div>
								<div className={styles.infoLabel}>{c.label}</div>
								<div className={styles.infoValue}>{c.value}</div>
							</div>
						</div>
					))}
				</Reveal>

				{/* Contact form */}
				<Reveal className={styles.formCard}>
					<h3>Gửi tin nhắn cho chúng tôi</h3>
					<Form form={form} layout="vertical" onFinish={onFinish} requiredMark>
						<Row gutter={16}>
							<Col xs={24} md={12}>
								<Form.Item
									name="fullName"
									label="Họ và tên"
									rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
								>
									<Input placeholder="Nhập họ và tên của bạn" />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name="email"
									label="Email"
									rules={[
										{ required: true, message: 'Vui lòng nhập email' },
										{ type: 'email', message: 'Email chưa đúng định dạng' },
									]}
								>
									<Input placeholder="email@congty.vn" />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item name="subject" label="Chủ đề" rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}>
							<Select placeholder="Chọn chủ đề liên hệ">
								{SUBJECT_OPTIONS.map((s) => (
									<Select.Option key={s} value={s}>
										{s}
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							name="content"
							label="Nội dung"
							rules={[
								{ required: true, message: 'Vui lòng nhập nội dung' },
								{ max: 5000, message: 'Không quá 5000 ký tự' },
							]}
						>
							<Input.TextArea rows={5} placeholder="Mô tả nhu cầu của tổ chức bạn..." />
						</Form.Item>

						<Form.Item
							name="agree"
							valuePropName="checked"
							rules={[
								{
									validator: (_, value) =>
										value ? Promise.resolve() : Promise.reject(new Error('Bạn cần đồng ý với điều khoản')),
								},
							]}
						>
							<Checkbox>
								Tôi đồng ý với <a href="/privacy">Chính sách bảo mật</a> và <a href="/terms">Điều khoản sử dụng</a>
							</Checkbox>
						</Form.Item>

						<button type="submit" className={styles.submitBtn} disabled={submitting}>
							<SendOutlined /> {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
						</button>
					</Form>
				</Reveal>
			</div>

			<PublicFooter />
		</div>
	);
};

export default Contact;
