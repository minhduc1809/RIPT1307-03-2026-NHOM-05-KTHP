import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	DownOutlined,
	EditOutlined,
	EyeOutlined,
	ForkOutlined,
	FormOutlined,
	OrderedListOutlined,
	PlusOutlined,
	RollbackOutlined,
	SaveOutlined,
	TeamOutlined,
	UpOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Input, InputNumber, message, Select, Tag, Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { getActiveForms } from '@/services/Forms/formApi';
import type { IForm } from '@/services/Forms/typings';
import { createWorkflowDefinition } from '@/services/Workflows/workflowApi';
import type { IWorkflowConfig, IWorkflowTransition } from '@/services/Workflows/typings';
import WorkflowTree from '@/components/WorkflowTree';
import styles from './index.less';

const ALL_ROLES = ['ADMIN', 'MANAGER', 'HR', 'USER'];
const ROLE_LABELS: Record<string, string> = {
	ADMIN: 'Quản trị viên',
	MANAGER: 'Quản lý',
	HR: 'Nhân sự',
	USER: 'Nhân viên',
};

type StageType = 'sequential' | 'parallel' | 'voting';

interface WorkflowStage {
	id: string;
	type: StageType;
	role?: string;
	requireCommentOnReject?: boolean;
	canReturn?: boolean;
	requireCommentOnReturn?: boolean;
	parallelRoles?: string[];
	voterRole?: string;
	approveThreshold?: number;
	rejectThreshold?: number;
}

const TYPE_META: Record<StageType, { label: string; color: string; icon: React.ReactNode; desc: string }> = {
	sequential: { label: 'Tuần tự', color: 'blue', icon: <OrderedListOutlined />, desc: 'Một người duyệt' },
	parallel: { label: 'Song song', color: 'cyan', icon: <ForkOutlined />, desc: 'Nhiều người duyệt đồng thời' },
	voting: { label: 'Bỏ phiếu', color: 'purple', icon: <TeamOutlined />, desc: 'Đạt ngưỡng phiếu' },
};

let stageCounter = 0;
function createStage(type: StageType): WorkflowStage {
	stageCounter++;
	return {
		id: `stage_${stageCounter}_${Date.now()}`,
		type,
		role: 'MANAGER',
		requireCommentOnReject: true,
		canReturn: false,
		requireCommentOnReturn: false,
		parallelRoles: ['MANAGER', 'HR'],
		voterRole: 'MANAGER',
		approveThreshold: 2,
		rejectThreshold: 2,
	};
}

function getStateName(idx: number, stage: WorkflowStage): string {
	if (stage.type === 'voting') return `stage_${idx + 1}_voting`;
	if (stage.type === 'parallel') return `stage_${idx + 1}_parallel`;
	return `stage_${idx + 1}`;
}

function getStageLabel(idx: number, stage: WorkflowStage): string {
	if (stage.type === 'sequential') return ROLE_LABELS[stage.role || 'MANAGER'] || stage.role || 'Duyệt';
	if (stage.type === 'parallel') return (stage.parallelRoles || []).map((r) => ROLE_LABELS[r] || r).join(' + ');
	if (stage.type === 'voting') return `${ROLE_LABELS[stage.voterRole || 'MANAGER']} bỏ phiếu`;
	return `Bước ${idx + 1}`;
}

function buildMixedConfig(stages: WorkflowStage[]): IWorkflowConfig {
	const states: string[] = [];
	const transitions: IWorkflowTransition[] = [];
	const hasReturn = stages.some((s) => s.type === 'sequential' && s.canReturn);

	stages.forEach((stage, idx) => {
		states.push(getStateName(idx, stage));
	});
	states.push('approved', 'rejected');
	if (hasReturn) states.push('returned');

	const finalStates = ['approved', 'rejected'];
	if (hasReturn) finalStates.push('returned');

	const statesDetails: Record<string, any> = {};

	stages.forEach((stage, idx) => {
		const fromState = getStateName(idx, stage);
		const nextState = idx < stages.length - 1 ? getStateName(idx + 1, stages[idx + 1]) : 'approved';

		if (stage.type === 'sequential') {
			transitions.push({ from: fromState, to: nextState, action: 'approve', roles: [stage.role || 'MANAGER'] });
			transitions.push({
				from: fromState, to: 'rejected', action: 'reject', roles: [stage.role || 'MANAGER'],
				...(stage.requireCommentOnReject && { conditions: { requireComment: true } }),
			});
			if (stage.canReturn) {
				transitions.push({
					from: fromState, to: 'returned', action: 'return_for_edit', roles: [stage.role || 'MANAGER'],
					...(stage.requireCommentOnReturn && { conditions: { requireComment: true } }),
				});
			}
		} else if (stage.type === 'parallel') {
			const roles = stage.parallelRoles || ['MANAGER', 'HR'];
			const requireActions = roles.map((r) => `approve_${r.toLowerCase()}`);
			transitions.push({
				from: fromState, to: nextState, action: requireActions[0], roles,
				type: 'PARALLEL_JOIN', requireActions,
			});
			roles.forEach((role) => {
				transitions.push({ from: fromState, to: 'rejected', action: 'reject', roles: [role], conditions: { requireComment: true } });
			});
			statesDetails[fromState] = { slaHours: 72 };
		} else if (stage.type === 'voting') {
			const voterRole = stage.voterRole || 'MANAGER';
			transitions.push({
				from: fromState, to: nextState, action: 'vote_approve', roles: [voterRole],
				type: 'VOTING',
				votingConfig: {
					approveAction: 'vote_approve', rejectAction: 'vote_reject',
					approveThreshold: stage.approveThreshold || 2,
					rejectThreshold: stage.rejectThreshold || 2,
					approveTarget: nextState, rejectTarget: 'rejected',
				},
			});
			statesDetails[fromState] = { slaHours: 48 };
		}
	});

	return {
		states,
		initialState: getStateName(0, stages[0]),
		finalStates,
		transitions,
		...(Object.keys(statesDetails).length > 0 && { statesDetails }),
	};
}

// ---- Parse existing config back into stages ----
export function parseConfigToStages(config: IWorkflowConfig): WorkflowStage[] | null {
	if (!config?.initialState || !config?.transitions?.length) return null;

	const stages: WorkflowStage[] = [];
	let current = config.initialState;
	const visited = new Set<string>();

	while (current && !visited.has(current)) {
		visited.add(current);
		if (config.finalStates?.includes(current)) break;

		const fromTs = config.transitions.filter((t) =>
			typeof t.from === 'string' ? t.from === current : Array.isArray(t.from) ? t.from.includes(current) : false,
		);
		if (fromTs.length === 0) break;

		const votingT = fromTs.find((t) => t.type === 'VOTING');
		const parallelT = fromTs.find((t) => t.type === 'PARALLEL_JOIN');
		const approveT = fromTs.find((t) => t.action === 'approve');
		const rejectT = fromTs.find((t) => t.action === 'reject');
		const returnT = fromTs.find((t) => t.action === 'return_for_edit');

		if (votingT) {
			const vc = votingT.votingConfig;
			stages.push(createStageFromParsed('voting', {
				voterRole: votingT.roles?.[0] || 'MANAGER',
				approveThreshold: vc?.approveThreshold ?? 2,
				rejectThreshold: vc?.rejectThreshold ?? 2,
			}));
			current = vc?.approveTarget || votingT.to;
		} else if (parallelT) {
			stages.push(createStageFromParsed('parallel', {
				parallelRoles: parallelT.roles || ['MANAGER', 'HR'],
			}));
			current = parallelT.to;
		} else if (approveT) {
			stages.push(createStageFromParsed('sequential', {
				role: approveT.roles?.[0] || 'MANAGER',
				requireCommentOnReject: !!rejectT?.conditions?.requireComment,
				canReturn: !!returnT,
				requireCommentOnReturn: !!returnT?.conditions?.requireComment,
			}));
			current = approveT.to;
		} else {
			break;
		}
	}

	return stages.length > 0 ? stages : null;
}

function createStageFromParsed(type: StageType, overrides: Partial<WorkflowStage>): WorkflowStage {
	return { ...createStage(type), ...overrides };
}

// ============================
// COMPONENT
// ============================
const WorkflowBuilder: React.FC = () => {
	const [workflowName, setWorkflowName] = useState('');
	const [selectedFormId, setSelectedFormId] = useState<string | undefined>(undefined);
	const [forms, setForms] = useState<IForm[]>([]);
	const [loadingForms, setLoadingForms] = useState(false);
	const [saving, setSaving] = useState(false);
	const [stages, setStages] = useState<WorkflowStage[]>([createStage('sequential')]);

	useEffect(() => {
		(async () => {
			setLoadingForms(true);
			try {
				const response = await getActiveForms();
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				setForms(Array.isArray(data) ? data : []);
			} catch { /* */ } finally { setLoadingForms(false); }
		})();
	}, []);

	// Stage operations
	const addStage = (type: StageType) => {
		setStages((prev) => [...prev, createStage(type)]);
	};

	const removeStage = (idx: number) => {
		if (stages.length <= 1) { message.warning('Cần ít nhất 1 bước'); return; }
		setStages((prev) => prev.filter((_, i) => i !== idx));
	};

	const updateStage = (idx: number, patch: Partial<WorkflowStage>) => {
		setStages((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
	};

	const moveStage = (idx: number, dir: -1 | 1) => {
		const target = idx + dir;
		if (target < 0 || target >= stages.length) return;
		setStages((prev) => { const arr = [...prev]; [arr[idx], arr[target]] = [arr[target], arr[idx]]; return arr; });
	};

	const changeStageType = (idx: number, newType: StageType) => {
		setStages((prev) => prev.map((s, i) => (i === idx ? { ...s, type: newType } : s)));
	};

	// Validation
	const validate = (): string | null => {
		if (!workflowName.trim()) return 'Vui lòng nhập tên workflow';
		if (stages.length === 0) return 'Cần ít nhất 1 bước duyệt';
		for (let i = 0; i < stages.length; i++) {
			const s = stages[i];
			if (s.type === 'parallel' && (!s.parallelRoles || s.parallelRoles.length < 2)) return `Bước ${i + 1}: Cần ít nhất 2 vai trò duyệt song song`;
			if (s.type === 'voting' && (!s.approveThreshold || s.approveThreshold < 1)) return `Bước ${i + 1}: Ngưỡng đồng ý phải >= 1`;
		}
		return null;
	};

	const handleSave = async () => {
		const error = validate();
		if (error) { message.error(error); return; }

		const config = buildMixedConfig(stages);
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
			console.error('Failed to create workflow:', err);
		} finally { setSaving(false); }
	};

	// Preview data for WorkflowTree (mixed mode)
	const mixedStages = useMemo(() => {
		return stages.map((s) => ({
			type: s.type,
			role: s.role,
			parallelRoles: s.parallelRoles,
			voterRole: s.voterRole,
			approveThreshold: s.approveThreshold,
			rejectThreshold: s.rejectThreshold,
			canReject: true,
			canReturn: s.type === 'sequential' && !!s.canReturn,
		}));
	}, [stages]);

	// ---- RENDER ----
	return (
		<div className={styles.builderPage}>
			{/* Header */}
			<div className={styles.builderHeader}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={() => history.push('/workflows')}><ArrowLeftOutlined /></button>
					<div className={styles.headerInfo}>
						<h1>Tạo Workflow Mới</h1>
						<p>Thiết kế luồng phê duyệt hỗn hợp cho biểu mẫu</p>
					</div>
				</div>
				<div className={styles.headerActions}>
					<Button type="primary" icon={<SaveOutlined />} className={styles.saveBtn} loading={saving} onClick={handleSave}>
						Lưu Workflow
					</Button>
				</div>
			</div>

			<div className={styles.builderContent}>
				{/* Section 1: Basic Info */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.info}`}><FormOutlined /></div>
						<div className={styles.sectionTitle}>
							<h3>Thông tin cơ bản</h3>
							<p>Đặt tên và liên kết workflow với biểu mẫu</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						<div className={styles.formGroup}>
							<label>Tên Workflow <span className={styles.required}>*</span></label>
							<Input placeholder="Ví dụ: Luồng phê duyệt đơn nghỉ phép" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} maxLength={100} />
						</div>
						<div className={styles.formGroup}>
							<label>Liên kết với Biểu mẫu</label>
							<Select placeholder="Chọn biểu mẫu (không bắt buộc)" value={selectedFormId} onChange={setSelectedFormId} allowClear loading={loadingForms} style={{ width: '100%' }}
								options={forms.map((f) => ({ label: f.name, value: f.id }))} showSearch filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())} />
						</div>
					</div>
				</div>

				{/* Section 2: Stages */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.steps}`}><TeamOutlined /></div>
						<div className={styles.sectionTitle}>
							<h3>Các bước phê duyệt</h3>
							<p>Thêm các bước duyệt theo thứ tự. Mỗi bước có thể chọn kiểu duyệt khác nhau.</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						<div className={styles.stagesList}>
							{stages.map((stage, idx) => {
								const meta = TYPE_META[stage.type];
								const isLast = idx === stages.length - 1;
								return (
									<React.Fragment key={stage.id}>
										<div className={styles.stageCard}>
											{/* Stage header */}
											<div className={styles.stageHeader}>
												<div className={styles.stageBadge}>
													<div className={styles.stageNumber}>{idx + 1}</div>
													<Tag color={meta.color} icon={meta.icon} style={{ margin: 0, borderRadius: 6, fontWeight: 600 }}>
														{meta.label}
													</Tag>
													<span className={styles.stageLabel}>{getStageLabel(idx, stage)}</span>
												</div>
												<div className={styles.stepActions}>
													<button onClick={() => moveStage(idx, -1)} disabled={idx === 0} title="Di lên"><UpOutlined /></button>
													<button onClick={() => moveStage(idx, 1)} disabled={isLast} title="Di xuống"><DownOutlined /></button>
													<button className={styles.deleteBtn} onClick={() => removeStage(idx)} title="Xóa bước"><DeleteOutlined /></button>
												</div>
											</div>

											{/* Type selector */}
											<div className={styles.typeRow}>
												{(['sequential', 'parallel', 'voting'] as StageType[]).map((t) => (
													<button
														key={t}
														className={`${styles.typePill} ${stage.type === t ? styles.active : ''}`}
														onClick={() => changeStageType(idx, t)}
													>
														{TYPE_META[t].icon} {TYPE_META[t].label}
													</button>
												))}
											</div>

											{/* Type-specific config */}
											<div className={styles.stageBody}>
												{stage.type === 'sequential' && (
													<>
														<div className={styles.stageRow}>
															<div className={styles.stageField}>
																<label>Người duyệt <span style={{ color: '#ef4444' }}>*</span></label>
																<Select value={stage.role} onChange={(val) => updateStage(idx, { role: val })} style={{ width: '100%' }}
																	options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))} />
															</div>
															<div className={styles.stageField}>
																<label>Bước tiếp theo</label>
																<Input disabled value={isLast ? 'Phê duyệt hoàn tất' : `Bước ${idx + 2}: ${getStageLabel(idx + 1, stages[idx + 1])}`} />
															</div>
														</div>
														<div className={styles.stagePerms}>
															<div className={`${styles.permChip} ${styles.always}`}><CheckCircleOutlined /> Phê duyệt</div>
															<div className={`${styles.permChip} ${styles.always}`}><CloseCircleOutlined /> Từ chối</div>
															<div className={`${styles.permChip} ${stage.requireCommentOnReject ? styles.active : ''}`} onClick={() => updateStage(idx, { requireCommentOnReject: !stage.requireCommentOnReject })}>
																<Checkbox checked={stage.requireCommentOnReject} /> Ghi chú khi từ chối
															</div>
															<div className={`${styles.permChip} ${stage.canReturn ? styles.active : ''}`} onClick={() => updateStage(idx, { canReturn: !stage.canReturn, ...(!stage.canReturn ? {} : { requireCommentOnReturn: false }) })}>
																<Checkbox checked={stage.canReturn} /> Trả lại để sửa
															</div>
															{stage.canReturn && (
																<div className={`${styles.permChip} ${stage.requireCommentOnReturn ? styles.active : ''}`} onClick={() => updateStage(idx, { requireCommentOnReturn: !stage.requireCommentOnReturn })}>
																	<Checkbox checked={stage.requireCommentOnReturn} /> Ghi chú khi trả lại
																</div>
															)}
														</div>
													</>
												)}

												{stage.type === 'parallel' && (
													<div className={styles.stageRow}>
														<div className={styles.stageField} style={{ gridColumn: '1 / -1' }}>
															<label>Các vai trò duyệt đồng thời <span style={{ color: '#ef4444' }}>*</span></label>
															<Select mode="multiple" value={stage.parallelRoles} onChange={(roles) => updateStage(idx, { parallelRoles: roles })} style={{ width: '100%' }}
																options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))} />
															<p className={styles.fieldHint}>
																Tất cả {(stage.parallelRoles || []).length} vai trò phải duyệt. Bất kỳ ai từ chối = kết thúc.
															</p>
														</div>
													</div>
												)}

												{stage.type === 'voting' && (
													<div className={styles.stageRow}>
														<div className={styles.stageField}>
															<label>Vai trò bỏ phiếu <span style={{ color: '#ef4444' }}>*</span></label>
															<Select value={stage.voterRole} onChange={(v) => updateStage(idx, { voterRole: v })} style={{ width: '100%' }}
																options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))} />
														</div>
														<div className={styles.stageField}>
															<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
																<div>
																	<label>Ngưỡng đồng ý <span style={{ color: '#ef4444' }}>*</span></label>
																	<InputNumber min={1} max={99} value={stage.approveThreshold} onChange={(v) => updateStage(idx, { approveThreshold: v ?? 2 })} style={{ width: '100%' }} />
																</div>
																<div>
																	<label>Ngưỡng từ chối</label>
																	<InputNumber min={1} max={99} value={stage.rejectThreshold} onChange={(v) => updateStage(idx, { rejectThreshold: v ?? 2 })} style={{ width: '100%' }} />
																</div>
															</div>
														</div>
													</div>
												)}
											</div>
										</div>

										{/* Arrow between stages */}
										{!isLast && (
											<div className={styles.stageArrow}>
												<div className={styles.arrowLine} />
												<DownOutlined className={styles.arrowIcon} />
											</div>
										)}
									</React.Fragment>
								);
							})}
						</div>

						{/* Add stage */}
						<div className={styles.addStageRow}>
							<span className={styles.addLabel}>Thêm bước:</span>
							{(['sequential', 'parallel', 'voting'] as StageType[]).map((t) => (
								<button key={t} className={styles.addTypeBtn} onClick={() => addStage(t)}>
									<PlusOutlined /> {TYPE_META[t].icon} {TYPE_META[t].label}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Section 3: Preview */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.preview}`}><EyeOutlined /></div>
						<div className={styles.sectionTitle}>
							<h3>Xem trước luồng</h3>
							<p>Sơ đồ tổng quan các bước phê duyệt</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						{stages.length === 0 ? (
							<div className={styles.emptyPreview}>Thêm bước duyệt để xem sơ đồ luồng workflow</div>
						) : (
							<WorkflowTree mode="mixed" mixedStages={mixedStages} roleLabels={ROLE_LABELS} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkflowBuilder;
