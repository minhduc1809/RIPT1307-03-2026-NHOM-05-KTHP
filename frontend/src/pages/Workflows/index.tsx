import {
	ArrowRightOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PartitionOutlined,
	PlusOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Input, message, Modal, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import {
	deleteWorkflowDefinition,
	getWorkflowDefinitions,
} from '@/services/Workflows/workflowApi';
import type { IWorkflowDefinition } from '@/services/Workflows/typings';
import styles from './index.less';

const WorkflowsDashboard: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const userRole = currentUser?.role;
	const isAdminOrManager = userRole && ['ADMIN', 'MANAGER'].includes(userRole);

	const [loading, setLoading] = useState(false);
	const [workflows, setWorkflows] = useState<IWorkflowDefinition[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [searchText, setSearchText] = useState('');

	// Detail drawer
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedWorkflow, setSelectedWorkflow] = useState<IWorkflowDefinition | null>(null);

	const fetchWorkflows = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getWorkflowDefinitions({ page, limit });
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setWorkflows(data?.items ?? []);
			setTotal(data?.meta?.total ?? 0);
		} catch (error) {
			console.error('Failed to fetch workflows:', error);
		} finally {
			setLoading(false);
		}
	}, [page, limit]);

	useEffect(() => {
		fetchWorkflows();
	}, [fetchWorkflows]);

	/** Client-side search */
	const displayedWorkflows = useMemo(() => {
		if (!searchText.trim()) return workflows;
		return workflows.filter((w) =>
			w.name.toLowerCase().includes(searchText.toLowerCase()),
		);
	}, [workflows, searchText]);

	const handleSearch = (value: string) => {
		setSearchText(value);
	};

	const handleView = (record: IWorkflowDefinition) => {
		history.push(`/workflows/${record.id}`);
	};

	const handleEdit = (record: IWorkflowDefinition) => {
		history.push(`/workflows/${record.id}/edit`);
	};

	const handleDelete = (record: IWorkflowDefinition) => {
		if (userRole !== 'ADMIN') {
			message.warning('Chỉ ADMIN mới có quyền xóa workflow');
			return;
		}

		Modal.confirm({
			title: 'Xác nhận xóa',
			content: (
				<span>
					Bạn có chắc chắn muốn xóa workflow <strong>{record.name}</strong>? Thao tác
					này không thể hoàn tác.
				</span>
			),
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await deleteWorkflowDefinition(record.id);
					message.success('Đã xóa workflow thành công');
					fetchWorkflows();
				} catch (error: any) {
					if (error?.response?.status === 409) {
						message.error('Không thể xóa: còn workflow instance đang hoạt động');
					}
				}
			},
		});
	};

	const getStateCount = (wf: IWorkflowDefinition): number => {
		return wf.config?.states?.length ?? 0;
	};

	const getTransitionCount = (wf: IWorkflowDefinition): number => {
		return wf.config?.transitions?.length ?? 0;
	};

	const columns: ColumnsType<IWorkflowDefinition> = useMemo(() => {
		const cols: ColumnsType<IWorkflowDefinition> = [
			{
				title: 'Tên Workflow',
				dataIndex: 'name',
				key: 'name',
				render: (_: string, record: IWorkflowDefinition) => (
					<div className={styles.nameCell}>
						<div className={styles.nameIcon}>
							<PartitionOutlined />
						</div>
						<div className={styles.nameInfo}>
							<div className={styles.nameTitle}>{record.name}</div>
							<div className={styles.nameMeta}>
								{getStateCount(record)} trạng thái •{' '}
								{getTransitionCount(record)} chuyển đổi
							</div>
						</div>
					</div>
				),
			},
			{
				title: 'Trạng thái',
				key: 'states',
				width: 280,
				render: (_: any, record: IWorkflowDefinition) => {
					const config = record.config;
					if (!config?.states?.length) return <span className={styles.noForm}>—</span>;
					return (
						<div className={styles.statesPreview}>
							{config.states.slice(0, 4).map((s) => {
								let cls = styles.normal;
								if (s === config.initialState) cls = styles.initial;
								else if (config.finalStates?.includes(s)) cls = styles.final;
								return (
									<span key={s} className={`${styles.stateTag} ${cls}`}>
										{s}
									</span>
								);
							})}
							{config.states.length > 4 && (
								<span className={`${styles.stateTag} ${styles.normal}`}>
									+{config.states.length - 4}
								</span>
							)}
						</div>
					);
				},
			},
			{
				title: 'Biểu mẫu',
				key: 'form',
				width: 180,
				render: (_: any, record: IWorkflowDefinition) =>
					record.form ? (
						<span className={styles.formLink}>📋 {record.form.name}</span>
					) : (
						<span className={styles.noForm}>Không liên kết</span>
					),
			},
			{
				title: 'Ngày tạo',
				dataIndex: 'createdAt',
				key: 'createdAt',
				width: 140,
				render: (date: string) => (
					<span style={{ color: '#64748b', fontSize: 13 }}>
						{moment(date).format('DD/MM/YYYY')}
					</span>
				),
			},
		];

		// Action column
		if (isAdminOrManager) {
			cols.push({
				title: 'Thao tác',
				key: 'actions',
				width: 140,
				align: 'right' as const,
				render: (_: any, record: IWorkflowDefinition) => (
					<div className={styles.actionBtns}>
						<Tooltip title="Xem chi tiết">
							<button
								className={`${styles.actionBtn} ${styles.viewBtn}`}
								onClick={(e) => {
									e.stopPropagation();
									handleView(record);
								}}
							>
								<EyeOutlined style={{ fontSize: 16 }} />
							</button>
						</Tooltip>
						<Tooltip title="Chỉnh sửa">
							<button
								className={`${styles.actionBtn} ${styles.editBtn}`}
								onClick={(e) => {
									e.stopPropagation();
									handleEdit(record);
								}}
							>
								<EditOutlined style={{ fontSize: 16 }} />
							</button>
						</Tooltip>
						{userRole === 'ADMIN' && (
							<Tooltip title="Xóa">
								<button
									className={`${styles.actionBtn} ${styles.deleteBtn}`}
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(record);
									}}
								>
									<DeleteOutlined style={{ fontSize: 16 }} />
								</button>
							</Tooltip>
						)}
					</div>
				),
			});
		}

		return cols;
	}, [isAdminOrManager, userRole]);

	return (
		<div className={styles.workflowDashboard}>
			{/* Header */}
			<div className={styles.headerSection}>
				<div className={styles.headerTitle}>
					<h1>Quản lý Workflows</h1>
					<p>Thiết kế và quản lý các luồng phê duyệt cho hệ thống.</p>
				</div>
				{isAdminOrManager && (
					<Button
						type="primary"
						icon={<PlusOutlined />}
						className={styles.createBtn}
						onClick={() => history.push('/workflows/builder')}
					>
						Tạo workflow mới
					</Button>
				)}
			</div>

			{/* Search Bar */}
			<div className={styles.searchFilterBar}>
				<div className={styles.searchInput}>
					<Input.Search
						placeholder="Tìm kiếm tên workflow..."
						prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
						onSearch={handleSearch}
						onChange={(e) => {
							if (!e.target.value) setSearchText('');
						}}
						allowClear
						enterButton={false}
					/>
				</div>
			</div>

			{/* Table */}
			<div className={styles.tableWrapper}>
				<Table<IWorkflowDefinition>
					columns={columns}
					dataSource={displayedWorkflows}
					loading={loading}
					rowKey="id"
					pagination={{
						current: page,
						pageSize: limit,
						total,
						showSizeChanger: true,
						showTotal: (t, range) =>
							`Hiển thị ${range[0]}-${range[1]} trong số ${t} workflow`,
						onChange: (p, ps) => {
							setPage(p);
							setLimit(ps ?? 10);
						},
					}}
					onRow={(record) => ({
						style: { cursor: 'pointer' },
						onClick: () => handleView(record),
					})}
				/>
			</div>

			{/* Stats Grid */}
			<div className={styles.statsGrid}>
				<div className={styles.statCardPrimary}>
					<div style={{ position: 'relative', zIndex: 1 }}>
						<div className={styles.statLabel}>Tổng Workflows</div>
						<div className={styles.statValue}>{total}</div>
						<div className={styles.statChange}>
							Tổng số luồng phê duyệt trong hệ thống
						</div>
					</div>
					<div className={styles.statBgIcon}>⚙️</div>
				</div>

				<div className={styles.statCard}>
					<div>
						<div className={styles.statIcon}>🔗</div>
						<div className={styles.statTitle}>Có biểu mẫu</div>
					</div>
					<div className={styles.statNumber}>
						{workflows.filter((w) => w.formId).length}
					</div>
				</div>

				<div className={`${styles.statCard} ${styles.light}`}>
					<div>
						<div className={styles.statIcon}>📊</div>
						<div className={styles.statTitle}>Trung bình steps</div>
					</div>
					<div className={styles.statNumber}>
						{workflows.length > 0
							? Math.round(
									workflows.reduce(
										(sum, w) => sum + (w.config?.states?.length ?? 0),
										0,
									) / workflows.length,
							  )
							: 0}
					</div>
				</div>
			</div>

			{/* Detail Drawer */}
			<Drawer
				title={selectedWorkflow?.name ?? 'Chi tiết Workflow'}
				open={drawerOpen}
				onClose={() => {
					setDrawerOpen(false);
					setSelectedWorkflow(null);
				}}
				width={480}
			>
				{selectedWorkflow && (
					<>
						{/* Basic Info */}
						<div className={styles.detailSection}>
							<div className={styles.detailLabel}>Tên Workflow</div>
							<div className={styles.detailValue}>{selectedWorkflow.name}</div>
						</div>

						{selectedWorkflow.form && (
							<div className={styles.detailSection}>
								<div className={styles.detailLabel}>Biểu mẫu liên kết</div>
								<div className={styles.detailValue}>
									<span className={styles.formLink}>
										📋 {selectedWorkflow.form.name}
									</span>
								</div>
							</div>
						)}

						<div className={styles.detailSection}>
							<div className={styles.detailLabel}>Ngày tạo</div>
							<div className={styles.detailValue}>
								{moment(selectedWorkflow.createdAt).format(
									'DD/MM/YYYY HH:mm',
								)}
							</div>
						</div>

						{/* States */}
						<div className={styles.detailSection}>
							<div className={styles.detailLabel}>Trạng thái</div>
							<div className={styles.statesPreview} style={{ marginTop: 4 }}>
								{selectedWorkflow.config?.states?.map((s) => {
									let cls = styles.normal;
									if (s === selectedWorkflow.config.initialState)
										cls = styles.initial;
									else if (
										selectedWorkflow.config.finalStates?.includes(s)
									)
										cls = styles.final;
									return (
										<span
											key={s}
											className={`${styles.stateTag} ${cls}`}
										>
											{s}
											{s === selectedWorkflow.config.initialState &&
												' (bắt đầu)'}
											{selectedWorkflow.config.finalStates?.includes(
												s,
											) && ' (kết thúc)'}
										</span>
									);
								})}
							</div>
						</div>

						{/* Transitions */}
						<div className={styles.detailSection}>
							<div className={styles.detailLabel}>Chuyển đổi trạng thái</div>
							<div className={styles.transitionCardList}>
								{selectedWorkflow.config?.transitions?.map((t, idx) => {
									const fromLabel =
										typeof t.from === 'string'
											? t.from === '*'
												? '* (tất cả)'
												: t.from
											: (t.from as string[]).join(', ');

									return (
										<div key={idx} className={styles.transitionItem}>
											<span className={styles.tFrom}>{fromLabel}</span>
											<span className={styles.tArrow}>
												<ArrowRightOutlined />
											</span>
											<span className={styles.tTo}>{t.to}</span>
											<span className={styles.tAction}>{t.action}</span>
										</div>
									);
								})}
							</div>
						</div>
					</>
				)}
			</Drawer>
		</div>
	);
};

export default WorkflowsDashboard;
