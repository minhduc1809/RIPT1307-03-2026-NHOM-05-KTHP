import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CloseOutlined,
	CommentOutlined,
	DeleteOutlined,
	PlusOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { AutoComplete, Button, Checkbox, Input, message, Modal, Select } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { getActiveForms } from '@/services/Forms/formApi';
import type { IForm } from '@/services/Forms/typings';
import { createWorkflowDefinition } from '@/services/Workflows/workflowApi';
import type { IWorkflowConfig, IWorkflowTransition } from '@/services/Workflows/typings';
import styles from './index.less';

const SUGGESTED_ACTIONS = ['approve', 'reject', 'cancel', 'return_for_edit', 'resubmit'];
const ALL_ROLES = ['ADMIN', 'MANAGER', 'USER'];

const WorkflowBuilder: React.FC = () => {
	// ---- Basic Info ----
	const [workflowName, setWorkflowName] = useState('');
	const [selectedFormId, setSelectedFormId] = useState<string | undefined>(undefined);
	const [forms, setForms] = useState<IForm[]>([]);
	const [loadingForms, setLoadingForms] = useState(false);

	// ---- States ----
	const [states, setStates] = useState<string[]>([]);
	const [initialState, setInitialState] = useState<string | undefined>(undefined);
	const [finalStates, setFinalStates] = useState<string[]>([]);
	const [newStateName, setNewStateName] = useState('');

	// ---- Transitions ----
	const [transitions, setTransitions] = useState<IWorkflowTransition[]>([]);
	const [transitionModalOpen, setTransitionModalOpen] = useState(false);
	const [editFrom, setEditFrom] = useState<string | undefined>(undefined);
	const [editTo, setEditTo] = useState<string | undefined>(undefined);
	const [editAction, setEditAction] = useState<string>('');
	const [editRoles, setEditRoles] = useState<string[]>([]);
	const [editRequireComment, setEditRequireComment] = useState(false);

	// ---- Saving ----
	const [saving, setSaving] = useState(false);

	// ---- Load forms for linking ----
	useEffect(() => {
		const loadForms = async () => {
			setLoadingForms(true);
			try {
				const response = await getActiveForms();
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				setForms(Array.isArray(data) ? data : []);
			} catch {
				// Silently fail
			} finally {
				setLoadingForms(false);
			}
		};
		loadForms();
	}, []);

	// ---- State Management ----
	const addState = useCallback(() => {
		const name = newStateName.trim().toLowerCase().replace(/\s+/g, '_');
		if (!name) {
			message.warning('Vui lòng nhập tên trạng thái');
			return;
		}
		if (states.includes(name)) {
			message.warning('Trạng thái này đã tồn tại');
			return;
		}
		setStates((prev) => [...prev, name]);
		setNewStateName('');

		// Auto-set initial state if first state
		if (states.length === 0) {
			setInitialState(name);
		}
	}, [newStateName, states]);

	const removeState = useCallback(
		(stateName: string) => {
			// Check if state is used in transitions
			const isUsed = transitions.some(
				(t) =>
					t.to === stateName ||
					t.from === stateName ||
					(Array.isArray(t.from) && t.from.includes(stateName)),
			);
			if (isUsed) {
				message.error('Không thể xóa trạng thái đang được sử dụng trong transitions');
				return;
			}

			setStates((prev) => prev.filter((s) => s !== stateName));
			if (initialState === stateName) setInitialState(undefined);
			setFinalStates((prev) => prev.filter((s) => s !== stateName));
		},
		[transitions, initialState],
	);

	// ---- Transition Management ----
	const openTransitionModal = () => {
		setEditFrom(undefined);
		setEditTo(undefined);
		setEditAction('');
		setEditRoles([]);
		setEditRequireComment(false);
		setTransitionModalOpen(true);
	};

	const addTransition = () => {
		if (!editFrom) {
			message.warning('Vui lòng chọn trạng thái nguồn');
			return;
		}
		if (!editTo) {
			message.warning('Vui lòng chọn trạng thái đích');
			return;
		}
		const actionValue = editAction.trim().toLowerCase().replace(/\s+/g, '_');
		if (!actionValue) {
			message.warning('Vui lòng nhập tên action');
			return;
		}

		const newTransition: IWorkflowTransition = {
			from: editFrom,
			to: editTo,
			action: actionValue,
			...(editRoles.length > 0 && { roles: editRoles }),
			...(editRequireComment && { conditions: { requireComment: true } }),
		};

		setTransitions((prev) => [...prev, newTransition]);
		setTransitionModalOpen(false);
	};

	const removeTransition = (index: number) => {
		setTransitions((prev) => prev.filter((_, i) => i !== index));
	};

	// ---- Validation ----
	const validate = useCallback((): string | null => {
		if (!workflowName.trim()) return 'Vui lòng nhập tên workflow';
		if (states.length === 0) return 'Cần ít nhất 1 trạng thái';
		if (!initialState) return 'Vui lòng chọn trạng thái khởi tạo';
		if (!states.includes(initialState)) return 'Trạng thái khởi tạo không hợp lệ';
		if (finalStates.length === 0) return 'Cần ít nhất 1 trạng thái kết thúc';
		for (const fs of finalStates) {
			if (!states.includes(fs)) return `Trạng thái kết thúc "${fs}" không nằm trong danh sách states`;
		}
		if (transitions.length === 0) return 'Cần ít nhất 1 transition';
		for (const t of transitions) {
			const fromValue = typeof t.from === 'string' ? t.from : '';
			if (fromValue !== '*' && !states.includes(fromValue)) {
				return `Transition từ "${fromValue}" không hợp lệ`;
			}
			if (!states.includes(t.to)) {
				return `Transition đến "${t.to}" không hợp lệ`;
			}
		}
		return null;
	}, [workflowName, states, initialState, finalStates, transitions]);

	// ---- Submit ----
	const handleSave = async () => {
		const error = validate();
		if (error) {
			message.error(error);
			return;
		}

		const config: IWorkflowConfig = {
			states,
			initialState: initialState!,
			finalStates,
			transitions,
		};

		setSaving(true);
		try {
			await createWorkflowDefinition({
				name: workflowName.trim(),
				...(selectedFormId && { formId: selectedFormId }),
				config,
			});
			message.success('Tạo workflow thành công!');
			history.push('/workflows');
		} catch (err) {
			// Error is handled by axios interceptor
			console.error('Failed to create workflow:', err);
		} finally {
			setSaving(false);
		}
	};

	// ---- Preview data ----
	const orderedStates = useMemo(() => {
		if (states.length === 0) return [];
		// Put initial state first, then non-final, then final
		const init = initialState ? [initialState] : [];
		const middle = states.filter((s) => s !== initialState && !finalStates.includes(s));
		const final = finalStates.filter((s) => s !== initialState);
		return [...new Set([...init, ...middle, ...final])];
	}, [states, initialState, finalStates]);

	const stateOptions = useMemo(
		() => states.map((s) => ({ label: s, value: s })),
		[states],
	);

	const fromStateOptions = useMemo(
		() => [{ label: '* (tất cả)', value: '*' }, ...stateOptions],
		[stateOptions],
	);

	return (
		<div className={styles.builderPage}>
			{/* ===== HEADER ===== */}
			<div className={styles.builderHeader}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={() => history.push('/workflows')}>
						<ArrowLeftOutlined />
					</button>
					<div className={styles.headerInfo}>
						<h1>Tạo Workflow Mới</h1>
						<p>Thiết kế luồng phê duyệt cho biểu mẫu của bạn</p>
					</div>
				</div>
				<div className={styles.headerActions}>
					<Button
						type="primary"
						icon={<SaveOutlined />}
						className={styles.saveBtn}
						loading={saving}
						onClick={handleSave}
					>
						Lưu Workflow
					</Button>
				</div>
			</div>

			{/* ===== CONTENT ===== */}
			<div className={styles.builderContent}>
				{/* --- Section 1: Basic Info --- */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.info}`}>📝</div>
						<div className={styles.sectionTitle}>
							<h3>Thông tin cơ bản</h3>
							<p>Đặt tên và liên kết workflow với biểu mẫu</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						<div className={styles.formGroup}>
							<label>
								Tên Workflow <span className={styles.required}>*</span>
							</label>
							<Input
								placeholder="Ví dụ: Luồng phê duyệt đơn nghỉ phép"
								value={workflowName}
								onChange={(e) => setWorkflowName(e.target.value)}
								maxLength={100}
							/>
						</div>
						<div className={styles.formGroup}>
							<label>Liên kết với Biểu mẫu</label>
							<Select
								placeholder="Chọn biểu mẫu (không bắt buộc)"
								value={selectedFormId}
								onChange={setSelectedFormId}
								allowClear
								loading={loadingForms}
								style={{ width: '100%' }}
								options={forms.map((f) => ({ label: f.name, value: f.id }))}
								showSearch
								filterOption={(input, option) =>
									(option?.label as string)?.toLowerCase().includes(input.toLowerCase())
								}
							/>
						</div>
					</div>
				</div>

				{/* --- Section 2: States --- */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.states}`}>🔵</div>
						<div className={styles.sectionTitle}>
							<h3>Quản lý trạng thái</h3>
							<p>Thêm các bước trong luồng phê duyệt</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						{/* Add State */}
						<div className={styles.stateInputRow}>
							<div className={styles.stateInput}>
								<Input
									placeholder="Nhập tên trạng thái (ví dụ: pending_manager)"
									value={newStateName}
									onChange={(e) => setNewStateName(e.target.value)}
									onPressEnter={addState}
								/>
							</div>
							<button className={styles.addStateBtn} onClick={addState}>
								<PlusOutlined /> Thêm
							</button>
						</div>

						{/* States List */}
						{states.length === 0 ? (
							<div className={styles.emptyStates}>
								<span>📋</span>
								Chưa có trạng thái nào. Hãy thêm ít nhất 1 trạng thái.
							</div>
						) : (
							<div className={styles.statesList}>
								{states.map((s) => {
									const isInitial = initialState === s;
									const isFinal = finalStates.includes(s);
									let tagClass = styles.stateTag;
									if (isInitial && isFinal) tagClass += ` ${styles.initialFinal}`;
									else if (isInitial) tagClass += ` ${styles.initial}`;
									else if (isFinal) tagClass += ` ${styles.final}`;

									return (
										<span key={s} className={tagClass}>
											<span className={styles.stateLabel}>
												{s}
												{isInitial && (
													<span className={`${styles.badge} ${styles.initialBadge}`}>
														Bắt đầu
													</span>
												)}
												{isFinal && (
													<span className={`${styles.badge} ${styles.finalBadge}`}>
														Kết thúc
													</span>
												)}
											</span>
											<button
												className={styles.removeState}
												onClick={() => removeState(s)}
												title="Xóa trạng thái"
											>
												<CloseOutlined />
											</button>
										</span>
									);
								})}
							</div>
						)}

						{/* Initial / Final config */}
						{states.length > 0 && (
							<div className={styles.stateConfigRow}>
								<div className={styles.formGroup}>
									<label>
										Trạng thái khởi tạo <span className={styles.required}>*</span>
									</label>
									<Select
										placeholder="Chọn trạng thái bắt đầu"
										value={initialState}
										onChange={setInitialState}
										style={{ width: '100%' }}
										options={stateOptions}
									/>
								</div>
								<div className={styles.formGroup}>
									<label>
										Trạng thái kết thúc <span className={styles.required}>*</span>
									</label>
									<Select
										mode="multiple"
										placeholder="Chọn trạng thái kết thúc"
										value={finalStates}
										onChange={setFinalStates}
										style={{ width: '100%' }}
										options={stateOptions}
									/>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* --- Section 3: Transitions --- */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.transitions}`}>🔀</div>
						<div className={styles.sectionTitle}>
							<h3>Quản lý chuyển trạng thái</h3>
							<p>Thiết lập các bước chuyển đổi giữa các trạng thái</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						<Button
							type="dashed"
							block
							size="large"
							icon={<PlusOutlined />}
							onClick={() => {
								setEditFrom(undefined);
								setEditTo(undefined);
								setEditAction('');
								setEditRoles([]);
								setEditRequireComment(false);
								setTransitionModalOpen(true);
							}}
							disabled={states.length < 2}
							style={{
								height: 48,
								borderRadius: 12,
								fontWeight: 600,
								fontSize: 14,
								marginBottom: 16,
							}}
						>
							Thêm Transition
						</Button>

						{transitions.length === 0 ? (
							<div className={styles.emptyTransitions}>
								<span>🔗</span>
								{states.length < 2
									? 'Cần ít nhất 2 trạng thái để tạo transition'
									: 'Chưa có transition nào. Nhấn nút trên để thêm.'}
							</div>
						) : (
							<div className={styles.transitionsList}>
								{transitions.map((t, idx) => {
									const fromLabel =
										typeof t.from === 'string'
											? t.from === '*'
												? '* (tất cả)'
												: t.from
											: (t.from as string[]).join(', ');

									return (
										<div key={idx} className={styles.transitionCard}>
											<div className={styles.transitionFlow}>
												<span
													className={`${styles.stateChip} ${
														t.from === '*' ? styles.wildcard : styles.from
													}`}
												>
													{fromLabel}
												</span>
												<span className={styles.arrow}>
													<ArrowRightOutlined />
												</span>
												<span className={`${styles.stateChip} ${styles.to}`}>
													{t.to}
												</span>
												<span className={styles.actionName}>{t.action}</span>
											</div>
											<div className={styles.transitionMeta}>
												{t.roles?.map((r) => (
													<span key={r} className={styles.roleChip}>
														{r}
													</span>
												))}
												{t.conditions?.requireComment && (
													<span className={styles.commentBadge}>
														<CommentOutlined /> bắt buộc
													</span>
												)}
												<button
													className={styles.removeTransition}
													onClick={() => removeTransition(idx)}
													title="Xóa transition"
												>
													<DeleteOutlined />
												</button>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>

				{/* --- Section 4: Preview --- */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.preview}`}>👁️</div>
						<div className={styles.sectionTitle}>
							<h3>Xem trước luồng</h3>
							<p>Sơ đồ tổng quan các trạng thái trong workflow</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						{orderedStates.length === 0 ? (
							<div className={styles.emptyPreview}>
								Thêm trạng thái để xem sơ đồ luồng workflow
							</div>
						) : (
							<div className={styles.previewContainer}>
								<div className={styles.previewFlow}>
									{orderedStates.map((s, idx) => {
										const isInit = s === initialState;
										const isFin = finalStates.includes(s);
										let nodeClass = styles.normal;
										if (isInit) nodeClass = styles.initial;
										else if (isFin) nodeClass = styles.final;

										return (
											<React.Fragment key={s}>
												{idx > 0 && (
													<div className={styles.previewArrow}>
														<ArrowRightOutlined />
													</div>
												)}
												<div className={styles.previewNode}>
													<div className={`${styles.nodeDot} ${nodeClass}`}>
														{isInit ? '▶' : isFin ? '■' : '●'}
													</div>
													<div className={styles.nodeName}>{s}</div>
												</div>
											</React.Fragment>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* ===== TRANSITION MODAL ===== */}
			<Modal
				title="Thêm Transition"
				visible={transitionModalOpen}
				onCancel={() => setTransitionModalOpen(false)}
				onOk={addTransition}
				okText="Thêm"
				cancelText="Hủy"
				width={520}
				destroyOnClose
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
					<div>
						<label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#475569', marginBottom: 8 }}>
							Từ trạng thái <span style={{ color: '#ef4444' }}>*</span>
						</label>
						<Select
							placeholder="Chọn trạng thái nguồn"
							value={editFrom}
							onChange={setEditFrom}
							style={{ width: '100%' }}
							options={fromStateOptions}
						/>
					</div>

					<div>
						<label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#475569', marginBottom: 8 }}>
							Đến trạng thái <span style={{ color: '#ef4444' }}>*</span>
						</label>
						<Select
							placeholder="Chọn trạng thái đích"
							value={editTo}
							onChange={setEditTo}
							style={{ width: '100%' }}
							options={stateOptions}
						/>
					</div>

					<div>
						<label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#475569', marginBottom: 8 }}>
							Action <span style={{ color: '#ef4444' }}>*</span>
						</label>
						<AutoComplete
							placeholder="Chọn hoặc nhập tên action"
							value={editAction || undefined}
							onChange={(val) => setEditAction(val || '')}
							style={{ width: '100%' }}
							options={SUGGESTED_ACTIONS.map((a) => ({ label: a, value: a }))}
							filterOption={(input, option) =>
								(option?.value as string)?.toLowerCase().includes(input.toLowerCase())
							}
						/>
					</div>

					<div>
						<label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#475569', marginBottom: 8 }}>
							Roles được phép
						</label>
						<Select
							mode="multiple"
							placeholder="Chọn roles (để trống = tất cả)"
							value={editRoles}
							onChange={setEditRoles}
							style={{ width: '100%' }}
							options={ALL_ROLES.map((r) => ({ label: r, value: r }))}
						/>
					</div>

					<div>
						<Checkbox
							checked={editRequireComment}
							onChange={(e) => setEditRequireComment(e.target.checked)}
						>
							Yêu cầu ghi chú (comment) khi thực hiện action
						</Checkbox>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default WorkflowBuilder;
