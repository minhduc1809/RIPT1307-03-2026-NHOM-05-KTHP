import {
	CalendarOutlined,
	DeleteOutlined,
	EditOutlined,
	FileTextOutlined,
	PlusOutlined,
	SwapOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, message, Modal, Pagination, Select, Spin, Switch, Table } from 'antd';
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

const DelegationsPage: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;

	const [loading, setLoading] = useState(true);
	const [delegations, setDelegations] = useState<IDelegation[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(20);

	const [modalVisible, setModalVisible] = useState(false);
	const [editing, setEditing] = useState<IDelegation | null>(null);
	const [saving, setSaving] = useState(false);
	const [revokeTarget, setRevokeTarget] = useState<IDelegation | null>(null);
	const [revoking, setRevoking] = useState(false);

	const [toUserId, setToUserId] = useState<string | undefined>(undefined);
	const [startDate, setStartDate] = useState<moment.Moment | null>(null);
	const [endDate, setEndDate] = useState<moment.Moment | null>(null);
	const [isActive, setIsActive] = useState(true);
	const [scopeFormIds, setScopeFormIds] = useState<string[]>([]);
	const [scopeWorkflowIds, setScopeWorkflowIds] = useState<string[]>([]);

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
		setStartDate(null);
		setEndDate(null);
		setIsActive(true);
		setScopeFormIds([]);
		setScopeWorkflowIds([]);
		setModalVisible(true);
	};

	const openEdit = (record: IDelegation) => {
		setEditing(record);
		setToUserId(record.toUserId);
		setStartDate(moment(record.startDate));
		setEndDate(moment(record.endDate));
		setIsActive(record.isActive);
		setScopeFormIds(record.formIds ?? []);
		setScopeWorkflowIds(record.workflowDefinitionIds ?? []);
		if (record.toUser) {
			setUserOptions([{ label: `${record.toUser.username || record.toUser.email}`, value: record.toUserId }]);
		}
		setModalVisible(true);
	};

	const getCurrentUserId = (): string | null => {
		if (currentUser?.id) return currentUser.id;
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
		if (!startDate || !endDate) { message.warning('Vui lòng chọn thời gian'); return; }

		const myUserId = getCurrentUserId();
		if (!myUserId) { message.warning('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại'); return; }

		setSaving(true);
		try {
			const commonPayload = {
				toUserId,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
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

	const confirmRevoke = async () => {
		if (!revokeTarget) return;
		setRevoking(true);
		try {
			await deleteDelegation(revokeTarget.id);
			setDelegations((prev) => prev.filter((d) => d.id !== revokeTarget.id));
			setTotal((t) => Math.max(0, t - 1));
			message.success('Đã thu hồi ủy quyền');
			setRevokeTarget(null);
		} catch (err: any) {
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setRevoking(false);
		}
	};

	const handleToggle = async (record: IDelegation, checked: boolean) => {
		setDelegations((prev) => prev.map((d) => (d.id === record.id ? { ...d, isActive: checked } : d)));
		try {
			await updateDelegation(record.id, { isActive: checked });
			message.success(checked ? 'Đã kích hoạt ủy quyền' : 'Đã tạm ngưng ủy quyền');
		} catch (err: any) {
			setDelegations((prev) => prev.map((d) => (d.id === record.id ? { ...d, isActive: !checked } : d)));
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		}
	};

	const isExpired = (d: IDelegation) => moment(d.endDate).isBefore(moment());
	const isCurrentlyActive = (d: IDelegation) => d.isActive && !isExpired(d) && moment(d.startDate).isSameOrBefore(moment());

	const initial = (user: any) =>
		`${(user?.lastName || user?.username || '?')[0] || ''}${(user?.firstName || '')[0] || ''}`.toUpperCase();

	const columns: ColumnsType<IDelegation> = [
		{
			title: 'Từ / Tới',
			key: 'users',
			render: (_, record) => (
				<div className={styles.userCell}>
					<div className={styles.userAvatar}>{initial(record.fromUser)}</div>
					<SwapOutlined className={styles.swapIcon} />
					<div className={`${styles.userAvatar} ${styles.receiver}`}>{initial(record.toUser)}</div>
					<div>
						<div className={styles.userName}>
							{record.fromUser?.username || record.fromUser?.email || '—'} → {record.toUser?.username || record.toUser?.email || '—'}
						</div>
						{record.fromUserId === currentUser?.id && <span className={styles.meTag}>Tôi ủy quyền</span>}
					</div>
				</div>
			),
		},
		{
			title: 'Thời gian',
			key: 'period',
			width: 220,
			render: (_, record) => (
				<div className={styles.periodCell}>
					<CalendarOutlined style={{ color: '#94a3b8' }} />
					{moment(record.startDate).format('DD/MM')} – {moment(record.endDate).format('DD/MM/YYYY')}
					{isExpired(record) && <span className={styles.expiredTag}>Hết hạn</span>}
				</div>
			),
		},
		{
			title: 'Phạm vi',
			key: 'scope',
			width: 220,
			render: (_, record) => {
				const hasForm = record.formIds?.length > 0;
				const hasWf = record.workflowDefinitionIds?.length > 0;
				if (!hasForm && !hasWf) return <span className={`${styles.scopeTag} ${styles.all}`}>Toàn quyền</span>;
				return (
					<div className={styles.scopeTags}>
						{hasForm && (
							<span className={styles.scopeTag}>
								<FileTextOutlined /> {record.formIds.length} biểu mẫu
							</span>
						)}
						{hasWf && (
							<span className={styles.scopeTag}>
								<SwapOutlined /> {record.workflowDefinitionIds.length} quy trình
							</span>
						)}
					</div>
				);
			},
		},
		{
			title: 'Trạng thái',
			key: 'status',
			width: 110,
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
			title: 'Thao tác',
			key: 'actions',
			width: 80,
			render: (_, record) => (
				<div className={styles.rowActions}>
					<button type='button' className={styles.actionBtn} onClick={() => openEdit(record)}>
						<EditOutlined />
					</button>
					<button type='button' className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setRevokeTarget(record)}>
						<DeleteOutlined />
					</button>
				</div>
			),
		},
	];

	const activeCount = delegations.filter(isCurrentlyActive).length;
	const expiredCount = delegations.filter(isExpired).length;

	return (
		<div className={styles.delegationsPage}>
			<div className={styles.pageHeader}>
				<div>
					<h1>Ủy quyền</h1>
					<p>Chuyển giao quyền phê duyệt trong khoảng thời gian xác định</p>
				</div>
				<Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className={styles.createBtn}>
					Tạo ủy quyền
				</Button>
			</div>

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

			<div className={styles.tableCard}>
				{loading ? (
					<div className={styles.loadingContainer}><Spin /></div>
				) : delegations.length === 0 ? (
					<div className={styles.emptyState}>
						<SwapOutlined style={{ fontSize: 48, color: '#cbd5e1' }} />
						<h3>Chưa có ủy quyền nào</h3>
						<p>Tạo ủy quyền khi bạn vắng mặt để công việc không bị gián đoạn</p>
						<Button type="primary" icon={<PlusOutlined />} onClick={openCreate} className={styles.createBtn}>
							Tạo ủy quyền đầu tiên
						</Button>
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

			<Modal
				title={editing ? 'Chỉnh sửa ủy quyền' : 'Tạo ủy quyền'}
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				onOk={handleSave}
				confirmLoading={saving}
				okText={editing ? 'Cập nhật' : 'Xác nhận ủy quyền'}
				cancelText='Hủy'
				destroyOnClose
				width={460}
				className={styles.delegationModal}
			>
				<div className={styles.fieldGroup}>
					<label>Người được ủy quyền</label>
					<Select
						showSearch
						placeholder='Tìm theo tên hoặc email...'
						value={toUserId}
						onChange={setToUserId}
						onSearch={handleSearchUsers}
						filterOption={false}
						loading={userSearching}
						options={userOptions}
						style={{ width: '100%' }}
						notFoundContent={userSearching ? <Spin size='small' /> : 'Nhập ít nhất 2 ký tự để tìm'}
					/>
				</div>

				<div className={styles.dateRow}>
					<div className={styles.fieldGroup}>
						<label>
							Từ ngày <span className={styles.required}>*</span>
						</label>
						<DatePicker
							value={startDate}
							onChange={setStartDate}
							style={{ width: '100%' }}
							format='DD/MM/YYYY'
							placeholder='Chọn ngày'
						/>
					</div>
					<div className={styles.fieldGroup}>
						<label>
							Đến ngày <span className={styles.required}>*</span>
						</label>
						<DatePicker
							value={endDate}
							onChange={setEndDate}
							style={{ width: '100%' }}
							format='DD/MM/YYYY'
							placeholder='Chọn ngày'
							disabledDate={(d) => !!startDate && d.isBefore(startDate, 'day')}
						/>
					</div>
				</div>

				<div className={styles.fieldGroup}>
					<label>Phạm vi biểu mẫu</label>
					<Select
						mode='multiple'
						placeholder='Tất cả biểu mẫu'
						value={scopeFormIds}
						onChange={setScopeFormIds}
						options={formOptions}
						style={{ width: '100%' }}
						allowClear
					/>
				</div>

				<div className={styles.fieldGroup}>
					<label>Phạm vi quy trình</label>
					<Select
						mode='multiple'
						placeholder='Tất cả quy trình'
						value={scopeWorkflowIds}
						onChange={setScopeWorkflowIds}
						options={workflowOptions}
						style={{ width: '100%' }}
						allowClear
					/>
				</div>

				<div className={styles.toggleRow}>
					<Switch checked={isActive} onChange={setIsActive} />
					<span className={styles.toggleLabel}>Kích hoạt ngay</span>
				</div>

				{toUserId && startDate && endDate && (
					<div className={styles.summaryBox}>
						<span className={styles.summaryTitle}>TÓM TẮT</span>
						<span className={styles.summaryText}>
							<strong>
								{currentUser?.firstName} {currentUser?.lastName}
							</strong>{' '}
							ủy quyền phê duyệt
							{scopeFormIds.length > 0 || scopeWorkflowIds.length > 0 ? (
								<>
									{' '}
									({scopeFormIds.length > 0 && `${scopeFormIds.length} biểu mẫu`}
									{scopeFormIds.length > 0 && scopeWorkflowIds.length > 0 && ', '}
									{scopeWorkflowIds.length > 0 && `${scopeWorkflowIds.length} quy trình`})
								</>
							) : (
								' toàn bộ'
							)}{' '}
							cho <strong>{userOptions.find((u) => u.value === toUserId)?.label || '...'}</strong> từ{' '}
							{startDate.format('DD/MM/YYYY')} đến {endDate.format('DD/MM/YYYY')}.
						</span>
					</div>
				)}
			</Modal>

			<Modal
				visible={!!revokeTarget}
				onCancel={() => setRevokeTarget(null)}
				footer={null}
				width={400}
				centered
				closable={false}
				className={styles.revokeModal}
			>
				<div className={styles.revokeBody}>
					<div className={styles.revokeIconCircle}>
						<DeleteOutlined />
					</div>
					<h3>Thu hồi ủy quyền?</h3>
					<p>
						Ủy quyền cho <strong>{revokeTarget?.toUser?.username || revokeTarget?.toUser?.email || ''}</strong> sẽ bị thu
						hồi ngay lập tức. Hành động này không thể hoàn tác.
					</p>
					<div className={styles.revokeActions}>
						<button type='button' className={styles.cancelBtn} onClick={() => setRevokeTarget(null)} disabled={revoking}>
							Hủy
						</button>
						<button type='button' className={styles.dangerBtn} onClick={confirmRevoke} disabled={revoking}>
							<DeleteOutlined /> {revoking ? 'Đang thu hồi...' : 'Thu hồi'}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default DelegationsPage;
