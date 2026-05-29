import React, { useCallback, useEffect, useState } from 'react';
import { history, useModel, useParams } from 'umi';
import { Spin } from 'antd';
import {
	ArrowLeftOutlined,
	CalendarOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	FileTextOutlined,
	FontSizeOutlined,
	InfoCircleOutlined,
	NumberOutlined,
	SettingOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { getFormById } from '@/services/Forms/formApi';
import type { IForm, IFormField } from '@/services/Forms/typings';
import styles from './index.less';

const FIELD_TYPE_ICONS: Record<string, React.ReactNode> = {
	text: <FontSizeOutlined />,
	number: <NumberOutlined />,
	date: <CalendarOutlined />,
	select: <UnorderedListOutlined />,
};

const FIELD_TYPE_LABELS: Record<string, string> = {
	text: 'Văn bản',
	number: 'Số',
	date: 'Ngày',
	select: 'Lựa chọn',
};

const FormView: React.FC = () => {
	const { formId } = useParams<{ formId: string }>();
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const userRole = currentUser?.role;
	const isAdminOrManager = userRole && ['ADMIN', 'MANAGER'].includes(userRole);

	const [form, setForm] = useState<IForm | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const fetchForm = useCallback(async () => {
		if (!formId) return;
		setLoading(true);
		setError(false);
		try {
			const response = await getFormById(formId);
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setForm(data);
		} catch (err) {
			console.error('Failed to fetch form:', err);
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [formId]);

	useEffect(() => {
		fetchForm();
	}, [fetchForm]);

	/** Render rules for a field */
	const renderRules = (field: IFormField) => {
		const rules: { label: string; value: string }[] = [];

		if (field.rules?.required) rules.push({ label: 'Bắt buộc', value: 'Có' });
		if (field.rules?.minLength !== undefined) rules.push({ label: 'Min Length', value: String(field.rules.minLength) });
		if (field.rules?.maxLength !== undefined) rules.push({ label: 'Max Length', value: String(field.rules.maxLength) });
		if (field.rules?.min !== undefined) rules.push({ label: 'Min', value: String(field.rules.min) });
		if (field.rules?.max !== undefined) rules.push({ label: 'Max', value: String(field.rules.max) });
		if (field.rules?.regex) rules.push({ label: 'Regex', value: field.rules.regex });
		if (field.rules?.afterField) rules.push({ label: 'Sau trường', value: field.rules.afterField });

		if (rules.length === 0) return null;

		return (
			<div className={styles.fieldRules}>
				{rules.map((r, i) => (
					<span key={i} className={styles.ruleTag}>
						{r.label}: <strong>{r.value}</strong>
					</span>
				))}
			</div>
		);
	};

	/** Render a single field preview */
	const renderFieldPreview = (field: IFormField, index: number) => {
		const placeholderMap: Record<string, string> = {
			text: 'Nhập văn bản...',
			number: 'Nhập số...',
			date: 'Chọn ngày...',
			select: 'Chọn một tùy chọn...',
		};

		return (
			<div key={field.key || index} className={styles.fieldItem}>
				<div className={styles.fieldHeader}>
					<div className={`${styles.fieldTypeIcon} ${styles[field.type]}`}>
						{FIELD_TYPE_ICONS[field.type] || <FontSizeOutlined />}
					</div>
					<span className={styles.fieldLabel}>
						{field.label}
						{field.rules?.required && <span className={styles.requiredMark}>*</span>}
					</span>
					<span className={styles.fieldTypeBadge}>{FIELD_TYPE_LABELS[field.type] || field.type}</span>
				</div>

				<div className={styles.fieldInputPreview}>
					<span>{placeholderMap[field.type] || 'Nhập giá trị...'}</span>
				</div>

				{/* Select options */}
				{field.type === 'select' && field.rules?.allowedTypes && field.rules.allowedTypes.length > 0 && (
					<div className={styles.selectOptions}>
						{field.rules.allowedTypes.map((opt: string, i: number) => (
							<div key={i} className={styles.optionItem}>
								<span className={styles.optionDot} />
								{opt}
							</div>
						))}
					</div>
				)}

				{renderRules(field)}
			</div>
		);
	};

	// Loading state
	if (loading) {
		return (
			<div className={styles.formViewPage}>
				<div className={styles.loadingWrapper}>
					<Spin size="large" />
					<span className={styles.loadingText}>Đang tải biểu mẫu...</span>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !form) {
		return (
			<div className={styles.formViewPage}>
				<div className={styles.errorWrapper}>
					<ExclamationCircleOutlined className={styles.errorIcon} />
					<p>Không thể tải biểu mẫu. Vui lòng thử lại.</p>
					<button className={styles.retryBtn} onClick={fetchForm}>
						Thử lại
					</button>
					<button
						className={styles.retryBtn}
						style={{ background: 'transparent', color: '#64748b', border: '1px solid #d9e4ea' }}
						onClick={() => history.push('/forms')}
					>
						Quay lại danh sách
					</button>
				</div>
			</div>
		);
	}

	const fields = form.schema?.fields ?? [];

	return (
		<div className={styles.formViewPage}>
			{/* Header Bar */}
			<div className={styles.viewHeader}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={() => history.push('/forms')}>
						<ArrowLeftOutlined /> Quay lại
					</button>
					<div className={styles.headerInfo}>
						<h2 className={styles.formName}>{form.name}</h2>
						<div className={styles.formMeta}>
							{fields.length} trường • Tạo lúc {moment(form.createdAt).format('DD/MM/YYYY HH:mm')}
						</div>
					</div>
				</div>
				{isAdminOrManager && (
					<div className={styles.headerActions}>
						<button className={styles.editBtn} onClick={() => history.push(`/forms/${formId}/edit`)}>
							<EditOutlined /> Chỉnh sửa
						</button>
					</div>
				)}
			</div>

			{/* Main Content */}
			<div className={styles.viewContent}>
				{/* Info Card */}
				<div className={styles.infoCard}>
					<div className={styles.infoGrid}>
						<div className={styles.infoItem}>
							<div className={styles.infoLabel}>Trạng thái</div>
							<div>
								<span className={`${styles.statusBadge} ${form.isActive ? styles.active : styles.inactive}`}>
									<span className={styles.dot} />
									{form.isActive ? 'Đang hoạt động' : 'Đã vô hiệu'}
								</span>
							</div>
						</div>
						<div className={styles.infoItem}>
							<div className={styles.infoLabel}>Ngày tạo</div>
							<div className={styles.infoValue}>{moment(form.createdAt).format('DD/MM/YYYY HH:mm')}</div>
						</div>
						<div className={styles.infoItem}>
							<div className={styles.infoLabel}>Cập nhật lần cuối</div>
							<div className={styles.infoValue}>{moment(form.updatedAt).format('DD/MM/YYYY HH:mm')}</div>
						</div>
						<div className={styles.infoItem}>
							<div className={styles.infoLabel}>Số trường dữ liệu</div>
							<div className={styles.infoValue}>{fields.length} trường</div>
						</div>
					</div>
				</div>

				{/* Description */}
				{form.description && (
					<div className={styles.descriptionCard}>
						<div className={styles.sectionTitle}>
							<InfoCircleOutlined className={styles.icon} /> Mô tả
						</div>
						<p className={styles.descriptionText}>{form.description}</p>
					</div>
				)}

				{/* Form Preview */}
				<div className={styles.formPreviewCard}>
					<div className={styles.formPreviewHeader}>
						<h1 className={styles.formTitle}>{form.name}</h1>
						{form.description && <p className={styles.formDesc}>{form.description}</p>}
					</div>

					{fields.length > 0 ? (
						<div className={styles.fieldsContainer}>
							{fields.map((field, index) => renderFieldPreview(field, index))}
						</div>
					) : (
						<div className={styles.emptyFields}>
							<div className={styles.emptyIcon}>
								<FileTextOutlined />
							</div>
							<p>Biểu mẫu này chưa có trường dữ liệu nào.</p>
						</div>
					)}
				</div>

				{/* Settings Card */}
				{form.settings && Object.keys(form.settings).length > 0 && (
					<div className={styles.settingsCard}>
						<div className={styles.sectionTitle}>
							<SettingOutlined className={styles.icon} /> Cài đặt
						</div>
						<div className={styles.settingsList}>
							{Object.entries(form.settings).map(([key, value]) => (
								<div key={key} className={styles.settingItem}>
									<span className={styles.settingKey}>{key}</span>
									<span className={`${styles.settingValue} ${typeof value === 'boolean' ? (value ? styles.true : styles.false) : ''}`}>
										{String(value)}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FormView;
