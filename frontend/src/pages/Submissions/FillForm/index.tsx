import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, InputNumber, message, Select, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import { getFormById } from '@/services/Forms/formApi';
import type { IForm, IFormField } from '@/services/Forms/typings';
import { createSubmission } from '@/services/Submissions/submissionApi';
import styles from './index.less';

const FillForm: React.FC = (props: any) => {
	const formId = props?.match?.params?.formId;

	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState<IForm | null>(null);
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	// Load form details
	useEffect(() => {
		if (!formId) return;
		const loadForm = async () => {
			setLoading(true);
			try {
				const response = await getFormById(formId);
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				setForm(data);
			} catch {
				message.error('Không thể tải biểu mẫu');
			} finally {
				setLoading(false);
			}
		};
		loadForm();
	}, [formId]);

	const getFields = (): IFormField[] => {
		return form?.schema?.fields ?? [];
	};

	const setFieldValue = (key: string, value: any) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[key];
				return next;
			});
		}
	};

	// ---- Validation ----
	const validateForm = useCallback((): boolean => {
		const fields = getFields();
		const newErrors: Record<string, string> = {};

		for (const field of fields) {
			const val = formData[field.key];
			const rules = field.rules;

			if (rules?.required && (val === undefined || val === null || val === '')) {
				newErrors[field.key] = `${field.label} là bắt buộc`;
				continue;
			}

			if (val !== undefined && val !== null && val !== '') {
				if (field.type === 'text') {
					const strVal = String(val);
					if (rules?.minLength && strVal.length < rules.minLength) {
						newErrors[field.key] = `Tối thiểu ${rules.minLength} ký tự`;
					} else if (rules?.maxLength && strVal.length > rules.maxLength) {
						newErrors[field.key] = `Tối đa ${rules.maxLength} ký tự`;
					} else if (rules?.regex) {
						const regex = new RegExp(rules.regex);
						if (!regex.test(strVal)) {
							newErrors[field.key] = `Không đúng định dạng`;
						}
					}
				} else if (field.type === 'number') {
					const numVal = Number(val);
					if (rules?.min !== undefined && numVal < rules.min) {
						newErrors[field.key] = `Giá trị tối thiểu là ${rules.min}`;
					} else if (rules?.max !== undefined && numVal > rules.max) {
						newErrors[field.key] = `Giá trị tối đa là ${rules.max}`;
					}
				}
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [form, formData]);

	// ---- Submit ----
	const handleSubmit = async () => {
		if (!validateForm()) {
			message.error('Vui lòng kiểm tra lại dữ liệu');
			return;
		}

		setSubmitting(true);
		try {
			await createSubmission({ formId, data: formData });
			message.success('Nộp biểu mẫu thành công!');
			history.push('/submissions/new');
		} catch (err: any) {
			const errData = err?.response?.data;
			if (errData?.errors && Array.isArray(errData.errors)) {
				const serverErrors: Record<string, string> = {};
				for (const e of errData.errors) {
					serverErrors[e.field] = e.i18nKey || 'Dữ liệu không hợp lệ';
				}
				setErrors(serverErrors);
			} else {
				message.error(errData?.message || 'Có lỗi xảy ra khi nộp biểu mẫu');
			}
		} finally {
			setSubmitting(false);
		}
	};

	const renderField = (field: IFormField) => {
		const value = formData[field.key];
		const error = errors[field.key];

		return (
			<div key={field.key} className={styles.fieldItem}>
				<label className={styles.fieldLabel}>
					{field.label}
					{field.rules?.required && <span className={styles.required}>*</span>}
				</label>

				{field.type === 'text' && (
					<Input
						placeholder={`Nhập ${field.label.toLowerCase()}`}
						value={value || ''}
						onChange={(e) => setFieldValue(field.key, e.target.value)}
						maxLength={field.rules?.maxLength}
					/>
				)}

				{field.type === 'number' && (
					<InputNumber
						placeholder={`Nhập ${field.label.toLowerCase()}`}
						value={value}
						onChange={(val) => setFieldValue(field.key, val)}
						min={field.rules?.min}
						max={field.rules?.max}
						style={{ width: '100%' }}
					/>
				)}

				{field.type === 'date' && (
					<DatePicker
						placeholder={`Chọn ${field.label.toLowerCase()}`}
						value={value}
						onChange={(val) => setFieldValue(field.key, val?.toISOString())}
						style={{ width: '100%' }}
					/>
				)}

				{field.type === 'select' && (() => {
					const opts: string[] = field.options
						? (field.options as any[]).map((o: any) => (typeof o === 'string' ? o : o.value))
						: field.rules?.allowedTypes ?? [];
					return (
						<Select
							placeholder={`Chọn ${field.label.toLowerCase()}`}
							value={value}
							onChange={(val) => setFieldValue(field.key, val)}
							style={{ width: '100%' }}
							allowClear
							options={opts.map((o) => ({ label: o, value: o }))}
						/>
					);
				})()}

				{field.rules?.minLength && field.rules?.maxLength && (
					<div className={styles.fieldHint}>
						{field.rules.minLength} - {field.rules.maxLength} ký tự
					</div>
				)}
				{field.rules?.min !== undefined &&
					field.rules?.max !== undefined &&
					field.type === 'number' && (
						<div className={styles.fieldHint}>
							Giá trị: {field.rules.min} - {field.rules.max}
						</div>
					)}

				{error && <div className={styles.fieldError}>{error}</div>}
			</div>
		);
	};

	if (loading) {
		return (
			<div className={styles.fillPage}>
				<div className={styles.loadingContainer}>
					<Spin size="large" />
				</div>
			</div>
		);
	}

	if (!form) {
		return (
			<div className={styles.fillPage}>
				<div className={styles.emptyForm}>
					<span>❌</span>
					Không tìm thấy biểu mẫu
				</div>
			</div>
		);
	}

	return (
		<div className={styles.fillPage}>
			{/* Header */}
			<div className={styles.pageHeader}>
				<div className={styles.headerLeft}>
					<button
						className={styles.backBtn}
						onClick={() => history.push('/submissions/new')}
					>
						<ArrowLeftOutlined />
					</button>
					<h1>{form.name}</h1>
				</div>
				<p>{form.description || 'Điền thông tin và nộp biểu mẫu'}</p>
			</div>

			{/* Form Fields */}
			<div className={styles.formCard}>
				<div className={styles.cardHeader}>
					<div className={styles.cardIcon}>📋</div>
					<div className={styles.cardTitle}>
						<h3>Thông tin biểu mẫu</h3>
						<p>Điền đầy đủ các trường bắt buộc (*) bên dưới</p>
					</div>
				</div>
				<div className={styles.cardBody}>
					{getFields().length === 0 ? (
						<div className={styles.emptyForm}>
							<span>📄</span>
							Biểu mẫu này chưa có trường dữ liệu
						</div>
					) : (
						<>
							{getFields().map(renderField)}

							<div className={styles.submitActions}>
								<Button
									type="primary"
									icon={<SendOutlined />}
									className={styles.submitBtn}
									onClick={handleSubmit}
									loading={submitting}
								>
									Nộp biểu mẫu
								</Button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default FillForm;
