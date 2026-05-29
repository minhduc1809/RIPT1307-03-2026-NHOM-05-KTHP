import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	DeleteOutlined,
	DownOutlined,
	PlusOutlined,
	SaveOutlined,
	UpOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Input, message, Select, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { getActiveForms } from '@/services/Forms/formApi';
import type { IForm } from '@/services/Forms/typings';
import {
	getWorkflowDefinitionById,
	updateWorkflowDefinition,
} from '@/services/Workflows/workflowApi';
import type { IWorkflowConfig, IWorkflowTransition } from '@/services/Workflows/typings';
import styles from './index.less';

const ALL_ROLES = ['ADMIN', 'MANAGER', 'HR', 'USER'];

const ROLE_LABELS: Record<string, string> = {
	ADMIN: 'Quản trị viên',
	MANAGER: 'Quản lý',
	HR: 'Nhân sự',
	USER: 'Nhân viên',
};

interface ApprovalStep {
	role: string;
	requireCommentOnReject: boolean;
	canReturn: boolean;
	requireCommentOnReturn: boolean;
}

function buildConfig(steps: ApprovalStep[]): IWorkflowConfig {
	const states: string[] = [];
	const transitions: IWorkflowTransition[] = [];

	steps.forEach((_, i) => {
		states.push(`step_${i + 1}`);
	});

	states.push('approved', 'rejected');
	const hasReturn = steps.some((s) => s.canReturn);
	if (hasReturn) states.push('returned');

	const finalStates = ['approved', 'rejected'];
	if (hasReturn) finalStates.push('returned');

	steps.forEach((step, i) => {
		const fromState = `step_${i + 1}`;
		const nextState = i < steps.length - 1 ? `step_${i + 2}` : 'approved';

		transitions.push({
			from: fromState,
			to: nextState,
			action: 'approve',
			roles: [step.role],
		});

		transitions.push({
			from: fromState,
			to: 'rejected',
			action: 'reject',
			roles: [step.role],
			...(step.requireCommentOnReject && { conditions: { requireComment: true } }),
		});

		if (step.canReturn) {
			transitions.push({
				from: fromState,
				to: 'returned',
				action: 'return_for_edit',
				roles: [step.role],
				...(step.requireCommentOnReturn && { conditions: { requireComment: true } }),
			});
		}
	});

	return {
		states,
		initialState: 'step_1',
		finalStates,
		transitions,
	};
}

function parseConfigToSteps(config: IWorkflowConfig): ApprovalStep[] | null {
	if (!config?.initialState || !config?.transitions?.length) return null;

	const steps: ApprovalStep[] = [];
	let current = config.initialState;
	const visited = new Set<string>();

	while (current && !visited.has(current)) {
		visited.add(current);
		if (config.finalStates?.includes(current)) break;

		const fromTransitions = config.transitions.filter((t) => {
			if (typeof t.from === 'string') return t.from === current;
			if (Array.isArray(t.from)) return t.from.includes(current);
			return false;
		});

		const approveT = fromTransitions.find((t) => t.action === 'approve');
		if (!approveT) break;

		const rejectT = fromTransitions.find((t) => t.action === 'reject');
		const returnT = fromTransitions.find((t) => t.action === 'return_for_edit');

		steps.push({
			role: approveT.roles?.[0] || 'MANAGER',
			requireCommentOnReject: !!rejectT?.conditions?.requireComment,
			canReturn: !!returnT,
			requireCommentOnReturn: !!returnT?.conditions?.requireComment,
		});

		current = approveT.to;
	}

	return steps.length > 0 ? steps : null;
}

const DEFAULT_STEP: ApprovalStep = {
	role: 'MANAGER',
	requireCommentOnReject: true,
	canReturn: false,
	requireCommentOnReturn: false,
};

const WorkflowEdit: React.FC = (props: any) => {
	const workflowId = props?.match?.params?.id;

	const [loadingData, setLoadingData] = useState(true);
	const [workflowName, setWorkflowName] = useState('');
	const [selectedFormId, setSelectedFormId] = useState<string | undefined>(undefined);
	const [forms, setForms] = useState<IForm[]>([]);
	const [loadingForms, setLoadingForms] = useState(false);
	const [steps, setSteps] = useState<ApprovalStep[]>([]);
	const [saving, setSaving] = useState(false);

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
						const parsed = parseConfigToSteps(data.config);
						setSteps(parsed || [{ ...DEFAULT_STEP }]);
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

	const addStep = () => {
		setSteps((prev) => [...prev, { ...DEFAULT_STEP }]);
	};

	const removeStep = (index: number) => {
		if (steps.length <= 1) {
			message.warning('Cần ít nhất 1 bước duyệt');
			return;
		}
		setSteps((prev) => prev.filter((_, i) => i !== index));
	};

	const updateStep = (index: number, patch: Partial<ApprovalStep>) => {
		setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
	};

	const moveStep = (index: number, direction: -1 | 1) => {
		const target = index + direction;
		if (target < 0 || target >= steps.length) return;
		setSteps((prev) => {
			const arr = [...prev];
			[arr[index], arr[target]] = [arr[target], arr[index]];
			return arr;
		});
	};

	const validate = (): string | null => {
		if (!workflowName.trim()) return 'Vui lòng nhập tên workflow';
		if (steps.length === 0) return 'Cần ít nhất 1 bước duyệt';
		for (let i = 0; i < steps.length; i++) {
			if (!steps[i].role) return `Buoc ${i + 1}: Chưa chọn người duyệt`;
		}
		return null;
	};

	const handleSave = async () => {
		const error = validate();
		if (error) { message.error(error); return; }

		const config = buildConfig(steps);
		setSaving(true);
		try {
			await updateWorkflowDefinition(workflowId, {
				name: workflowName.trim(),
				...(selectedFormId ? { formId: selectedFormId } : {}),
				config,
			});
			message.success('Cập nhật workflow thành công!');
			history.push(`/workflows/${workflowId}`);
		} catch (err) {
			console.error('Failed to update workflow:', err);
		} finally {
			setSaving(false);
		}
	};

	const hasReturn = steps.some((s) => s.canReturn);

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
					<Button
						type="primary"
						icon={<SaveOutlined />}
						className={styles.saveBtn}
						loading={saving}
						onClick={handleSave}
					>
						Lưu thay đổi
					</Button>
				</div>
			</div>

			<div className={styles.builderContent}>
				{/* Section 1: Basic Info */}
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
							<label>Tên Workflow <span className={styles.required}>*</span></label>
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

				{/* Section 2: Approval Steps */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.steps}`}>👥</div>
						<div className={styles.sectionTitle}>
							<h3>Các bước phê duyệt</h3>
							<p>Thêm người duyệt theo thứ tự. Yêu cầu sẽ đi qua từng bước từ trên xuống.</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						{steps.length === 0 ? (
							<div className={styles.emptySteps}>
								<span>👥</span>
								Chưa có bước duyệt nào. Nhấn nút bên dưới để thêm.
							</div>
						) : (
							<div className={styles.stepsList}>
								{steps.map((step, idx) => (
									<div key={idx} className={styles.stepCard}>
										<div className={styles.stepHeader}>
											<div className={styles.stepBadge}>
												<div className={styles.stepNumber}>{idx + 1}</div>
												<div className={styles.stepTitle}>
													{ROLE_LABELS[step.role] || step.role} duyệt
												</div>
											</div>
											<div className={styles.stepActions}>
												<button onClick={() => moveStep(idx, -1)} disabled={idx === 0} title="Di lên">
													<UpOutlined />
												</button>
												<button onClick={() => moveStep(idx, 1)} disabled={idx === steps.length - 1} title="Di xuống">
													<DownOutlined />
												</button>
												<button className={styles.deleteBtn} onClick={() => removeStep(idx)} title="Xóa bước">
													<DeleteOutlined />
												</button>
											</div>
										</div>

										<div className={styles.stepBody}>
											<div className={styles.stepField}>
												<label>Người duyệt <span style={{ color: '#ef4444' }}>*</span></label>
												<Select
													value={step.role}
													onChange={(val) => updateStep(idx, { role: val })}
													style={{ width: '100%' }}
													options={ALL_ROLES.map((r) => ({
														label: `${ROLE_LABELS[r]} (${r})`,
														value: r,
													}))}
												/>
											</div>
											<div className={styles.stepField}>
												<label>Bước tiếp theo</label>
												<Input
													disabled
													value={
														idx < steps.length - 1
															? `Bước ${idx + 2}: ${ROLE_LABELS[steps[idx + 1].role] || steps[idx + 1].role} duyệt`
															: 'Phê duyệt hoàn tất'
													}
												/>
											</div>
											<div className={styles.stepOptions}>
												<div className={styles.optionGroup}>
													<Checkbox
														checked={step.requireCommentOnReject}
														onChange={(e) => updateStep(idx, { requireCommentOnReject: e.target.checked })}
													>
														Bắt buộc ghi chú khi từ chối
													</Checkbox>
												</div>
												<div className={styles.optionGroup}>
													<Checkbox
														checked={step.canReturn}
														onChange={(e) => updateStep(idx, {
															canReturn: e.target.checked,
															...(!e.target.checked && { requireCommentOnReturn: false }),
														})}
													>
														Cho phép trả lại để sửa
													</Checkbox>
													{step.canReturn && (
														<Checkbox
															checked={step.requireCommentOnReturn}
															onChange={(e) => updateStep(idx, { requireCommentOnReturn: e.target.checked })}
														>
															Bắt buộc ghi chú khi trả lại
														</Checkbox>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						<button className={styles.addStepBtn} onClick={addStep}>
							<PlusOutlined /> Thêm bước duyệt
						</button>
					</div>
				</div>

				{/* Section 3: Preview */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.preview}`}>👁️</div>
						<div className={styles.sectionTitle}>
							<h3>Xem trước luồng</h3>
							<p>Sơ đồ tổng quan các bước phê duyệt</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						{steps.length === 0 ? (
							<div className={styles.emptyPreview}>
								Thêm bước duyệt để xem sơ đồ luồng workflow
							</div>
						) : (
							<div className={styles.previewContainer}>
								<div className={styles.previewFlow}>
									<div className={styles.previewNode}>
										<div className={`${styles.nodeDot} ${styles.start}`}>NỘP</div>
										<div className={styles.nodeName}>Nộp yêu cầu</div>
									</div>

									{steps.map((step, idx) => (
										<React.Fragment key={idx}>
											<div className={styles.previewArrow}><ArrowRightOutlined /></div>
											<div className={styles.previewNode}>
												<div className={`${styles.nodeDot} ${styles.step}`}>B{idx + 1}</div>
												<div className={styles.nodeName}>{ROLE_LABELS[step.role] || step.role}</div>
												<div className={styles.nodeRole}>duyệt</div>
											</div>
										</React.Fragment>
									))}

									<div className={styles.previewArrow}><ArrowRightOutlined /></div>
									<div className={styles.previewNode}>
										<div className={`${styles.nodeDot} ${styles.approved}`}>OK</div>
										<div className={styles.nodeName}>Phê duyệt</div>
									</div>
								</div>

								<div className={styles.previewBranches}>
										<div className={styles.branchItem}>
											<div className={`${styles.branchDot} ${styles.rejected}`} />
											Bất kỳ bước nào có thể từ chối → Kết thúc
										</div>
										{hasReturn && (
											<div className={styles.branchItem}>
												<div className={`${styles.branchDot} ${styles.returned}`} />
												Bất kỳ bước nào có thể trả lại → Người nộp sửa và nộp lại
											</div>
										)}
									</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkflowEdit;
