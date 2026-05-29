import { ArrowLeftOutlined, FormOutlined, SendOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, InputNumber, message, Modal, Select, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import { getActiveForms, getFormById } from '@/services/Forms/formApi';
import type { IForm, IFormField } from '@/services/Forms/typings';
import { createSubmission } from '@/services/Submissions/submissionApi';

interface Props {
	visible: boolean;
	onClose: () => void;
}

const SubmitFormModal: React.FC<Props> = ({ visible, onClose }) => {
	const [step, setStep] = useState<'pick' | 'fill'>('pick');

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
		const fieldStyle = { marginBottom: 16 };
		const labelStyle: React.CSSProperties = {
			display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6,
		};
		const errorStyle: React.CSSProperties = { fontSize: 12, color: '#ef4444', marginTop: 4 };

		return (
			<div key={field.key} style={fieldStyle}>
				<label style={labelStyle}>
					{field.label}
					{field.rules?.required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
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

				{error && <div style={errorStyle}>{error}</div>}
			</div>
		);
	};

	return (
		<Modal
			title={
				step === 'pick'
					? 'Chọn biểu mẫu'
					: (
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<button
								onClick={() => { setStep('pick'); setSelectedForm(null); setFormData({}); setErrors({}); }}
								style={{
									border: 'none', background: 'none', cursor: 'pointer', padding: 4,
									display: 'flex', alignItems: 'center', color: '#64748b',
								}}
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
						style={{ marginBottom: 16 }}
					/>
					{loadingForms ? (
						<div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
					) : filteredForms.length === 0 ? (
						<div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
							Không tìm thấy biểu mẫu
						</div>
					) : (
						<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
							{filteredForms.map((form) => (
								<div
									key={form.id}
									onClick={() => handlePickForm(form)}
									style={{
										padding: '14px 16px',
										borderRadius: 12,
										border: '1px solid #e2e8f0',
										cursor: 'pointer',
										transition: 'all 0.2s',
										display: 'flex',
										alignItems: 'center',
										gap: 12,
									}}
									onMouseEnter={(e) => {
										(e.currentTarget as HTMLDivElement).style.background = '#f8fafc';
										(e.currentTarget as HTMLDivElement).style.borderColor = '#cbd5e1';
									}}
									onMouseLeave={(e) => {
										(e.currentTarget as HTMLDivElement).style.background = '';
										(e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
									}}
								>
									<div style={{
										width: 36, height: 36, borderRadius: 10,
										background: '#ede9fe', color: '#7c3aed',
										display: 'flex', alignItems: 'center', justifyContent: 'center',
										fontSize: 16, flexShrink: 0,
									}}>
										<FormOutlined />
									</div>
									<div style={{ flex: 1, minWidth: 0 }}>
										<div style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>
											{form.name}
										</div>
										{form.description && (
											<div style={{
												fontSize: 12, color: '#94a3b8', marginTop: 2,
												overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
											}}>
												{form.description}
											</div>
										)}
									</div>
									<div style={{ fontSize: 12, color: '#94a3b8', flexShrink: 0 }}>
										{form.schema?.fields?.length ?? 0} trường
									</div>
								</div>
							))}
						</div>
					)}
				</>
			)}

			{step === 'fill' && (
				loadingForm ? (
					<div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
				) : getFields().length === 0 ? (
					<div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
						Biểu mẫu này chưa có trường dữ liệu
					</div>
				) : (
					<>{getFields().map(renderField)}</>
				)
			)}
		</Modal>
	);
};

export default SubmitFormModal;
