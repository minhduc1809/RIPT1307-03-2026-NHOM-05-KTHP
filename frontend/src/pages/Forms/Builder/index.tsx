import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import { message } from 'antd';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
	ArrowLeftOutlined,
	MoreOutlined,
	CalendarOutlined,
	CheckCircleOutlined,
	CheckOutlined,
	ControlOutlined,
	CopyOutlined,
	DeleteOutlined,
	DownOutlined,
	EditOutlined,
	EyeOutlined,
	FontSizeOutlined,
	MinusCircleOutlined,
	NumberOutlined,
	PlusOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import { createForm, getFormById, updateForm } from '@/services/Forms/formApi';
import styles from './index.less';

interface IBuilderField {
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
	{ type: 'text', label: 'Văn bản', icon: <FontSizeOutlined /> },
	{ type: 'number', label: 'Số', icon: <NumberOutlined /> },
	{ type: 'date', label: 'Ngày', icon: <CalendarOutlined /> },
	{ type: 'select', label: 'Chọn', icon: <UnorderedListOutlined /> },
] as const;

const THEME_PRESETS = [
	{ id: 'default', label: 'Mặc định (Sáng)', swatch: '#ffffff' },
	{ id: 'dark', label: 'Tối giản (Dark)', swatch: '#0f172a' },
	{ id: 'mint', label: 'Mùa xuân (Mint)', swatch: '#6ee7b7' },
	{ id: 'sunset', label: 'Hoàng hôn (Rose)', swatch: '#fda4af' },
	{ id: 'violet', label: 'Hiện đại (Violet)', swatch: '#8b5cf6' },
] as const;

type ThemeId = (typeof THEME_PRESETS)[number]['id'];
type RightTab = 'field' | 'theme' | 'settings';

const THEME_CLASS: Record<ThemeId, string> = {
	default: '',
	dark: 'themeDark',
	mint: 'themeMint',
	sunset: 'themeSunset',
	violet: 'themeViolet',
};

const generateId = () => Math.random().toString(36).substring(2, 9);

interface IFormBuilderProps {
	editId?: string;
}

const FormBuilder: React.FC<IFormBuilderProps> = ({ editId: editIdProp }) => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const editId = editIdProp ?? queryParams.get('id');

	const [formName, setFormName] = useState('Đăng ký thông tin mới');
	const [formDescription, setFormDescription] = useState('Vui lòng điền đầy đủ các thông tin bên dưới để tiếp tục.');
	const [fields, setFields] = useState<IBuilderField[]>([]);
	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
	const [themePreset, setThemePreset] = useState<ThemeId>('default');
	const [allowAnonymous, setAllowAnonymous] = useState(false);
	const [allowDraft, setAllowDraft] = useState(true);
	const [rightTab, setRightTab] = useState<RightTab>('field');
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [originalFormId, setOriginalFormId] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!editId) return;
		setIsLoading(true);
		getFormById(editId)
			.then((response) => {
				const form = (response as any)?.data?.data ?? (response as any)?.data;
				if (form) {
					setFormName(form.name || '');
					setFormDescription(form.description || '');
					setOriginalFormId(form.schema?.formId);

					if (form.settings) {
						setAllowAnonymous(form.settings.allowAnonymous ?? false);
						setAllowDraft(form.settings.allowDraft ?? true);
						if (form.settings.theme && THEME_PRESETS.some((t) => t.id === form.settings.theme)) {
							setThemePreset(form.settings.theme);
						}
					}

					if (form.schema?.fields && Array.isArray(form.schema.fields)) {
						const builderFields: IBuilderField[] = form.schema.fields.map((f: any) => ({
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
						setFields(builderFields);
					}
				}
			})
			.catch((error) => {
				console.error('Failed to load form:', error);
				message.error('Không thể tải biểu mẫu');
			})
			.finally(() => setIsLoading(false));
	}, [editId]);

	const selectedField = fields.find((f) => f.id === selectedFieldId);

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;
		if (!destination) return;

		if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
			const newFields = Array.from(fields);
			const [movedItem] = newFields.splice(source.index, 1);
			newFields.splice(destination.index, 0, movedItem);
			setFields(newFields);
			return;
		}

		if (source.droppableId === 'toolbox' && destination.droppableId === 'canvas') {
			const fieldTypeTemplate = FIELD_TYPES[source.index];
			const newFieldId = generateId();

			const newField: IBuilderField = {
				id: newFieldId,
				type: fieldTypeTemplate.type,
				key: `field_${newFieldId}`,
				label: `Trường ${fieldTypeTemplate.label}`,
				placeholder: fieldTypeTemplate.type === 'select' ? 'Chọn một tùy chọn' : 'Nhập giá trị...',
				required: false,
				...(fieldTypeTemplate.type === 'select' ? { options: ['Lựa chọn 1', 'Lựa chọn 2'] } : {}),
			};

			const newFields = Array.from(fields);
			newFields.splice(destination.index, 0, newField);
			setFields(newFields);
			setSelectedFieldId(newFieldId);
			setRightTab('field');
		}
	};

	const handleDeleteField = (id: string, e?: React.MouseEvent) => {
		if (e) e.stopPropagation();
		setFields(fields.filter((f) => f.id !== id));
		if (selectedFieldId === id) setSelectedFieldId(null);
	};

	const handleCopyField = (field: IBuilderField, index: number, e: React.MouseEvent) => {
		e.stopPropagation();
		const newId = generateId();
		const clonedField: IBuilderField = { ...field, id: newId, key: `${field.key}_copy` };
		const newFields = Array.from(fields);
		newFields.splice(index + 1, 0, clonedField);
		setFields(newFields);
		setSelectedFieldId(newId);
		setRightTab('field');
	};

	const selectField = (id: string) => {
		setSelectedFieldId(id);
		setRightTab('field');
	};

	const updateFieldProp = (id: string, key: keyof IBuilderField, value: any) => {
		setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
	};

	const handleSave = async () => {
		if (!formName.trim()) {
			message.warning('Vui lòng nhập tên biểu mẫu');
			return;
		}

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
				settings: { allowAnonymous, allowDraft, theme: themePreset },
			};

			if (editId) {
				await updateForm(editId, formData);
				message.success('Cập nhật biểu mẫu thành công!');
			} else {
				await createForm(formData);
				message.success('Tạo biểu mẫu thành công!');
			}

			history.push('/forms');
		} catch (error) {
			message.error(editId ? 'Cập nhật biểu mẫu thất bại' : 'Lưu biểu mẫu thất bại');
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	const renderFieldPreview = (field: IBuilderField) => {
		switch (field.type) {
			case 'text':
			case 'number':
				return <div className={styles.fieldInputPreview}>{field.placeholder || '...'}</div>;
			case 'date':
				return (
					<div className={styles.fieldInputPreview}>
						<span>{field.placeholder || 'Chọn ngày...'}</span>
						<CalendarOutlined />
					</div>
				);
			case 'select': {
				const isOpen = openDropdownId === field.id;
				return (
					<div className={styles.selectPreviewContainer}>
						<div
							className={`${styles.fieldInputPreview} ${isOpen ? styles.active : ''}`}
							onClick={(e) => {
								e.stopPropagation();
								selectField(field.id);
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
									// eslint-disable-next-line react/no-array-index-key
									<div key={i} className={styles.customOptionItem}>
										{opt}
									</div>
								))}
								{(!field.options || field.options.length === 0) && (
									<div className={styles.customOptionEmpty}>Chưa có tùy chọn nào</div>
								)}
							</div>
						)}
					</div>
				);
			}
			default:
				return null;
		}
	};

	const renderFieldConfig = () => {
		if (!selectedField) {
			return (
				<div className={styles.panelBody}>
					<div className={styles.emptyProps}>
						<ControlOutlined />
						<p>Chọn một trường trên biểu mẫu để cấu hình</p>
					</div>
				</div>
			);
		}

		return (
			<div className={styles.panelBody}>
				<div className={styles.propGroup}>
					<label>Mã trường (Key)</label>
					<input
						type='text'
						className={styles.propInput}
						value={selectedField.key}
						onChange={(e) => updateFieldProp(selectedField.id, 'key', e.target.value)}
					/>
				</div>
				<div className={styles.propGroup}>
					<label>Nhãn hiển thị</label>
					<input
						type='text'
						className={styles.propInput}
						value={selectedField.label}
						onChange={(e) => updateFieldProp(selectedField.id, 'label', e.target.value)}
					/>
				</div>
				<div className={styles.propGroup}>
					<label>Gợi ý (Placeholder)</label>
					<input
						type='text'
						className={styles.propInput}
						value={selectedField.placeholder || ''}
						onChange={(e) => updateFieldProp(selectedField.id, 'placeholder', e.target.value)}
					/>
				</div>

				<label className={styles.checkRow}>
					<input
						type='checkbox'
						hidden
						checked={selectedField.required}
						onChange={(e) => updateFieldProp(selectedField.id, 'required', e.target.checked)}
					/>
					<span className={`${styles.checkBox} ${selectedField.required ? styles.checked : ''}`}>
						{selectedField.required && <CheckOutlined />}
					</span>
					<span className={styles.checkLabel}>Bắt buộc nhập</span>
				</label>

				{selectedField.type === 'text' && (
					<>
						<div className={styles.propGroup}>
							<label>Độ dài tối thiểu (minLength)</label>
							<input
								type='number'
								className={styles.propInput}
								value={selectedField.minLength ?? ''}
								onChange={(e) =>
									updateFieldProp(selectedField.id, 'minLength', e.target.value ? Number(e.target.value) : undefined)
								}
							/>
						</div>
						<div className={styles.propGroup}>
							<label>Độ dài tối đa (maxLength)</label>
							<input
								type='number'
								className={styles.propInput}
								value={selectedField.maxLength ?? ''}
								onChange={(e) =>
									updateFieldProp(selectedField.id, 'maxLength', e.target.value ? Number(e.target.value) : undefined)
								}
							/>
						</div>
						<div className={styles.propGroup}>
							<label>Biểu thức Regex (regex)</label>
							<input
								type='text'
								className={styles.propInput}
								value={selectedField.regex || ''}
								placeholder='VD: ^[\w-\.]+@...'
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
								type='number'
								className={styles.propInput}
								value={selectedField.min ?? ''}
								onChange={(e) =>
									updateFieldProp(selectedField.id, 'min', e.target.value ? Number(e.target.value) : undefined)
								}
							/>
						</div>
						<div className={styles.propGroup}>
							<label>Giá trị lớn nhất (max)</label>
							<input
								type='number'
								className={styles.propInput}
								value={selectedField.max ?? ''}
								onChange={(e) =>
									updateFieldProp(selectedField.id, 'max', e.target.value ? Number(e.target.value) : undefined)
								}
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
							<option value=''>-- Không có --</option>
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
					<div className={styles.propGroup}>
						<label>Tùy chọn danh sách</label>
						<div className={styles.optionsList}>
							{selectedField.options?.map((opt, optIdx) => (
								// eslint-disable-next-line react/no-array-index-key
								<div key={optIdx} className={styles.optionItem}>
									<input
										type='text'
										value={opt}
										onChange={(e) => {
											const newOpts = [...(selectedField.options || [])];
											newOpts[optIdx] = e.target.value;
											updateFieldProp(selectedField.id, 'options', newOpts);
										}}
									/>
									<button
										type='button'
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
							type='button'
							className={styles.btnAddOption}
							onClick={() => {
								const newOpts = [...(selectedField.options || []), `Lựa chọn ${(selectedField.options?.length || 0) + 1}`];
								updateFieldProp(selectedField.id, 'options', newOpts);
							}}
						>
							+ Thêm tùy chọn
						</button>
					</div>
				)}

				<button type='button' className={styles.btnDeleteField} onClick={() => handleDeleteField(selectedField.id)}>
					<DeleteOutlined />
					Xóa trường này
				</button>
			</div>
		);
	};

	return (
		<div className={styles.builderLayout}>
			<header className={styles.header}>
				<button type='button' className={styles.btnBack} onClick={() => history.push('/forms')}>
					<ArrowLeftOutlined />
				</button>
				<div className={styles.titleCol}>
					<div className={styles.titleRow}>
						<input
							className={styles.nameInput}
							value={formName}
							onChange={(e) => setFormName(e.target.value)}
							placeholder='Tên biểu mẫu...'
							size={Math.max(formName.length, 10)}
						/>
						<EditOutlined className={styles.titleIcon} />
						{editId && <span className={styles.editBadge}>ĐANG CHỈNH SỬA</span>}
					</div>
					<input
						className={styles.descInput}
						value={formDescription}
						onChange={(e) => setFormDescription(e.target.value)}
						placeholder='Mô tả ngắn về biểu mẫu...'
					/>
				</div>
				<div className={styles.headerSpacer} />
				{editId && (
					<button type='button' className={styles.btnPreview} onClick={() => history.push(`/forms/${editId}`)}>
						<EyeOutlined /> Xem biểu mẫu
					</button>
				)}
				<button type='button' className={styles.btnSave} onClick={handleSave} disabled={isSaving || isLoading}>
					{isSaving ? 'Đang lưu...' : editId ? 'Cập nhật biểu mẫu' : 'Lưu biểu mẫu'}
				</button>
			</header>

			<DragDropContext onDragEnd={onDragEnd}>
				<main className={styles.mainContent}>
					<aside className={styles.toolbox}>
						<span className={styles.sectionLabel}>THÀNH PHẦN</span>
						<Droppable droppableId='toolbox' isDropDisabled>
							{(provided) => (
								<div className={styles.tileList} ref={provided.innerRef} {...provided.droppableProps}>
									{FIELD_TYPES.map((type, index) => (
										<Draggable key={type.type} draggableId={type.type} index={index}>
											{(dragProvided, dragSnapshot) => (
												<div
													ref={dragProvided.innerRef}
													{...dragProvided.draggableProps}
													{...dragProvided.dragHandleProps}
													className={`${styles.tile} ${dragSnapshot.isDragging ? styles.dragging : ''}`}
												>
													<span className={styles.tileIcon}>{type.icon}</span>
													<span className={styles.tileLabel}>{type.label}</span>
													<MoreOutlined className={styles.tileGrip} />
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</aside>

					<section className={styles.canvasArea} onClick={() => setSelectedFieldId(null)}>
						<Droppable droppableId='canvas'>
							{(provided, snapshot) => (
								<div
									className={`${styles.paper} ${styles[THEME_CLASS[themePreset]] || ''}`}
									ref={provided.innerRef}
									{...provided.droppableProps}
									onClick={(e) => e.stopPropagation()}
								>
									<div className={styles.formHead}>
										<h2>{formName || 'Tên biểu mẫu'}</h2>
										{formDescription && <p>{formDescription}</p>}
									</div>

									{fields.map((field, index) => (
										<Draggable key={field.id} draggableId={field.id} index={index}>
											{(dragProvided, dragSnapshot) => (
												<div
													ref={dragProvided.innerRef}
													{...dragProvided.draggableProps}
													{...dragProvided.dragHandleProps}
													className={`${styles.fieldCard} ${selectedFieldId === field.id ? styles.active : ''} ${
														dragSnapshot.isDragging ? styles.dragging : ''
													}`}
													onClick={(e) => {
														e.stopPropagation();
														selectField(field.id);
													}}
												>
													<div className={styles.fieldRow}>
														<span className={styles.fieldLabel}>{field.label}</span>
														{field.required && <span className={styles.requiredMark}>*</span>}
														<span className={styles.rowSpacer} />
														<button
															type='button'
															className={styles.fieldAction}
															title='Cấu hình'
															onClick={(e) => {
																e.stopPropagation();
																selectField(field.id);
															}}
														>
															<ControlOutlined />
														</button>
														<button
															type='button'
															className={styles.fieldAction}
															title='Nhân bản'
															onClick={(e) => handleCopyField(field, index, e)}
														>
															<CopyOutlined />
														</button>
														<button
															type='button'
															className={`${styles.fieldAction} ${styles.danger}`}
															title='Xóa'
															onClick={(e) => handleDeleteField(field.id, e)}
														>
															<DeleteOutlined />
														</button>
													</div>
													{renderFieldPreview(field)}
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}

									<div className={`${styles.dropGhost} ${snapshot.isDraggingOver ? styles.over : ''}`}>
										<PlusOutlined />
										<span>Thả thành phần vào đây</span>
									</div>
								</div>
							)}
						</Droppable>
					</section>

					<aside className={styles.propPanel}>
						<div className={styles.tabs}>
							{(
								[
									{ key: 'field', label: 'Thành phần' },
									{ key: 'theme', label: 'Giao diện' },
									{ key: 'settings', label: 'Cài đặt' },
								] as { key: RightTab; label: string }[]
							).map((t) => (
								<button
									type='button'
									key={t.key}
									className={`${styles.tab} ${rightTab === t.key ? styles.active : ''}`}
									onClick={() => setRightTab(t.key)}
								>
									{t.label}
								</button>
							))}
						</div>

						{rightTab === 'field' && renderFieldConfig()}

						{rightTab === 'theme' && (
							<div className={styles.panelBody}>
								<span className={styles.sectionLabel}>CHỦ ĐỀ BIỂU MẪU</span>
								{THEME_PRESETS.map((preset) => (
									<div
										key={preset.id}
										className={`${styles.themeRow} ${themePreset === preset.id ? styles.active : ''}`}
										onClick={() => setThemePreset(preset.id)}
									>
										<span className={styles.swatch} style={{ background: preset.swatch }} />
										<span className={styles.themeName}>{preset.label}</span>
										{themePreset === preset.id && <CheckCircleOutlined className={styles.themeCheck} />}
									</div>
								))}
							</div>
						)}

						{rightTab === 'settings' && (
							<div className={styles.panelBody}>
								<span className={styles.sectionLabel}>CÀI ĐẶT NÂNG CAO</span>
								<label className={styles.checkRow}>
									<input
										type='checkbox'
										hidden
										checked={allowAnonymous}
										onChange={(e) => setAllowAnonymous(e.target.checked)}
									/>
									<span className={`${styles.checkBox} ${allowAnonymous ? styles.checked : ''}`}>
										{allowAnonymous && <CheckOutlined />}
									</span>
									<span className={styles.checkLabel}>Cho phép nộp ẩn danh</span>
								</label>
								<label className={styles.checkRow}>
									<input type='checkbox' hidden checked={allowDraft} onChange={(e) => setAllowDraft(e.target.checked)} />
									<span className={`${styles.checkBox} ${allowDraft ? styles.checked : ''}`}>
										{allowDraft && <CheckOutlined />}
									</span>
									<span className={styles.checkLabel}>Cho phép lưu nháp</span>
								</label>
							</div>
						)}
					</aside>
				</main>
			</DragDropContext>
		</div>
	);
};

export default FormBuilder;
