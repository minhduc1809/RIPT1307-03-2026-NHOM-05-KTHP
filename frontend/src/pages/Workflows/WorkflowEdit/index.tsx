import {
	ArrowLeftOutlined,
	BranchesOutlined,
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
import { Button, Checkbox, Input, InputNumber, message, Radio, Select, Spin, Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { getActiveForms } from '@/services/Forms/formApi';
import type { IForm } from '@/services/Forms/typings';
import {
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

type WorkflowType = 'sequential' | 'parallel' | 'voting';

interface ApprovalStep {
	role: string;
	requireCommentOnReject: boolean;
	canReturn: boolean;
	requireCommentOnReturn: boolean;
}

interface ParallelConfig {
	roles: string[];
	requireCommentOnReject: boolean;
}

interface VotingConfig {
	voterRole: string;
	approveThreshold: number;
	rejectThreshold: number;
}

// ---- Build configs ----

function buildSequentialConfig(steps: ApprovalStep[]): IWorkflowConfig {
	const states: string[] = [];
	const transitions: IWorkflowTransition[] = [];
	steps.forEach((_, i) => states.push(`step_${i + 1}`));
	states.push('approved', 'rejected');
	const hasReturn = steps.some((s) => s.canReturn);
	if (hasReturn) states.push('returned');
	const finalStates = ['approved', 'rejected'];
	if (hasReturn) finalStates.push('returned');

	steps.forEach((step, i) => {
		const from = `step_${i + 1}`;
		const next = i < steps.length - 1 ? `step_${i + 2}` : 'approved';
		transitions.push({ from, to: next, action: 'approve', roles: [step.role] });
		transitions.push({ from, to: 'rejected', action: 'reject', roles: [step.role], ...(step.requireCommentOnReject && { conditions: { requireComment: true } }) });
		if (step.canReturn) {
			transitions.push({ from, to: 'returned', action: 'return_for_edit', roles: [step.role], ...(step.requireCommentOnReturn && { conditions: { requireComment: true } }) });
		}
	});
	return { states, initialState: 'step_1', finalStates, transitions };
}

function buildParallelConfig(cfg: ParallelConfig): IWorkflowConfig {
	const requireActions = cfg.roles.map((r) => `approve_${r.toLowerCase()}`);
	const transitions: IWorkflowTransition[] = [];
	transitions.push({ from: 'pending_approval', to: 'approved', action: requireActions[0], roles: cfg.roles, type: 'PARALLEL_JOIN', requireActions });
	cfg.roles.forEach((role) => {
		transitions.push({ from: 'pending_approval', to: 'rejected', action: 'reject', roles: [role], ...(cfg.requireCommentOnReject && { conditions: { requireComment: true } }) });
	});
	return { states: ['pending_approval', 'approved', 'rejected'], initialState: 'pending_approval', finalStates: ['approved', 'rejected'], transitions };
}

function buildVotingConfig(cfg: VotingConfig): IWorkflowConfig {
	return {
		states: ['submitted', 'voting', 'approved', 'rejected'],
		initialState: 'submitted',
		finalStates: ['approved', 'rejected'],
		transitions: [
			{ from: 'submitted', to: 'voting', action: 'start_review', roles: ['ADMIN', 'MANAGER'] },
			{ from: 'voting', to: 'approved', action: 'vote_approve', roles: [cfg.voterRole], type: 'VOTING', votingConfig: { approveAction: 'vote_approve', rejectAction: 'vote_reject', approveThreshold: cfg.approveThreshold, rejectThreshold: cfg.rejectThreshold, approveTarget: 'approved', rejectTarget: 'rejected' } },
		],
		statesDetails: { voting: { slaHours: 48 } },
	};
}

// ---- Parse existing config ----

function detectType(config: IWorkflowConfig): WorkflowType {
	if (config.transitions?.some((t) => t.type === 'VOTING')) return 'voting';
	if (config.transitions?.some((t) => t.type === 'PARALLEL_JOIN')) return 'parallel';
	return 'sequential';
}

function parseSequentialSteps(config: IWorkflowConfig): ApprovalStep[] {
	const steps: ApprovalStep[] = [];
	let current = config.initialState;
	const visited = new Set<string>();
	while (current && !visited.has(current)) {
		visited.add(current);
		if (config.finalStates?.includes(current)) break;
		const fromTs = config.transitions.filter((t) => (typeof t.from === 'string' ? t.from === current : Array.isArray(t.from) ? t.from.includes(current) : false));
		const approveT = fromTs.find((t) => t.action === 'approve');
		if (!approveT) break;
		const rejectT = fromTs.find((t) => t.action === 'reject');
		const returnT = fromTs.find((t) => t.action === 'return_for_edit');
		steps.push({ role: approveT.roles?.[0] || 'MANAGER', requireCommentOnReject: !!rejectT?.conditions?.requireComment, canReturn: !!returnT, requireCommentOnReturn: !!returnT?.conditions?.requireComment });
		current = approveT.to;
	}
	return steps.length > 0 ? steps : [{ role: 'MANAGER', requireCommentOnReject: true, canReturn: false, requireCommentOnReturn: false }];
}

function parseParallelConfig(config: IWorkflowConfig): ParallelConfig {
	const pjt = config.transitions.find((t) => t.type === 'PARALLEL_JOIN');
	const rejectT = config.transitions.find((t) => t.action === 'reject');
	return { roles: pjt?.roles || ['MANAGER', 'HR'], requireCommentOnReject: !!rejectT?.conditions?.requireComment };
}

function parseVotingConfig(config: IWorkflowConfig): VotingConfig {
	const vt = config.transitions.find((t) => t.type === 'VOTING');
	const vc = vt?.votingConfig;
	return { voterRole: vt?.roles?.[0] || 'MANAGER', approveThreshold: vc?.approveThreshold ?? 2, rejectThreshold: vc?.rejectThreshold ?? 2 };
}

const DEFAULT_STEP: ApprovalStep = { role: 'MANAGER', requireCommentOnReject: true, canReturn: false, requireCommentOnReturn: false };

const WorkflowEdit: React.FC = (props: any) => {
	const workflowId = props?.match?.params?.id;

	const [loadingData, setLoadingData] = useState(true);
	const [workflowName, setWorkflowName] = useState('');
	const [selectedFormId, setSelectedFormId] = useState<string | undefined>(undefined);
	const [forms, setForms] = useState<IForm[]>([]);
	const [loadingForms, setLoadingForms] = useState(false);
	const [saving, setSaving] = useState(false);

	const [workflowType, setWorkflowType] = useState<WorkflowType>('sequential');
	const [steps, setSteps] = useState<ApprovalStep[]>([{ ...DEFAULT_STEP }]);
	const [parallelConfig, setParallelConfig] = useState<ParallelConfig>({ roles: ['MANAGER', 'HR'], requireCommentOnReject: true });
	const [votingCfg, setVotingCfg] = useState<VotingConfig>({ voterRole: 'MANAGER', approveThreshold: 2, rejectThreshold: 2 });

	useEffect(() => {
		const loadWorkflow = async () => {
			if (!workflowId) return;
			setLoadingData(true);
			try {
				const response = await getWorkflowDefinitionById(workflowId);
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				if (data) {
					setWorkflowName(data.name || '');
					setSelectedFormId(data.formId || undefined);
					if (data.config) {
						const type = detectType(data.config);
						setWorkflowType(type);
						if (type === 'sequential') setSteps(parseSequentialSteps(data.config));
						else if (type === 'parallel') setParallelConfig(parseParallelConfig(data.config));
						else if (type === 'voting') setVotingCfg(parseVotingConfig(data.config));
					}
				}
			} catch {
				message.error('Không thể tải workflow');
			} finally {
				setLoadingData(false);
			}
		};
		loadWorkflow();
	}, [workflowId]);

	useEffect(() => {
		const loadForms = async () => {
			setLoadingForms(true);
			try {
				const response = await getActiveForms();
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				setForms(Array.isArray(data) ? data : []);
			} catch { /* silent */ } finally {
				setLoadingForms(false);
			}
		};
		loadForms();
	}, []);

	const addStep = () => setSteps((prev) => [...prev, { ...DEFAULT_STEP }]);
	const removeStep = (index: number) => {
		if (steps.length <= 1) { message.warning('Cần ít nhất 1 bước duyệt'); return; }
		setSteps((prev) => prev.filter((_, i) => i !== index));
	};
	const updateStep = (index: number, patch: Partial<ApprovalStep>) => {
		setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
	};
	const moveStep = (index: number, direction: -1 | 1) => {
		const target = index + direction;
		if (target < 0 || target >= steps.length) return;
		setSteps((prev) => { const arr = [...prev]; [arr[index], arr[target]] = [arr[target], arr[index]]; return arr; });
	};

	const validate = (): string | null => {
		if (!workflowName.trim()) return 'Vui lòng nhập tên workflow';
		if (workflowType === 'sequential' && steps.length === 0) return 'Cần ít nhất 1 bước duyệt';
		if (workflowType === 'parallel' && parallelConfig.roles.length < 2) return 'Cần ít nhất 2 vai trò duyệt song song';
		if (workflowType === 'voting' && votingCfg.approveThreshold < 1) return 'Ngưỡng đồng ý phải >= 1';
		return null;
	};

	const handleSave = async () => {
		const error = validate();
		if (error) { message.error(error); return; }

		let config: IWorkflowConfig;
		if (workflowType === 'sequential') config = buildSequentialConfig(steps);
		else if (workflowType === 'parallel') config = buildParallelConfig(parallelConfig);
		else config = buildVotingConfig(votingCfg);

		setSaving(true);
		try {
			await updateWorkflowDefinition(workflowId, { name: workflowName.trim(), ...(selectedFormId ? { formId: selectedFormId } : {}), config });
			message.success('Cập nhật workflow thành công!');
			history.push(`/workflows/${workflowId}`);
		} catch (err) {
			console.error('Failed to update workflow:', err);
		} finally {
			setSaving(false);
		}
	};

	if (loadingData) {
		return (
			<div className={styles.builderPage}>
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
					<Spin size="large" />
				</div>
			</div>
		);
	}

	return (
		<div className={styles.builderPage}>
			{/* Header */}
			<div className={styles.builderHeader}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={() => history.push(`/workflows/${workflowId}`)}>
						<ArrowLeftOutlined />
					</button>
					<div className={styles.headerInfo}>
						<h1>Chỉnh sửa Workflow</h1>
						<p>{workflowName || 'Đang tải...'}</p>
					</div>
				</div>
				<div className={styles.headerActions}>
					<Button type="primary" icon={<SaveOutlined />} className={styles.saveBtn} loading={saving} onClick={handleSave}>
						Lưu thay đổi
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
							<Select
								placeholder="Chọn biểu mẫu (không bắt buộc)" value={selectedFormId} onChange={setSelectedFormId} allowClear loading={loadingForms} style={{ width: '100%' }}
								options={forms.map((f) => ({ label: f.name, value: f.id }))} showSearch filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase())}
							/>
						</div>
					</div>
				</div>

				{/* Section 2: Workflow Type */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.steps}`}><BranchesOutlined /></div>
						<div className={styles.sectionTitle}>
							<h3>Loại quy trình</h3>
							<p>Chọn cách thức phê duyệt phù hợp</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						<div className={styles.typeSelector}>
							<div className={`${styles.typeCard} ${workflowType === 'sequential' ? styles.active : ''}`} onClick={() => setWorkflowType('sequential')}>
								<div className={styles.typeIcon}><OrderedListOutlined /></div>
								<div className={styles.typeInfo}>
									<div className={styles.typeName}>Tuần tự</div>
									<div className={styles.typeDesc}>Từng người duyệt theo thứ tự từ trên xuống</div>
								</div>
								<Radio checked={workflowType === 'sequential'} />
							</div>
							<div className={`${styles.typeCard} ${workflowType === 'parallel' ? styles.active : ''}`} onClick={() => setWorkflowType('parallel')}>
								<div className={styles.typeIcon}><ForkOutlined /></div>
								<div className={styles.typeInfo}>
									<div className={styles.typeName}>Song song</div>
									<div className={styles.typeDesc}>Tất cả vai trò phải đồng thời duyệt</div>
								</div>
								<Radio checked={workflowType === 'parallel'} />
							</div>
							<div className={`${styles.typeCard} ${workflowType === 'voting' ? styles.active : ''}`} onClick={() => setWorkflowType('voting')}>
								<div className={styles.typeIcon}><TeamOutlined /></div>
								<div className={styles.typeInfo}>
									<div className={styles.typeName}>Bỏ phiếu</div>
									<div className={styles.typeDesc}>Đạt ngưỡng phiếu đồng ý / từ chối để quyết định</div>
								</div>
								<Radio checked={workflowType === 'voting'} />
							</div>
						</div>
					</div>
				</div>

				{/* Section 3: Type-specific config */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.steps}`}><TeamOutlined /></div>
						<div className={styles.sectionTitle}>
							<h3>
								{workflowType === 'sequential' && 'Các bước phê duyệt'}
								{workflowType === 'parallel' && 'Cấu hình duyệt song song'}
								{workflowType === 'voting' && 'Cấu hình bỏ phiếu'}
							</h3>
						</div>
					</div>
					<div className={styles.sectionBody}>
						{/* Sequential */}
						{workflowType === 'sequential' && (
							<>
								{steps.length === 0 ? (
									<div className={styles.emptySteps}>
										<TeamOutlined style={{ fontSize: 32, display: 'block', marginBottom: 8 }} />
										Chưa có bước duyệt nào. Nhấn nút bên dưới để thêm.
									</div>
								) : (
									<div className={styles.stepsList}>
										{steps.map((step, idx) => (
											<div key={idx} className={styles.stepCard}>
												<div className={styles.stepHeader}>
													<div className={styles.stepBadge}>
														<div className={styles.stepNumber}>{idx + 1}</div>
														<div className={styles.stepTitle}>{ROLE_LABELS[step.role] || step.role} duyệt</div>
													</div>
													<div className={styles.stepActions}>
														<button onClick={() => moveStep(idx, -1)} disabled={idx === 0} title="Di lên"><UpOutlined /></button>
														<button onClick={() => moveStep(idx, 1)} disabled={idx === steps.length - 1} title="Di xuống"><DownOutlined /></button>
														<button className={styles.deleteBtn} onClick={() => removeStep(idx)} title="Xóa bước"><DeleteOutlined /></button>
													</div>
												</div>
												<div className={styles.stepBody}>
													<div className={styles.stepField}>
														<label>Người duyệt <span style={{ color: '#ef4444' }}>*</span></label>
														<Select value={step.role} onChange={(val) => updateStep(idx, { role: val })} style={{ width: '100%' }} options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))} />
													</div>
													<div className={styles.stepField}>
														<label>Bước tiếp theo</label>
														<Input disabled value={idx < steps.length - 1 ? `Bước ${idx + 2}: ${ROLE_LABELS[steps[idx + 1].role]}` : 'Phê duyệt hoàn tất'} />
													</div>
													<div className={styles.stepPermissions}>
														<div className={styles.permLabel}>Quyền hạn</div>
														<div className={styles.permGrid}>
															<div className={`${styles.permItem} ${styles.approve}`}>
																<CheckCircleOutlined className={styles.permIcon} />
																<div className={styles.permInfo}>
																	<div className={styles.permName}>Phê duyệt</div>
																	<div className={styles.permDesc}>Luôn bật</div>
																</div>
																<Checkbox checked disabled />
															</div>
															<div className={`${styles.permItem} ${styles.reject}`}>
																<CloseCircleOutlined className={styles.permIcon} />
																<div className={styles.permInfo}>
																	<div className={styles.permName}>Từ chối</div>
																	<div className={styles.permDesc}>Luôn bật</div>
																</div>
																<Checkbox checked disabled />
															</div>
															<div className={`${styles.permItem} ${styles.commentReject} ${step.requireCommentOnReject ? styles.active : ''}`}>
																<EditOutlined className={styles.permIcon} />
																<div className={styles.permInfo}>
																	<div className={styles.permName}>Ghi chú khi từ chối</div>
																	<div className={styles.permDesc}>Bắt buộc nhập lý do</div>
																</div>
																<Checkbox checked={step.requireCommentOnReject} onChange={(e) => updateStep(idx, { requireCommentOnReject: e.target.checked })} />
															</div>
															<div className={`${styles.permItem} ${styles.returnPerm} ${step.canReturn ? styles.active : ''}`}>
																<RollbackOutlined className={styles.permIcon} />
																<div className={styles.permInfo}>
																	<div className={styles.permName}>Trả lại để sửa</div>
																	<div className={styles.permDesc}>Cho phép trả về người nộp</div>
																</div>
																<Checkbox checked={step.canReturn} onChange={(e) => updateStep(idx, { canReturn: e.target.checked, ...(!e.target.checked && { requireCommentOnReturn: false }) })} />
															</div>
															{step.canReturn && (
																<div className={`${styles.permItem} ${styles.commentReturn} ${step.requireCommentOnReturn ? styles.active : ''}`}>
																	<EditOutlined className={styles.permIcon} />
																	<div className={styles.permInfo}>
																		<div className={styles.permName}>Ghi chú khi trả lại</div>
																		<div className={styles.permDesc}>Bắt buộc nhập lý do</div>
																	</div>
																	<Checkbox checked={step.requireCommentOnReturn} onChange={(e) => updateStep(idx, { requireCommentOnReturn: e.target.checked })} />
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
								<button className={styles.addStepBtn} onClick={addStep}><PlusOutlined /> Thêm bước duyệt</button>
							</>
						)}

						{/* Parallel */}
						{workflowType === 'parallel' && (
							<div className={styles.configGrid}>
								<div className={styles.formGroup}>
									<label>Các vai trò duyệt đồng thời <span className={styles.required}>*</span></label>
									<Select mode="multiple" value={parallelConfig.roles} onChange={(roles) => setParallelConfig((prev) => ({ ...prev, roles }))} style={{ width: '100%' }} options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))} />
									<p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
										Tất cả {parallelConfig.roles.length} vai trò phải duyệt thì yêu cầu mới được chấp thuận.
									</p>
								</div>
								<div className={styles.formGroup}>
									<Checkbox checked={parallelConfig.requireCommentOnReject} onChange={(e) => setParallelConfig((prev) => ({ ...prev, requireCommentOnReject: e.target.checked }))}>
										Bắt buộc ghi chú khi từ chối
									</Checkbox>
								</div>
							</div>
						)}

						{/* Voting */}
						{workflowType === 'voting' && (
							<div className={styles.configGrid}>
								<div className={styles.formGroup}>
									<label>Vai trò bỏ phiếu <span className={styles.required}>*</span></label>
									<Select value={votingCfg.voterRole} onChange={(voterRole) => setVotingCfg((prev) => ({ ...prev, voterRole }))} style={{ width: '100%' }} options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))} />
								</div>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
									<div className={styles.formGroup}>
										<label>Ngưỡng đồng ý <span className={styles.required}>*</span>
											<Tooltip title="Số phiếu đồng ý tối thiểu để phê duyệt"><span style={{ marginLeft: 4, color: '#94a3b8', cursor: 'help' }}>i</span></Tooltip>
										</label>
										<InputNumber min={1} max={99} value={votingCfg.approveThreshold} onChange={(v) => setVotingCfg((prev) => ({ ...prev, approveThreshold: v ?? 1 }))} style={{ width: '100%' }} />
									</div>
									<div className={styles.formGroup}>
										<label>Ngưỡng từ chối
											<Tooltip title="Số phiếu từ chối tối thiểu để từ chối"><span style={{ marginLeft: 4, color: '#94a3b8', cursor: 'help' }}>i</span></Tooltip>
										</label>
										<InputNumber min={1} max={99} value={votingCfg.rejectThreshold} onChange={(v) => setVotingCfg((prev) => ({ ...prev, rejectThreshold: v ?? 1 }))} style={{ width: '100%' }} />
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Section 4: Preview */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.preview}`}><EyeOutlined /></div>
						<div className={styles.sectionTitle}>
							<h3>Xem trước luồng</h3>
							<p>Sơ đồ tổng quan các bước phê duyệt</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						{workflowType === 'sequential' && steps.length === 0 ? (
							<div className={styles.emptyPreview}>Thêm bước duyệt để xem sơ đồ luồng workflow</div>
						) : workflowType === 'sequential' ? (
							<WorkflowTree mode="sequential" steps={steps} roleLabels={ROLE_LABELS} />
						) : workflowType === 'parallel' ? (
							<WorkflowTree mode="parallel" parallelData={{ roles: parallelConfig.roles }} roleLabels={ROLE_LABELS} />
						) : (
							<WorkflowTree mode="voting" votingData={{ voterRole: votingCfg.voterRole, approveThreshold: votingCfg.approveThreshold, rejectThreshold: votingCfg.rejectThreshold }} roleLabels={ROLE_LABELS} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkflowEdit;
