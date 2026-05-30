import {
	ArrowLeftOutlined,
	ArrowRightOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	CopyOutlined,
	ExclamationCircleOutlined,
	RobotOutlined,
	RollbackOutlined,
	SendOutlined,
	StopOutlined,
	UndoOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Input, InputNumber, message, Modal, Popconfirm, Select, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import type { IFormField } from '@/services/Forms/typings';
import { history, useModel, useParams } from 'umi';
import {
	executeWorkflowAction,
	getAvailableActions,
	getSubmissionById,
	getWorkflowHistory,
	recallSubmission,
	resubmitSubmission,
	withdrawSubmission,
} from '@/services/Submissions/submissionApi';
import type {
	IAvailableAction,
	ISubmission,
	IWorkflowHistory,
	IWorkflowHistoryResponse,
} from '@/services/Submissions/typings';
import { getWorkflowDefinitionById } from '@/services/Workflows/workflowApi';
import type { IWorkflowDefinition } from '@/services/Workflows/typings';
import { getDelegations } from '@/services/Delegations/delegationApi';
import type { IDelegation } from '@/services/Delegations/typings';
import { getReadableData } from '@/utils/formDataHelper';
import styles from './index.less';

const STATUS_LABELS: Record<string, string> = {
	DRAFT: 'Nháp',
	SUBMITTED: 'Hoàn tất',
	UNDER_REVIEW: 'Đang duyệt',
	APPROVED: 'Đã duyệt',
	REJECTED: 'Từ chối',
	CANCELLED: 'Đã hủy',
	RETURNED: 'Trả lại',
};

const ACTION_LABELS: Record<string, string> = {
	SUBMIT: 'Nộp yêu cầu',
	approve: 'Phê duyệt',
	reject: 'Từ chối',
	cancel: 'Hủy',
	return_for_edit: 'Trả lại',
	resubmit: 'Gửi lại',
	RECALL: 'Thu hồi',
	WITHDRAW: 'Rút đơn',
	PARALLEL_JOIN_COMPLETE: 'Hoàn tất duyệt song song',
	vote_approve: 'Bỏ phiếu đồng ý',
	vote_reject: 'Bỏ phiếu từ chối',
	VOTING_COMPLETE: 'Kết thúc bỏ phiếu',
};

function getActionClass(action: string): string {
	if (action === 'SUBMIT' || action === 'resubmit') return 'submit';
	if (action === 'approve' || action === 'PARALLEL_JOIN_COMPLETE' || action === 'vote_approve' || action === 'VOTING_COMPLETE') return 'approve';
	if (action === 'reject' || action === 'cancel' || action === 'WITHDRAW' || action === 'vote_reject') return 'reject';
	if (action === 'return_for_edit') return 'return';
	if (action === 'RECALL') return 'recall';
	return 'default';
}

function getDotClass(action: string): string {
	return getActionClass(action);
}

function isSystemBot(actor: { id: string; email: string; name: string } | null | undefined): boolean {
	if (!actor) return false;
	return actor.name === 'System Bot' || actor.email === 'system@bot';
}

function getActionIcon(action: string, actor?: { id: string; email: string; name: string } | null) {
	if (isSystemBot(actor)) return <RobotOutlined />;
	if (action === 'approve' || action === 'PARALLEL_JOIN_COMPLETE') return <CheckCircleOutlined />;
	if (action === 'reject' || action === 'cancel') return <CloseCircleOutlined />;
	if (action === 'SUBMIT') return <SendOutlined />;
	if (action === 'return_for_edit') return <RollbackOutlined />;
	if (action === 'RECALL') return <UndoOutlined />;
	if (action === 'WITHDRAW') return <StopOutlined />;
	return <ArrowRightOutlined />;
}

const SubmissionDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const userId = currentUser?.id;

	const [loading, setLoading] = useState(true);
	const [submission, setSubmission] = useState<ISubmission | null>(null);
	const [historyData, setHistoryData] = useState<IWorkflowHistoryResponse | null>(null);
	const [availableActions, setAvailableActions] = useState<IAvailableAction[]>([]);
	const [currentState, setCurrentState] = useState('');
	const [workflowDef, setWorkflowDef] = useState<IWorkflowDefinition | null>(null);

	// Action state
	const [selectedAction, setSelectedAction] = useState<IAvailableAction | null>(null);
	const [comment, setComment] = useState('');
	const [executing, setExecuting] = useState(false);

	// Delegation state
	const [activeDelegations, setActiveDelegations] = useState<IDelegation[]>([]);
	const [delegatedForId, setDelegatedForId] = useState<string | undefined>(undefined);

	// Resubmit modal state
	const [resubmitVisible, setResubmitVisible] = useState(false);
	const [resubmitData, setResubmitData] = useState<Record<string, any>>({});
	const [resubmitErrors, setResubmitErrors] = useState<Record<string, string>>({});

	const isOwner = submission?.submittedBy === userId;
	const canRecall = isOwner && availableActions.some((a) => a.action === 'recall');
	const canResubmit = isOwner && submission?.status === 'RETURNED';
	const canWithdraw = isOwner && ['SUBMITTED', 'UNDER_REVIEW'].includes(submission?.status || '');
	const canCloneAsNew = isOwner && submission?.status === 'REJECTED';

	// Parallel approval detection
	const parallelTransition = workflowDef?.config?.transitions?.find(
		(t) => t.type === 'PARALLEL_JOIN' && (
			t.from === currentState ||
			(Array.isArray(t.from) && t.from.includes(currentState))
		),
	);
	const parallelRequireActions = parallelTransition?.requireActions ?? [];
	const histories: IWorkflowHistory[] = historyData?.history ?? [];
	const parallelCompletedActions = parallelRequireActions.filter((reqAction) =>
		histories.some((h) => h.action === reqAction && h.toStep === currentState),
	);

	// SLA info
	const slaDetail = workflowDef?.config?.statesDetails?.[currentState];

	const fetchAll = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		try {
			const [subRes, histRes] = await Promise.all([
				getSubmissionById(id),
				getWorkflowHistory(id).catch(() => null),
			]);

			const subData = (subRes as any)?.data?.data ?? (subRes as any)?.data;
			setSubmission(subData);

			if (histRes) {
				const hData = (histRes as any)?.data?.data ?? (histRes as any)?.data;
				setHistoryData(hData);
			}

			// Fetch available actions if the submission has an active workflow
			try {
				const actRes = await getAvailableActions(id);
				const actData = (actRes as any)?.data?.data ?? (actRes as any)?.data;
				setAvailableActions(actData?.actions ?? []);
				setCurrentState(actData?.currentState ?? '');
			} catch {
				setAvailableActions([]);
			}

			// Fetch workflow definition for parallel approval / SLA display
			const definitionId = subData?.workflows?.[0]?.definitionId;
			if (definitionId) {
				try {
					const defRes = await getWorkflowDefinitionById(definitionId);
					const defData = (defRes as any)?.data?.data ?? (defRes as any)?.data;
					setWorkflowDef(defData);
				} catch {
					setWorkflowDef(null);
				}
			}

			// Fetch active delegations for current user (as delegate)
			try {
				const delRes = await getDelegations({ limit: 100 });
				const delData = (delRes as any)?.data?.data ?? (delRes as any)?.data;
				const items: IDelegation[] = delData?.items ?? delData ?? [];
				const now = moment();
				const active = items.filter(
					(d) =>
						d.isActive &&
						d.toUserId === userId &&
						moment(d.startDate).isSameOrBefore(now) &&
						moment(d.endDate).isSameOrAfter(now),
				);
				setActiveDelegations(active);
			} catch {
				setActiveDelegations([]);
			}
		} catch {
			message.error('Không thể tải chi tiết yêu cầu');
		} finally {
			setLoading(false);
		}
	}, [id, userId]);

	useEffect(() => {
		fetchAll();
	}, [fetchAll]);

	const handleExecuteAction = async () => {
		if (!selectedAction) return;

		if (selectedAction.requiresComment && !comment.trim()) {
			message.warning('Vui lòng nhập ghi chú cho action này');
			return;
		}

		setExecuting(true);
		try {
			await executeWorkflowAction({
				submissionId: id!,
				action: selectedAction.action,
				...(comment.trim() ? { comment: comment.trim() } : {}),
				...(delegatedForId ? { delegatedForId } : {}),
			});
			message.success(`Đã thực hiện "${ACTION_LABELS[selectedAction.action] || selectedAction.action}" thành công!`);
			setSelectedAction(null);
			setComment('');
			setDelegatedForId(undefined);
			fetchAll();
		} catch (err: any) {
			const errMsg = err?.response?.data?.message;
			message.error(errMsg || 'Có lỗi xảy ra');
		} finally {
			setExecuting(false);
		}
	};

	const handleRecall = async () => {
		setExecuting(true);
		try {
			await recallSubmission(id!);
			message.success('Đã thu hồi yêu cầu');
			fetchAll();
		} catch (err: any) {
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setExecuting(false);
		}
	};

	const handleWithdraw = async () => {
		setExecuting(true);
		try {
			await withdrawSubmission(id!);
			message.success('Đã rút đơn thành công');
			fetchAll();
		} catch (err: any) {
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setExecuting(false);
		}
	};

	const handleCloneAsNew = () => {
		if (submission?.formId) {
			history.push(`/submissions/new/${submission.formId}?cloneFrom=${submission.id}`);
		}
	};

	const openResubmitModal = () => {
		setResubmitData({ ...(submission?.data || {}) });
		setResubmitErrors({});
		setResubmitVisible(true);
	};

	const getFormFields = (): IFormField[] => {
		return (submission?.form as any)?.schema?.fields ?? [];
	};

	const setResubmitFieldValue = (key: string, value: any) => {
		setResubmitData((prev) => ({ ...prev, [key]: value }));
		if (resubmitErrors[key]) {
			setResubmitErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
		}
	};

	const validateResubmit = (): boolean => {
		const fields = getFormFields();
		const newErrors: Record<string, string> = {};
		for (const field of fields) {
			const val = resubmitData[field.key];
			const rules = field.rules;
			if (rules?.required && (val === undefined || val === null || val === '')) {
				newErrors[field.key] = `${field.label} là bắt buộc`;
				continue;
			}
			if (val !== undefined && val !== null && val !== '') {
				if (field.type === 'text') {
					const strVal = String(val);
					if (rules?.minLength && strVal.length < rules.minLength) newErrors[field.key] = `Tối thiểu ${rules.minLength} ký tự`;
					else if (rules?.maxLength && strVal.length > rules.maxLength) newErrors[field.key] = `Tối đa ${rules.maxLength} ký tự`;
					else if (rules?.regex && !new RegExp(rules.regex).test(strVal)) newErrors[field.key] = 'Không đúng định dạng';
				} else if (field.type === 'number') {
					const numVal = Number(val);
					if (rules?.min !== undefined && numVal < rules.min) newErrors[field.key] = `Giá trị tối thiểu là ${rules.min}`;
					else if (rules?.max !== undefined && numVal > rules.max) newErrors[field.key] = `Giá trị tối đa là ${rules.max}`;
				}
			}
		}
		setResubmitErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleResubmit = async () => {
		if (!validateResubmit()) {
			message.error('Vui lòng kiểm tra lại dữ liệu');
			return;
		}
		setExecuting(true);
		try {
			const res = await resubmitSubmission(id!, { data: resubmitData });
			const newSub = (res as any)?.data?.data ?? (res as any)?.data;
			message.success('Đã nộp lại yêu cầu');
			setResubmitVisible(false);
			if (newSub?.id) {
				history.push(`/submissions/${newSub.id}`);
			} else {
				history.push('/submissions/mine');
			}
		} catch (err: any) {
			const errData = err?.response?.data;
			if (errData?.errors && Array.isArray(errData.errors)) {
				const serverErrors: Record<string, string> = {};
				for (const e of errData.errors) serverErrors[e.field] = e.i18nKey || 'Dữ liệu không hợp lệ';
				setResubmitErrors(serverErrors);
			} else {
				message.error(errData?.message || 'Có lỗi xảy ra');
			}
		} finally {
			setExecuting(false);
		}
	};

	const getActionBtnClass = (action: string): string => {
		if (action === 'approve' || action === 'vote_approve') return styles.approve;
		if (action === 'reject' || action === 'cancel' || action === 'vote_reject') return styles.reject;
		if (action === 'return_for_edit') return styles.other;
		if (action === 'resubmit') return styles.resubmit;
		return styles.other;
	};

	const getButtonActionIcon = (action: string) => {
		if (action === 'approve' || action === 'vote_approve') return <CheckCircleOutlined />;
		if (action === 'reject' || action === 'cancel' || action === 'vote_reject') return <CloseCircleOutlined />;
		if (action === 'return_for_edit') return <RollbackOutlined />;
		return <ArrowRightOutlined />;
	};

	if (loading) {
		return (
			<div className={styles.detailPage}>
				<div className={styles.loadingContainer}><Spin size="large" /></div>
			</div>
		);
	}

	if (!submission) {
		return (
			<div className={styles.detailPage}>
				<div className={styles.errorState}>
					<span>404</span>
					<p>Không tìm thấy yêu cầu</p>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.detailPage}>
			{/* Header */}
			<div className={styles.pageHeader}>
				<div className={styles.headerLeft}>
					<button className={styles.backBtn} onClick={() => history.goBack()}>
						<ArrowLeftOutlined />
					</button>
					<h1>{submission.form?.name || 'Chi tiết yêu cầu'}</h1>
				</div>
				<div className={styles.headerMeta}>
					<span className={`${styles.statusBadge} ${styles[submission.status]}`}>
						{STATUS_LABELS[submission.status] || submission.status}
					</span>
					<span><ClockCircleOutlined /> {moment(submission.createdAt).format('DD/MM/YYYY HH:mm')}</span>
					{submission.user && (
						<span>Người nộp: {submission.user.username || submission.user.email}</span>
					)}
					{submission.revisionNumber > 1 && (
						<span>Lần nộp #{submission.revisionNumber}</span>
					)}
				</div>
				{/* SLA info */}
				{slaDetail?.slaHours && submission.status === 'UNDER_REVIEW' && (
					<div className={styles.headerMeta} style={{ marginTop: 6 }}>
						<span className={styles.slaInfo}>
							<ExclamationCircleOutlined /> SLA: {slaDetail.slaHours} giờ làm việc
						</span>
					</div>
				)}
			</div>

			{/* Submission Data */}
			<div className={styles.card}>
				<div className={styles.cardHeader}>
					<div className={`${styles.cardIcon} ${styles.dataIcon}`}>📋</div>
					<div className={styles.cardTitle}>
						<h3>Dữ liệu biểu mẫu</h3>
						<p>Thông tin đã được nộp</p>
					</div>
				</div>
				<div className={styles.cardBody}>
					{(() => {
						const readable = getReadableData(submission);
						return readable.length === 0 ? (
							<div style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>
								Không có dữ liệu
							</div>
						) : (
							readable.map((f) => (
								<div key={f.key} className={styles.dataRow}>
									<span className={styles.dataKey}>{f.label}</span>
									<span className={styles.dataValue}>{f.value}</span>
								</div>
							))
						);
					})()}
				</div>
			</div>

			{/* No-workflow notice */}
			{histories.length === 0 && submission.status === 'SUBMITTED' && (
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.dataIcon}`} style={{ background: '#d1fae5', color: '#047857' }}>
							<CheckCircleOutlined />
						</div>
						<div className={styles.cardTitle}>
							<h3>Đã nộp thành công</h3>
							<p>Biểu mẫu này không yêu cầu phê duyệt. Dữ liệu của bạn đã được ghi nhận.</p>
						</div>
					</div>
				</div>
			)}

			{/* Parallel Approval Progress */}
			{parallelRequireActions.length > 0 && submission.status === 'UNDER_REVIEW' && (
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.timelineIcon}`}>
							<CheckCircleOutlined />
						</div>
						<div className={styles.cardTitle}>
							<h3>Duyệt song song</h3>
							<p>{parallelCompletedActions.length}/{parallelRequireActions.length} phê duyệt đã nhận</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						<div className={styles.parallelProgress}>
							{parallelRequireActions.map((reqAction) => {
								const completed = parallelCompletedActions.includes(reqAction);
								const historyEntry = histories.find((h) => h.action === reqAction && h.toStep === currentState);
								return (
									<div key={reqAction} className={`${styles.parallelItem} ${completed ? styles.completed : ''}`}>
										{completed ? <CheckCircleOutlined style={{ color: '#047857' }} /> : <ClockCircleOutlined style={{ color: '#d97706' }} />}
										<span className={styles.parallelAction}>{ACTION_LABELS[reqAction] || reqAction}</span>
										{completed && historyEntry?.actor && (
											<span className={styles.parallelActor}>
												— {historyEntry.actor.name} ({moment(historyEntry.createdAt).format('DD/MM HH:mm')})
											</span>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{/* Workflow History Timeline */}
			{histories.length > 0 && (
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.timelineIcon}`}>
							<ClockCircleOutlined />
						</div>
						<div className={styles.cardTitle}>
							<h3>Lịch sử xử lý</h3>
							<p>{historyData?.workflowName || 'Workflow'} &mdash; {historyData?.currentStep}</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						<div className={styles.timeline}>
							{[...histories].reverse().map((h) => (
								<div key={h.id} className={`${styles.timelineItem} ${isSystemBot(h.actor) ? styles.systemBot : ''}`}>
									<div className={`${styles.timelineDot} ${styles[getDotClass(h.action)]} ${isSystemBot(h.actor) ? styles.botDot : ''}`}>
										{getActionIcon(h.action, h.actor)}
									</div>
									<div className={styles.timelineContent}>
										<div className={styles.timelineAction}>
											<span className={`${styles.actionBadge} ${styles[getActionClass(h.action)]}`}>
												{ACTION_LABELS[h.action] || h.action}
											</span>
											{isSystemBot(h.actor) && (
												<span className={styles.systemBotLabel}>Hệ thống tự động</span>
											)}
										</div>
										<div className={styles.timelineSteps}>
											{h.fromStep && (
												<>
													<span>{h.fromStep}</span>
													<span className={styles.arrow}><ArrowRightOutlined /></span>
												</>
											)}
											<span>{h.toStep}</span>
										</div>
										<div className={styles.timelineMeta}>
											{h.actor && !isSystemBot(h.actor) && <span>{h.actor.name}</span>}
											{h.delegatedFor && (
												<span className={styles.delegatedFor}>
													Duyệt thay cho {h.delegatedFor.name}
												</span>
											)}
											<span>{moment(h.createdAt).format('DD/MM/YYYY HH:mm')}</span>
										</div>
										{h.comment && (
											<div className={styles.timelineComment}>
												&ldquo;{h.comment}&rdquo;
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Actions Card */}
			{(availableActions.length > 0 || canRecall || canResubmit || canWithdraw || canCloneAsNew) && (
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={`${styles.cardIcon} ${styles.actionIcon}`}>
							<ArrowRightOutlined />
						</div>
						<div className={styles.cardTitle}>
							<h3>Thao tác</h3>
							<p>
								{availableActions.length > 0 && 'Chọn action để thực hiện'}
								{canRecall && !availableActions.length && 'Thu hồi yêu cầu đang chờ duyệt'}
								{canResubmit && !availableActions.length && 'Sửa và nộp lại yêu cầu đã bị trả lại'}
								{canCloneAsNew && !availableActions.length && !canResubmit && 'Tạo đơn mới từ dữ liệu này'}
							</p>
						</div>
					</div>
					<div className={styles.cardBody}>
						<div className={styles.actionsSection}>
							{/* Workflow actions for approvers */}
							{availableActions.map((act) => (
								<button
									key={act.action}
									className={`${styles.actionBtn} ${getActionBtnClass(act.action)}`}
									onClick={() => {
										setSelectedAction(selectedAction?.action === act.action ? null : act);
										setComment('');
										setDelegatedForId(undefined);
									}}
									disabled={executing}
									style={{
										outline: selectedAction?.action === act.action ? '2px solid #2563eb' : 'none',
										outlineOffset: 2,
									}}
								>
									{getButtonActionIcon(act.action)} {ACTION_LABELS[act.action] || act.action}
								</button>
							))}

							{/* Owner actions */}
							{canRecall && (
								<Popconfirm
									title="Xác nhận thu hồi? Yêu cầu sẽ chuyển về trạng thái nháp."
									onConfirm={handleRecall}
									okText="Thu hồi"
									cancelText="Không"
									placement="topRight"
								>
									<button
										className={`${styles.actionBtn} ${styles.recall}`}
										disabled={executing}
									>
										<UndoOutlined /> Thu hồi
									</button>
								</Popconfirm>
							)}
							{canWithdraw && (
								<Popconfirm
									title="Xác nhận rút đơn? Đơn sẽ bị hủy vĩnh viễn, không thể khôi phục."
									onConfirm={handleWithdraw}
									okText="Rút đơn"
									cancelText="Không"
									placement="topRight"
									okButtonProps={{ danger: true }}
								>
									<button
										className={`${styles.actionBtn} ${styles.withdraw}`}
										disabled={executing}
									>
										<StopOutlined /> Rút đơn
									</button>
								</Popconfirm>
							)}
							{canResubmit && (
								<button
									className={`${styles.actionBtn} ${styles.resubmit}`}
									onClick={openResubmitModal}
									disabled={executing}
								>
									<SendOutlined /> Sửa và nộp lại
								</button>
							)}
							{canCloneAsNew && (
								<button
									className={`${styles.actionBtn} ${styles.cloneNew}`}
									onClick={handleCloneAsNew}
									disabled={executing}
								>
									<CopyOutlined /> Tạo đơn mới từ dữ liệu này
								</button>
							)}
						</div>

						{/* Selected action details */}
						{selectedAction && (
							<>
								{/* Delegation select */}
								{activeDelegations.length > 0 && (
									<div className={styles.delegationSection}>
										<label className={styles.commentLabel}>
											Duyệt thay cho
										</label>
										<Select
											allowClear
											placeholder="Duyệt với quyền của chính mình"
											value={delegatedForId}
											onChange={(val) => setDelegatedForId(val)}
											style={{ width: '100%' }}
											options={activeDelegations.map((d) => ({
												label: d.fromUser?.username || d.fromUser?.email || d.fromUserId,
												value: d.fromUserId,
											}))}
										/>
									</div>
								)}

								<div className={styles.commentSection}>
									<label className={styles.commentLabel}>
										Ghi chú
										{selectedAction.requiresComment && <span className={styles.required}>*</span>}
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

								<div className={styles.confirmBar}>
									<div className={styles.transitionInfo}>
										<span className={styles.fromState}>{currentState}</span>
										<span className={styles.arrow}><ArrowRightOutlined /></span>
										<span className={styles.toState}>{selectedAction.targetState}</span>
									</div>
									<button
										className={`${styles.actionBtn} ${getActionBtnClass(selectedAction.action)}`}
										onClick={handleExecuteAction}
										disabled={executing}
										style={{ marginLeft: 'auto' }}
									>
										{executing ? 'Đang xử lý...' : `Xác nhận ${ACTION_LABELS[selectedAction.action] || selectedAction.action}`}
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}

			{/* Resubmit Modal */}
			<Modal
				title="Sửa và nộp lại yêu cầu"
				visible={resubmitVisible}
				onCancel={() => setResubmitVisible(false)}
				footer={
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
						<Button onClick={() => setResubmitVisible(false)}>Hủy</Button>
						<Button
							type="primary"
							icon={<SendOutlined />}
							loading={executing}
							onClick={handleResubmit}
						>
							Nộp lại
						</Button>
					</div>
				}
				width={600}
				destroyOnClose
				style={{ top: 40 }}
				bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '16px 24px' }}
			>
				{getFormFields().length === 0 ? (
					<div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
						Không thể tải trường biểu mẫu. Vui lòng thử lại.
					</div>
				) : (
					getFormFields().map((field) => {
						const value = resubmitData[field.key];
						const error = resubmitErrors[field.key];
						return (
							<div key={field.key} style={{ marginBottom: 16 }}>
								<label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
									{field.label}
									{field.rules?.required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
								</label>

								{field.type === 'text' && (
									<Input
										placeholder={`Nhập ${field.label.toLowerCase()}`}
										value={value || ''}
										onChange={(e) => setResubmitFieldValue(field.key, e.target.value)}
										maxLength={field.rules?.maxLength}
									/>
								)}

								{field.type === 'number' && (
									<InputNumber
										placeholder={`Nhập ${field.label.toLowerCase()}`}
										value={value}
										onChange={(val) => setResubmitFieldValue(field.key, val)}
										min={field.rules?.min}
										max={field.rules?.max}
										style={{ width: '100%' }}
									/>
								)}

								{field.type === 'date' && (
									<DatePicker
										placeholder={`Chọn ${field.label.toLowerCase()}`}
										value={value ? moment(value) : null}
										onChange={(val) => setResubmitFieldValue(field.key, val?.toISOString() ?? null)}
										style={{ width: '100%' }}
									/>
								)}

								{field.type === 'select' && (() => {
									const opts: string[] = field.options
										? (field.options as any[]).map((o: any) => (typeof o === 'string' ? o : o.value))
										: field.rules?.allowedTypes ?? [];
									return (
										<Select
											placeholder={`Chọn ${field.label.toLowerCase()}`}
											value={value}
											onChange={(val) => setResubmitFieldValue(field.key, val)}
											style={{ width: '100%' }}
											allowClear
											options={opts.map((o) => ({ label: o, value: o }))}
										/>
									);
								})()}

								{error && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{error}</div>}
							</div>
						);
					})
				)}
			</Modal>
		</div>
	);
};

export default SubmissionDetail;
