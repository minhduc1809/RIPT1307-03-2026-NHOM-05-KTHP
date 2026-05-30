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
import { Button, Checkbox, Input, InputNumber, message, Select, Spin, Tag, Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { getActiveForms } from '@/services/Forms/formApi';
import type { IForm } from '@/services/Forms/typings';
import { getWorkflowDefinitionById, updateWorkflowDefinition } from '@/services/Workflows/workflowApi';
import type { IWorkflowConfig, IWorkflowTransition } from '@/services/Workflows/typings';
import WorkflowTree from '@/components/WorkflowTree';
import { parseConfigToStages } from '../Builder/index';
import styles from './index.less';

const ALL_ROLES = ['ADMIN', 'MANAGER', 'HR', 'USER'];
const ROLE_LABELS: Record<string, string> = { ADMIN: 'Quản trị viên', MANAGER: 'Quản lý', HR: 'Nhân sự', USER: 'Nhân viên' };

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

const TYPE_META: Record<StageType, { label: string; color: string; icon: React.ReactNode }> = {
	sequential: { label: 'Tuần tự', color: 'blue', icon: <OrderedListOutlined /> },
	parallel: { label: 'Song song', color: 'cyan', icon: <ForkOutlined /> },
	voting: { label: 'Bỏ phiếu', color: 'purple', icon: <TeamOutlined /> },
};

let counter = 0;
function makeStage(type: StageType, overrides?: Partial<WorkflowStage>): WorkflowStage {
	counter++;
	return {
		id: `s_${counter}_${Date.now()}`, type,
		role: 'MANAGER', requireCommentOnReject: true, canReturn: false, requireCommentOnReturn: false,
		parallelRoles: ['MANAGER', 'HR'], voterRole: 'MANAGER', approveThreshold: 2, rejectThreshold: 2,
		...overrides,
	};
}

function getStateName(idx: number, s: WorkflowStage): string {
	if (s.type === 'voting') return `stage_${idx + 1}_voting`;
	if (s.type === 'parallel') return `stage_${idx + 1}_parallel`;
	return `stage_${idx + 1}`;
}

function getLabel(idx: number, s: WorkflowStage): string {
	if (s.type === 'sequential') return ROLE_LABELS[s.role || 'MANAGER'] || s.role || '';
	if (s.type === 'parallel') return (s.parallelRoles || []).map((r) => ROLE_LABELS[r] || r).join(' + ');
	return `${ROLE_LABELS[s.voterRole || 'MANAGER']} bỏ phiếu`;
}

function buildConfig(stages: WorkflowStage[]): IWorkflowConfig {
	const states: string[] = [];
	const transitions: IWorkflowTransition[] = [];
	const hasReturn = stages.some((s) => s.type === 'sequential' && s.canReturn);
	const statesDetails: Record<string, any> = {};

	stages.forEach((s, i) => states.push(getStateName(i, s)));
	states.push('approved', 'rejected');
	if (hasReturn) states.push('returned');

	stages.forEach((stage, idx) => {
		const from = getStateName(idx, stage);
		const next = idx < stages.length - 1 ? getStateName(idx + 1, stages[idx + 1]) : 'approved';

		if (stage.type === 'sequential') {
			transitions.push({ from, to: next, action: 'approve', roles: [stage.role || 'MANAGER'] });
			transitions.push({ from, to: 'rejected', action: 'reject', roles: [stage.role || 'MANAGER'], ...(stage.requireCommentOnReject && { conditions: { requireComment: true } }) });
			if (stage.canReturn) transitions.push({ from, to: 'returned', action: 'return_for_edit', roles: [stage.role || 'MANAGER'], ...(stage.requireCommentOnReturn && { conditions: { requireComment: true } }) });
		} else if (stage.type === 'parallel') {
			const roles = stage.parallelRoles || ['MANAGER', 'HR'];
			const reqs = roles.map((r) => `approve_${r.toLowerCase()}`);
			transitions.push({ from, to: next, action: reqs[0], roles, type: 'PARALLEL_JOIN', requireActions: reqs });
			roles.forEach((role) => transitions.push({ from, to: 'rejected', action: 'reject', roles: [role], conditions: { requireComment: true } }));
			statesDetails[from] = { slaHours: 72 };
		} else if (stage.type === 'voting') {
			transitions.push({ from, to: next, action: 'vote_approve', roles: [stage.voterRole || 'MANAGER'], type: 'VOTING',
				votingConfig: { approveAction: 'vote_approve', rejectAction: 'vote_reject', approveThreshold: stage.approveThreshold || 2, rejectThreshold: stage.rejectThreshold || 2, approveTarget: next, rejectTarget: 'rejected' } });
			statesDetails[from] = { slaHours: 48 };
		}
	});

	return { states, initialState: getStateName(0, stages[0]), finalStates: ['approved', 'rejected', ...(hasReturn ? ['returned'] : [])], transitions, ...(Object.keys(statesDetails).length > 0 && { statesDetails }) };
}

const WorkflowEdit: React.FC = (props: any) => {
	const workflowId = props?.match?.params?.id;
	const [loadingData, setLoadingData] = useState(true);
	const [workflowName, setWorkflowName] = useState('');
	const [selectedFormId, setSelectedFormId] = useState<string | undefined>(undefined);
	const [forms, setForms] = useState<IForm[]>([]);
	const [loadingForms, setLoadingForms] = useState(false);
	const [saving, setSaving] = useState(false);
	const [stages, setStages] = useState<WorkflowStage[]>([]);

	useEffect(() => {
		(async () => {
			if (!workflowId) return;
			setLoadingData(true);
			try {
				const response = await getWorkflowDefinitionById(workflowId);
				const data = (response as any)?.data?.data ?? (response as any)?.data;
				if (data) {
					setWorkflowName(data.name || '');
					setSelectedFormId(data.formId || undefined);
					if (data.config) {
						const parsed = parseConfigToStages(data.config);
						setStages(parsed || [makeStage('sequential')]);
					}
				}
			} catch { message.error('Không thể tải workflow'); }
			finally { setLoadingData(false); }
		})();
	}, [workflowId]);

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

	const addStage = (type: StageType) => setStages((prev) => [...prev, makeStage(type)]);
	const removeStage = (idx: number) => { if (stages.length <= 1) { message.warning('Cần ít nhất 1 bước'); return; } setStages((prev) => prev.filter((_, i) => i !== idx)); };
	const updateStage = (idx: number, patch: Partial<WorkflowStage>) => setStages((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
	const moveStage = (idx: number, dir: -1 | 1) => { const t = idx + dir; if (t < 0 || t >= stages.length) return; setStages((prev) => { const a = [...prev]; [a[idx], a[t]] = [a[t], a[idx]]; return a; }); };
	const changeType = (idx: number, type: StageType) => setStages((prev) => prev.map((s, i) => (i === idx ? { ...s, type } : s)));

	const handleSave = async () => {
		if (!workflowName.trim()) { message.error('Vui lòng nhập tên workflow'); return; }
		if (stages.length === 0) { message.error('Cần ít nhất 1 bước'); return; }
		const config = buildConfig(stages);
		setSaving(true);
		try {
			await updateWorkflowDefinition(workflowId, { name: workflowName.trim(), ...(selectedFormId ? { formId: selectedFormId } : {}), config });
			message.success('Cập nhật workflow thành công!');
			history.push(`/workflows/${workflowId}`);
		} catch (err) { console.error(err); } finally { setSaving(false); }
	};

	const mixedStages = useMemo(() => stages.map((s) => ({
		type: s.type, role: s.role, parallelRoles: s.parallelRoles, voterRole: s.voterRole,
		approveThreshold: s.approveThreshold, rejectThreshold: s.rejectThreshold,
		canReject: true, canReturn: s.type === 'sequential' && !!s.canReturn,
	})), [stages]);

	if (loadingData) {
		return <div className={styles.builderPage}><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><Spin size="large" /></div></div>;
	}

	return (
		<div className={styles.builderPage}>
			<div className={styles.builderHeader}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={() => history.push(`/workflows/${workflowId}`)}><ArrowLeftOutlined /></button>
					<div className={styles.headerInfo}><h1>Chỉnh sửa Workflow</h1><p>{workflowName}</p></div>
				</div>
				<div className={styles.headerActions}>
					<Button type="primary" icon={<SaveOutlined />} className={styles.saveBtn} loading={saving} onClick={handleSave}>Lưu thay đổi</Button>
				</div>
			</div>

			<div className={styles.builderContent}>
				{/* Basic Info */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.info}`}><FormOutlined /></div>
						<div className={styles.sectionTitle}><h3>Thông tin cơ bản</h3></div>
					</div>
					<div className={styles.sectionBody}>
						<div className={styles.formGroup}>
							<label>Tên Workflow <span className={styles.required}>*</span></label>
							<Input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} maxLength={100} />
						</div>
						<div className={styles.formGroup}>
							<label>Liên kết với Biểu mẫu</label>
							<Select placeholder="Chọn biểu mẫu" value={selectedFormId} onChange={setSelectedFormId} allowClear loading={loadingForms} style={{ width: '100%' }}
								options={forms.map((f) => ({ label: f.name, value: f.id }))} showSearch filterOption={(i, o) => (o?.label as string)?.toLowerCase().includes(i.toLowerCase())} />
						</div>
					</div>
				</div>

				{/* Stages */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.steps}`}><TeamOutlined /></div>
						<div className={styles.sectionTitle}><h3>Các bước phê duyệt</h3><p>Mỗi bước có thể chọn kiểu duyệt khác nhau</p></div>
					</div>
					<div className={styles.sectionBody}>
						<div className={styles.stagesList}>
							{stages.map((stage, idx) => {
								const meta = TYPE_META[stage.type];
								const isLast = idx === stages.length - 1;
								return (
									<React.Fragment key={stage.id}>
										<div className={styles.stageCard}>
											<div className={styles.stageHeader}>
												<div className={styles.stageBadge}>
													<div className={styles.stageNumber}>{idx + 1}</div>
													<Tag color={meta.color} icon={meta.icon} style={{ margin: 0, borderRadius: 6, fontWeight: 600 }}>{meta.label}</Tag>
													<span className={styles.stageLabel}>{getLabel(idx, stage)}</span>
												</div>
												<div className={styles.stepActions}>
													<button onClick={() => moveStage(idx, -1)} disabled={idx === 0}><UpOutlined /></button>
													<button onClick={() => moveStage(idx, 1)} disabled={isLast}><DownOutlined /></button>
													<button className={styles.deleteBtn} onClick={() => removeStage(idx)}><DeleteOutlined /></button>
												</div>
											</div>
											<div className={styles.typeRow}>
												{(['sequential', 'parallel', 'voting'] as StageType[]).map((t) => (
													<button key={t} className={`${styles.typePill} ${stage.type === t ? styles.active : ''}`} onClick={() => changeType(idx, t)}>
														{TYPE_META[t].icon} {TYPE_META[t].label}
													</button>
												))}
											</div>
											<div className={styles.stageBody}>
												{stage.type === 'sequential' && (
													<>
														<div className={styles.stageRow}>
															<div className={styles.stageField}>
																<label>Người duyệt <span style={{ color: '#ef4444' }}>*</span></label>
																<Select value={stage.role} onChange={(v) => updateStage(idx, { role: v })} style={{ width: '100%' }} options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))} />
															</div>
															<div className={styles.stageField}>
																<label>Bước tiếp theo</label>
																<Input disabled value={isLast ? 'Phê duyệt hoàn tất' : `Bước ${idx + 2}: ${getLabel(idx + 1, stages[idx + 1])}`} />
															</div>
														</div>
														<div className={styles.stagePerms}>
															<div className={`${styles.permChip} ${styles.always}`}><CheckCircleOutlined /> Phê duyệt</div>
															<div className={`${styles.permChip} ${styles.always}`}><CloseCircleOutlined /> Từ chối</div>
															<div className={`${styles.permChip} ${stage.requireCommentOnReject ? styles.active : ''}`} onClick={() => updateStage(idx, { requireCommentOnReject: !stage.requireCommentOnReject })}><Checkbox checked={stage.requireCommentOnReject} /> Ghi chú khi từ chối</div>
															<div className={`${styles.permChip} ${stage.canReturn ? styles.active : ''}`} onClick={() => updateStage(idx, { canReturn: !stage.canReturn })}><Checkbox checked={stage.canReturn} /> Trả lại để sửa</div>
															{stage.canReturn && <div className={`${styles.permChip} ${stage.requireCommentOnReturn ? styles.active : ''}`} onClick={() => updateStage(idx, { requireCommentOnReturn: !stage.requireCommentOnReturn })}><Checkbox checked={stage.requireCommentOnReturn} /> Ghi chú khi trả lại</div>}
														</div>
													</>
												)}
												{stage.type === 'parallel' && (
													<div className={styles.stageRow}>
														<div className={styles.stageField} style={{ gridColumn: '1 / -1' }}>
															<label>Các vai trò duyệt đồng thời <span style={{ color: '#ef4444' }}>*</span></label>
															<Select mode="multiple" value={stage.parallelRoles} onChange={(r) => updateStage(idx, { parallelRoles: r })} style={{ width: '100%' }} options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))} />
														</div>
													</div>
												)}
												{stage.type === 'voting' && (
													<div className={styles.stageRow}>
														<div className={styles.stageField}>
															<label>Vai trò bỏ phiếu <span style={{ color: '#ef4444' }}>*</span></label>
															<Select value={stage.voterRole} onChange={(v) => updateStage(idx, { voterRole: v })} style={{ width: '100%' }} options={ALL_ROLES.map((r) => ({ label: `${ROLE_LABELS[r]} (${r})`, value: r }))} />
														</div>
														<div className={styles.stageField}>
															<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
																<div><label>Ngưỡng đồng ý <span style={{ color: '#ef4444' }}>*</span></label><InputNumber min={1} max={99} value={stage.approveThreshold} onChange={(v) => updateStage(idx, { approveThreshold: v ?? 2 })} style={{ width: '100%' }} /></div>
																<div><label>Ngưỡng từ chối</label><InputNumber min={1} max={99} value={stage.rejectThreshold} onChange={(v) => updateStage(idx, { rejectThreshold: v ?? 2 })} style={{ width: '100%' }} /></div>
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
										{!isLast && <div className={styles.stageArrow}><div className={styles.arrowLine} /><DownOutlined className={styles.arrowIcon} /></div>}
									</React.Fragment>
								);
							})}
						</div>
						<div className={styles.addStageRow}>
							<span className={styles.addLabel}>Thêm bước:</span>
							{(['sequential', 'parallel', 'voting'] as StageType[]).map((t) => (
								<button key={t} className={styles.addTypeBtn} onClick={() => addStage(t)}><PlusOutlined /> {TYPE_META[t].icon} {TYPE_META[t].label}</button>
							))}
						</div>
					</div>
				</div>

				{/* Preview */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.preview}`}><EyeOutlined /></div>
						<div className={styles.sectionTitle}><h3>Xem trước luồng</h3></div>
					</div>
					<div className={styles.sectionBody}>
						{stages.length === 0 ? <div className={styles.emptyPreview}>Thêm bước duyệt để xem sơ đồ</div>
							: <WorkflowTree mode="mixed" mixedStages={mixedStages} roleLabels={ROLE_LABELS} />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkflowEdit;
