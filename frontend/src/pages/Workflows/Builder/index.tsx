import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	DeleteOutlined,
	DownOutlined,
	PlusOutlined,
	SaveOutlined,
	UpOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Input, message, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import { getActiveForms } from '@/services/Forms/formApi';
import type { IForm } from '@/services/Forms/typings';
import { createWorkflowDefinition } from '@/services/Workflows/workflowApi';
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
	canReject: boolean;
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

	states.push('approved');
	const hasReject = steps.some((s) => s.canReject);
	const hasReturn = steps.some((s) => s.canReturn);
	if (hasReject) states.push('rejected');
	if (hasReturn) states.push('returned');

	const finalStates = ['approved'];
	if (hasReject) finalStates.push('rejected');
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

		if (step.canReject) {
			transitions.push({
				from: fromState,
				to: 'rejected',
				action: 'reject',
				roles: [step.role],
				...(step.requireCommentOnReject && { conditions: { requireComment: true } }),
			});
		}

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

const DEFAULT_STEP: ApprovalStep = {
	role: 'MANAGER',
	canReject: true,
	requireCommentOnReject: true,
	canReturn: false,
	requireCommentOnReturn: false,
};

const WorkflowBuilder: React.FC = () => {
	const [workflowName, setWorkflowName] = useState('');
	const [selectedFormId, setSelectedFormId] = useState<string | undefined>(undefined);
	const [forms, setForms] = useState<IForm[]>([]);
	const [loadingForms, setLoadingForms] = useState(false);
	const [steps, setSteps] = useState<ApprovalStep[]>([{ ...DEFAULT_STEP }]);
	const [saving, setSaving] = useState(false);

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
			if (!steps[i].role) return `Bước ${i + 1}: Chưa chọn người duyệt`;
		}
		return null;
	};

	const handleSave = async () => {
		const error = validate();
		if (error) { message.error(error); return; }

		const config = buildConfig(steps);
		setSaving(true);
		try {
			await createWorkflowDefinition({
				name: workflowName.trim(),
				...(selectedFormId && { formId: selectedFormId }),
				config,
			});
			message.success('Tao workflow thanh cong!');
			history.push('/workflows');
		} catch (err) {
			console.error('Failed to create workflow:', err);
		} finally {
			setSaving(false);
		}
	};

	const previewConfig = useMemo(() => {
		if (steps.length === 0) return null;
		return buildConfig(steps);
	}, [steps]);

	const hasReject = steps.some((s) => s.canReject);
	const hasReturn = steps.some((s) => s.canReturn);

	return (
		<div className={styles.builderPage}>
			{/* Header */}
			<div className={styles.builderHeader}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={() => history.push('/workflows')}>
						<ArrowLeftOutlined />
					</button>
					<div className={styles.headerInfo}>
						<h1>Tao Workflow Moi</h1>
						<p>Thiet ke luong phe duyet cho bieu mau cua ban</p>
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
						Luu Workflow
					</Button>
				</div>
			</div>

			<div className={styles.builderContent}>
				{/* Section 1: Basic Info */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.info}`}>📝</div>
						<div className={styles.sectionTitle}>
							<h3>Thong tin co ban</h3>
							<p>Dat ten va lien ket workflow voi bieu mau</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						<div className={styles.formGroup}>
							<label>Ten Workflow <span className={styles.required}>*</span></label>
							<Input
								placeholder="Vi du: Luong phe duyet don nghi phep"
								value={workflowName}
								onChange={(e) => setWorkflowName(e.target.value)}
								maxLength={100}
							/>
						</div>
						<div className={styles.formGroup}>
							<label>Lien ket voi Bieu mau</label>
							<Select
								placeholder="Chon bieu mau (khong bat buoc)"
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
							<h3>Cac buoc phe duyet</h3>
							<p>Them nguoi duyet theo thu tu. Yeu cau se di qua tung buoc tu tren xuong.</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						{steps.length === 0 ? (
							<div className={styles.emptySteps}>
								<span>👥</span>
								Chua co buoc duyet nao. Nhan nut ben duoi de them.
							</div>
						) : (
							<div className={styles.stepsList}>
								{steps.map((step, idx) => (
									<div key={idx} className={styles.stepCard}>
										<div className={styles.stepHeader}>
											<div className={styles.stepBadge}>
												<div className={styles.stepNumber}>{idx + 1}</div>
												<div className={styles.stepTitle}>
													{ROLE_LABELS[step.role] || step.role} duyet
												</div>
											</div>
											<div className={styles.stepActions}>
												<button
													onClick={() => moveStep(idx, -1)}
													disabled={idx === 0}
													title="Di len"
												>
													<UpOutlined />
												</button>
												<button
													onClick={() => moveStep(idx, 1)}
													disabled={idx === steps.length - 1}
													title="Di xuong"
												>
													<DownOutlined />
												</button>
												<button
													className={styles.deleteBtn}
													onClick={() => removeStep(idx)}
													title="Xoa buoc"
												>
													<DeleteOutlined />
												</button>
											</div>
										</div>

										<div className={styles.stepBody}>
											<div className={styles.stepField}>
												<label>Nguoi duyet <span style={{ color: '#ef4444' }}>*</span></label>
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
												<label>Buoc tiep theo</label>
												<Input
													disabled
													value={
														idx < steps.length - 1
															? `Buoc ${idx + 2}: ${ROLE_LABELS[steps[idx + 1].role] || steps[idx + 1].role} duyet`
															: 'Phe duyet hoan tat'
													}
												/>
											</div>
											<div className={styles.stepOptions}>
												<div className={styles.optionGroup}>
													<Checkbox
														checked={step.canReject}
														onChange={(e) => updateStep(idx, {
															canReject: e.target.checked,
															...(!e.target.checked && { requireCommentOnReject: false }),
														})}
													>
														Co the tu choi
													</Checkbox>
													{step.canReject && (
														<Checkbox
															checked={step.requireCommentOnReject}
															onChange={(e) => updateStep(idx, { requireCommentOnReject: e.target.checked })}
														>
															Bat buoc ghi chu khi tu choi
														</Checkbox>
													)}
												</div>
												<div className={styles.optionGroup}>
													<Checkbox
														checked={step.canReturn}
														onChange={(e) => updateStep(idx, {
															canReturn: e.target.checked,
															...(!e.target.checked && { requireCommentOnReturn: false }),
														})}
													>
														Co the tra lai
													</Checkbox>
													{step.canReturn && (
														<Checkbox
															checked={step.requireCommentOnReturn}
															onChange={(e) => updateStep(idx, { requireCommentOnReturn: e.target.checked })}
														>
															Bat buoc ghi chu khi tra lai
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
							<PlusOutlined /> Them buoc duyet
						</button>
					</div>
				</div>

				{/* Section 3: Preview */}
				<div className={styles.sectionCard}>
					<div className={styles.sectionHeader}>
						<div className={`${styles.sectionIcon} ${styles.preview}`}>👁️</div>
						<div className={styles.sectionTitle}>
							<h3>Xem truoc luong</h3>
							<p>So do tong quan cac buoc phe duyet</p>
						</div>
					</div>
					<div className={styles.sectionBody}>
						{steps.length === 0 ? (
							<div className={styles.emptyPreview}>
								Them buoc duyet de xem so do luong workflow
							</div>
						) : (
							<div className={styles.previewContainer}>
								<div className={styles.previewFlow}>
									{/* Submit node */}
									<div className={styles.previewNode}>
										<div className={`${styles.nodeDot} ${styles.start}`}>NOP</div>
										<div className={styles.nodeName}>Nop yeu cau</div>
									</div>

									{steps.map((step, idx) => (
										<React.Fragment key={idx}>
											<div className={styles.previewArrow}><ArrowRightOutlined /></div>
											<div className={styles.previewNode}>
												<div className={`${styles.nodeDot} ${styles.step}`}>
													B{idx + 1}
												</div>
												<div className={styles.nodeName}>
													{ROLE_LABELS[step.role] || step.role}
												</div>
												<div className={styles.nodeRole}>duyet</div>
											</div>
										</React.Fragment>
									))}

									<div className={styles.previewArrow}><ArrowRightOutlined /></div>
									<div className={styles.previewNode}>
										<div className={`${styles.nodeDot} ${styles.approved}`}>OK</div>
										<div className={styles.nodeName}>Phe duyet</div>
									</div>
								</div>

								{(hasReject || hasReturn) && (
									<div className={styles.previewBranches}>
										{hasReject && (
											<div className={styles.branchItem}>
												<div className={`${styles.branchDot} ${styles.rejected}`} />
												Bat ky buoc nao co the tu choi → Ket thuc
											</div>
										)}
										{hasReturn && (
											<div className={styles.branchItem}>
												<div className={`${styles.branchDot} ${styles.returned}`} />
												Bat ky buoc nao co the tra lai → Nguoi nop sua va nop lai
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkflowBuilder;
