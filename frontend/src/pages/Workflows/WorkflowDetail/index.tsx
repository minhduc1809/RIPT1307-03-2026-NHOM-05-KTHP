// design: smartadmin.pen · frame 21
import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	FileTextOutlined,
	PartitionOutlined,
	RollbackOutlined,
} from '@ant-design/icons';
import { message, Modal, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import { deleteWorkflowDefinition, getWorkflowDefinitionById } from '@/services/Workflows/workflowApi';
import type { IWorkflowDefinition, IWorkflowConfig } from '@/services/Workflows/typings';
import WorkflowTree from '@/components/WorkflowTree';
import styles from './index.less';

const ROLE_LABELS: Record<string, string> = {
	ADMIN: 'Quản trị viên',
	MANAGER: 'Quản lý',
	HR: 'Nhân sự',
	USER: 'Nhân viên',
};

interface ApprovalStep {
	state: string;
	role: string;
	canReject: boolean;
	requireCommentOnReject: boolean;
	canReturn: boolean;
	requireCommentOnReturn: boolean;
}

type WorkflowType = 'sequential' | 'parallel' | 'voting' | 'unknown';

const TYPE_LABELS: Record<WorkflowType, string> = {
	sequential: 'Tuần tự',
	parallel: 'Song song',
	voting: 'Bỏ phiếu',
	unknown: 'Tùy chỉnh',
};

function detectWorkflowType(config: IWorkflowConfig): WorkflowType {
	if (config.transitions.some((t) => t.type === 'VOTING')) return 'voting';
	if (config.transitions.some((t) => t.type === 'PARALLEL_JOIN')) return 'parallel';
	if (config.transitions.some((t) => t.action === 'approve')) return 'sequential';
	return 'unknown';
}

function parseSteps(config: IWorkflowConfig): ApprovalStep[] | null {
	if (!config?.initialState || !config?.transitions?.length) return null;
	const steps: ApprovalStep[] = [];
	let current = config.initialState;
	const visited = new Set<string>();

	while (current && !visited.has(current)) {
		visited.add(current);
		if (config.finalStates?.includes(current)) break;

		const cur = current;
		const fromTs = config.transitions.filter((t) =>
			typeof t.from === 'string' ? t.from === cur : Array.isArray(t.from) ? t.from.includes(cur) : false,
		);
		const approveT = fromTs.find((t) => t.action === 'approve');
		if (!approveT) break;
		const rejectT = fromTs.find((t) => t.action === 'reject');
		const returnT = fromTs.find((t) => t.action === 'return_for_edit');

		steps.push({
			state: current,
			role: approveT.roles?.[0] || 'MANAGER',
			canReject: !!rejectT,
			requireCommentOnReject: !!rejectT?.conditions?.requireComment,
			canReturn: !!returnT,
			requireCommentOnReturn: !!returnT?.conditions?.requireComment,
		});
		current = approveT.to;
	}
	return steps.length > 0 ? steps : null;
}

const WorkflowDetail: React.FC = (props: any) => {
	const workflowId = props?.match?.params?.id;
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const userRole = currentUser?.role;
	const isAdminOrManager = userRole && ['ADMIN', 'MANAGER'].includes(userRole);

	const [loading, setLoading] = useState(true);
	const [workflow, setWorkflow] = useState<IWorkflowDefinition | null>(null);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const fetchWorkflow = useCallback(async () => {
		if (!workflowId) return;
		setLoading(true);
		try {
			const response = await getWorkflowDefinitionById(workflowId);
			setWorkflow((response as any)?.data?.data ?? (response as any)?.data);
		} catch {
			/* silent */
		} finally {
			setLoading(false);
		}
	}, [workflowId]);

	useEffect(() => {
		fetchWorkflow();
	}, [fetchWorkflow]);

	const config = workflow?.config;
	const wfType = useMemo(() => (config ? detectWorkflowType(config) : 'unknown'), [config]);
	const steps = useMemo(() => (config && wfType === 'sequential' ? parseSteps(config) : null), [config, wfType]);
	const hasReject = config?.finalStates?.includes('rejected') ?? false;
	const hasReturn = config?.finalStates?.includes('returned') ?? false;

	const uniqueRoles = useMemo(() => {
		const roles = new Set<string>();
		config?.transitions?.forEach((t) => t.roles?.forEach((r) => roles.add(r)));
		return [...roles];
	}, [config]);

	const votingTransition = useMemo(() => config?.transitions?.find((t) => t.type === 'VOTING'), [config]);
	const parallelTransition = useMemo(() => config?.transitions?.find((t) => t.type === 'PARALLEL_JOIN'), [config]);

	const confirmDelete = async () => {
		if (!workflow) return;
		setDeleting(true);
		try {
			await deleteWorkflowDefinition(workflow.id);
			message.success('Đã xóa quy trình thành công');
			history.push('/workflows');
		} catch (error: any) {
			if (error?.response?.status === 409) {
				message.error('Không thể xóa: còn workflow instance đang hoạt động');
			}
		} finally {
			setDeleting(false);
		}
	};

	if (loading) {
		return (
			<div className={styles.detailPage}>
				<div className={styles.loadingContainer}>
					<Spin size='large' />
				</div>
			</div>
		);
	}

	if (!workflow) {
		return (
			<div className={styles.detailPage}>
				<div className={styles.loadingContainer}>
					<p>Không tìm thấy quy trình</p>
				</div>
			</div>
		);
	}

	const stepSub = (s: ApprovalStep, idx: number, total: number) => {
		const parts = ['Tuần tự'];
		if (s.canReject && s.requireCommentOnReject) parts.push('Từ chối cần ghi chú');
		if (s.canReturn) parts.push(s.requireCommentOnReturn ? 'Trả lại cần ghi chú' : 'Có thể trả lại');
		if (idx === total - 1) parts.push('Bước cuối');
		return parts.join(' · ');
	};

	return (
		<div className={styles.detailPage}>
			{/* Back link */}
			<button type='button' className={styles.backLink} onClick={() => history.push('/workflows')}>
				<ArrowLeftOutlined /> Quay lại danh sách quy trình
			</button>

			{/* Header */}
			<div className={styles.detailHeader}>
				<div className={styles.headerLeft}>
					<div className={styles.titleRow}>
						<h1>{workflow.name}</h1>
						<span className={`${styles.typeBadge} ${styles[wfType]}`}>{TYPE_LABELS[wfType]}</span>
					</div>
					<div className={styles.headerMeta}>
						{steps ? `${steps.length} bước phê duyệt` : `${config?.states?.length ?? 0} trạng thái`}
						{workflow.form ? ` · Biểu mẫu: ${workflow.form.name}` : ' · Chưa liên kết biểu mẫu'}
						{` · Tạo ${moment(workflow.createdAt).format('DD/MM/YYYY')}`}
					</div>
				</div>
				{isAdminOrManager && (
					<div className={styles.headerActions}>
						{userRole === 'ADMIN' && (
							<button type='button' className={styles.deleteBtn} onClick={() => setDeleteOpen(true)}>
								<DeleteOutlined /> Xóa
							</button>
						)}
						<button type='button' className={styles.editBtn} onClick={() => history.push(`/workflows/${workflowId}/edit`)}>
							<EditOutlined /> Chỉnh sửa quy trình
						</button>
					</div>
				)}
			</div>

			{/* Body: trái 380 + sơ đồ */}
			<div className={styles.bodyGrid}>
				<div className={styles.leftCol}>
					{/* Các bước phê duyệt */}
					<div className={styles.card}>
						<h3 className={styles.cardTitle}>Các bước phê duyệt</h3>
						{steps ? (
							steps.map((s, idx) => (
								<div key={s.state} className={styles.stepRow}>
									<span className={`${styles.stepNum} ${idx % 2 === 1 ? styles.violet : ''}`}>{idx + 1}</span>
									<div className={styles.stepInfo}>
										<div className={styles.stepName}>
											{ROLE_LABELS[s.role] || s.role} ({s.role})
										</div>
										<div className={styles.stepSub}>{stepSub(s, idx, steps.length)}</div>
									</div>
								</div>
							))
						) : (
							<div className={styles.emptyNote}>
								{wfType === 'parallel' && parallelTransition
									? `Duyệt song song: ${(parallelTransition.roles || []).map((r) => ROLE_LABELS[r] || r).join(', ')}`
									: wfType === 'voting' && votingTransition
									? `Bỏ phiếu bởi ${ROLE_LABELS[votingTransition.roles?.[0] || ''] || votingTransition.roles?.[0]} — cần ≥${
											votingTransition.votingConfig?.approveThreshold ?? 2
									  } đồng ý`
									: `Quy trình tùy chỉnh — ${config?.transitions?.length ?? 0} chuyển tiếp`}
							</div>
						)}
					</div>

					{/* Biểu mẫu liên kết */}
					<div className={styles.card}>
						<h3 className={styles.cardTitle}>Biểu mẫu liên kết {workflow.form ? '(1)' : '(0)'}</h3>
						{workflow.form ? (
							<div className={styles.formRow} onClick={() => history.push(`/forms/${workflow.formId}`)}>
								<span className={styles.formIcon}>
									<FileTextOutlined />
								</span>
								<span className={styles.formName}>{workflow.form.name}</span>
								<span className={styles.formView}>Xem →</span>
							</div>
						) : (
							<div className={styles.emptyNote}>Chưa có biểu mẫu nào sử dụng quy trình này</div>
						)}
					</div>

					{/* Thông tin */}
					<div className={styles.card}>
						<h3 className={styles.cardTitle}>Thông tin</h3>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Vai trò tham gia</span>
							<span className={styles.roleTags}>
								{uniqueRoles.map((r) => (
									<span key={r} className={styles.roleChip}>
										{ROLE_LABELS[r] || r}
									</span>
								))}
							</span>
						</div>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Ngày tạo</span>
							<span className={styles.infoValue}>{moment(workflow.createdAt).format('DD/MM/YYYY HH:mm')}</span>
						</div>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Cập nhật lần cuối</span>
							<span className={styles.infoValue}>{moment(workflow.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
						</div>
					</div>

					{/* Kết quả có thể */}
					<div className={styles.card}>
						<h3 className={styles.cardTitle}>Kết quả có thể xảy ra</h3>
						<div className={`${styles.outcomeRow} ${styles.approved}`}>
							<CheckCircleOutlined /> Được phê duyệt
						</div>
						{hasReject && (
							<div className={`${styles.outcomeRow} ${styles.rejected}`}>
								<CloseCircleOutlined /> Bị từ chối
							</div>
						)}
						{hasReturn && (
							<div className={`${styles.outcomeRow} ${styles.returned}`}>
								<RollbackOutlined /> Trả lại để chỉnh sửa
							</div>
						)}
					</div>
				</div>

				{/* Sơ đồ quy trình */}
				<div className={styles.treeCard}>
					<div className={styles.treeHeader}>
						<PartitionOutlined /> Sơ đồ quy trình
					</div>
					<div className={styles.treeBody}>
						{wfType === 'sequential' && steps ? (
							<WorkflowTree mode='sequential' steps={steps} roleLabels={ROLE_LABELS} />
						) : wfType === 'parallel' && parallelTransition ? (
							<WorkflowTree mode='parallel' parallelData={{ roles: parallelTransition.roles || [] }} roleLabels={ROLE_LABELS} />
						) : wfType === 'voting' && votingTransition?.votingConfig ? (
							<WorkflowTree
								mode='voting'
								votingData={{
									voterRole: votingTransition.roles?.[0] || 'MANAGER',
									approveThreshold: votingTransition.votingConfig.approveThreshold,
									rejectThreshold: votingTransition.votingConfig.rejectThreshold,
								}}
								roleLabels={ROLE_LABELS}
							/>
						) : (
							<div className={styles.emptyNote}>
								Workflow tùy chỉnh — {config?.states?.length ?? 0} trạng thái, {config?.transitions?.length ?? 0} chuyển tiếp
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Modal xác nhận xóa — frame 17 (confirmModal) */}
			<Modal
				visible={deleteOpen}
				onCancel={() => setDeleteOpen(false)}
				footer={null}
				width={400}
				centered
				closable={false}
				className={styles.deleteModal}
			>
				<div className={styles.deleteModalBody}>
					<div className={styles.deleteIconCircle}>
						<DeleteOutlined />
					</div>
					<h3>Xác nhận xóa quy trình?</h3>
					<p>
						Quy trình <strong>“{workflow.name}”</strong> sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
					</p>
					<div className={styles.deleteModalActions}>
						<button type='button' className={styles.cancelBtn} onClick={() => setDeleteOpen(false)} disabled={deleting}>
							Hủy
						</button>
						<button type='button' className={styles.dangerBtn} onClick={confirmDelete} disabled={deleting}>
							<DeleteOutlined /> {deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default WorkflowDetail;
