// design: smartadmin.pen · frame 07 (tạo mới) & 07b (chỉnh sửa)
import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	DownOutlined,
	EyeOutlined,
	ForkOutlined,
	OrderedListOutlined,
	PlusOutlined,
	TeamOutlined,
	UpOutlined,
} from '@ant-design/icons';
import { Checkbox, Input, InputNumber, message, Select, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { getActiveForms } from '@/services/Forms/formApi';
import type { IForm } from '@/services/Forms/typings';
import {
	createWorkflowDefinition,
	getWorkflowDefinitionById,
	updateWorkflowDefinition,
} from '@/services/Workflows/workflowApi';
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
	customLabel?: string;
	role?: string;
	requireCommentOnReject?: boolean;
	canReturn?: boolean;
	requireCommentOnReturn?: boolean;
	parallelRoles?: string[];
	voterRole?: string;
	approveThreshold?: number;
	rejectThreshold?: number;
}

const TYPE_META: Record<StageType, { label: string; icon: React.ReactNode }> = {
	sequential: { label: 'Tuần tự', icon: <OrderedListOutlined /> },
	parallel: { label: 'Song song', icon: <ForkOutlined /> },
	voting: { label: 'Bỏ phiếu', icon: <TeamOutlined /> },
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
				from: fromState,
				to: 'rejected',
				action: 'reject',
				roles: [stage.role || 'MANAGER'],
				...(stage.requireCommentOnReject && { conditions: { requireComment: true } }),
			});
			if (stage.canReturn) {
				transitions.push({
					from: fromState,
					to: 'returned',
					action: 'return_for_edit',
					roles: [stage.role || 'MANAGER'],
					...(stage.requireCommentOnReturn && { conditions: { requireComment: true } }),
				});
			}
		} else if (stage.type === 'parallel') {
			const roles = stage.parallelRoles || ['MANAGER', 'HR'];
			const requireActions = roles.map((r) => `approve_${r.toLowerCase()}`);
			transitions.push({
				from: fromState,
				to: nextState,
				action: requireActions[0],
				roles,
				type: 'PARALLEL_JOIN',
				requireActions,
			});
			roles.forEach((role) => {
				transitions.push({ from: fromState, to: 'rejected', action: 'reject', roles: [role], conditions: { requireComment: true } });
			});
			statesDetails[fromState] = { slaHours: 72 };
		} else if (stage.type === 'voting') {
			const voterRole = stage.voterRole || 'MANAGER';
			transitions.push({
				from: fromState,
				to: nextState,
				action: 'vote_approve',
				roles: [voterRole],
				type: 'VOTING',
				votingConfig: {
					approveAction: 'vote_approve',
					rejectAction: 'vote_reject',
					approveThreshold: stage.approveThreshold || 2,
					rejectThreshold: stage.rejectThreshold || 2,
					approveTarget: nextState,
					rejectTarget: 'rejected',
				},
			});
			statesDetails[fromState] = { slaHours: 48 };
		}
	});

	const stateLabels: Record<string, string> = {};
	stages.forEach((stage, idx) => {
		const stateName = getStateName(idx, stage);
		stateLabels[stateName] = stage.customLabel || `Bước ${idx + 1}: ${getStageLabel(idx, stage)}`;
	});
	stateLabels.approved = 'Đã phê duyệt';
	stateLabels.rejected = 'Từ chối';
	if (hasReturn) stateLabels.returned = 'Trả lại chỉnh sửa';

	return {
		states,
		initialState: getStateName(0, stages[0]),
		finalStates,
		transitions,
		stateLabels,
		...(Object.keys(statesDetails).length > 0 && { statesDetails }),
	};
}

export function parseConfigToStages(config: IWorkflowConfig): WorkflowStage[] | null {
	if (!config?.initialState || !config?.transitions?.length) return null;

	const stages: WorkflowStage[] = [];
	let current = config.initialState;
	const visited = new Set<string>();

	while (current && !visited.has(current)) {
		visited.add(current);
		if (config.finalStates?.includes(current)) break;

		const cur = current;
		const fromTs = config.transitions.filter((t) =>
			typeof t.from === 'string' ? t.from === cur : Array.isArray(t.from) ? t.from.includes(cur) : false,
		);
		if (fromTs.length === 0) break;

		const votingT = fromTs.find((t) => t.type === 'VOTING');
		const parallelT = fromTs.find((t) => t.type === 'PARALLEL_JOIN');
		const approveT = fromTs.find((t) => t.action === 'approve');
		const rejectT = fromTs.find((t) => t.action === 'reject');
		const returnT = fromTs.find((t) => t.action === 'return_for_edit');

		const label = config.stateLabels?.[current];

		if (votingT) {
			const vc = votingT.votingConfig;
			stages.push(
				createStageFromParsed('voting', {
					customLabel: label,
					voterRole: votingT.roles?.[0] || 'MANAGER',
					approveThreshold: vc?.approveThreshold ?? 2,
					rejectThreshold: vc?.rejectThreshold ?? 2,
				}),
			);
			current = vc?.approveTarget || votingT.to;
		} else if (parallelT) {
			stages.push(
				createStageFromParsed('parallel', {
					customLabel: label,
					parallelRoles: parallelT.roles || ['MANAGER', 'HR'],
				}),
			);
			current = parallelT.to;
		} else if (approveT) {
			stages.push(
				createStageFromParsed('sequential', {
					customLabel: label,
					role: approveT.roles?.[0] || 'MANAGER',
					requireCommentOnReject: !!rejectT?.conditions?.requireComment,
					canReturn: !!returnT,
					requireCommentOnReturn: !!returnT?.conditions?.requireComment,
				}),
			);
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

interface IWorkflowBuilderProps {
	// truyền từ trang WorkflowEdit (/workflows/:id/edit)
	editId?: string;
}

const WorkflowBuilder: React.FC<IWorkflowBuilderProps> = ({ editId }) => {
	const [workflowName, setWorkflowName] = useState('');
	const [selectedFormId, setSelectedFormId] = useState<string | undefined>(undefined);
	const [forms, setForms] = useState<IForm[]>([]);
	const [loadingForms, setLoadingForms] = useState(false);
	const [loading, setLoading] = useState(!!editId);
	const [saving, setSaving] = useState(false);
	const [stages, setStages] = useState<WorkflowStage[]>([createStage('sequential')]);

	useEffect(() => {
		(async () => {
			setLoadingForms(true);
			try {
				const response = await getActiveForms();
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				setForms(Array.isArray(data) ? data : []);
			} catch {
				/* */
			} finally {
				setLoadingForms(false);
			}
		})();
	}, []);

	useEffect(() => {
		if (!editId) return;
		setLoading(true);
		getWorkflowDefinitionById(editId)
			.then((response) => {
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				if (data) {
					setWorkflowName(data.name || '');
					setSelectedFormId(data.formId || undefined);
					const parsed = parseConfigToStages(data.config);
					if (parsed) setStages(parsed);
					else message.warning('Quy trình tùy chỉnh — không thể chỉnh sửa trực quan, lưu sẽ ghi đè cấu hình');
				}
			})
			.catch(() => message.error('Không thể tải quy trình'))
			.finally(() => setLoading(false));
	}, [editId]);

	const addStage = (type: StageType) => {
		setStages((prev) => [...prev, createStage(type)]);
	};

	const removeStage = (idx: number) => {
		if (stages.length <= 1) {
			message.warning('Cần ít nhất 1 bước');
			return;
		}
		setStages((prev) => prev.filter((_, i) => i !== idx));
	};

	const updateStage = (idx: number, patch: Partial<WorkflowStage>) => {
		setStages((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
	};

	const moveStage = (idx: number, dir: -1 | 1) => {
		const target = idx + dir;
		if (target < 0 || target >= stages.length) return;
		setStages((prev) => {
			const arr = [...prev];
			[arr[idx], arr[target]] = [arr[target], arr[idx]];
			return arr;
		});
	};

	const validate = (): string | null => {
		if (!workflowName.trim()) return 'Vui lòng nhập tên quy trình';
		if (stages.length === 0) return 'Cần ít nhất 1 bước duyệt';
		for (let i = 0; i < stages.length; i++) {
			const s = stages[i];
			if (s.type === 'parallel' && (!s.parallelRoles || s.parallelRoles.length < 2))
				return `Bước ${i + 1}: Cần ít nhất 2 vai trò duyệt song song`;
			if (s.type === 'voting' && (!s.approveThreshold || s.approveThreshold < 1)) return `Bước ${i + 1}: Ngưỡng đồng ý phải >= 1`;
		}
		return null;
	};

	const handleSave = async () => {
		const error = validate();
		if (error) {
			message.error(error);
			return;
		}

		const config = buildMixedConfig(stages);
		setSaving(true);
		try {
			if (editId) {
				await updateWorkflowDefinition(editId, {
					name: workflowName.trim(),
					...(selectedFormId ? { formId: selectedFormId } : {}),
					config,
				});
				message.success('Cập nhật quy trình thành công!');
			} else {
				await createWorkflowDefinition({
					name: workflowName.trim(),
					...(selectedFormId && { formId: selectedFormId }),
					config,
				});
				message.success('Tạo quy trình thành công!');
			}
			history.push('/workflows');
		} catch (err) {
			console.error('Failed to save workflow:', err);
		} finally {
			setSaving(false);
		}
	};

	const mixedStages = useMemo(
		() =>
			stages.map((s) => ({
				type: s.type,
				role: s.role,
				parallelRoles: s.parallelRoles,
				voterRole: s.voterRole,
				approveThreshold: s.approveThreshold,
				rejectThreshold: s.rejectThreshold,
				canReject: true,
				canReturn: s.type === 'sequential' && !!s.canReturn,
			})),
		[stages],
	);

	if (loading) {
		return (
			<div className={styles.builderPage}>
				<div className={styles.loadingWrap}>
					<Spin size='large' />
				</div>
			</div>
		);
	}

	return (
		<div className={styles.builderPage}>
			{/* Top bar — 60px */}
			<header className={styles.topBar}>
				<button type='button' className={styles.backBtn} onClick={() => history.push('/workflows')}>
					<ArrowLeftOutlined />
				</button>
				<div className={styles.titleCol}>
					<div className={styles.titleRow}>
						<span className={styles.title}>{editId ? workflowName || 'Quy trình' : 'Workflow Builder'}</span>
						{editId && <span className={styles.editBadge}>ĐANG CHỈNH SỬA</span>}
					</div>
					<span className={styles.subTitle}>
						{editId ? 'Chỉnh sửa quy trình phê duyệt' : 'Thiết kế quy trình phê duyệt trực quan'}
					</span>
				</div>
				<div className={styles.topSpacer} />
				{editId && (
					<button type='button' className={styles.viewBtn} onClick={() => history.push(`/workflows/${editId}`)}>
						<EyeOutlined />
						<span className={styles.btnText}>Xem chi tiết</span>
					</button>
				)}
				<button type='button' className={styles.saveBtn} onClick={handleSave} disabled={saving}>
					<span className={styles.btnText}>
						{saving ? 'Đang lưu...' : editId ? 'Cập nhật quy trình' : 'Lưu quy trình'}
					</span>
					<span className={styles.btnTextShort}>
						{saving ? '...' : 'Lưu'}
					</span>
				</button>
			</header>

			<div className={styles.body}>
				{/* Panel trái 500 */}
				<aside className={styles.stagePanel}>
					<div className={styles.formGroup}>
						<label>
							Tên quy trình <span className={styles.required}>*</span>
						</label>
						<Input
							placeholder='Ví dụ: Phê duyệt nghỉ phép'
							value={workflowName}
							onChange={(e) => setWorkflowName(e.target.value)}
							maxLength={100}
						/>
					</div>
					<div className={styles.formGroup}>
						<label>Biểu mẫu áp dụng</label>
						<Select
							placeholder='Chọn biểu mẫu (không bắt buộc)'
							value={selectedFormId}
							onChange={setSelectedFormId}
							allowClear
							loading={loadingForms}
							style={{ width: '100%' }}
							options={forms.map((f) => ({ label: f.name, value: f.id }))}
							showSearch
							filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
						/>
					</div>

					<div className={styles.divider} />
					<span className={styles.sectionLabel}>CÁC BƯỚC PHÊ DUYỆT</span>

					{stages.map((stage, idx) => {
						const meta = TYPE_META[stage.type];
						const isLast = idx === stages.length - 1;
						return (
							<div key={stage.id} className={styles.stageCard}>
								<div className={styles.stageHeader}>
									<span className={`${styles.stageBadge} ${idx % 2 === 1 ? styles.violet : ''}`}>
										Bước {idx + 1} · {meta.label}
									</span>
									<span className={styles.stageName}>{getStageLabel(idx, stage)}</span>
									<span className={styles.stageSpacer} />
									<button type='button' className={styles.stageAction} onClick={() => moveStage(idx, -1)} disabled={idx === 0}>
										<UpOutlined />
									</button>
									<button type='button' className={styles.stageAction} onClick={() => moveStage(idx, 1)} disabled={isLast}>
										<DownOutlined />
									</button>
									<button
										type='button'
										className={`${styles.stageAction} ${styles.danger}`}
										onClick={() => removeStage(idx)}
									>
										<DeleteOutlined />
									</button>
								</div>

								<div className={styles.typeRow}>
									{(['sequential', 'parallel', 'voting'] as StageType[]).map((t) => (
										<button
											type='button'
											key={t}
											className={`${styles.typePill} ${stage.type === t ? styles.active : ''}`}
											onClick={() => updateStage(idx, { type: t })}
										>
											{TYPE_META[t].icon} {TYPE_META[t].label}
										</button>
									))}
								</div>

								<div className={styles.stageField}>
									<label>Tên hiển thị</label>
									<Input
										placeholder={`Bước ${idx + 1}: ${getStageLabel(idx, stage)}`}
										value={stage.customLabel || ''}
										onChange={(e) => updateStage(idx, { customLabel: e.target.value || undefined })}
										allowClear
									/>
								</div>

								{stage.type === 'sequential' && (
									<>
										<div className={styles.stageField}>
											<label>
												Vai trò phê duyệt <span className={styles.required}>*</span>
											</label>
											<Select
												value={stage.role}
												onChange={(val) => updateStage(idx, { role: val })}
												style={{ width: '100%' }}
												options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))}
											/>
										</div>
										<div className={styles.permGrid}>
											<span className={`${styles.permChip} ${styles.fixed}`}>
												<CheckCircleOutlined /> Phê duyệt
											</span>
											<span className={`${styles.permChip} ${styles.fixed}`}>
												<CloseCircleOutlined /> Từ chối
											</span>
											<label className={styles.permCheck}>
												<Checkbox
													checked={stage.requireCommentOnReject}
													onChange={(e) => updateStage(idx, { requireCommentOnReject: e.target.checked })}
												/>
												Ghi chú khi từ chối
											</label>
											<label className={styles.permCheck}>
												<Checkbox
													checked={stage.canReturn}
													onChange={(e) =>
														updateStage(idx, { canReturn: e.target.checked, ...(e.target.checked ? {} : { requireCommentOnReturn: false }) })
													}
												/>
												Trả lại để sửa
											</label>
											{stage.canReturn && (
												<label className={styles.permCheck}>
													<Checkbox
														checked={stage.requireCommentOnReturn}
														onChange={(e) => updateStage(idx, { requireCommentOnReturn: e.target.checked })}
													/>
													Ghi chú khi trả lại
												</label>
											)}
										</div>
									</>
								)}

								{stage.type === 'parallel' && (
									<div className={styles.stageField}>
										<label>
											Các vai trò duyệt đồng thời <span className={styles.required}>*</span>
										</label>
										<Select
											mode='multiple'
											value={stage.parallelRoles}
											onChange={(roles) => updateStage(idx, { parallelRoles: roles })}
											style={{ width: '100%' }}
											options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))}
										/>
										<p className={styles.fieldHint}>
											Tất cả {(stage.parallelRoles || []).length} vai trò phải duyệt. Bất kỳ ai từ chối = kết thúc.
										</p>
									</div>
								)}

								{stage.type === 'voting' && (
									<>
										<div className={styles.stageField}>
											<label>
												Vai trò bỏ phiếu <span className={styles.required}>*</span>
											</label>
											<Select
												value={stage.voterRole}
												onChange={(v) => updateStage(idx, { voterRole: v })}
												style={{ width: '100%' }}
												options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))}
											/>
										</div>
										<div className={styles.thresholdRow}>
											<div className={styles.stageField}>
												<label>
													Ngưỡng đồng ý <span className={styles.required}>*</span>
												</label>
												<InputNumber
													min={1}
													max={99}
													value={stage.approveThreshold}
													onChange={(v) => updateStage(idx, { approveThreshold: v ?? 2 })}
													style={{ width: '100%' }}
												/>
											</div>
											<div className={styles.stageField}>
												<label>Ngưỡng từ chối</label>
												<InputNumber
													min={1}
													max={99}
													value={stage.rejectThreshold}
													onChange={(v) => updateStage(idx, { rejectThreshold: v ?? 2 })}
													style={{ width: '100%' }}
												/>
											</div>
										</div>
									</>
								)}
							</div>
						);
					})}

					<div className={styles.addRow}>
						{(['sequential', 'parallel', 'voting'] as StageType[]).map((t) => (
							<button type='button' key={t} className={styles.addBtn} onClick={() => addStage(t)}>
								<PlusOutlined /> {TYPE_META[t].label}
							</button>
						))}
					</div>
				</aside>

				{/* Preview phải */}
				<section className={styles.previewPane}>
					<div className={styles.previewHeader}>
						<EyeOutlined /> Xem trước quy trình (realtime)
					</div>
					<div className={styles.previewBody}>
						{stages.length === 0 ? (
							<div className={styles.emptyPreview}>Thêm bước duyệt để xem sơ đồ quy trình</div>
						) : (
							<WorkflowTree mode='mixed' mixedStages={mixedStages} roleLabels={ROLE_LABELS} />
						)}
					</div>
				</section>
			</div>
		</div>
	);
};

export default WorkflowBuilder;
