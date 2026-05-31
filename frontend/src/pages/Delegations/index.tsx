import {
	CalendarOutlined,
	DeleteOutlined,
	EditOutlined,
	FileTextOutlined,
	PlusOutlined,
	SwapOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons';
import {
	Button,
	DatePicker,
	message,
	Modal,
	Pagination,
	Select,
	Spin,
	Steps,
	Switch,
	Table,
	Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import {
	createDelegation,
	deleteDelegation,
	getDelegations,
	updateDelegation,
} from '@/services/Delegations/delegationApi';
import type { IDelegation } from '@/services/Delegations/typings';
import { getUsers } from '@/services/Users/userApi';
import { getActiveForms } from '@/services/Forms/formApi';
import { getWorkflowDefinitions } from '@/services/Workflows/workflowApi';
import styles from './index.less';

const { RangePicker } = DatePicker;

const DelegationsPage: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;

	const [loading, setLoading] = useState(true);
	const [delegations, setDelegations] = useState<IDelegation[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(20);

	// Modal
	const [modalVisible, setModalVisible] = useState(false);
	const [editing, setEditing] = useState<IDelegation | null>(null);
	const [saving, setSaving] = useState(false);

	// Form state
	const [toUserId, setToUserId] = useState<string | undefined>(undefined);
	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
	const [isActive, setIsActive] = useState(true);
	const [scopeFormIds, setScopeFormIds] = useState<string[]>([]);
	const [scopeWorkflowIds, setScopeWorkflowIds] = useState<string[]>([]);

	// Options
	const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
	const [userSearching, setUserSearching] = useState(false);
	const [formOptions, setFormOptions] = useState<{ label: string; value: string }[]>([]);
	const [workflowOptions, setWorkflowOptions] = useState<{ label: string; value: string }[]>([]);

	const fetchDelegations = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getDelegations({ page, limit });
			const data = (res as any)?.data?.data ?? (res as any)?.data;
			const items = data?.items ?? data ?? [];
			setDelegations(Array.isArray(items) ? items : []);
			setTotal(data?.meta?.total ?? items.length ?? 0);
		} catch {
			message.error('Không thể tải danh sách ủy quyền');
		} finally {
			setLoading(false);
		}
	}, [page, limit]);

	useEffect(() => { fetchDelegations(); }, [fetchDelegations]);

	useEffect(() => {
		(async () => {
			try {
				const formsRes = await getActiveForms();
				const formsData = (formsRes as any)?.data?.data ?? (formsRes as any)?.data;
				setFormOptions((Array.isArray(formsData) ? formsData : []).map((f: any) => ({ label: f.name, value: f.id })));
			} catch { /* */ }
			try {
				const wfRes = await getWorkflowDefinitions({ limit: 100 });
				const wfData = (wfRes as any)?.data?.data ?? (wfRes as any)?.data;
				const items = wfData?.items ?? wfData ?? [];
				setWorkflowOptions((Array.isArray(items) ? items : []).map((w: any) => ({ label: w.name, value: w.id })));
			} catch { /* */ }
		})();
	}, []);

	const handleSearchUsers = async (search: string) => {
		if (!search || search.length < 2) return;
		setUserSearching(true);
		try {
			const res = await getUsers({ search, limit: 20 });
			const data = (res as any)?.data?.data ?? (res as any)?.data;
			const items = data?.items ?? data ?? [];
			setUserOptions(
				(Array.isArray(items) ? items : [])
					.filter((u: any) => u.id !== currentUser?.id)
					.map((u: any) => ({
						label: `${u.firstName || ''} ${u.lastName || ''} (${u.username || u.email})`.trim(),
						value: u.id,
					})),
			);
		} catch { setUserOptions([]); }
		finally { setUserSearching(false); }
	};

	const openCreate = () => {
		setEditing(null);
		setToUserId(undefined);
		setDateRange(null);
		setIsActive(true);
		setScopeFormIds([]);
		setScopeWorkflowIds([]);
		setModalVisible(true);
	};

	const openEdit = (record: IDelegation) => {
		setEditing(record);
		setToUserId(record.toUserId);
		setDateRange([moment(record.startDate), moment(record.endDate)]);
		setIsActive(record.isActive);
		setScopeFormIds(record.formIds ?? []);
		setScopeWorkflowIds(record.workflowDefinitionIds ?? []);
		if (record.toUser) {
			setUserOptions([{ label: `${record.toUser.username || record.toUser.email}`, value: record.toUserId }]);
		}
		setModalVisible(true);
	};

	// Get current user ID from initialState or JWT token
	const getCurrentUserId = (): string | null => {
		if (currentUser?.id) return currentUser.id;
		// Fallback: decode from JWT
		try {
			const token = localStorage.getItem('token');
			if (token) {
				const payload = JSON.parse(atob(token.split('.')[1]));
				return payload.sub || null;
			}
		} catch { /* */ }
		return null;
	};

	const handleSave = async () => {
		if (!toUserId) { message.warning('Vui lòng chọn người được ủy quyền'); return; }
		if (!dateRange || !dateRange[0] || !dateRange[1]) { message.warning('Vui lòng chọn thời gian'); return; }

		const myUserId = getCurrentUserId();
		if (!myUserId) { message.warning('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại'); return; }

		setSaving(true);
		try {
			const commonPayload = {
				toUserId,
				startDate: dateRange[0].toISOString(),
				endDate: dateRange[1].toISOString(),
				isActive,
				formIds: scopeFormIds,
				workflowDefinitionIds: scopeWorkflowIds,
			};

			if (editing) {
				await updateDelegation(editing.id, commonPayload);
				message.success('Đã cập nhật ủy quyền');
			} else {
				await createDelegation({ fromUserId: myUserId, ...commonPayload });
				message.success('Đã tạo ủy quyền');
			}
			setModalVisible(false);
			// Silent re-fetch to get full data with relations
			getDelegations({ page, limit }).then((res) => {
				const data = (res as any)?.data?.data ?? (res as any)?.data;
				const items = data?.items ?? data ?? [];
				setDelegations(Array.isArray(items) ? items : []);
				setTotal(data?.meta?.total ?? items.length ?? 0);
			}).catch(() => {});
		} catch (err: any) {
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = (record: IDelegation) => {
		Modal.confirm({
			title: 'Thu hồi ủy quyền',
			content: `Bạn có chắc muốn thu hồi ủy quyền cho ${record.toUser?.username || record.toUser?.email || ''}?`,
			okText: 'Thu hồi',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await deleteDelegation(record.id);
					setDelegations((prev) => prev.filter((d) => d.id !== record.id));
					setTotal((t) => Math.max(0, t - 1));
					message.success('Đã thu hồi ủy quyền');
				} catch (err: any) {
					message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
				}
			},
		});
	};

	const handleToggle = async (record: IDelegation, checked: boolean) => {
		// Optimistic update
		setDelegations((prev) => prev.map((d) => (d.id === record.id ? { ...d, isActive: checked } : d)));
		try {
			await updateDelegation(record.id, { isActive: checked });
			message.success(checked ? 'Đã kích hoạt ủy quyền' : 'Đã tạm ngưng ủy quyền');
		} catch (err: any) {
			// Revert on error
			setDelegations((prev) => prev.map((d) => (d.id === record.id ? { ...d, isActive: !checked } : d)));
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		}
	};

	const isExpired = (d: IDelegation) => moment(d.endDate).isBefore(moment());
	const isCurrentlyActive = (d: IDelegation) => d.isActive && !isExpired(d) && moment(d.startDate).isSameOrBefore(moment());

	const columns: ColumnsType<IDelegation> = [
		{
			title: 'Người ủy quyền',
			dataIndex: 'fromUser',
			render: (user, record) => (
				<div className={styles.userCell}>
					<div className={styles.userAvatar}>{(user?.lastName || user?.username || '?')[0].toUpperCase()}</div>
					<div>
						<div className={styles.userName}>{user?.username || user?.email || '—'}</div>
						{record.fromUserId === currentUser?.id && <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>Tôi</Tag>}
					</div>
				</div>
			),
		},
		{
			title: '',
			width: 40,
			render: () => <SwapOutlined style={{ color: '#cbd5e1' }} />,
		},
		{
			title: 'Người nhận quyền',
			dataIndex: 'toUser',
			render: (user) => (
				<div className={styles.userCell}>
					<div className={`${styles.userAvatar} ${styles.receiver}`}>{(user?.lastName || user?.username || '?')[0].toUpperCase()}</div>
					<div className={styles.userName}>{user?.username || user?.email || '—'}</div>
				</div>
			),
		},
		{
			title: 'Thời hạn',
			key: 'period',
			render: (_, record) => (
				<div className={styles.periodCell}>
					<CalendarOutlined style={{ color: '#94a3b8', marginRight: 6 }} />
					{moment(record.startDate).format('DD/MM/YYYY')} - {moment(record.endDate).format('DD/MM/YYYY')}
					{isExpired(record) && <Tag color="red" style={{ marginLeft: 6, fontSize: 10 }}>Hết hạn</Tag>}
				</div>
			),
		},
		{
			title: 'Phạm vi',
			key: 'scope',
			render: (_, record) => {
				const hasForm = record.formIds?.length > 0;
				const hasWf = record.workflowDefinitionIds?.length > 0;
				if (!hasForm && !hasWf) return <Tag style={{ borderRadius: 6 }}>Toàn quyền</Tag>;
				return (
					<div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
						{hasForm && <Tag color="blue" style={{ borderRadius: 6, fontSize: 11, margin: 0 }}><FileTextOutlined /> {record.formIds.length} biểu mẫu</Tag>}
						{hasWf && <Tag color="purple" style={{ borderRadius: 6, fontSize: 11, margin: 0 }}><SwapOutlined /> {record.workflowDefinitionIds.length} quy trình</Tag>}
					</div>
				);
			},
		},
		{
			title: 'Trạng thái',
			key: 'status',
			width: 100,
			render: (_, record) => (
				<Switch
					checked={record.isActive}
					onChange={(checked) => handleToggle(record, checked)}
					size="small"
					disabled={isExpired(record)}
				/>
			),
		},
		{
			title: '',
			width: 80,
			render: (_, record) => (
				<div style={{ display: 'flex', gap: 4 }}>
					<Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
					<Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record)} />
				</div>
			),
		},
	];

	// Summary counts
	const activeCount = delegations.filter(isCurrentlyActive).length;
	const expiredCount = delegations.filter(isExpired).length;

	return (
		<div className={styles.delegationsPage}>
			{/* Header */}
			<div className={styles.pageHeader}>
				<div className={styles.headerLeft}>
					<div className={styles.headerIcon}><SwapOutlined /></div>
					<div>
						<h1>Ủy quyền công việc</h1>
						<p>Ủy quyền phê duyệt khi bạn vắng mặt hoặc đi công tác</p>
					</div>
				</div>
				<Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className={styles.createBtn}>
					Tạo ủy quyền
				</Button>
			</div>

			{/* Stats */}
			<div className={styles.statsRow}>
				<div className={styles.statItem}>
					<div className={`${styles.statDot} ${styles.total}`} />
					<span className={styles.statNum}>{delegations.length}</span>
					<span className={styles.statLabel}>Tổng</span>
				</div>
				<div className={styles.statItem}>
					<div className={`${styles.statDot} ${styles.active}`} />
					<span className={styles.statNum}>{activeCount}</span>
					<span className={styles.statLabel}>Đang hoạt động</span>
				</div>
				<div className={styles.statItem}>
					<div className={`${styles.statDot} ${styles.expired}`} />
					<span className={styles.statNum}>{expiredCount}</span>
					<span className={styles.statLabel}>Hết hạn</span>
				</div>
			</div>

			{/* Table */}
			<div className={styles.tableCard}>
				{loading ? (
					<div className={styles.loadingContainer}><Spin /></div>
				) : delegations.length === 0 ? (
					<div className={styles.emptyState}>
						<SwapOutlined style={{ fontSize: 48, color: '#cbd5e1' }} />
						<h3>Chưa có ủy quyền nào</h3>
						<p>Tạo ủy quyền khi bạn vắng mặt để công việc không bị gián đoạn</p>
						<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Tạo ủy quyền đầu tiên</Button>
					</div>
				) : (
					<>
						<Table columns={columns} dataSource={delegations} rowKey="id" pagination={false} size="middle"
							rowClassName={(record) => isExpired(record) ? styles.expiredRow : ''}
						/>
						{total > limit && (
							<div className={styles.paginationWrap}>
								<Pagination current={page} total={total} pageSize={limit} onChange={setPage} showSizeChanger={false} size="small" />
							</div>
						)}
					</>
				)}
			</div>

			{/* Create / Edit Modal */}
			<Modal
				title={null}
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				onOk={handleSave}
				confirmLoading={saving}
				okText={editing ? 'Cập nhật' : 'Xác nhận ủy quyền'}
				cancelText="Hủy"
				destroyOnClose
				width={560}
				wrapClassName={styles.delegationModal}
			>
				{/* Modal header */}
				<div className={styles.modalHeader}>
					<div className={styles.modalIcon}><SwapOutlined /></div>
					<div>
						<h3>{editing ? 'Chỉnh sửa ủy quyền' : 'Tạo ủy quyền mới'}</h3>
						<p>{currentUser?.firstName} {currentUser?.lastName} ({currentUser?.username})</p>
					</div>
				</div>

				{/* Step 1: Ai */}
				<div className={styles.modalSection}>
					<div className={styles.sectionNum}>1</div>
					<div className={styles.sectionContent}>
						<label className={styles.sectionLabel}>
							Tôi ủy quyền cho <span style={{ color: '#ef4444' }}>*</span>
						</label>
						<p className={styles.sectionHint}>Chọn người sẽ thay bạn phê duyệt các yêu cầu</p>
						<Select
							showSearch
							placeholder="Tìm theo tên hoặc email..."
							value={toUserId}
							onChange={setToUserId}
							onSearch={handleSearchUsers}
							filterOption={false}
							loading={userSearching}
							options={userOptions}
							style={{ width: '100%' }}
							notFoundContent={userSearching ? <Spin size="small" /> : 'Nhập ít nhất 2 ký tự để tìm'}
							size="large"
						/>
					</div>
				</div>

				{/* Step 2: Phạm vi */}
				<div className={styles.modalSection}>
					<div className={styles.sectionNum}>2</div>
					<div className={styles.sectionContent}>
						<label className={styles.sectionLabel}>Phạm vi ủy quyền</label>
						<p className={styles.sectionHint}>Để trống cả hai = ủy quyền toàn bộ quyền phê duyệt</p>

						<div className={styles.scopeGroup}>
							<div className={styles.scopeField}>
								<div className={styles.scopeIcon}><FileTextOutlined /></div>
								<div style={{ flex: 1 }}>
									<div className={styles.scopeTitle}>Giới hạn theo biểu mẫu</div>
									<Select
										mode="multiple"
										placeholder="Tất cả biểu mẫu"
										value={scopeFormIds}
										onChange={setScopeFormIds}
										options={formOptions}
										style={{ width: '100%' }}
										allowClear
									/>
								</div>
							</div>
							<div className={styles.scopeField}>
								<div className={styles.scopeIcon}><SwapOutlined /></div>
								<div style={{ flex: 1 }}>
									<div className={styles.scopeTitle}>Giới hạn theo quy trình</div>
									<Select
										mode="multiple"
										placeholder="Tất cả quy trình"
										value={scopeWorkflowIds}
										onChange={setScopeWorkflowIds}
										options={workflowOptions}
										style={{ width: '100%' }}
										allowClear
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Step 3: Thời gian */}
				<div className={styles.modalSection}>
					<div className={styles.sectionNum}>3</div>
					<div className={styles.sectionContent}>
						<label className={styles.sectionLabel}>
							Thời gian ủy quyền <span style={{ color: '#ef4444' }}>*</span>
						</label>
						<p className={styles.sectionHint}>Ủy quyền tự động hết hiệu lực sau ngày kết thúc</p>
						<RangePicker
							value={dateRange}
							onChange={(vals) => setDateRange(vals as [moment.Moment, moment.Moment] | null)}
							style={{ width: '100%' }}
							format="DD/MM/YYYY"
							size="large"
							placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
						/>
					</div>
				</div>

				{/* Active toggle */}
				<div className={styles.modalToggle}>
					<div>
						<div className={styles.toggleLabel}>Kích hoạt ngay</div>
						<div className={styles.toggleHint}>Tắt nếu muốn thiết lập trước nhưng chưa áp dụng</div>
					</div>
					<Switch checked={isActive} onChange={setIsActive} />
				</div>

				{/* Summary preview */}
				{toUserId && dateRange && (
					<div className={styles.modalSummary}>
						<div className={styles.summaryTitle}>Tóm tắt</div>
						<div className={styles.summaryText}>
							<strong>{currentUser?.firstName} {currentUser?.lastName}</strong> ủy quyền phê duyệt
							{scopeFormIds.length > 0 || scopeWorkflowIds.length > 0 ? (
								<> ({scopeFormIds.length > 0 && `${scopeFormIds.length} biểu mẫu`}{scopeFormIds.length > 0 && scopeWorkflowIds.length > 0 && ', '}{scopeWorkflowIds.length > 0 && `${scopeWorkflowIds.length} quy trình`})</>
							) : ' toàn bộ'} cho <strong>{userOptions.find((u) => u.value === toUserId)?.label || '...'}</strong> từ {dateRange[0].format('DD/MM/YYYY')} đến {dateRange[1].format('DD/MM/YYYY')}.
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default DelegationsPage;
