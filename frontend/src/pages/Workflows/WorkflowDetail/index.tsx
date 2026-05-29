import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	EditOutlined,
	FileTextOutlined,
	LinkOutlined,
	RollbackOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Button, Spin, Tag } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import { getWorkflowDefinitionById } from '@/services/Workflows/workflowApi';
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

function parseSteps(config: IWorkflowConfig): ApprovalStep[] | null {
	if (!config?.initialState || !config?.transitions?.length) return null;
	const steps: ApprovalStep[] = [];
	let current = config.initialState;
	const visited = new Set<string>();

	while (current && !visited.has(current)) {
		visited.add(current);
		if (config.finalStates?.includes(current)) break;

		const fromTs = config.transitions.filter((t) =>
			typeof t.from === 'string' ? t.from === current : Array.isArray(t.from) ? t.from.includes(current) : false,
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
	const isAdminOrManager = currentUser?.role && ['ADMIN', 'MANAGER'].includes(currentUser.role);

	const [loading, setLoading] = useState(true);
	const [workflow, setWorkflow] = useState<IWorkflowDefinition | null>(null);

	const fetchWorkflow = useCallback(async () => {
		if (!workflowId) return;
		setLoading(true);
		try {
			const response = await getWorkflowDefinitionById(workflowId);
			setWorkflow((response as any)?.data?.data ?? (response as any)?.data);
		} catch { /* silent */ } finally {
			setLoading(false);
		}
	}, [workflowId]);

	useEffect(() => { fetchWorkflow(); }, [fetchWorkflow]);

	const config = workflow?.config;
	const steps = useMemo(() => config ? parseSteps(config) : null, [config]);
	const hasReject = config?.finalStates?.includes('rejected') ?? false;
	const hasReturn = config?.finalStates?.includes('returned') ?? false;
	const uniqueRoles = useMemo(() => [...new Set(steps?.map((s) => s.role) ?? [])], [steps]);

	if (loading) {
		return <div className={styles.detailPage}><div className={styles.loadingContainer}><Spin size="large" /></div></div>;
	}

	if (!workflow) {
		return <div className={styles.detailPage}><div className={styles.loadingContainer}><p>Không tìm thấy workflow</p></div></div>;
	}

	return (
		<div className={styles.detailPage}>
			{/* Header */}
			<div className={styles.detailHeader}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={() => history.push('/workflows')}>
						<ArrowLeftOutlined />
					</button>
					<div className={styles.headerInfo}>
						<div className={styles.titleRow}>
							<h1>{workflow.name}</h1>
							<Tag color="blue">{steps?.length ?? 0} bước duyệt</Tag>
						</div>
						<div className={styles.headerMeta}>
							{workflow.form && (
								<span className={styles.metaItem}>
									<LinkOutlined /> {workflow.form.name}
								</span>
							)}
							<span className={styles.metaItem}>
								<ClockCircleOutlined /> {moment(workflow.createdAt).format('DD/MM/YYYY')}
							</span>
						</div>
					</div>
				</div>
				{isAdminOrManager && (
					<Button
						type="primary"
						icon={<EditOutlined />}
						className={styles.editBtn}
						onClick={() => history.push(`/workflows/${workflowId}/edit`)}
					>
						Chỉnh sửa
					</Button>
				)}
			</div>

			{/* Quick Stats */}
			<div className={styles.statsRow}>
				<div className={styles.statCard}>
					<div className={`${styles.statIcon} ${styles.steps}`}><TeamOutlined /></div>
					<div className={styles.statInfo}>
						<div className={styles.statNumber}>{steps?.length ?? 0}</div>
						<div className={styles.statLabel}>Bước duyệt</div>
					</div>
				</div>
				<div className={styles.statCard}>
					<div className={`${styles.statIcon} ${styles.roles}`}><UserOutlined /></div>
					<div className={styles.statInfo}>
						<div className={styles.statNumber}>{uniqueRoles.length}</div>
						<div className={styles.statLabel}>Vai trò tham gia</div>
					</div>
				</div>
				<div className={styles.statCard}>
					<div className={`${styles.statIcon} ${styles.outcomes}`}><FileTextOutlined /></div>
					<div className={styles.statInfo}>
						<div className={styles.statNumber}>{(hasReject ? 1 : 0) + (hasReturn ? 1 : 0) + 1}</div>
						<div className={styles.statLabel}>Kết quả có thể</div>
					</div>
				</div>
			</div>

			<div className={styles.contentGrid}>
				{/* Approval Flow */}
				<div className={`${styles.card} ${styles.fullWidth}`}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.flow}`}><TeamOutlined /></div>
						<div className={styles.cardTitle}>
							<h3>Luồng phê duyệt</h3>
							<p>Yêu cầu sẽ đi qua các bước sau theo thứ tự từ trên xuống</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						{steps && steps.length > 0 ? (
							<WorkflowTree steps={steps} roleLabels={ROLE_LABELS} />
						) : (
							<div className={styles.emptyFlow}>Không thể phân tích luồng phê duyệt</div>
						)}
					</div>
				</div>

				{/* Info Card */}
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.info}`}><FileTextOutlined /></div>
						<div className={styles.cardTitle}>
							<h3>Thông tin chi tiết</h3>
							<p>Cấu hình workflow</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Tên workflow</span>
							<span className={styles.infoValue}>{workflow.name}</span>
						</div>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Biểu mẫu</span>
							{workflow.form ? (
								<span className={styles.formLink}>{workflow.form.name}</span>
							) : (
								<span className={styles.noValue}>Chưa liên kết</span>
							)}
						</div>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Vai trò tham gia</span>
							<div className={styles.roleTags}>
								{uniqueRoles.map((r) => (
									<span key={r} className={styles.roleChip}>{ROLE_LABELS[r] || r}</span>
								))}
							</div>
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
				</div>

				{/* Outcomes Card */}
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.outcomes}`}><CheckCircleOutlined /></div>
						<div className={styles.cardTitle}>
							<h3>Kết quả có thể xảy ra</h3>
							<p>Trạng thái cuối cùng của yêu cầu</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						<div className={styles.outcomesList}>
							<div className={`${styles.outcomeItem} ${styles.approved}`}>
								<div className={styles.outcomeIcon}><CheckCircleOutlined /></div>
								<div className={styles.outcomeInfo}>
									<div className={styles.outcomeTitle}>Được phê duyệt</div>
									<div className={styles.outcomeDesc}>Yêu cầu vượt qua tất cả {steps?.length ?? 0} bước duyệt thành công</div>
								</div>
							</div>
							{hasReject && (
								<div className={`${styles.outcomeItem} ${styles.rejected}`}>
									<div className={styles.outcomeIcon}><CloseCircleOutlined /></div>
									<div className={styles.outcomeInfo}>
										<div className={styles.outcomeTitle}>Bị từ chối</div>
										<div className={styles.outcomeDesc}>Người duyệt ở bất kỳ bước nào quyết định từ chối yêu cầu</div>
									</div>
								</div>
							)}
							{hasReturn && (
								<div className={`${styles.outcomeItem} ${styles.returned}`}>
									<div className={styles.outcomeIcon}><RollbackOutlined /></div>
									<div className={styles.outcomeInfo}>
										<div className={styles.outcomeTitle}>Trả lại để chỉnh sửa</div>
										<div className={styles.outcomeDesc}>Yêu cầu được gửi về cho người nộp để sửa đổi và nộp lại</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkflowDetail;
