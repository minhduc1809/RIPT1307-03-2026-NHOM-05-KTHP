import {
	ArrowRightOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Input, message, Modal, Spin, Pagination } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
	executeWorkflowAction,
	getAvailableActions,
	getPendingSubmissions,
} from '@/services/Submissions/submissionApi';
import type { IAvailableAction, IWorkflowInstance } from '@/services/Submissions/typings';
import styles from './index.less';

const WorkflowApproval: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [pendingItems, setPendingItems] = useState<IWorkflowInstance[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(20);

	// Action modal state
	const [actionModalVisible, setActionModalVisible] = useState(false);
	const [selectedItem, setSelectedItem] = useState<IWorkflowInstance | null>(null);
	const [availableActions, setAvailableActions] = useState<IAvailableAction[]>([]);
	const [currentState, setCurrentState] = useState('');
	const [loadingActions, setLoadingActions] = useState(false);
	const [selectedAction, setSelectedAction] = useState<IAvailableAction | null>(null);
	const [comment, setComment] = useState('');
	const [executing, setExecuting] = useState(false);

	const fetchPending = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getPendingSubmissions({ page, limit });
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setPendingItems(data?.items ?? []);
			setTotal(data?.meta?.total ?? 0);
		} catch (error) {
			console.error('Failed to fetch pending:', error);
		} finally {
			setLoading(false);
		}
	}, [page, limit]);

	useEffect(() => {
		fetchPending();
	}, [fetchPending]);

	// Open action modal
	const handleOpenActions = async (item: IWorkflowInstance) => {
		setSelectedItem(item);
		setSelectedAction(null);
		setComment('');
		setLoadingActions(true);
		setActionModalVisible(true);

		try {
			const response = await getAvailableActions(item.submissionId);
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setAvailableActions(data?.actions ?? []);
			setCurrentState(data?.currentState ?? item.currentStep);
		} catch {
			message.error('Không thể tải danh sách action');
			setAvailableActions([]);
		} finally {
			setLoadingActions(false);
		}
	};

	// Execute action
	const handleExecuteAction = async () => {
		if (!selectedItem || !selectedAction) return;

		if (selectedAction.requiresComment && !comment.trim()) {
			message.warning('Vui lòng nhập ghi chú cho action này');
			return;
		}

		setExecuting(true);
		try {
			await executeWorkflowAction({
				submissionId: selectedItem.submissionId,
				action: selectedAction.action,
				...(comment.trim() ? { comment: comment.trim() } : {}),
			});
			message.success(
				`Đã thực hiện "${selectedAction.action}" thành công!`,
			);
			setActionModalVisible(false);
			fetchPending(); // Refresh list
		} catch (err: any) {
			const errMsg = err?.response?.data?.message;
			if (errMsg) {
				message.error(errMsg);
			}
		} finally {
			setExecuting(false);
		}
	};

	const getActionBtnClass = (action: string): string => {
		if (action === 'approve') return styles.approve;
		if (action === 'reject' || action === 'cancel') return styles.reject;
		return styles.other;
	};

	const getActionIcon = (action: string) => {
		if (action === 'approve') return <CheckCircleOutlined />;
		if (action === 'reject' || action === 'cancel') return <CloseCircleOutlined />;
		return <ArrowRightOutlined />;
	};

	const getActionLabel = (action: string): string => {
		const labels: Record<string, string> = {
			approve: 'Phê duyệt',
			reject: 'Từ chối',
			cancel: 'Hủy',
			return_for_edit: 'Trả lại',
			resubmit: 'Gửi lại',
		};
		return labels[action] || action;
	};

	return (
		<div className={styles.approvalPage}>
			{/* Header */}
			<div className={styles.pageHeader}>
				<h1>Phê duyệt Workflow</h1>
				<p>Danh sách các yêu cầu đang chờ bạn xử lý</p>
			</div>

			{/* Stats */}
			<div className={styles.statsBar}>
				<div className={`${styles.statCard} ${styles.pending}`}>
					<div className={styles.statIcon}>
						<ClockCircleOutlined />
					</div>
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
						<p>Nhấn vào yêu cầu để xem chi tiết và thực hiện action</p>
					</div>
				</div>

				<div className={styles.listBody}>
					{loading ? (
						<div className={styles.loadingContainer}>
							<Spin size="large" />
						</div>
					) : pendingItems.length === 0 ? (
						<div className={styles.emptyState}>
							<span>✅</span>
							<p>Không có yêu cầu nào đang chờ bạn xử lý</p>
						</div>
					) : (
						<>
							{pendingItems.map((item) => {
								const submission = item.submission;
								const submissionData = submission?.data ?? {};
								const dataKeys = Object.keys(submissionData).slice(0, 3);

								return (
									<div
										key={item.id}
										className={styles.pendingItem}
										onClick={() => handleOpenActions(item)}
									>
										<div className={styles.itemInfo}>
											<div className={styles.itemTitle}>
												Submission #{item.submissionId.substring(0, 8)}
												<span className={styles.itemStep}>
													{item.currentStep}
												</span>
											</div>

											<div className={styles.itemMeta}>
												{submission?.user && (
													<span className={styles.metaUser}>
														<UserOutlined />{' '}
														{submission.user.username ||
															submission.user.email}
													</span>
												)}
												<span className={styles.metaDate}>
													<ClockCircleOutlined />{' '}
													{moment(item.createdAt).format(
														'DD/MM/YYYY HH:mm',
													)}
												</span>
											</div>

											{dataKeys.length > 0 && (
												<div className={styles.itemData}>
													{dataKeys.map((key) => (
														<span
															key={key}
															className={styles.dataTag}
														>
															{key}: {String(submissionData[key])}
														</span>
													))}
												</div>
											)}
										</div>

										<div className={styles.itemActions}>
											<button
												className={`${styles.actionBtn} ${styles.approve}`}
												onClick={(e) => {
													e.stopPropagation();
													handleOpenActions(item);
												}}
											>
												Xử lý
											</button>
										</div>
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

			{/* Action Modal */}
			<Modal
				title="Thực hiện Action"
				visible={actionModalVisible}
				onCancel={() => setActionModalVisible(false)}
				footer={null}
				width={560}
				destroyOnClose
			>
				{loadingActions ? (
					<div className={styles.loadingContainer}>
						<Spin />
					</div>
				) : (
					<div className={styles.modalBody}>
						{/* Submission Data Preview */}
						{selectedItem?.submission?.data && (
							<div className={styles.submissionData}>
								<div className={styles.dataTitle}>Dữ liệu đã nộp</div>
								{Object.entries(selectedItem.submission.data).map(
									([key, value]) => (
										<div key={key} className={styles.dataRow}>
											<span className={styles.dataKey}>{key}</span>
											<span className={styles.dataValue}>
												{String(value)}
											</span>
										</div>
									),
								)}
							</div>
						)}

						{/* Current State */}
						<div className={styles.currentState}>
							<span className={styles.stateLabel}>Trạng thái:</span>
							<span className={styles.stateValue}>{currentState}</span>
						</div>

						{/* Actions */}
						{availableActions.length === 0 ? (
							<div className={styles.emptyState}>
								<p>Không có action nào khả dụng cho bạn</p>
							</div>
						) : (
							<>
								{/* Action buttons */}
								<div
									style={{
										display: 'flex',
										gap: 10,
										flexWrap: 'wrap',
										marginBottom: 16,
									}}
								>
									{availableActions.map((act) => (
										<button
											key={act.action}
											className={`${styles.actionBtn} ${getActionBtnClass(act.action)}`}
											onClick={() => setSelectedAction(act)}
											style={{
												outline:
													selectedAction?.action === act.action
														? '2px solid #2563eb'
														: 'none',
												outlineOffset: 2,
											}}
										>
											{getActionIcon(act.action)}{' '}
											{getActionLabel(act.action)}
										</button>
									))}
								</div>

								{/* Selected action detail */}
								{selectedAction && (
									<>
										<div className={styles.currentState}>
											<span className={styles.stateLabel}>
												Chuyển đến:
											</span>
											<span className={styles.stateValue}>
												{currentState}
											</span>
											<span className={styles.arrow}>
												<ArrowRightOutlined />
											</span>
											<span className={styles.targetValue}>
												{selectedAction.targetState}
											</span>
										</div>

										{/* Comment */}
										<div className={styles.commentField}>
											<label className={styles.commentLabel}>
												Ghi chú
												{selectedAction.requiresComment && (
													<span className={styles.required}>*</span>
												)}
											</label>
											<Input.TextArea
												rows={3}
												placeholder={
													selectedAction.requiresComment
														? 'Bắt buộc nhập ghi chú cho action này'
														: 'Nhập ghi chú (không bắt buộc)'
												}
												value={comment}
												onChange={(e) => setComment(e.target.value)}
											/>
										</div>

										{/* Execute button */}
										<div
											style={{
												marginTop: 20,
												display: 'flex',
												justifyContent: 'flex-end',
											}}
										>
											<button
												className={`${styles.actionBtn} ${getActionBtnClass(selectedAction.action)}`}
												onClick={handleExecuteAction}
												disabled={executing}
												style={{
													height: 42,
													padding: '0 24px',
													fontSize: 14,
													opacity: executing ? 0.6 : 1,
												}}
											>
												{executing
													? 'Đang xử lý...'
													: `Xác nhận ${getActionLabel(selectedAction.action)}`}
											</button>
										</div>
									</>
								)}
							</>
						)}
					</div>
				)}
			</Modal>
		</div>
	);
};

export default WorkflowApproval;
