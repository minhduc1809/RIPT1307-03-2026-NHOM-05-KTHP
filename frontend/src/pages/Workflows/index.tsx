import {
	ArrowRightOutlined,
	BranchesOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	FileTextOutlined,
	ForkOutlined,
	LinkOutlined,
	OrderedListOutlined,
	PartitionOutlined,
	PlusOutlined,
	SearchOutlined,
	SettingOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Input, message, Modal, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import {
	deleteWorkflowDefinition,
	getWorkflowDefinitions,
} from '@/services/Workflows/workflowApi';
import type { IWorkflowDefinition, IWorkflowConfig } from '@/services/Workflows/typings';
import WorkflowTree from '@/components/WorkflowTree';
import styles from './index.less';

const ROLE_LABELS: Record<string, string> = {
	ADMIN: 'Quản trị viên',
	MANAGER: 'Quản lý',
	HR: 'Nhân sự',
	USER: 'Nhân viên',
};

type WorkflowType = 'sequential' | 'parallel' | 'voting' | 'custom';

function detectType(config: IWorkflowConfig): WorkflowType {
	if (config.transitions?.some((t) => t.type === 'VOTING')) return 'voting';
	if (config.transitions?.some((t) => t.type === 'PARALLEL_JOIN')) return 'parallel';
	if (config.transitions?.some((t) => t.action === 'approve')) return 'sequential';
	return 'custom';
}

const TYPE_CONFIG: Record<WorkflowType, { label: string; color: string; icon: React.ReactNode }> = {
	sequential: { label: 'Tuần tự', color: 'blue', icon: <OrderedListOutlined /> },
	parallel: { label: 'Song song', color: 'cyan', icon: <ForkOutlined /> },
	voting: { label: 'Bỏ phiếu', color: 'purple', icon: <TeamOutlined /> },
	custom: { label: 'Tùy chỉnh', color: 'default', icon: <SettingOutlined /> },
};

function parseSequentialSteps(config: IWorkflowConfig) {
	const steps: Array<{ role: string; canReject: boolean; requireCommentOnReject: boolean; canReturn: boolean; requireCommentOnReturn: boolean }> = [];
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

	const displayedWorkflows = useMemo(() => {
		if (!searchText.trim()) return workflows;
		return workflows.filter((w) =>
			w.name.toLowerCase().includes(searchText.toLowerCase()),
		);
	}, [workflows, searchText]);

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
					Bạn có chắc chắn muốn xóa workflow <strong>{record.name}</strong>? Thao tác này không thể hoàn tác.
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

	const openDrawer = (record: IWorkflowDefinition) => {
		setSelectedWorkflow(record);
		setDrawerOpen(true);
	};

	const columns: ColumnsType<IWorkflowDefinition> = useMemo(() => {
		const cols: ColumnsType<IWorkflowDefinition> = [
			{
				title: 'Tên Workflow',
				dataIndex: 'name',
				key: 'name',
				render: (_: string, record: IWorkflowDefinition) => {
					const wfType = detectType(record.config);
					const typeConf = TYPE_CONFIG[wfType];
					return (
						<div className={styles.nameCell}>
							<div className={styles.nameIcon}>
								<PartitionOutlined />
							</div>
							<div className={styles.nameInfo}>
								<div className={styles.nameTitle}>{record.name}</div>
								<div className={styles.nameMeta}>
									<Tag
										icon={typeConf.icon}
										color={typeConf.color}
										style={{ fontSize: 10, lineHeight: '16px', margin: 0, borderRadius: 6 }}
									>
										{typeConf.label}
									</Tag>
									<span>{record.config?.states?.length ?? 0} trạng thái</span>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				title: 'Trạng thái',
				key: 'states',
				width: 280,
				render: (_: any, record: IWorkflowDefinition) => {
					const config = record.config;
					if (!config?.states?.length) return <span className={styles.noForm}>-</span>;
					return (
						<div className={styles.statesPreview}>
							{config.states.slice(0, 4).map((s) => {
								let cls = styles.normal;
								if (s === config.initialState) cls = styles.initial;
								else if (config.finalStates?.includes(s)) cls = styles.final;
								return (
									<span key={s} className={`${styles.stateTag} ${cls}`}>
										{config.stateLabels?.[s] || s}
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
						<span className={styles.formLink}>
							<FileTextOutlined /> {record.form.name}
						</span>
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

		if (isAdminOrManager) {
			cols.push({
				title: 'Thao tác',
				key: 'actions',
				width: 140,
				align: 'right' as const,
				render: (_: any, record: IWorkflowDefinition) => (
					<div className={styles.actionBtns}>
						<Tooltip title="Xem chi tiết">
							<button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={(e) => { e.stopPropagation(); handleView(record); }}>
								<EyeOutlined style={{ fontSize: 16 }} />
							</button>
						</Tooltip>
						<Tooltip title="Chỉnh sửa">
							<button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={(e) => { e.stopPropagation(); handleEdit(record); }}>
								<EditOutlined style={{ fontSize: 16 }} />
							</button>
						</Tooltip>
						{userRole === 'ADMIN' && (
							<Tooltip title="Xóa">
								<button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={(e) => { e.stopPropagation(); handleDelete(record); }}>
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

	// Drawer: detect workflow type and prepare tree data
	const drawerWfType = useMemo(() => selectedWorkflow ? detectType(selectedWorkflow.config) : 'custom', [selectedWorkflow]);
	const drawerSteps = useMemo(() => {
		if (drawerWfType !== 'sequential' || !selectedWorkflow) return null;
		return parseSequentialSteps(selectedWorkflow.config);
	}, [drawerWfType, selectedWorkflow]);
	const drawerParallelTransition = useMemo(() => selectedWorkflow?.config?.transitions?.find((t) => t.type === 'PARALLEL_JOIN'), [selectedWorkflow]);
	const drawerVotingTransition = useMemo(() => selectedWorkflow?.config?.transitions?.find((t) => t.type === 'VOTING'), [selectedWorkflow]);

	// Stats
	const typeCounts = useMemo(() => {
		const counts: Record<WorkflowType, number> = { sequential: 0, parallel: 0, voting: 0, custom: 0 };
		workflows.forEach((w) => { counts[detectType(w.config)]++; });
		return counts;
	}, [workflows]);

	return (
		<div className={styles.workflowDashboard}>
			{/* Header */}
			<div className={styles.headerSection}>
				<div className={styles.headerTitle}>
					<h1>{isAdminOrManager ? 'Quản lý Workflows' : 'Danh sách quy trình'}</h1>
					<p>{isAdminOrManager ? 'Thiết kế và quản lý các luồng phê duyệt cho hệ thống.' : 'Xem các quy trình phê duyệt đang hoạt động.'}</p>
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
					<Input
						placeholder="Tìm kiếm tên workflow..."
						prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
						onPressEnter={(e) => setSearchText(e.currentTarget.value)}
						onChange={(e) => { if (!e.target.value) setSearchText(''); }}
						allowClear
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
						showTotal: (t, range) => `Hiển thị ${range[0]}-${range[1]} trong số ${t} workflow`,
						onChange: (p, ps) => { setPage(p); setLimit(ps ?? 10); },
					}}
					onRow={(record) => ({
						style: { cursor: 'pointer' },
						onClick: () => openDrawer(record),
					})}
				/>
			</div>

			{/* Stats Grid */}
			<div className={styles.statsGrid}>
				<div className={styles.statCardPrimary}>
					<div style={{ position: 'relative', zIndex: 1 }}>
						<div className={styles.statLabel}>Tổng Workflows</div>
						<div className={styles.statValue}>{total}</div>
						<div className={styles.statChange}>Tổng số luồng phê duyệt trong hệ thống</div>
					</div>
					<div className={styles.statBgIcon}><BranchesOutlined /></div>
				</div>

				<div className={styles.statCard}>
					<div>
						<div className={styles.statIcon}><LinkOutlined /></div>
						<div className={styles.statTitle}>Có biểu mẫu</div>
					</div>
					<div className={styles.statNumber}>{workflows.filter((w) => w.formId).length}</div>
				</div>

				<div className={`${styles.statCard} ${styles.light}`}>
					<div>
						<div className={styles.statIcon}><BranchesOutlined /></div>
						<div className={styles.statTitle}>Theo loại</div>
					</div>
					<div className={styles.typeStats}>
						{typeCounts.sequential > 0 && <Tag icon={<OrderedListOutlined />} color="blue">{typeCounts.sequential} tuần tự</Tag>}
						{typeCounts.parallel > 0 && <Tag icon={<ForkOutlined />} color="cyan">{typeCounts.parallel} song song</Tag>}
						{typeCounts.voting > 0 && <Tag icon={<TeamOutlined />} color="purple">{typeCounts.voting} bỏ phiếu</Tag>}
					</div>
				</div>
			</div>

			{/* Detail Drawer */}
			<Drawer
				title={
					selectedWorkflow ? (
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<span>{selectedWorkflow.name}</span>
							<Tag color={TYPE_CONFIG[drawerWfType].color} style={{ margin: 0 }}>
								{TYPE_CONFIG[drawerWfType].icon} {TYPE_CONFIG[drawerWfType].label}
							</Tag>
						</div>
					) : 'Chi tiết Workflow'
				}
				visible={drawerOpen}
				onClose={() => { setDrawerOpen(false); setSelectedWorkflow(null); }}
				width={560}
				extra={
					isAdminOrManager && selectedWorkflow ? (
						<div style={{ display: 'flex', gap: 8 }}>
							<Button size="small" icon={<EyeOutlined />} onClick={() => handleView(selectedWorkflow)}>Chi tiết</Button>
							<Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(selectedWorkflow)}>Sửa</Button>
						</div>
					) : null
				}
			>
				{selectedWorkflow && (
					<>
						{/* Workflow Tree */}
						<div className={styles.detailSection}>
							<div className={styles.detailLabel}>Sơ đồ luồng</div>
							{drawerWfType === 'sequential' && drawerSteps ? (
								<WorkflowTree mode="sequential" steps={drawerSteps} roleLabels={ROLE_LABELS} />
							) : drawerWfType === 'parallel' && drawerParallelTransition ? (
								<WorkflowTree
									mode="parallel"
									parallelData={{ roles: drawerParallelTransition.roles || [] }}
									roleLabels={ROLE_LABELS}
								/>
							) : drawerWfType === 'voting' && drawerVotingTransition?.votingConfig ? (
								<WorkflowTree
									mode="voting"
									votingData={{
										voterRole: drawerVotingTransition.roles?.[0] || 'MANAGER',
										approveThreshold: drawerVotingTransition.votingConfig.approveThreshold,
										rejectThreshold: drawerVotingTransition.votingConfig.rejectThreshold,
									}}
									roleLabels={ROLE_LABELS}
								/>
							) : (
								<div style={{ padding: 20, color: '#94a3b8', textAlign: 'center' }}>
									Workflow tùy chỉnh - {selectedWorkflow.config?.states?.length ?? 0} trạng thái
								</div>
							)}
						</div>

						{/* Basic Info */}
						<div className={styles.detailSection}>
							<div className={styles.detailLabel}>Tên Workflow</div>
							<div className={styles.detailValue}>{selectedWorkflow.name}</div>
						</div>

						{selectedWorkflow.form && (
							<div className={styles.detailSection}>
								<div className={styles.detailLabel}>Biểu mẫu liên kết</div>
								<div className={styles.detailValue}>
									<span className={styles.formLink}><FileTextOutlined /> {selectedWorkflow.form.name}</span>
								</div>
							</div>
						)}

						<div className={styles.detailSection}>
							<div className={styles.detailLabel}>Ngày tạo</div>
							<div className={styles.detailValue}>{moment(selectedWorkflow.createdAt).format('DD/MM/YYYY HH:mm')}</div>
						</div>

						{/* States */}
						<div className={styles.detailSection}>
							<div className={styles.detailLabel}>Trạng thái</div>
							<div className={styles.statesPreview} style={{ marginTop: 4 }}>
								{selectedWorkflow.config?.states?.map((s) => {
									let cls = styles.normal;
									if (s === selectedWorkflow.config.initialState) cls = styles.initial;
									else if (selectedWorkflow.config.finalStates?.includes(s)) cls = styles.final;
									return (
										<span key={s} className={`${styles.stateTag} ${cls}`}>
											{selectedWorkflow.config.stateLabels?.[s] || s}
											{s === selectedWorkflow.config.initialState && ' (bắt đầu)'}
											{selectedWorkflow.config.finalStates?.includes(s) && ' (kết thúc)'}
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
									const fromLabel = typeof t.from === 'string' ? (t.from === '*' ? '* (tất cả)' : t.from) : (t.from as string[]).join(', ');
									return (
										<div key={idx} className={styles.transitionItem}>
											<span className={styles.tFrom}>{fromLabel}</span>
											<span className={styles.tArrow}><ArrowRightOutlined /></span>
											<span className={styles.tTo}>{t.to}</span>
											<span className={styles.tAction}>
												{t.type === 'VOTING' && <TeamOutlined style={{ marginRight: 4 }} />}
												{t.type === 'PARALLEL_JOIN' && <ForkOutlined style={{ marginRight: 4 }} />}
												{t.action}
											</span>
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
