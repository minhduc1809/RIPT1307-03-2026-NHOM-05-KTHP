import React, { useEffect, useState } from 'react';
import { history, useLocation } from 'umi';
import { message } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult, DragStart, DragUpdate } from 'react-beautiful-dnd';
import {
	FontSizeOutlined,
	NumberOutlined,
	CalendarOutlined,
	UnorderedListOutlined,
	CopyOutlined,
	DeleteOutlined,
	PlusCircleOutlined,
	ControlOutlined,
	DownOutlined,
	MinusCircleOutlined,
	SelectOutlined,
	LockOutlined,
	GlobalOutlined,
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
	{ id: 'default', label: 'Mặc định (Sáng)', color: '#f7f9fb', cardColor: '#ffffff', textColor: '#2a3439' },
	{ id: 'dark', label: 'Tối giản (Dark)', color: '#0f172a', cardColor: '#1e293b', textColor: '#f8fafc' },
	{ id: 'mint', label: 'Mùa xuân (Mint)', color: '#ccfbf1', cardColor: '#ffffff', textColor: '#065f46' },
	{ id: 'sunset', label: 'Hoàng hôn (Rose)', color: '#fee2e2', cardColor: '#ffffff', textColor: '#7f1d1d' },
	{ id: 'violet', label: 'Hiện đại (Violet)', color: '#f3e8ff', cardColor: '#ffffff', textColor: '#3b0764' },
] as const;

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

const FormBuilder: React.FC = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const editId = queryParams.get('id');

	const [formName, setFormName] = useState('Đăng ký thông tin mới');
	const [formDescription, setFormDescription] = useState('Vui lòng điền đầy đủ các thông tin bên dưới để tiếp tục.');
	const [fields, setFields] = useState<IBuilderField[]>([]);
	const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
	const [themePreset, setThemePreset] = useState<'default' | 'dark' | 'mint' | 'sunset' | 'violet'>('default');
	const [allowAnonymous, setAllowAnonymous] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [originalFormId, setOriginalFormId] = useState<string | undefined>(undefined);

	// Load existing form data when editing
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

					// Load settings
					if (form.settings) {
						setAllowAnonymous(form.settings.allowAnonymous ?? false);
						if (form.settings.theme && ['default', 'dark', 'mint', 'sunset', 'violet'].includes(form.settings.theme)) {
							setThemePreset(form.settings.theme);
						}
					}

					// Map schema fields to builder fields
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

	// Track what's being dragged for inline ghost preview
	const onDragStart = (start: DragStart) => {
		// Drag start logic if needed
	};

	const onDragUpdate = (update: DragUpdate) => {
		// Drag update logic if needed
	};

	const onDragEnd = (result: DropResult) => {
		const { source, destination } = result;

		// Dropped outside a valid droppable area
		if (!destination) return;

		// Reordering within the canvas
		if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
			const newFields = Array.from(fields);
			const [movedItem] = newFields.splice(source.index, 1);
			newFields.splice(destination.index, 0, movedItem);
			setFields(newFields);
			return;
		}

		// Dragging from toolbox to canvas
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
		}
	};

	// Field Actions
	const handleDeleteField = (id: string, e?: React.MouseEvent) => {
		if (e) e.stopPropagation();
		setFields(fields.filter((f) => f.id !== id));
		if (selectedFieldId === id) setSelectedFieldId(null);
	};

	const handleCopyField = (field: IBuilderField, index: number, e: React.MouseEvent) => {
		e.stopPropagation();
		const newId = generateId();
		const clonedField: IBuilderField = {
			...field,
			id: newId,
			key: `${field.key}_copy`,
		};
		const newFields = Array.from(fields);
		newFields.splice(index + 1, 0, clonedField);
		setFields(newFields);
		setSelectedFieldId(newId);
	};

	// Update Field Properties
	const updateFieldProp = (id: string, key: keyof IBuilderField, value: any) => {
		setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
	};

	// Save Logic
	const handleSave = async () => {
		if (!formName.trim()) {
			message.warning('Vui lòng nhập tên biểu mẫu');
			return;
		}

		setIsSaving(true);
		try {
			// Map internal builder fields to the IFormSchema format
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
				settings: { allowAnonymous, theme: themePreset },
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

	// Rendering Helpers
	const renderFieldPreview = (field: IBuilderField) => {
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
							className={`${styles.fieldInputPreview} ${isOpen ? styles.active : ''}`}
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
			default:
				return null;
		}
	};

	return (
		<div className={styles.builderLayout}>
			{/* Top Header */}
			<header className={styles.header}>
				<div className={styles.headerLeft}>
					<span className={styles.logo}>{editId ? 'Chỉnh sửa biểu mẫu' : 'Tạo biểu mẫu mới'}</span>
					{!editId && <span className={styles.editBadge}>Đang tạo</span>}
				</div>
				<div className={styles.headerRight}>
					<div className={styles.actions}>
						<button className={styles.btnBack} onClick={() => history.push('/forms')}>
							Quay lại
						</button>
						<button className={styles.btnSave} onClick={handleSave} disabled={isSaving || isLoading}>
							{isSaving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Lưu'}
						</button>
					</div>
				</div>
			</header>

			<DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
				<main className={styles.mainContent}>
					{/* Left Sidebar */}
					<aside className={styles.sidebarLeft}>
						<div className={styles.sidebarTitle}>
							<h2>Thông tin biểu mẫu</h2>
							<p>Nhập tên, mô tả và thêm các trường</p>
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
							<Droppable droppableId='toolbox' isDropDisabled={true}>
								{(provided) => (
									<div className={styles.fieldTypeGrid} ref={provided.innerRef} {...provided.droppableProps}>
										{FIELD_TYPES.map((type, index) => (
											<Draggable key={type.type} draggableId={type.type} index={index}>
												{(dragProvided, dragSnapshot) => (
													<div
														ref={dragProvided.innerRef}
														{...dragProvided.draggableProps}
														{...dragProvided.dragHandleProps}
														className={`${styles.fieldTypeCard} ${dragSnapshot.isDragging ? styles.fieldTypeDragging : ''}`}
													>
														<div className={`${styles.ftIcon} ${styles[type.type]}`}>{type.icon}</div>
														<span className={styles.ftLabel}>{type.label}</span>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>

						{/* Settings */}
						<div className={styles.addFieldSection}>
							<h3>Cài đặt</h3>
							<div className={styles.settingCard}>
								<div className={styles.settingInfo}>
									<div className={styles.settingIcon}>
										{allowAnonymous ? <GlobalOutlined /> : <LockOutlined />}
									</div>
									<div>
										<div className={styles.settingLabel}>Gửi ẩn danh</div>
										<div className={styles.settingDesc}>Không cần đăng nhập</div>
									</div>
								</div>
								<label className={styles.settingToggle}>
									<input
										type='checkbox'
										checked={allowAnonymous}
										onChange={(e) => setAllowAnonymous(e.target.checked)}
									/>
									<div className={`${styles.toggleTrack} ${allowAnonymous ? styles.checked : ''}`} />
									<div className={`${styles.toggleThumb} ${allowAnonymous ? styles.checked : ''}`} />
								</label>
							</div>
						</div>

						{/* Theme */}
						<div className={styles.addFieldSection}>
							<h3>Giao diện</h3>
							<div className={styles.themeGrid}>
								{THEME_PRESETS.map((preset) => (
									<div
										key={preset.id}
										className={`${styles.themeChip} ${themePreset === preset.id ? styles.activeTheme : ''}`}
										onClick={() => setThemePreset(preset.id)}
									>
										<div
											className={styles.themeColor}
											style={{ background: preset.color === '#f7f9fb' ? '#e2e8f0' : preset.color }}
										>
											<span style={{ color: preset.textColor, fontSize: 11, fontWeight: 700 }}>Aa</span>
										</div>
										<span>{preset.label.split(' ')[0]}</span>
									</div>
								))}
							</div>
						</div>
					</aside>

					{/* Middle Canvas */}
					<section
						className={`${styles.canvasArea} ${styles[`theme_${themePreset}`]}`}
						onClick={() => setSelectedFieldId(null)}
					>
						<div className={styles.canvasContainer} onClick={(e) => e.stopPropagation()}>
							<div className={styles.formHeader}>
								<h2 className={styles.formTitleDisplay}>{formName || 'Tên biểu mẫu'}</h2>
								{formDescription && <p className={styles.formDescDisplay}>{formDescription}</p>}
							</div>

							<Droppable droppableId='canvas'>
								{(provided, snapshot) => (
									<div
										className={`${styles.dropZone} ${snapshot.isDraggingOver ? styles.dropZoneActive : ''}`}
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{fields.map((field, index) => {
											return (
												<React.Fragment key={field.id}>
													<Draggable draggableId={field.id} index={index}>
														{(dragProvided, dragSnapshot) => (
															<div
																ref={dragProvided.innerRef}
																{...dragProvided.draggableProps}
																{...dragProvided.dragHandleProps}
																className={`${styles.formFieldItem} ${selectedFieldId === field.id ? styles.active : ''} ${dragSnapshot.isDragging ? styles.dragging : ''}`}
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
														)}
													</Draggable>
												</React.Fragment>
											);
										})}
										{provided.placeholder}


										{fields.length === 0 && !snapshot.isDraggingOver && (
											<div className={styles.dropPlaceholder}>
												<PlusCircleOutlined className={styles.icon} />
												<span className={styles.text}>Kéo thả thành phần từ bên trái vào đây</span>
											</div>
										)}
									</div>
								)}
							</Droppable>
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

									<div className={styles.propSwitch}>
										<div className={styles.switchText}>
											<span>Bắt buộc nhập</span>
											<p>Người dùng phải điền trường này</p>
										</div>
										<label className={styles.toggleWrapper}>
											<input
												type='checkbox'
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
													type='number'
													className={styles.propInput}
													value={selectedField.minLength ?? ''}
													onChange={(e) =>
														updateFieldProp(
															selectedField.id,
															'minLength',
															e.target.value ? Number(e.target.value) : undefined,
														)
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
														updateFieldProp(
															selectedField.id,
															'maxLength',
															e.target.value ? Number(e.target.value) : undefined,
														)
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
														updateFieldProp(
															selectedField.id,
															'min',
															e.target.value ? Number(e.target.value) : undefined,
														)
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
														updateFieldProp(
															selectedField.id,
															'max',
															e.target.value ? Number(e.target.value) : undefined,
														)
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
										<div className={styles.propOptions}>
											<label>Tùy chọn danh sách</label>
											<div className={styles.optionsList}>
												{selectedField.options?.map((opt, optIdx) => (
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
			</DragDropContext>
		</div>
	);
};

export default FormBuilder;
