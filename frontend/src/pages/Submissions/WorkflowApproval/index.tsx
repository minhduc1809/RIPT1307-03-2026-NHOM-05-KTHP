import {
	ArrowRightOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	EyeOutlined,
	PlusOutlined,
	RollbackOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Button, Input, message, Modal, Popconfirm, Spin, Pagination } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import {
	executeWorkflowAction,
	getAvailableActions,
	getPendingSubmissions,
} from '@/services/Submissions/submissionApi';
import type { IAvailableAction, IWorkflowInstance } from '@/services/Submissions/typings';
import SubmitFormModal from '@/components/SubmitFormModal';
import { getReadableData } from '@/utils/formDataHelper';
import styles from './index.less';

const ACTION_LABELS: Record<string, string> = {
	approve: 'Phê duyệt',
	reject: 'Từ chối',
	cancel: 'Hủy',
	return_for_edit: 'Trả lại',
	resubmit: 'Gửi lại',
};

const WorkflowApproval: React.FC = () => {
	const [submitModalVisible, setSubmitModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [pendingItems, setPendingItems] = useState<IWorkflowInstance[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(20);

	// Per-item available actions cache
	const [actionsMap, setActionsMap] = useState<Record<string, IAvailableAction[]>>({});
	const [loadingActionsFor, setLoadingActionsFor] = useState<Set<string>>(new Set());

	// Expanded item (inline data preview)
	const [expandedId, setExpandedId] = useState<string | null>(null);

	// Reject/return modal state
	const [commentModalVisible, setCommentModalVisible] = useState(false);
	const [commentModalItem, setCommentModalItem] = useState<IWorkflowInstance | null>(null);
	const [commentModalAction, setCommentModalAction] = useState<IAvailableAction | null>(null);
	const [comment, setComment] = useState('');
	const [executing, setExecuting] = useState<string | null>(null);

	const fetchPending = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getPendingSubmissions({ page, limit });
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			const items: IWorkflowInstance[] = data?.items ?? [];
			setPendingItems(items);
			setTotal(data?.meta?.total ?? 0);

			// Pre-fetch available actions for all items
			const newLoadingSet = new Set<string>();
			items.forEach((item) => newLoadingSet.add(item.submissionId));
			setLoadingActionsFor(newLoadingSet);

			const results = await Promise.allSettled(
				items.map(async (item) => {
					const res = await getAvailableActions(item.submissionId);
					const d = (res as any)?.data?.data ?? (res as any)?.data;
					return { submissionId: item.submissionId, actions: d?.actions ?? [] };
				}),
			);

			const map: Record<string, IAvailableAction[]> = {};
			results.forEach((r) => {
				if (r.status === 'fulfilled') {
					map[r.value.submissionId] = r.value.actions;
				}
			});
			setActionsMap(map);
			setLoadingActionsFor(new Set());
		} catch (error) {
			console.error('Failed to fetch pending:', error);
		} finally {
			setLoading(false);
		}
	}, [page, limit]);

	useEffect(() => {
		fetchPending();
	}, [fetchPending]);

	const handleQuickApprove = async (item: IWorkflowInstance) => {
		setExecuting(item.submissionId);
		try {
			await executeWorkflowAction({
				submissionId: item.submissionId,
				action: 'approve',
			});
			message.success('Đã phê duyệt thành công!');
			fetchPending();
		} catch (err: any) {
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setExecuting(null);
		}
	};

	const openCommentModal = (item: IWorkflowInstance, action: IAvailableAction) => {
		setCommentModalItem(item);
		setCommentModalAction(action);
		setComment('');
		setCommentModalVisible(true);
	};

	const handleCommentSubmit = async () => {
		if (!commentModalItem || !commentModalAction) return;

		if (commentModalAction.requiresComment && !comment.trim()) {
			message.warning('Vui lòng nhập lý do');
			return;
		}

		setExecuting(commentModalItem.submissionId);
		try {
			await executeWorkflowAction({
				submissionId: commentModalItem.submissionId,
				action: commentModalAction.action,
				...(comment.trim() ? { comment: comment.trim() } : {}),
			});
			message.success(
				`Đã ${ACTION_LABELS[commentModalAction.action] || commentModalAction.action} thành công!`,
			);
			setCommentModalVisible(false);
			fetchPending();
		} catch (err: any) {
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setExecuting(null);
		}
	};

	const getActionIcon = (action: string) => {
		if (action === 'approve') return <CheckCircleOutlined />;
		if (action === 'reject' || action === 'cancel') return <CloseCircleOutlined />;
		if (action === 'return_for_edit') return <RollbackOutlined />;
		return <ArrowRightOutlined />;
	};

	return (
		<div className={styles.approvalPage}>
			{/* Header */}
			<div className={styles.pageHeader}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
					<div>
						<h1>Phê duyệt Workflow</h1>
						<p>Danh sách các yêu cầu đang chờ bạn xử lý</p>
					</div>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => setSubmitModalVisible(true)}
						style={{
							height: 40, borderRadius: 10, fontWeight: 600,
							background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
							border: 'none', boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
						}}
					>
						Nộp biểu mẫu
					</Button>
				</div>
			</div>

			{/* Stats */}
			<div className={styles.statsBar}>
				<div className={`${styles.statCard} ${styles.pending}`}>
					<div className={styles.statIcon}><ClockCircleOutlined /></div>
					<div className={styles.statInfo}>
						<div className={styles.statNumber}>{total}</div>
						<div className={styles.statLabel}>Chờ xử lý</div>
					</div>
				</div>
			</div>

			{/* Pending List */}
			<div className={styles.listSection}>
				<div className={styles.listHeader}>
					<div className={styles.listIcon}>📋</div>
					<div className={styles.listTitle}>
						<h3>Danh sách chờ duyệt</h3>
						<p>Phê duyệt nhanh hoặc nhấn vào yêu cầu để xem chi tiết</p>
					</div>
				</div>

				<div className={styles.listBody}>
					{loading ? (
						<div className={styles.loadingContainer}><Spin size="large" /></div>
					) : pendingItems.length === 0 ? (
						<div className={styles.emptyState}>
							<span>✅</span>
							<p>Không có yêu cầu nào đang chờ bạn xử lý</p>
						</div>
					) : (
						<>
							{pendingItems.map((item) => {
								const submission = item.submission;
								const readable = getReadableData(submission as any);
								const previewFields = readable.slice(0, 3);
								const actions = actionsMap[item.submissionId] ?? [];
								const isLoadingActions = loadingActionsFor.has(item.submissionId);
								const isExecuting = executing === item.submissionId;

								const approveAction = actions.find((a) => a.action === 'approve');
								const rejectAction = actions.find((a) => a.action === 'reject');
								const returnAction = actions.find((a) => a.action === 'return_for_edit');
								const otherActions = actions.filter(
									(a) => !['approve', 'reject', 'return_for_edit'].includes(a.action),
								);

								const isExpanded = expandedId === item.submissionId;

								return (
									<div key={item.id} className={`${styles.pendingItem} ${isExpanded ? styles.expanded : ''}`}>
										<div className={styles.itemRow}>
											<div
												className={styles.itemInfo}
												onClick={() => setExpandedId(isExpanded ? null : item.submissionId)}
												style={{ cursor: 'pointer' }}
											>
												<div className={styles.itemTitle}>
													{submission?.form?.name || `#${item.submissionId.substring(0, 8)}`}
													<span className={styles.itemStep}>{item.currentStep}</span>
												</div>

												<div className={styles.itemMeta}>
													{submission?.user && (
														<span className={styles.metaUser}>
															<UserOutlined />{' '}
															{submission.user.username || submission.user.email}
														</span>
													)}
													<span className={styles.metaDate}>
														<ClockCircleOutlined />{' '}
														{moment(item.createdAt).format('DD/MM/YYYY HH:mm')}
													</span>
												</div>

												{!isExpanded && previewFields.length > 0 && (
													<div className={styles.itemData}>
														{previewFields.map((f) => (
															<span key={f.key} className={styles.dataTag}>
																{f.label}: {f.value}
															</span>
														))}
													</div>
												)}
											</div>

											<div className={styles.itemActions}>
											{isLoadingActions ? (
												<Spin size="small" />
											) : (
												<>
													{/* Quick approve — one click with confirmation */}
													{approveAction && (
														<Popconfirm
															title="Xác nhận phê duyệt?"
															description="Yêu cầu sẽ được chuyển sang bước tiếp theo."
															onConfirm={(e) => {
																e?.stopPropagation();
																handleQuickApprove(item);
															}}
															onCancel={(e) => e?.stopPropagation()}
															okText="Phê duyệt"
															cancelText="Hủy"
															placement="topRight"
														>
															<button
																className={`${styles.actionBtn} ${styles.approve}`}
																onClick={(e) => e.stopPropagation()}
																disabled={isExecuting}
															>
																<CheckCircleOutlined /> Duyệt
															</button>
														</Popconfirm>
													)}

													{/* Reject — opens comment modal */}
													{rejectAction && (
														<button
															className={`${styles.actionBtn} ${styles.reject}`}
															onClick={(e) => {
																e.stopPropagation();
																openCommentModal(item, rejectAction);
															}}
															disabled={isExecuting}
														>
															<CloseCircleOutlined /> Từ chối
														</button>
													)}

													{/* Return — opens comment modal */}
													{returnAction && (
														<button
															className={`${styles.actionBtn} ${styles.other}`}
															onClick={(e) => {
																e.stopPropagation();
																openCommentModal(item, returnAction);
															}}
															disabled={isExecuting}
														>
															<RollbackOutlined /> Trả lại
														</button>
													)}

													{/* Other custom actions */}
													{otherActions.map((act) => (
														<button
															key={act.action}
															className={`${styles.actionBtn} ${styles.other}`}
															onClick={(e) => {
																e.stopPropagation();
																openCommentModal(item, act);
															}}
															disabled={isExecuting}
														>
															{getActionIcon(act.action)}{' '}
															{ACTION_LABELS[act.action] || act.action}
														</button>
													))}

													{/* View detail */}
													<button
														className={`${styles.actionBtn} ${styles.detail}`}
														onClick={(e) => {
															e.stopPropagation();
															history.push(`/submissions/${item.submissionId}`);
														}}
														title="Xem chi tiết"
													>
														<EyeOutlined />
													</button>
												</>
											)}
										</div>
										</div>

										{/* Expanded data preview */}
										{isExpanded && (
											<div className={styles.expandedData}>
												{readable.length === 0 ? (
													<div style={{ color: '#94a3b8', fontSize: 13 }}>
														Không có dữ liệu
													</div>
												) : (
													readable.map((f) => (
														<div key={f.key} className={styles.expandedRow}>
															<span className={styles.expandedKey}>{f.label}</span>
															<span className={styles.expandedValue}>{f.value}</span>
														</div>
													))
												)}
											</div>
										)}
									</div>
								);
							})}

							{total > limit && (
								<div style={{ padding: '16px 20px', textAlign: 'center' }}>
									<Pagination
										current={page}
										pageSize={limit}
										total={total}
										onChange={(p) => setPage(p)}
										showTotal={(t) => `Tổng ${t} yêu cầu`}
									/>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{/* Comment Modal for reject/return/other */}
			<Modal
				title={
					commentModalAction
						? `${ACTION_LABELS[commentModalAction.action] || commentModalAction.action} yêu cầu`
						: 'Thực hiện action'
				}
				visible={commentModalVisible}
				onCancel={() => setCommentModalVisible(false)}
				footer={null}
				width={520}
				destroyOnClose
				style={{ top: 40 }}
				bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
			>
				{commentModalItem?.submission && (
					<div className={styles.submissionData}>
						<div className={styles.dataTitle}>Dữ liệu yêu cầu</div>
						{getReadableData(commentModalItem.submission as any).map((f) => (
							<div key={f.key} className={styles.dataRow}>
								<span className={styles.dataKey}>{f.label}</span>
								<span className={styles.dataValue}>{f.value}</span>
							</div>
						))}
					</div>
				)}

				{commentModalAction && (
					<div className={styles.modalBody}>
						<div className={styles.currentState}>
							<span className={styles.stateLabel}>Chuyển đến:</span>
							<span className={styles.stateValue}>
								{commentModalItem?.currentStep}
							</span>
							<span className={styles.arrow}><ArrowRightOutlined /></span>
							<span className={styles.targetValue}>
								{commentModalAction.targetState}
							</span>
						</div>

						<div className={styles.commentField}>
							<label className={styles.commentLabel}>
								Lý do
								{commentModalAction.requiresComment && (
									<span className={styles.required}>*</span>
								)}
							</label>
							<Input.TextArea
								rows={3}
								placeholder={
									commentModalAction.requiresComment
										? 'Bắt buộc nhập lý do'
										: 'Nhập lý do (không bắt buộc)'
								}
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								autoFocus
							/>
						</div>

						<div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
							<button
								className={`${styles.actionBtn} ${styles.other}`}
								onClick={() => setCommentModalVisible(false)}
								style={{ height: 40, padding: '0 20px' }}
							>
								Hủy
							</button>
							<button
								className={`${styles.actionBtn} ${
									commentModalAction.action === 'reject' || commentModalAction.action === 'cancel'
										? styles.reject
										: styles.other
								}`}
								onClick={handleCommentSubmit}
								disabled={executing !== null}
								style={{ height: 40, padding: '0 20px', fontSize: 14 }}
							>
								{executing
									? 'Đang xử lý...'
									: `Xác nhận ${ACTION_LABELS[commentModalAction.action] || commentModalAction.action}`}
							</button>
						</div>
					</div>
				)}
			</Modal>

			<SubmitFormModal
				visible={submitModalVisible}
				onClose={() => { setSubmitModalVisible(false); fetchPending(); }}
			/>
		</div>
	);
};

export default WorkflowApproval;
