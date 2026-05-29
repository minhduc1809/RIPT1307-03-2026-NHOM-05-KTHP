import React, { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import { message, Spin } from 'antd';
import {
	CalendarOutlined,
	ControlOutlined,
	CopyOutlined,
	DeleteOutlined,
	DownOutlined,
	EyeOutlined,
	FontSizeOutlined,
	GlobalOutlined,
	LockOutlined,
	MinusCircleOutlined,
	NumberOutlined,
	PlusCircleOutlined,
	SelectOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import { getFormById, updateForm } from '@/services/Forms/formApi';
import styles from './index.less';

interface IEditField {
	id: string;
	type: 'text' | 'number' | 'date' | 'select';
	key: string;
	label: string;
	placeholder?: string;
	required: boolean;
	options?: string[];
	minLength?: number;
	maxLength?: number;
	regex?: string;
	min?: number;
	max?: number;
	afterField?: string;
}

const FIELD_TYPES = [
	{ type: 'text' as const, label: 'Văn bản', icon: <FontSizeOutlined /> },
	{ type: 'number' as const, label: 'Số', icon: <NumberOutlined /> },
	{ type: 'date' as const, label: 'Ngày', icon: <CalendarOutlined /> },
	{ type: 'select' as const, label: 'Chọn', icon: <UnorderedListOutlined /> },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

const FormEdit: React.FC = () => {
	const { formId } = useParams<{ formId: string }>();

	const [formName, setFormName] = useState('');
	const [formDescription, setFormDescription] = useState('');
	const [fields, setFields] = useState<IEditField[]>([]);
	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [originalFormId, setOriginalFormId] = useState<string | undefined>(undefined);
	const [allowAnonymous, setAllowAnonymous] = useState(false);

	// Load existing form data
	useEffect(() => {
		if (!formId) return;
		setIsLoading(true);
		getFormById(formId)
			.then((response) => {
				const form = (response as any)?.data?.data ?? (response as any)?.data;
				if (form) {
					setFormName(form.name || '');
					setFormDescription(form.description || '');
					setOriginalFormId(form.schema?.formId);

					// Load settings
					if (form.settings) {
						setAllowAnonymous(form.settings.allowAnonymous ?? false);
					}

					// Map schema fields to editor fields
					if (form.schema?.fields && Array.isArray(form.schema.fields)) {
						const editorFields: IEditField[] = form.schema.fields.map((f: any) => ({
							id: generateId(),
							type: f.type || 'text',
							key: f.key || '',
							label: f.label || '',
							placeholder: f.type === 'select' ? 'Chọn một tùy chọn' : 'Nhập giá trị...',
							required: f.rules?.required ?? false,
							options: f.type === 'select' ? f.rules?.allowedTypes || [] : undefined,
							minLength: f.rules?.minLength,
							maxLength: f.rules?.maxLength,
							regex: f.rules?.regex,
							min: f.rules?.min,
							max: f.rules?.max,
							afterField: f.rules?.afterField,
						}));
						setFields(editorFields);
					}
				}
			})
			.catch((error) => {
				console.error('Failed to load form:', error);
				message.error('Không thể tải biểu mẫu');
			})
			.finally(() => setIsLoading(false));
	}, [formId]);

	const selectedField = fields.find((f) => f.id === selectedFieldId);

	// Field Actions
	const handleDeleteField = (id: string, e?: React.MouseEvent) => {
		if (e) e.stopPropagation();
		setFields(fields.filter((f) => f.id !== id));
		if (selectedFieldId === id) setSelectedFieldId(null);
	};

	const handleCopyField = (field: IEditField, index: number, e: React.MouseEvent) => {
		e.stopPropagation();
		const newId = generateId();
		const clonedField: IEditField = { ...field, id: newId, key: `${field.key}_copy` };
		const newFields = Array.from(fields);
		newFields.splice(index + 1, 0, clonedField);
		setFields(newFields);
		setSelectedFieldId(newId);
	};

	const addField = (type: 'text' | 'number' | 'date' | 'select') => {
		const newId = generateId();
		const typeLabel = FIELD_TYPES.find((t) => t.type === type)?.label || type;
		const newField: IEditField = {
			id: newId,
			type,
			key: `field_${newId}`,
			label: `Trường ${typeLabel}`,
			placeholder: type === 'select' ? 'Chọn một tùy chọn' : 'Nhập giá trị...',
			required: false,
			...(type === 'select' ? { options: ['Lựa chọn 1', 'Lựa chọn 2'] } : {}),
		};
		setFields([...fields, newField]);
		setSelectedFieldId(newId);
	};

	// Update Field Properties
	const updateFieldProp = (id: string, key: keyof IEditField, value: any) => {
		setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
	};

	// Save Logic
	const handleSave = async () => {
		if (!formName.trim()) {
			message.warning('Vui lòng nhập tên biểu mẫu');
			return;
		}
		if (!formId) return;

		setIsSaving(true);
		try {
			const schemaFields = fields.map((f) => {
				const fieldRule: any = {};
				if (f.required) fieldRule.required = true;

				if (f.type === 'text') {
					if (f.minLength !== undefined) fieldRule.minLength = f.minLength;
					if (f.maxLength !== undefined) fieldRule.maxLength = f.maxLength;
					if (f.regex) fieldRule.regex = f.regex;
				}

				if (f.type === 'number') {
					if (f.min !== undefined) fieldRule.min = f.min;
					if (f.max !== undefined) fieldRule.max = f.max;
				}

				if (f.type === 'date') {
					if (f.afterField) fieldRule.afterField = f.afterField;
				}

				if (f.type === 'select' && f.options) {
					fieldRule.allowedTypes = f.options;
				}

				return {
					key: f.key,
					label: f.label,
					type: f.type,
					rules: Object.keys(fieldRule).length > 0 ? fieldRule : undefined,
				};
			});

			const formData = {
				name: formName,
				description: formDescription,
				schema: {
					formId: originalFormId || `form_${generateId()}`,
					fields: schemaFields as any,
				},
				settings: { allowAnonymous },
			};

			await updateForm(formId, formData);
			message.success('Cập nhật biểu mẫu thành công!');
			history.push(`/forms/${formId}`);
		} catch (error) {
			message.error('Cập nhật biểu mẫu thất bại');
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	// Render field preview
	const renderFieldPreview = (field: IEditField) => {
		switch (field.type) {
			case 'text':
			case 'number':
			case 'date':
				return <div className={styles.fieldInputPreview}>{field.placeholder || '...'}</div>;
			case 'select':
				const isOpen = openDropdownId === field.id;
				return (
					<div className={styles.selectPreviewContainer}>
						<div
							className={styles.fieldInputPreview}
							onClick={(e) => {
								e.stopPropagation();
								setSelectedFieldId(field.id);
								setOpenDropdownId(isOpen ? null : field.id);
							}}
							style={{ cursor: 'pointer' }}
						>
							<span>{field.placeholder || 'Chọn một tùy chọn'}</span>
							<DownOutlined style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
						</div>
						{isOpen && (
							<div className={styles.customDropdownOptions}>
								{field.options?.map((opt, i) => (
									<div key={i} className={styles.customOptionItem}>{opt}</div>
								))}
								{(!field.options || field.options.length === 0) && (
									<div className={styles.customOptionEmpty}>Chưa có tùy chọn nào</div>
								)}
							</div>
						)}
					</div>
				);
			default:
				return null;
		}
	};

	if (isLoading) {
		return (
			<div className={styles.editLayout}>
				<div className={styles.loadingOverlay}>
					<Spin size="large" />
					<span className={styles.loadingText}>Đang tải biểu mẫu...</span>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.editLayout}>
			{/* Top Header */}
			<header className={styles.header}>
				<div className={styles.headerLeft}>
					<span className={styles.logo}>Chỉnh sửa biểu mẫu</span>
					<span className={styles.editBadge}>Đang chỉnh sửa</span>
				</div>
				<div className={styles.headerRight}>
					<div className={styles.actions}>
						<button className={styles.btnView} onClick={() => history.push(`/forms/${formId}`)}>
							<EyeOutlined /> Xem
						</button>
						<button className={styles.btnBack} onClick={() => history.push('/forms')}>
							Quay lại
						</button>
						<button className={styles.btnSave} onClick={handleSave} disabled={isSaving}>
							{isSaving ? 'Đang lưu...' : 'Cập nhật'}
						</button>
					</div>
				</div>
			</header>

			<main className={styles.mainContent}>
				{/* Left Sidebar — Form Metadata + Add Field */}
				<aside className={styles.sidebarLeft}>
					<div className={styles.sidebarTitle}>
						<h2>Thông tin biểu mẫu</h2>
						<p>Chỉnh sửa tên, mô tả và các trường</p>
					</div>

					<div className={styles.metaForm}>
						<div className={styles.metaGroup}>
							<label>Tên biểu mẫu</label>
							<input
								type="text"
								value={formName}
								onChange={(e) => setFormName(e.target.value)}
								placeholder="Nhập tên biểu mẫu..."
							/>
						</div>
						<div className={styles.metaGroup}>
							<label>Mô tả</label>
							<textarea
								value={formDescription}
								onChange={(e) => setFormDescription(e.target.value)}
								placeholder="Nhập mô tả biểu mẫu..."
								rows={3}
							/>
						</div>
					</div>

					{/* Add New Field */}
					<div className={styles.addFieldSection}>
						<h3>Thêm trường mới</h3>
						<div className={styles.fieldTypeGrid}>
							{FIELD_TYPES.map((ft) => (
								<div key={ft.type} className={styles.fieldTypeCard} onClick={() => addField(ft.type)}>
									<div className={`${styles.ftIcon} ${styles[ft.type]}`}>{ft.icon}</div>
									<span className={styles.ftLabel}>{ft.label}</span>
								</div>
							))}
						</div>
					</div>

					{/* Allow Anonymous Setting */}
					<div className={styles.addFieldSection}>
						<h3>Cài đặt</h3>
						<div style={{
							background: '#fff',
							borderRadius: 14,
							padding: 16,
							border: '1px solid rgba(169,180,185,0.15)',
						}}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
								<div style={{
									width: 32, height: 32, borderRadius: 8,
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									background: 'rgba(218,226,253,0.25)', color: '#565e74', fontSize: 16
								}}>
									{allowAnonymous ? <GlobalOutlined /> : <LockOutlined />}
								</div>
								<div>
									<div style={{ fontSize: 13, fontWeight: 600, color: '#2a3439' }}>Gửi ẩn danh</div>
									<div style={{ fontSize: 10, color: '#717c82' }}>Không cần đăng nhập</div>
								</div>
							</div>
							<label className={styles.propSwitch} style={{ padding: 0 }}>
								<div className={styles.switchText}>
									<span style={{ fontSize: 12 }}>{allowAnonymous ? 'Bật' : 'Tắt'}</span>
								</div>
								<label className={styles.toggleWrapper}>
									<input type='checkbox' checked={allowAnonymous} onChange={(e) => setAllowAnonymous(e.target.checked)} />
									<div className={`${styles.toggleTrack} ${allowAnonymous ? styles.checked : ''}`} />
									<div className={`${styles.toggleThumb} ${allowAnonymous ? styles.checked : ''}`} />
								</label>
							</label>
						</div>
					</div>
				</aside>

				{/* Middle Canvas */}
				<section className={styles.canvasArea} onClick={() => setSelectedFieldId(null)}>
					<div className={styles.canvasContainer} onClick={(e) => e.stopPropagation()}>
						<div className={styles.formHeader}>
							<h2 className={styles.formTitleDisplay}>{formName || 'Tên biểu mẫu'}</h2>
							{formDescription && <p className={styles.formDescDisplay}>{formDescription}</p>}
						</div>

						<div className={styles.fieldsZone}>
							{fields.map((field, index) => (
								<div
									key={field.id}
									className={`${styles.fieldEditItem} ${selectedFieldId === field.id ? styles.active : ''}`}
									onClick={(e) => {
										e.stopPropagation();
										setSelectedFieldId(field.id);
									}}
								>
									<div className={styles.fieldActions}>
										<button className={styles.btnCopy} onClick={(e) => handleCopyField(field, index, e)}>
											<CopyOutlined />
										</button>
										<button className={styles.btnDelete} onClick={(e) => handleDeleteField(field.id, e)}>
											<DeleteOutlined />
										</button>
									</div>

									<span className={styles.fieldLabel}>
										{field.label}
										{field.required && <span className={styles.requiredMark}>*</span>}
									</span>
									{renderFieldPreview(field)}
								</div>
							))}

							{fields.length === 0 && (
								<div className={styles.emptyFields}>
									<PlusCircleOutlined className={styles.icon} />
									<span className={styles.text}>Thêm trường từ panel bên trái</span>
								</div>
							)}
						</div>
					</div>
				</section>

				{/* Right Sidebar (Properties) */}
				<aside className={styles.sidebarRight}>
					<div className={styles.propsHeader}>
						<h2>
							<ControlOutlined />
							Cấu hình trường
						</h2>
					</div>

					{selectedField ? (
						<>
							<div className={styles.propsBody}>
								<div className={styles.propGroup}>
									<label>Mã trường (Key)</label>
									<input
										type="text"
										className={styles.propInput}
										value={selectedField.key}
										onChange={(e) => updateFieldProp(selectedField.id, 'key', e.target.value)}
									/>
								</div>
								<div className={styles.propGroup}>
									<label>Nhãn hiển thị</label>
									<input
										type="text"
										className={styles.propInput}
										value={selectedField.label}
										onChange={(e) => updateFieldProp(selectedField.id, 'label', e.target.value)}
									/>
								</div>
								<div className={styles.propGroup}>
									<label>Gợi ý (Placeholder)</label>
									<input
										type="text"
										className={styles.propInput}
										value={selectedField.placeholder || ''}
										onChange={(e) => updateFieldProp(selectedField.id, 'placeholder', e.target.value)}
									/>
								</div>

								<div className={styles.propSwitch}>
									<div className={styles.switchText}>
										<span>Bắt buộc nhập</span>
										<p>Người dùng phải điền trường này</p>
									</div>
									<label className={styles.toggleWrapper}>
										<input
											type="checkbox"
											checked={selectedField.required}
											onChange={(e) => updateFieldProp(selectedField.id, 'required', e.target.checked)}
										/>
										<div className={`${styles.toggleTrack} ${selectedField.required ? styles.checked : ''}`} />
										<div className={`${styles.toggleThumb} ${selectedField.required ? styles.checked : ''}`} />
									</label>
								</div>

								{selectedField.type === 'text' && (
									<>
										<div className={styles.propGroup}>
											<label>Độ dài tối thiểu (minLength)</label>
											<input
												type="number"
												className={styles.propInput}
												value={selectedField.minLength ?? ''}
												onChange={(e) => updateFieldProp(selectedField.id, 'minLength', e.target.value ? Number(e.target.value) : undefined)}
											/>
										</div>
										<div className={styles.propGroup}>
											<label>Độ dài tối đa (maxLength)</label>
											<input
												type="number"
												className={styles.propInput}
												value={selectedField.maxLength ?? ''}
												onChange={(e) => updateFieldProp(selectedField.id, 'maxLength', e.target.value ? Number(e.target.value) : undefined)}
											/>
										</div>
										<div className={styles.propGroup}>
											<label>Biểu thức Regex</label>
											<input
												type="text"
												className={styles.propInput}
												value={selectedField.regex || ''}
												placeholder="VD: ^[a-zA-Z]+$"
												onChange={(e) => updateFieldProp(selectedField.id, 'regex', e.target.value)}
											/>
										</div>
									</>
								)}

								{selectedField.type === 'number' && (
									<>
										<div className={styles.propGroup}>
											<label>Giá trị nhỏ nhất (min)</label>
											<input
												type="number"
												className={styles.propInput}
												value={selectedField.min ?? ''}
												onChange={(e) => updateFieldProp(selectedField.id, 'min', e.target.value ? Number(e.target.value) : undefined)}
											/>
										</div>
										<div className={styles.propGroup}>
											<label>Giá trị lớn nhất (max)</label>
											<input
												type="number"
												className={styles.propInput}
												value={selectedField.max ?? ''}
												onChange={(e) => updateFieldProp(selectedField.id, 'max', e.target.value ? Number(e.target.value) : undefined)}
											/>
										</div>
									</>
								)}

								{selectedField.type === 'date' && (
									<div className={styles.propGroup}>
										<label>Sau ngày của trường (afterField)</label>
										<select
											className={styles.propInput}
											value={selectedField.afterField || ''}
											onChange={(e) => updateFieldProp(selectedField.id, 'afterField', e.target.value)}
										>
											<option value="">-- Không có --</option>
											{fields
												.filter((f) => f.type === 'date' && f.id !== selectedField.id)
												.map((f) => (
													<option key={f.key} value={f.key}>
														{f.label} ({f.key})
													</option>
												))}
										</select>
									</div>
								)}

								{selectedField.type === 'select' && (
									<div className={styles.propOptions}>
										<label>Tùy chọn danh sách</label>
										<div className={styles.optionsList}>
											{selectedField.options?.map((opt, optIdx) => (
												<div key={optIdx} className={styles.optionItem}>
													<input
														type="text"
														value={opt}
														onChange={(e) => {
															const newOpts = [...(selectedField.options || [])];
															newOpts[optIdx] = e.target.value;
															updateFieldProp(selectedField.id, 'options', newOpts);
														}}
													/>
													<button
														onClick={() => {
															const newOpts = [...(selectedField.options || [])];
															newOpts.splice(optIdx, 1);
															updateFieldProp(selectedField.id, 'options', newOpts);
														}}
													>
														<MinusCircleOutlined />
													</button>
												</div>
											))}
										</div>
										<button
											className={styles.btnAddOption}
											onClick={() => {
												const newOpts = [
													...(selectedField.options || []),
													`Lựa chọn ${(selectedField.options?.length || 0) + 1}`,
												];
												updateFieldProp(selectedField.id, 'options', newOpts);
											}}
										>
											+ Thêm tùy chọn
										</button>
									</div>
								)}
							</div>

							<div className={styles.propsFooter}>
								<button className={styles.btnDeleteField} onClick={() => handleDeleteField(selectedField.id)}>
									<DeleteOutlined />
									Xóa trường này
								</button>
							</div>
						</>
					) : (
						<div className={styles.propsBody}>
							<div className={styles.emptyProps}>
								<SelectOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
								<p>Chọn một trường để cấu hình</p>
							</div>
						</div>
					)}
				</aside>
			</main>
		</div>
	);
};

export default FormEdit;
