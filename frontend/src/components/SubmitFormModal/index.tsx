import { ArrowLeftOutlined, FormOutlined, SendOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, InputNumber, message, Modal, Select, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import { getActiveForms, getFormById } from '@/services/Forms/formApi';
import type { IForm, IFormField } from '@/services/Forms/typings';
import { createSubmission } from '@/services/Submissions/submissionApi';
import styles from './index.less';

interface Props {
	visible: boolean;
	onClose: () => void;
}

const SubmitFormModal: React.FC<Props> = ({ visible, onClose }) => {
	const [step, setStep] = useState<'pick' | 'fill'>('pick');
	const [pickedId, setPickedId] = useState<string | null>(null);

	// Pick form state
	const [forms, setForms] = useState<IForm[]>([]);
	const [loadingForms, setLoadingForms] = useState(false);
	const [search, setSearch] = useState('');

	// Fill form state
	const [selectedForm, setSelectedForm] = useState<IForm | null>(null);
	const [loadingForm, setLoadingForm] = useState(false);
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!visible) return;
		setStep('pick');
		setSelectedForm(null);
		setFormData({});
		setErrors({});
		setSearch('');
		const load = async () => {
			setLoadingForms(true);
			try {
				const response = await getActiveForms();
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				setForms(Array.isArray(data) ? data : []);
			} catch { /* silent */ } finally {
				setLoadingForms(false);
			}
		};
		load();
	}, [visible]);

	const handlePickForm = async (form: IForm) => {
		setPickedId(form.id);
		setLoadingForm(true);
		setStep('fill');
		try {
			const response = await getFormById(form.id);
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setSelectedForm(data);
		} catch {
			message.error('Không thể tải biểu mẫu');
			setStep('pick');
		} finally {
			setLoadingForm(false);
		}
	};

	const getFields = (): IFormField[] => {
		return selectedForm?.schema?.fields ?? [];
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
						if (!new RegExp(rules.regex).test(strVal)) {
							newErrors[field.key] = 'Không đúng định dạng';
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
	}, [selectedForm, formData]);

	const handleSubmit = async () => {
		if (!selectedForm || !validateForm()) {
			message.error('Vui lòng kiểm tra lại dữ liệu');
			return;
		}

		setSubmitting(true);
		try {
			const res = await createSubmission({ formId: selectedForm.id, data: formData });
			const created = (res as any)?.data?.data ?? (res as any)?.data;
			message.success('Nộp biểu mẫu thành công!');
			onClose();
			if (created?.id) {
				history.push(`/submissions/${created.id}`);
			}
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

	const filteredForms = forms.filter(
		(f) =>
			!search.trim() ||
			f.name.toLowerCase().includes(search.toLowerCase()) ||
			(f.description ?? '').toLowerCase().includes(search.toLowerCase()),
	);

	const renderField = (field: IFormField) => {
		const value = formData[field.key];
		const error = errors[field.key];
		

		return (
			<div key={field.key} className={styles.fieldGroup}>
				<label>
					{field.label}
					{field.rules?.required && <span className={styles.requiredMark}>*</span>}
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
						value={value ? moment(value) : null}
						onChange={(val) => setFieldValue(field.key, val?.toISOString() ?? null)}
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

				{error && <div className={styles.fieldError}>{error}</div>}
			</div>
		);
	};

	return (
		<Modal
			title={
				step === 'pick'
					? 'Chọn biểu mẫu'
					: (
						<div className={styles.titleRow}>
							<button
								type='button'
								className={styles.backBtn}
								onClick={() => { setStep('pick'); setSelectedForm(null); setPickedId(null); setFormData({}); setErrors({}); }}
							>
								<ArrowLeftOutlined />
							</button>
							<span>{selectedForm?.name || 'Điền biểu mẫu'}</span>
						</div>
					)
			}
			visible={visible}
			onCancel={onClose}
			footer={
				step === 'fill' && selectedForm ? (
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
						<Button onClick={onClose}>Hủy</Button>
						<Button
							type="primary"
							icon={<SendOutlined />}
							loading={submitting}
							onClick={handleSubmit}
						>
							Nộp biểu mẫu
						</Button>
					</div>
				) : null
			}
			width={600}
			className={styles.modal}
			destroyOnClose
			style={{ top: 40 }}
			bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '16px 24px' }}
		>
			{step === 'pick' && (
				<>
					<Input
						placeholder="Tìm kiếm biểu mẫu..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						allowClear
						className={styles.searchInput}
					/>
					{loadingForms ? (
						<div className={styles.centerNote}><Spin /></div>
					) : filteredForms.length === 0 ? (
						<div className={styles.centerNote}>Không tìm thấy biểu mẫu</div>
					) : (
						<div className={styles.formList}>
							{filteredForms.map((form) => (
								<div
								key={form.id}
								className={`${styles.formItem} ${pickedId === form.id ? styles.picked : ''}`}
								onClick={() => handlePickForm(form)}
							>
								<div className={styles.formItemIcon}>
									<FormOutlined />
								</div>
								<div className={styles.formItemInfo}>
									<div className={styles.formItemName}>{form.name}</div>
									{form.description && <div className={styles.formItemDesc}>{form.description}</div>}
								</div>
								<div className={styles.formItemCount}>{form.schema?.fields?.length ?? 0} trường</div>
							</div>
							))}
						</div>
					)}
				</>
			)}

			{step === 'fill' && (
				loadingForm ? (
					<div className={styles.centerNote}><Spin /></div>
				) : getFields().length === 0 ? (
					<div className={styles.centerNote}>Biểu mẫu này chưa có trường dữ liệu</div>
				) : (
					<>{getFields().map(renderField)}</>
				)
			)}
		</Modal>
	);
};

export default SubmitFormModal;
