import {
	ArrowRightOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	ExportOutlined,
	FilterOutlined,
	RollbackOutlined,
	SearchOutlined,
	SwapOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Badge, Button, Input, message, Modal, Pagination, Select, Spin, Tag, Tooltip } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import {
	executeWorkflowAction,
	getAvailableActions,
	getPendingSubmissions,
} from '@/services/Submissions/submissionApi';
import type { IAvailableAction, IWorkflowInstance } from '@/services/Submissions/typings';
import { getDelegations } from '@/services/Delegations/delegationApi';
import type { IDelegation } from '@/services/Delegations/typings';
import { getReadableData } from '@/utils/formDataHelper';
import ExportJobButton from '@/components/ExportJobButton';
import { getStateLabel } from '@/utils/workflowLabels';
import styles from './index.less';

const ACTION_LABELS: Record<string, string> = {
	approve: 'Phê duyệt',
	reject: 'Từ chối',
	return_for_edit: 'Trả lại',
	cancel: 'Hủy',
	vote_approve: 'Đồng ý',
	vote_reject: 'Từ chối',
};

const ACTION_COLORS: Record<string, { bg: string; text: string; hover: string }> = {
	approve: { bg: '#d1fae5', text: '#047857', hover: '#a7f3d0' },
	vote_approve: { bg: '#d1fae5', text: '#047857', hover: '#a7f3d0' },
	reject: { bg: '#fee2e2', text: '#dc2626', hover: '#fecaca' },
	vote_reject: { bg: '#fee2e2', text: '#dc2626', hover: '#fecaca' },
	cancel: { bg: '#fee2e2', text: '#dc2626', hover: '#fecaca' },
	return_for_edit: { bg: '#e0e7ff', text: '#4338ca', hover: '#c7d2fe' },
};

const STEP_COLORS = [
	'#6366f1', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899',
	'#10b981', '#f97316', '#14b8a6', '#e11d48', '#7c3aed',
];

const PendingApprovals: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const userId = initialState?.currentUser?.id;

	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState<IWorkflowInstance[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(100);

	// View mode
	const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
	const [searchText, setSearchText] = useState('');
	const [filterForm, setFilterForm] = useState<string | undefined>(undefined);

	// Quick action
	const [actionModalVisible, setActionModalVisible] = useState(false);
	const [activeItem, setActiveItem] = useState<IWorkflowInstance | null>(null);
	const [availableActions, setAvailableActions] = useState<IAvailableAction[]>([]);
	const [selectedAction, setSelectedAction] = useState<IAvailableAction | null>(null);
	const [comment, setComment] = useState('');
	const [executing, setExecuting] = useState(false);
	const [loadingActions, setLoadingActions] = useState(false);

	// Inline quick action
	const [inlineExecuting, setInlineExecuting] = useState<string | null>(null);

	// Delegation
	const [activeDelegations, setActiveDelegations] = useState<IDelegation[]>([]);
	const [delegatedForId, setDelegatedForId] = useState<string | undefined>(undefined);

	// Bulk selection
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const fetchPending = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getPendingSubmissions({ page, limit });
			const data = (res as any)?.data?.data ?? (res as any)?.data;
			setItems(data?.items ?? []);
			setTotal(data?.meta?.total ?? 0);
		} catch {
			message.error('Không thể tải danh sách chờ duyệt');
		} finally {
			setLoading(false);
		}
	}, [page, limit]);

	useEffect(() => {
		fetchPending();
	}, [fetchPending]);

	useEffect(() => {
		const fetchDelegations = async () => {
			try {
				const res = await getDelegations({ limit: 100 });
				const data = (res as any)?.data?.data ?? (res as any)?.data;
				const allItems: IDelegation[] = data?.items ?? data ?? [];
				const now = moment();
				setActiveDelegations(
					allItems.filter(
						(d) =>
							d.isActive &&
							d.toUserId === userId &&
							moment(d.startDate).isSameOrBefore(now) &&
							moment(d.endDate).isSameOrAfter(now),
					),
				);
			} catch {
				setActiveDelegations([]);
			}
		};
		if (userId) fetchDelegations();
	}, [userId]);

	// Filtered items
	const filteredItems = useMemo(() => {
		let result = items;
		if (searchText.trim()) {
			const lower = searchText.toLowerCase();
			result = result.filter((item) => {
				const formName = item.submission?.form?.name?.toLowerCase() || '';
				const user = item.submission?.user?.username?.toLowerCase() || item.submission?.user?.email?.toLowerCase() || '';
				return formName.includes(lower) || user.includes(lower);
			});
		}
		if (filterForm) {
			result = result.filter((item) => item.submission?.form?.name === filterForm);
		}
		return result;
	}, [items, searchText, filterForm]);

	// Kanban columns grouped by workflow step
	const kanbanColumns = useMemo(() => {
		const grouped = new Map<string, IWorkflowInstance[]>();
		for (const item of filteredItems) {
			const step = item.currentStep;
			if (!grouped.has(step)) grouped.set(step, []);
			grouped.get(step)!.push(item);
		}
		return Array.from(grouped.entries()).map(([step, stepItems]) => ({
			step,
			items: stepItems,
		}));
	}, [filteredItems]);

	// Unique form names for filter
	const formNames = useMemo(() => {
		const names = new Set<string>();
		items.forEach((item) => {
			if (item.submission?.form?.name) names.add(item.submission.form.name);
		});
		return Array.from(names);
	}, [items]);

	const getStepColor = (step: string) => {
		let hash = 0;
		for (let i = 0; i < step.length; i++) hash = step.charCodeAt(i) + ((hash << 5) - hash);
		return STEP_COLORS[Math.abs(hash) % STEP_COLORS.length];
	};

	const getTimeAgo = (dateStr: string) => {
		const hours = moment().diff(moment(dateStr), 'hours');
		if (hours < 1) return 'Vừa xong';
		if (hours < 24) return `${hours}h trước`;
		const days = Math.floor(hours / 24);
		return `${days}d trước`;
	};

	const isOverdue = (dateStr: string) => {
		return moment().diff(moment(dateStr), 'hours') > 48;
	};

	// Inline quick approve — finds the correct action name automatically
	const handleInlineAction = async (item: IWorkflowInstance, fallbackAction: string) => {
		setInlineExecuting(item.id);
		try {
			// Get actual available actions for this submission
			let action = fallbackAction;
			try {
				const res = await getAvailableActions(item.submissionId);
				const data = (res as any)?.data?.data ?? (res as any)?.data;
				const actions: IAvailableAction[] = data?.actions ?? [];
				const approveAction = actions.find((a) =>
					a.action.includes('approve') || a.action.includes('start_review'),
				);
				if (approveAction) action = approveAction.action;
			} catch { /* use fallback */ }

			await executeWorkflowAction({
				submissionId: item.submissionId,
				action,
			});
			message.success(`Đã ${ACTION_LABELS[action] || action} thành công!`);
			fetchPending();
		} catch (err: any) {
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setInlineExecuting(null);
		}
	};

	// Modal action
	const openActionModal = async (item: IWorkflowInstance) => {
		setActiveItem(item);
		setSelectedAction(null);
		setComment('');
		setDelegatedForId(undefined);
		setActionModalVisible(true);
		setLoadingActions(true);
		try {
			const res = await getAvailableActions(item.submissionId);
			const data = (res as any)?.data?.data ?? (res as any)?.data;
			setAvailableActions(data?.actions ?? []);
		} catch {
			setAvailableActions([]);
		} finally {
			setLoadingActions(false);
		}
	};

	const handleExecute = async () => {
		if (!selectedAction || !activeItem) return;
		if (selectedAction.requiresComment && !comment.trim()) {
			message.warning('Vui lòng nhập ghi chú');
			return;
		}
		setExecuting(true);
		try {
			await executeWorkflowAction({
				submissionId: activeItem.submissionId,
				action: selectedAction.action,
				...(comment.trim() ? { comment: comment.trim() } : {}),
				...(delegatedForId ? { delegatedForId } : {}),
			});
			message.success(`Đã ${ACTION_LABELS[selectedAction.action] || selectedAction.action} thành công!`);
			setActionModalVisible(false);
			fetchPending();
		} catch (err: any) {
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setExecuting(false);
		}
	};

	// Bulk approve
	const handleBulkApprove = async () => {
		if (selectedIds.size === 0) return;
		const confirmItems = items.filter((i) => selectedIds.has(i.id));

		Modal.confirm({
			title: `Phê duyệt hàng loạt`,
			content: `Bạn có chắc muốn phê duyệt ${confirmItems.length} yêu cầu?`,
			okText: 'Phê duyệt tất cả',
			cancelText: 'Hủy',
			onOk: async () => {
				let success = 0;
				let failed = 0;
				for (const item of confirmItems) {
					try {
						let action = 'approve';
						try {
							const res = await getAvailableActions(item.submissionId);
							const data = (res as any)?.data?.data ?? (res as any)?.data;
							const actions: IAvailableAction[] = data?.actions ?? [];
							const approveAction = actions.find((a) => a.action.includes('approve') || a.action.includes('start_review'));
							if (approveAction) action = approveAction.action;
						} catch { /* */ }
						await executeWorkflowAction({
							submissionId: item.submissionId,
							action,
						});
						success++;
					} catch {
						failed++;
					}
				}
				message.success(`Hoàn tất: ${success} thành công, ${failed} thất bại`);
				setSelectedIds(new Set());
				fetchPending();
			},
		});
	};

	const toggleSelect = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const getActionIcon = (action: string) => {
		if (action.includes('approve')) return <CheckCircleOutlined />;
		if (action.includes('reject') || action === 'cancel') return <CloseCircleOutlined />;
		if (action === 'return_for_edit') return <RollbackOutlined />;
		return <ArrowRightOutlined />;
	};

	// ============================
	// RENDER
	// ============================

	const renderCard = (item: IWorkflowInstance) => {
		const sub = item.submission;
		const readable = sub ? getReadableData(sub).slice(0, 2) : [];
		const overdue = isOverdue(item.updatedAt || item.createdAt);
		const isSelected = selectedIds.has(item.id);

		return (
			<div
				key={item.id}
				className={`${styles.kanbanCard} ${overdue ? styles.overdue : ''} ${isSelected ? styles.cardSelected : ''}`}
			>
				{/* Select checkbox */}
				<div className={styles.cardCheckbox}>
					<input
						type="checkbox"
						checked={isSelected}
						onChange={() => toggleSelect(item.id)}
					/>
				</div>

				{/* Card body */}
				<div
					className={styles.cardBody}
					onClick={() => history.push(`/submissions/${item.submissionId}`)}
				>
					<div className={styles.cardHeader}>
						<span className={styles.cardTitle}>
							{sub?.form?.name || `#${item.submissionId.substring(0, 8)}`}
						</span>
						{overdue && (
							<Tooltip title="Quá 48h chưa xử lý">
								<Tag color="red" style={{ fontSize: 10, lineHeight: '16px', margin: 0 }}>
									<ClockCircleOutlined /> Quá hạn
								</Tag>
							</Tooltip>
						)}
					</div>

					<div className={styles.cardMeta}>
						{sub?.user && (
							<span>
								<UserOutlined /> {sub.user.username || sub.user.email}
							</span>
						)}
						<span>{getTimeAgo(item.updatedAt || item.createdAt)}</span>
					</div>

					{readable.length > 0 && (
						<div className={styles.cardData}>
							{readable.map((f) => (
								<div key={f.key} className={styles.cardField}>
									<span className={styles.fieldLabel}>{f.label}</span>
									<span className={styles.fieldValue}>{f.value}</span>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Quick actions */}
				<div className={styles.cardActions}>
					<Tooltip title="Phê duyệt nhanh">
						<button
							className={styles.quickApprove}
							onClick={(e) => {
								e.stopPropagation();
								handleInlineAction(item, 'approve');
							}}
							disabled={inlineExecuting === item.id}
						>
							{inlineExecuting === item.id ? <Spin size="small" /> : <CheckCircleOutlined />}
						</button>
					</Tooltip>
					<Tooltip title="Mở thao tác">
						<button
							className={styles.quickMore}
							onClick={(e) => {
								e.stopPropagation();
								openActionModal(item);
							}}
						>
							•••
						</button>
					</Tooltip>
				</div>
			</div>
		);
	};

	return (
		<div className={styles.pendingPage}>
			{/* ====== HEADER ====== */}
			<div className={styles.pageHeader}>
				<div className={styles.headerLeft}>
					<h1>Chờ phê duyệt</h1>
					<p>
						<Badge count={total} showZero style={{ backgroundColor: '#f59e0b' }} />
						<span style={{ marginLeft: 8 }}>yêu cầu đang chờ xử lý</span>
					</p>
				</div>
				<div className={styles.headerRight}>
					<ExportJobButton buttonText="Xuất Excel" />
				</div>
			</div>

			{/* ====== TOOLBAR ====== */}
			<div className={styles.toolbar}>
				<div className={styles.toolbarLeft}>
					<Input
						prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
						placeholder="Tìm theo tên form, người nộp..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
						style={{ width: 280 }}
					/>
					{formNames.length > 1 && (
						<Select
							placeholder="Lọc theo biểu mẫu"
							value={filterForm}
							onChange={setFilterForm}
							allowClear
							style={{ width: 200 }}
							suffixIcon={<FilterOutlined />}
						>
							{formNames.map((name) => (
								<Select.Option key={name} value={name}>
									{name}
								</Select.Option>
							))}
						</Select>
					)}
				</div>
				<div className={styles.toolbarRight}>
					{selectedIds.size > 0 && (
						<Button
							type="primary"
							icon={<CheckCircleOutlined />}
							onClick={handleBulkApprove}
							style={{ borderRadius: 8 }}
						>
							Duyệt {selectedIds.size} yêu cầu
						</Button>
					)}
					{activeDelegations.length > 0 && (
						<Tooltip title={`${activeDelegations.length} ủy quyền đang hoạt động`}>
							<Tag
								icon={<SwapOutlined />}
								color="purple"
								style={{ margin: 0, padding: '4px 10px', borderRadius: 8, fontWeight: 600 }}
							>
								{activeDelegations.length} ủy quyền
							</Tag>
						</Tooltip>
					)}
					<div className={styles.viewToggle}>
						<button
							className={`${styles.viewBtn} ${viewMode === 'kanban' ? styles.active : ''}`}
							onClick={() => setViewMode('kanban')}
							title="Kanban"
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
								<rect x="1" y="1" width="4" height="14" rx="1" />
								<rect x="6" y="1" width="4" height="10" rx="1" />
								<rect x="11" y="1" width="4" height="12" rx="1" />
							</svg>
						</button>
						<button
							className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
							onClick={() => setViewMode('list')}
							title="Danh sách"
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
								<rect x="1" y="2" width="14" height="2.5" rx="1" />
								<rect x="1" y="6.5" width="14" height="2.5" rx="1" />
								<rect x="1" y="11" width="14" height="2.5" rx="1" />
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* ====== MAIN CONTENT ====== */}
			{loading ? (
				<div className={styles.loadingContainer}><Spin size="large" /></div>
			) : filteredItems.length === 0 ? (
				<div className={styles.emptyState}>
					<CheckCircleOutlined style={{ fontSize: 56, color: '#10b981' }} />
					<h3>Tất cả đã xử lý!</h3>
					<p>Không có yêu cầu nào đang chờ duyệt</p>
				</div>
			) : viewMode === 'kanban' ? (
				/* ====== KANBAN VIEW ====== */
				<div className={styles.kanbanBoard}>
					{kanbanColumns.map(({ step, items: stepItems }) => {
						const color = getStepColor(step);
						return (
							<div key={step} className={styles.kanbanColumn}>
								<div className={styles.columnHeader}>
									<div className={styles.columnDot} style={{ background: color }} />
									<span className={styles.columnTitle}>{step}</span>
									<Badge count={stepItems.length} style={{ backgroundColor: color }} />
								</div>
								<div className={styles.columnBody}>
									{stepItems.map(renderCard)}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				/* ====== LIST VIEW ====== */
				<div className={styles.listSection}>
					{filteredItems.map((item) => {
						const sub = item.submission;
						const readable = sub ? getReadableData(sub).slice(0, 3) : [];
						const overdue = isOverdue(item.updatedAt || item.createdAt);

						return (
							<div key={item.id} className={`${styles.listItem} ${overdue ? styles.overdue : ''}`}>
								<input
									type="checkbox"
									checked={selectedIds.has(item.id)}
									onChange={() => toggleSelect(item.id)}
									className={styles.listCheckbox}
								/>
								<div
									className={styles.listInfo}
									onClick={() => history.push(`/submissions/${item.submissionId}`)}
								>
									<div className={styles.listTitle}>
										{sub?.form?.name || `#${item.submissionId.substring(0, 8)}`}
										<Tag
											style={{
												marginLeft: 8,
												borderRadius: 6,
												background: `${getStepColor(item.currentStep)}18`,
												color: getStepColor(item.currentStep),
												border: 'none',
												fontWeight: 600,
												fontSize: 11,
											}}
										>
											{getStateLabel(item.currentStep)}
										</Tag>
										{overdue && (
											<Tag color="red" style={{ fontSize: 10 }}>
												Quá hạn
											</Tag>
										)}
									</div>
									<div className={styles.listMeta}>
										{sub?.user && (
											<span><UserOutlined /> {sub.user.username || sub.user.email}</span>
										)}
										<span><ClockCircleOutlined /> {moment(item.createdAt).format('DD/MM/YYYY HH:mm')}</span>
										{readable.map((f) => (
											<span key={f.key} className={styles.listTag}>
												{f.label}: {f.value}
											</span>
										))}
									</div>
								</div>
								<div className={styles.listActions}>
									<Button
										type="primary"
										size="small"
										icon={<CheckCircleOutlined />}
										onClick={() => handleInlineAction(item, 'approve')}
										loading={inlineExecuting === item.id}
										style={{ borderRadius: 8, background: '#10b981', borderColor: '#10b981' }}
									>
										Duyệt
									</Button>
									<Button
										size="small"
										onClick={() => openActionModal(item)}
										style={{ borderRadius: 8 }}
									>
										Chi tiết
									</Button>
								</div>
							</div>
						);
					})}
					{total > limit && (
						<div style={{ padding: 16, textAlign: 'center' }}>
							<Pagination current={page} pageSize={limit} total={total} onChange={setPage} />
						</div>
					)}
				</div>
			)}

			{/* ====== ACTION MODAL ====== */}
			<Modal
				title={
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<span>Xử lý yêu cầu</span>
						{activeItem && (
							<Tag color="blue" style={{ margin: 0 }}>
								{activeItem.submission?.form?.name}
							</Tag>
						)}
					</div>
				}
				visible={actionModalVisible}
				onCancel={() => setActionModalVisible(false)}
				footer={null}
				destroyOnClose
				width={560}
			>
				{loadingActions ? (
					<div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
				) : availableActions.length === 0 ? (
					<div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
						Không có action khả dụng.
						<br />
						<Button
							type="link"
							onClick={() => {
								setActionModalVisible(false);
								history.push(`/submissions/${activeItem?.submissionId}`);
							}}
						>
							Xem chi tiết →
						</Button>
					</div>
				) : (
					<div>
						{/* Submission preview */}
						{activeItem?.submission && (
							<div className={styles.modalPreview}>
								<div className={styles.previewMeta}>
									<span><UserOutlined /> {activeItem.submission.user?.username || activeItem.submission.user?.email}</span>
									<span><ClockCircleOutlined /> {moment(activeItem.submission.createdAt).format('DD/MM/YYYY HH:mm')}</span>
								</div>
								<div className={styles.previewData}>
									{getReadableData(activeItem.submission).slice(0, 5).map((f) => (
										<div key={f.key} className={styles.previewRow}>
											<span className={styles.previewKey}>{f.label}</span>
											<span className={styles.previewValue}>{f.value}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Action buttons */}
						<div className={styles.modalActions}>
							{availableActions.map((act) => {
								const colors = ACTION_COLORS[act.action] ?? { bg: '#f1f5f9', text: '#64748b', hover: '#e2e8f0' };
								const isSelected = selectedAction?.action === act.action;
								return (
									<button
										key={act.action}
										className={styles.modalActionBtn}
										style={{
											background: colors.bg,
											color: colors.text,
											outline: isSelected ? `2px solid ${colors.text}` : 'none',
											outlineOffset: 2,
										}}
										onClick={() => {
											setSelectedAction(isSelected ? null : act);
											setComment('');
										}}
									>
										{getActionIcon(act.action)} {ACTION_LABELS[act.action] || act.action}
									</button>
								);
							})}
						</div>

						{/* Action form */}
						{selectedAction && (
							<div className={styles.modalForm}>
								{activeDelegations.length > 0 && (
									<div className={styles.formField}>
										<label>Duyệt thay cho</label>
										<Select
											value={delegatedForId}
											onChange={setDelegatedForId}
											placeholder="Duyệt với quyền của chính mình"
											allowClear
											style={{ width: '100%' }}
										>
											{activeDelegations.map((d) => (
												<Select.Option key={d.fromUserId} value={d.fromUserId}>
													<SwapOutlined style={{ marginRight: 6 }} />
													{d.fromUser?.username || d.fromUser?.email || d.fromUserId}
													{d.formIds?.length > 0 && (
														<Tag style={{ marginLeft: 6, fontSize: 10 }}>{d.formIds.length} form</Tag>
													)}
												</Select.Option>
											))}
										</Select>
									</div>
								)}

								<div className={styles.formField}>
									<label>
										Ghi chú
										{selectedAction.requiresComment && <span style={{ color: '#ef4444' }}> *</span>}
									</label>
									<Input.TextArea
										rows={3}
										placeholder={selectedAction.requiresComment ? 'Bắt buộc nhập ghi chú' : 'Nhập ghi chú (không bắt buộc)'}
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
								</div>

								<div className={styles.formFooter}>
									<Button onClick={() => setActionModalVisible(false)}>Hủy</Button>
									<Button
										type="primary"
										loading={executing}
										onClick={handleExecute}
										danger={selectedAction.action.includes('reject') || selectedAction.action === 'cancel'}
										style={{ borderRadius: 8 }}
									>
										{getActionIcon(selectedAction.action)} Xác nhận {ACTION_LABELS[selectedAction.action] || selectedAction.action}
									</Button>
								</div>
							</div>
						)}

						<div style={{ textAlign: 'center', marginTop: 12 }}>
							<Button
								type="link"
								size="small"
								onClick={() => {
									setActionModalVisible(false);
									history.push(`/submissions/${activeItem?.submissionId}`);
								}}
							>
								Xem chi tiết đầy đủ →
							</Button>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default PendingApprovals;
