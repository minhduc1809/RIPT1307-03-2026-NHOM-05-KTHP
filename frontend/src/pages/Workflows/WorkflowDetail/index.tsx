import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CommentOutlined,
	EditOutlined,
} from '@ant-design/icons';
import { Button, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import { getWorkflowDefinitionById } from '@/services/Workflows/workflowApi';
import type { IWorkflowDefinition } from '@/services/Workflows/typings';
import styles from './index.less';

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
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setWorkflow(data);
		} catch (error) {
			console.error('Failed to fetch workflow:', error);
		} finally {
			setLoading(false);
		}
	}, [workflowId]);

	useEffect(() => {
		fetchWorkflow();
	}, [fetchWorkflow]);

	const config = workflow?.config;

	/** Order states: initial → middle → final */
	const orderedStates = useMemo(() => {
		if (!config?.states?.length) return [];
		const init = config.initialState ? [config.initialState] : [];
		const middle = config.states.filter(
			(s) => s !== config.initialState && !config.finalStates?.includes(s),
		);
		const final = (config.finalStates ?? []).filter((s) => s !== config.initialState);
		return [...new Set([...init, ...middle, ...final])];
	}, [config]);

	if (loading) {
		return (
			<div className={styles.detailPage}>
				<div className={styles.loadingContainer}>
					<Spin size="large" />
				</div>
			</div>
		);
	}

	if (!workflow) {
		return (
			<div className={styles.detailPage}>
				<div className={styles.loadingContainer}>
					<p>Không tìm thấy workflow</p>
				</div>
			</div>
		);
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
						<h1>{workflow.name}</h1>
						<p>Tạo ngày {moment(workflow.createdAt).format('DD/MM/YYYY HH:mm')}</p>
					</div>
				</div>
				{isAdminOrManager && (
					<div className={styles.headerActions}>
						<Button
							type="primary"
							icon={<EditOutlined />}
							className={styles.editBtn}
							onClick={() => history.push(`/workflows/${workflowId}/edit`)}
						>
							Chỉnh sửa
						</Button>
					</div>
				)}
			</div>

			{/* Content Grid */}
			<div className={styles.contentGrid}>
				{/* Info Card */}
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.info}`}>📝</div>
						<div className={styles.cardTitle}>
							<h3>Thông tin cơ bản</h3>
							<p>Chi tiết workflow definition</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Tên</span>
							<span className={styles.infoValue}>{workflow.name}</span>
						</div>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Biểu mẫu</span>
							{workflow.form ? (
								<span className={styles.formLink}>📋 {workflow.form.name}</span>
							) : (
								<span className={styles.noValue}>Không liên kết</span>
							)}
						</div>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Ngày tạo</span>
							<span className={styles.infoValue}>
								{moment(workflow.createdAt).format('DD/MM/YYYY HH:mm')}
							</span>
						</div>
						<div className={styles.infoRow}>
							<span className={styles.infoLabel}>Cập nhật</span>
							<span className={styles.infoValue}>
								{moment(workflow.updatedAt).format('DD/MM/YYYY HH:mm')}
							</span>
						</div>
					</div>
				</div>

				{/* States Card */}
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.states}`}>🔵</div>
						<div className={styles.cardTitle}>
							<h3>Trạng thái ({config?.states?.length ?? 0})</h3>
							<p>Các bước trong luồng phê duyệt</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						<div className={styles.statesList}>
							{config?.states?.map((s) => {
								const isInitial = s === config.initialState;
								const isFinal = config.finalStates?.includes(s);
								let cls = '';
								if (isInitial) cls = styles.initial;
								else if (isFinal) cls = styles.final;

								return (
									<span key={s} className={`${styles.stateChip} ${cls}`}>
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
								);
							})}
						</div>
					</div>
				</div>

				{/* Transitions Card - full width */}
				<div className={`${styles.card} ${styles.fullWidth}`}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.transitions}`}>🔀</div>
						<div className={styles.cardTitle}>
							<h3>Chuyển trạng thái ({config?.transitions?.length ?? 0})</h3>
							<p>Các quy tắc chuyển đổi giữa các trạng thái</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						{!config?.transitions?.length ? (
							<div className={styles.emptyTransitions}>Chưa có transition nào</div>
						) : (
							<div className={styles.transitionList}>
								{config.transitions.map((t, idx) => {
									const fromLabel =
										typeof t.from === 'string'
											? t.from === '*'
												? '* (tất cả)'
												: t.from
											: (t.from as string[]).join(', ');

									return (
										<div key={idx} className={styles.transitionCard}>
											<div className={styles.tFlow}>
												<span
													className={`${styles.tChip} ${
														t.from === '*' ? styles.wildcard : styles.from
													}`}
												>
													{fromLabel}
												</span>
												<span className={styles.tArrow}>
													<ArrowRightOutlined />
												</span>
												<span className={`${styles.tChip} ${styles.to}`}>
													{t.to}
												</span>
												<span className={`${styles.tChip} ${styles.action}`}>
													{t.action}
												</span>
											</div>
											<div className={styles.tMeta}>
												{t.roles?.map((r) => (
													<span key={r} className={styles.roleTag}>
														{r}
													</span>
												))}
												{t.conditions?.requireComment && (
													<span className={styles.commentTag}>
														<CommentOutlined /> bắt buộc
													</span>
												)}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>

				{/* Flow Diagram - full width */}
				<div className={`${styles.card} ${styles.fullWidth}`}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.flow}`}>👁️</div>
						<div className={styles.cardTitle}>
							<h3>Sơ đồ luồng</h3>
							<p>Tổng quan trực quan các trạng thái</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						{orderedStates.length === 0 ? (
							<div className={styles.emptyFlow}>Không có trạng thái</div>
						) : (
							<div className={styles.flowContainer}>
								<div className={styles.flowDiagram}>
									{orderedStates.map((s, idx) => {
										const isInit = s === config?.initialState;
										const isFin = config?.finalStates?.includes(s);
										let nodeClass = styles.normal;
										if (isInit) nodeClass = styles.initial;
										else if (isFin) nodeClass = styles.final;

										return (
											<React.Fragment key={s}>
												{idx > 0 && (
													<div className={styles.flowArrow}>
														<ArrowRightOutlined />
													</div>
												)}
												<div className={styles.flowNode}>
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
		</div>
	);
};

export default WorkflowDetail;
