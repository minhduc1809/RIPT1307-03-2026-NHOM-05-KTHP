import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	FileTextOutlined,
	PlusOutlined,
	RollbackOutlined,
	StopOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import { Button, Pagination, Spin } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import { getMySubmissions } from '@/services/Submissions/submissionApi';
import type { ISubmission } from '@/services/Submissions/typings';
import SubmitFormModal from '@/components/SubmitFormModal';
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

const MySubmissions: React.FC = () => {
	const [submitModalVisible, setSubmitModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState<ISubmission[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(20);
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
	const [counts, setCounts] = useState<Record<string, number>>({});

	const fetchSubmissions = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getMySubmissions({ page, limit, status: statusFilter });
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setItems(data?.items ?? []);
			setTotal(data?.meta?.total ?? 0);
		} catch {
			// silent
		} finally {
			setLoading(false);
		}
	}, [page, limit, statusFilter]);

	// Fetch counts for each status on mount
	useEffect(() => {
		const fetchCounts = async () => {
			try {
				const statuses = ['UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RETURNED', 'CANCELLED'];
				const results = await Promise.all([
					getMySubmissions({ limit: 1 }),
					...statuses.map((s) => getMySubmissions({ limit: 1, status: s })),
				]);
				const newCounts: Record<string, number> = {};
				const allData = (results[0] as any)?.data?.data ?? (results[0] as any)?.data;
				newCounts.ALL = allData?.meta?.total ?? 0;
				statuses.forEach((s, i) => {
					const d = (results[i + 1] as any)?.data?.data ?? (results[i + 1] as any)?.data;
					newCounts[s] = d?.meta?.total ?? 0;
				});
				setCounts(newCounts);
			} catch {
				// silent
			}
		};
		fetchCounts();
	}, []);

	useEffect(() => {
		fetchSubmissions();
	}, [fetchSubmissions]);

	const handleFilterClick = (status: string | undefined) => {
		setStatusFilter(status);
		setPage(1);
	};

	return (
		<div className={styles.mySubmissionsPage}>
			{/* Header */}
			<div className={styles.pageHeader}>
				<div>
					<h1>Yêu cầu của tôi</h1>
					<p>Theo dõi trạng thái các biểu mẫu bạn đã nộp</p>
				</div>
				<Button type="primary" icon={<PlusOutlined />} onClick={() => setSubmitModalVisible(true)} className={styles.createBtn}>
					Nộp biểu mẫu
				</Button>
			</div>

			{/* Stats */}
			<div className={styles.statsBar}>
				<div
					className={`${styles.statCard} ${styles.all} ${statusFilter === undefined ? styles.active : ''}`}
					onClick={() => handleFilterClick(undefined)}
				>
					<div className={styles.statRow}>
						<span className={styles.statIcon}><UnorderedListOutlined /></span>
						<span className={styles.statNumber}>{counts.ALL ?? '-'}</span>
					</div>
					<div className={styles.statLabel}>Tất cả</div>
				</div>
				<div
					className={`${styles.statCard} ${styles.underReview} ${statusFilter === 'UNDER_REVIEW' ? styles.active : ''}`}
					onClick={() => handleFilterClick('UNDER_REVIEW')}
				>
					<div className={styles.statRow}>
						<span className={styles.statIcon}><ClockCircleOutlined /></span>
						<span className={styles.statNumber}>{counts.UNDER_REVIEW ?? '-'}</span>
					</div>
					<div className={styles.statLabel}>Đang duyệt</div>
				</div>
				<div
					className={`${styles.statCard} ${styles.approved} ${statusFilter === 'APPROVED' ? styles.active : ''}`}
					onClick={() => handleFilterClick('APPROVED')}
				>
					<div className={styles.statRow}>
						<span className={styles.statIcon}><CheckCircleOutlined /></span>
						<span className={styles.statNumber}>{counts.APPROVED ?? '-'}</span>
					</div>
					<div className={styles.statLabel}>Đã duyệt</div>
				</div>
				<div
					className={`${styles.statCard} ${styles.rejected} ${statusFilter === 'REJECTED' ? styles.active : ''}`}
					onClick={() => handleFilterClick('REJECTED')}
				>
					<div className={styles.statRow}>
						<span className={styles.statIcon}><CloseCircleOutlined /></span>
						<span className={styles.statNumber}>{counts.REJECTED ?? '-'}</span>
					</div>
					<div className={styles.statLabel}>Từ chối</div>
				</div>
				<div
					className={`${styles.statCard} ${styles.returned} ${statusFilter === 'RETURNED' ? styles.active : ''}`}
					onClick={() => handleFilterClick('RETURNED')}
				>
					<div className={styles.statRow}>
						<span className={styles.statIcon}><RollbackOutlined /></span>
						<span className={styles.statNumber}>{counts.RETURNED ?? '-'}</span>
					</div>
					<div className={styles.statLabel}>Trả lại</div>
				</div>
				<div
					className={`${styles.statCard} ${styles.cancelled} ${statusFilter === 'CANCELLED' ? styles.active : ''}`}
					onClick={() => handleFilterClick('CANCELLED')}
				>
					<div className={styles.statRow}>
						<span className={styles.statIcon}><StopOutlined /></span>
						<span className={styles.statNumber}>{counts.CANCELLED ?? '-'}</span>
					</div>
					<div className={styles.statLabel}>Đã hủy</div>
				</div>
			</div>

			{/* List */}
			<div className={styles.listSection}>
				<div className={styles.listHeader}>
					<div className={styles.listIcon}><FileTextOutlined /></div>
					<div className={styles.listTitle}>
						<h3>{statusFilter ? STATUS_LABELS[statusFilter] : 'Tất cả yêu cầu'}</h3>
						<p>{total} yêu cầu</p>
					</div>
				</div>

				<div className={styles.listBody}>
					{loading ? (
						<div className={styles.loadingContainer}><Spin size="large" /></div>
					) : items.length === 0 ? (
						<div className={styles.emptyState}>
							<div className={styles.emptyIcon}>
								<FileTextOutlined />
							</div>
							<h3>Chưa có yêu cầu nào</h3>
							<p>Nộp biểu mẫu đầu tiên để bắt đầu theo dõi trạng thái phê duyệt tại đây.</p>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								className={styles.createBtn}
								onClick={() => setSubmitModalVisible(true)}
							>
								Nộp biểu mẫu đầu tiên
							</Button>
						</div>
					) : (
						<>
							{items.map((item) => {
								const readable = getReadableData(item).slice(0, 3);
								return (
									<div
										key={item.id}
										className={styles.submissionItem}
										onClick={() => history.push(`/submissions/${item.id}`)}
									>
										<div className={styles.itemInfo}>
											<div className={styles.itemTitle}>
												{item.form?.name || `Form #${item.formId.substring(0, 8)}`}
												<span className={`${styles.statusBadge} ${styles[item.status]}`}>
													{STATUS_LABELS[item.status] || item.status}
												</span>
											</div>
											<div className={styles.itemMeta}>
												<span className={styles.metaItem}>
													<ClockCircleOutlined />
													{moment(item.createdAt).format('DD/MM/YYYY HH:mm')}
												</span>
												{item.revisionNumber > 1 && (
													<>
														<span className={styles.metaDot}>·</span>
														<span className={styles.revTag}>Lần nộp #{item.revisionNumber}</span>
													</>
												)}
											</div>
											{readable.length > 0 && (
												<div className={styles.itemData}>
													{readable.map((f) => (
														<span key={f.key} className={styles.dataTag}>
															{f.label}: {f.value}
														</span>
													))}
												</div>
											)}
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

			<SubmitFormModal
				visible={submitModalVisible}
				onClose={() => { setSubmitModalVisible(false); fetchSubmissions(); }}
			/>
		</div>
	);
};

export default MySubmissions;
