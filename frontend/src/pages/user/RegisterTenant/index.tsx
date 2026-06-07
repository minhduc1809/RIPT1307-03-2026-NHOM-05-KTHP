import {
	ArrowRightOutlined,
	BankOutlined,
	CheckCircleFilled,
	CheckOutlined,
	ThunderboltFilled,
} from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { history, Link } from 'umi';
import { registerTenant } from '@/services/base/authApi';
import { PublicHead } from '@/pages/Home/PublicShell';
import styles from './index.less';

const DOMAIN_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const toSlug = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 40);

const CHECKLIST = [
	'Tên miền (tenant) riêng, duy nhất',
	'Bạn là Quản trị viên (ADMIN) đầu tiên',
	'Mời thành viên ngay sau khi tạo',
];

const RegisterTenant: React.FC = () => {
	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);
	const [agreed, setAgreed] = useState(false);
	const [domainTouched, setDomainTouched] = useState(false);
	const [domainValue, setDomainValue] = useState('');
	const [success, setSuccess] = useState<{ domain: string } | null>(null);

	const domainValid = DOMAIN_REGEX.test(domainValue);

	const handleCompanyNameChange = (value: string) => {
		if (!domainTouched) {
			const slug = toSlug(value);
			form.setFieldsValue({ domain: slug });
			setDomainValue(slug);
		}
	};

	const handleSubmit = async (values: any) => {
		if (!agreed) {
			message.warning('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật');
			return;
		}
		setSubmitting(true);
		try {
			const res = await registerTenant({
				companyName: values.companyName,
				domain: values.domain,
				adminEmail: values.adminEmail,
				adminUsername: values.adminUsername,
				adminPassword: values.adminPassword,
				adminFirstName: values.adminFirstName,
				adminLastName: values.adminLastName,
			});
			const data = (res as any)?.data?.data ?? (res as any)?.data;
			setSuccess({ domain: data?.tenant?.domain || values.domain });
		} catch (error: any) {
			const errorMsg = error?.response?.data?.message;
			if (typeof errorMsg === 'string' && errorMsg.includes('DOMAIN_ALREADY_EXISTS')) {
				message.error('Tên miền này đã được sử dụng. Vui lòng chọn tên khác.');
			} else if (typeof errorMsg === 'string') {
				message.error(errorMsg);
			} else if (Array.isArray(errorMsg)) {
				message.error(errorMsg.join(', '));
			} else {
				message.error('Đăng ký tổ chức thất bại. Vui lòng thử lại.');
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={styles.container}>
			<PublicHead title='Đăng ký tổ chức — FlowForm' />
			<div className={styles.content}>
				<div className={styles.cardWrap}>
					<div className={styles.registerCard}>
					<div className={styles.leftPanel}>
						<Link to='/' className={styles.lpLogo} title='Về trang chủ'>
							<div className={styles.lpLogoSq}>
								<ThunderboltFilled />
							</div>
							<span>FLOWFORM</span>
						</Link>

						<div className={styles.lpMiddle}>
							<h1>Tạo không gian làm việc cho tổ chức của bạn</h1>
							<p>Mỗi tổ chức là một tenant độc lập với tên miền riêng, dữ liệu tách biệt hoàn toàn.</p>
						</div>

						<div className={styles.glassCard}>
							{CHECKLIST.map((item, idx) => (
								<div key={item} className={styles.glassItem} style={{ animationDelay: `${0.45 + idx * 0.12}s` }}>
									<CheckCircleFilled /> {item}
								</div>
							))}
						</div>
					</div>

					<div className={styles.formPanel}>
						<div className={styles.header}>
							<h2>Đăng ký tổ chức</h2>
							<p>Tạo tenant mới và tài khoản quản trị viên trong một bước</p>
						</div>

						<Form form={form} layout='vertical' onFinish={handleSubmit} className={styles.form} requiredMark={false}>
							<span className={styles.sectionLabel}>THÔNG TIN TỔ CHỨC</span>

							<Form.Item
								label='Tên tổ chức (companyName)'
								name='companyName'
								rules={[{ required: true, message: 'Vui lòng nhập tên tổ chức!' }]}
							>
								<Input
									placeholder='VD: Học viện Công nghệ Bưu chính Viễn thông'
									onChange={(e) => handleCompanyNameChange(e.target.value)}
								/>
							</Form.Item>

							<Form.Item
								label={
									<span>
										Tên miền (domain) <span className={styles.required}>*</span>
									</span>
								}
								name='domain'
								rules={[
									{ required: true, message: 'Vui lòng nhập tên miền!' },
									{ pattern: DOMAIN_REGEX, message: 'Chỉ chữ thường, số và dấu gạch ngang' },
								]}
								className={styles.domainItem}
							>
								<Input
									className={styles.domainInput}
									prefix={<span className={styles.domainPrefix}>app.flowform.vn/t/</span>}
									suffix={domainValue && domainValid ? <CheckCircleFilled className={styles.domainOk} /> : <span />}
									placeholder='ten-to-chuc'
									onChange={(e) => {
										setDomainTouched(true);
										setDomainValue(e.target.value);
									}}
								/>
							</Form.Item>
							<p className={styles.fieldHint}>
								Chỉ chữ thường, số và dấu gạch ngang. Tên miền là duy nhất — dùng làm định danh tenant (x-tenant-id).
							</p>

							<div className={styles.divider} />
							<span className={styles.sectionLabel}>TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN)</span>

							<div className={styles.fieldRow}>
								<Form.Item label='Họ (adminLastName)' name='adminLastName'>
									<Input placeholder='Nhập họ' />
								</Form.Item>
								<Form.Item label='Tên (adminFirstName)' name='adminFirstName'>
									<Input placeholder='Nhập tên' />
								</Form.Item>
							</div>

							<Form.Item
								label='Email quản trị (adminEmail)'
								name='adminEmail'
								rules={[
									{ required: true, message: 'Vui lòng nhập email!' },
									{ type: 'email', message: 'Email không hợp lệ!' },
								]}
							>
								<Input placeholder='admin@to-chuc.vn' />
							</Form.Item>

							<div className={styles.fieldRow}>
								<Form.Item
									label='Tên đăng nhập (adminUsername)'
									name='adminUsername'
									rules={[{ required: true, min: 3, message: 'Tối thiểu 3 ký tự' }]}
								>
									<Input placeholder='admin' />
								</Form.Item>
								<Form.Item
									label='Mật khẩu (adminPassword)'
									name='adminPassword'
									rules={[{ required: true, min: 8, message: 'Tối thiểu 8 ký tự' }]}
									extra={<span className={styles.fieldHint}>Tối thiểu 8 ký tự</span>}
								>
									<Input.Password placeholder='••••••••••' />
								</Form.Item>
							</div>

							<label className={styles.checkRow}>
								<input type='checkbox' hidden checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
								<span className={`${styles.checkBox} ${agreed ? styles.checked : ''}`}>
									{agreed && <CheckOutlined />}
								</span>
								<span className={styles.checkLabel}>
									Tôi đồng ý với <Link to='/terms'>Điều khoản sử dụng</Link> và <Link to='/privacy'>Chính sách bảo mật</Link>
								</span>
							</label>

							<Button
								type='primary'
								htmlType='submit'
								block
								loading={submitting}
								className={styles.submitBtn}
								icon={<BankOutlined />}
							>
								Tạo tổ chức &amp; tài khoản ADMIN
							</Button>

							<div className={styles.loginRow}>
								Đã có tài khoản? <Link to='/user/login'>Đăng nhập</Link>
							</div>
						</Form>
					</div>
				</div>

			<div className={`${styles.successCard} ${success ? styles.done : ''}`}>
				<div className={styles.scHeader}>
					<span className={styles.scIcon}>
						<CheckCircleFilled />
					</span>
					Tạo tổ chức thành công!
				</div>
				<div className={styles.scRow}>
					<span>Tenant</span>
					<strong>{success?.domain || domainValue || 'ten-to-chuc'}</strong>
				</div>
				<div className={styles.scRow}>
					<span>Vai trò của bạn</span>
					<span className={styles.scBadge}>Quản trị viên</span>
				</div>
					<button type='button' className={styles.scBtn} onClick={() => history.push('/user/login')}>
						Đăng nhập ngay <ArrowRightOutlined />
					</button>
				</div>
			</div>
			</div>
		</div>
	);
};

export default RegisterTenant;
