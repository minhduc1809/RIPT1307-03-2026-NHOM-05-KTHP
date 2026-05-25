import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	FilterOutlined,
	PlusOutlined,
	SearchOutlined,
	SortAscendingOutlined,
} from '@ant-design/icons';
import { Button, Input, message, Modal, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import { deleteForm, getActiveForms, getFormsPage } from '@/services/Forms/formApi';
import type { IForm, IFormPageRequest } from '@/services/Forms/typings';
import styles from './index.less';

const FormsDashboard: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const userRole = currentUser?.role;
	const isAdminOrManager = userRole && ['ADMIN', 'MANAGER'].includes(userRole);

	const [loading, setLoading] = useState(false);
	const [forms, setForms] = useState<IForm[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);

	/** ADMIN/MANAGER: POST /forms/page */
	const fetchFormsAdmin = useCallback(async () => {
		setLoading(true);
		try {
			const payload: IFormPageRequest = {
				page,
				limit,
				sort: { createdAt: 'desc' },
			};

			if (statusFilter !== undefined) {
				payload.condition = { isActive: statusFilter };
			}

			if (searchText.trim()) {
				payload.filters = [{ field: 'name', operator: 'contains', value: searchText.trim() }];
			}

			const response = await getFormsPage(payload);
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			setForms(data?.result ?? []);
			setTotal(data?.total ?? 0);
		} catch (error) {
			console.error('Failed to fetch forms:', error);
		} finally {
			setLoading(false);
		}
	}, [page, limit, searchText, statusFilter]);

	/** USER: GET /forms/many — chỉ form đang hoạt động */
	const fetchFormsUser = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getActiveForms();
			const data = (response as any)?.data?.data ?? (response as any)?.data;
			const allForms: IForm[] = Array.isArray(data) ? data : [];
			setForms(allForms);
			setTotal(allForms.length);
		} catch (error) {
			console.error('Failed to fetch active forms:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (isAdminOrManager) {
			fetchFormsAdmin();
		} else {
			fetchFormsUser();
		}
	}, [isAdminOrManager, fetchFormsAdmin, fetchFormsUser]);

	/** Client-side search cho USER (vì GET /forms/many không hỗ trợ filter) */
	const displayedForms = useMemo(() => {
		if (isAdminOrManager) return forms;
		if (!searchText.trim()) return forms;
		return forms.filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()));
	}, [forms, searchText, isAdminOrManager]);

	const handleSearch = (value: string) => {
		setSearchText(value);
		if (isAdminOrManager) {
			setPage(1);
		}
	};

	const handleDelete = (record: IForm) => {
		if (userRole !== 'ADMIN') {
			message.warning('Chỉ ADMIN mới có quyền xóa biểu mẫu');
			return;
		}

		Modal.confirm({
			title: 'Xác nhận xóa',
			content: (
				<span>
					Bạn có chắc chắn muốn xóa biểu mẫu <strong>{record.name}</strong>? Thao tác này không thể hoàn tác.
				</span>
			),
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await deleteForm(record.id);
					message.success('Đã xóa biểu mẫu thành công');
					fetchFormsAdmin();
				} catch (error) {
					message.error('Xóa biểu mẫu thất bại');
				}
			},
		});
	};

	const handleEdit = (record: IForm) => {
		history.push(`/forms/builder?id=${record.id}`);
	};

	const getFieldCount = (form: IForm): number => {
		return form.schema?.fields?.length ?? 0;
	};

	const columns: ColumnsType<IForm> = useMemo(() => {
		const cols: ColumnsType<IForm> = [
			{
				title: 'Tên biểu mẫu',
				dataIndex: 'name',
				key: 'name',
				render: (_: string, record: IForm) => (
					<div className={styles.formNameCell}>
						<div className={`${styles.formIcon} ${record.isActive ? styles.active : styles.inactive}`}>
							<EyeOutlined />
						</div>
						<div className={styles.formInfo}>
							<div className={styles.formTitle}>{record.name}</div>
							<div className={styles.formMeta}>
								{getFieldCount(record)} trường dữ liệu
								{record.description ? ` • ${record.description}` : ''}
							</div>
						</div>
					</div>
				),
			},
			{
				title: 'Ngày tạo',
				dataIndex: 'createdAt',
				key: 'createdAt',
				width: 160,
				render: (date: string) => (
					<span style={{ color: '#64748b', fontSize: 13 }}>{moment(date).format('DD/MM/YYYY')}</span>
				),
			},
			{
				title: 'Trạng thái',
				dataIndex: 'isActive',
				key: 'isActive',
				width: 160,
				render: (isActive: boolean, record: IForm) => {
					if (record.deletedAt) {
						return <span className={`${styles.statusTag} ${styles.deleted}`}>Đã xóa</span>;
					}
					return isActive ? (
						<span className={`${styles.statusTag} ${styles.active}`}>Đang hoạt động</span>
					) : (
						<span className={`${styles.statusTag} ${styles.inactive}`}>Đã vô hiệu</span>
					);
				},
			},
		];

		// Cột Thao tác — chỉ hiện cho ADMIN/MANAGER
		if (isAdminOrManager) {
			cols.push({
				title: 'Thao tác',
				key: 'actions',
				width: 140,
				align: 'right' as const,
				render: (_: any, record: IForm) => (
					<div className={styles.actionBtns}>
						<Tooltip title='Chỉnh sửa'>
							<button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={(e) => { e.stopPropagation(); handleEdit(record); }}>
								<EditOutlined style={{ fontSize: 16 }} />
							</button>
						</Tooltip>
						{userRole === 'ADMIN' && (
							<Tooltip title='Xóa'>
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

	// Stats computation
	const activeCount = forms.filter((f) => f.isActive && !f.deletedAt).length;
	const inactiveCount = forms.filter((f) => !f.isActive || f.deletedAt).length;

	return (
		<div className={styles.formDashboard}>
			{/* Header */}
			<div className={styles.headerSection}>
				<div className={styles.headerTitle}>
					<h1>{isAdminOrManager ? 'Danh sách biểu mẫu' : 'Biểu mẫu đang hoạt động'}</h1>
					<p>
						{isAdminOrManager
							? 'Quản lý và tinh chỉnh các biểu mẫu thu thập dữ liệu của bạn.'
							: 'Chọn biểu mẫu bạn muốn điền và gửi dữ liệu.'}
					</p>
				</div>
				{isAdminOrManager && (
					<Button
						type='primary'
						icon={<PlusOutlined />}
						className={styles.createBtn}
						onClick={() => history.push('/forms/builder')}
					>
						Tạo biểu mẫu mới
					</Button>
				)}
			</div>

			{/* Search & Filter Bar */}
			<div className={styles.searchFilterBar}>
				<div className={styles.searchInput}>
					<Input.Search
						placeholder='Tìm kiếm tên biểu mẫu...'
						prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
						onSearch={handleSearch}
						onChange={(e) => {
							if (!e.target.value) {
								setSearchText('');
								if (isAdminOrManager) setPage(1);
							}
						}}
						allowClear
						enterButton={false}
					/>
				</div>
				{isAdminOrManager && (
					<div className={styles.filterGroup}>
						<Button
							className={styles.filterBtn}
							icon={<FilterOutlined />}
							onClick={() => {
								if (statusFilter === undefined) {
									setStatusFilter(true);
								} else if (statusFilter === true) {
									setStatusFilter(false);
								} else {
									setStatusFilter(undefined);
								}
								setPage(1);
							}}
						>
							{statusFilter === undefined ? 'Lọc' : statusFilter ? 'Đang hoạt động' : 'Đã vô hiệu'}
						</Button>
						<Button className={styles.filterBtn} icon={<SortAscendingOutlined />}>
							Sắp xếp
						</Button>
					</div>
				)}
			</div>

			{/* Table */}
			<div className={styles.tableWrapper}>
				<Table<IForm>
					columns={columns}
					dataSource={displayedForms}
					loading={loading}
					rowKey='id'
					pagination={
						isAdminOrManager
							? {
									current: page,
									pageSize: limit,
									total,
									showSizeChanger: true,
									showTotal: (t, range) => `Hiển thị ${range[0]}-${range[1]} trong số ${t} biểu mẫu`,
									onChange: (p, ps) => {
										setPage(p);
										setLimit(ps ?? 10);
									},
							  }
							: {
									pageSize: 10,
									showTotal: (t, range) => `Hiển thị ${range[0]}-${range[1]} trong số ${t} biểu mẫu`,
							  }
					}
					onRow={(record) => ({
						style: { cursor: 'pointer' },
						onClick: () => handleEdit(record),
					})}
				/>
			</div>

			{/* Stats Bento Grid — chỉ cho ADMIN/MANAGER */}
			{isAdminOrManager && (
				<div className={styles.statsGrid}>
					<div className={styles.statCardPrimary}>
						<div style={{ position: 'relative', zIndex: 1 }}>
							<div className={styles.statLabel}>Tổng biểu mẫu</div>
							<div className={styles.statValue}>{total}</div>
							<div className={styles.statChange}>Tổng số biểu mẫu trong hệ thống</div>
						</div>
						<div className={styles.statBgIcon}>📊</div>
					</div>

					<div className={styles.statCard}>
						<div>
							<div className={styles.statIcon}>✅</div>
							<div className={styles.statTitle}>Đang hoạt động</div>
						</div>
						<div className={styles.statNumber}>{activeCount}</div>
					</div>

					<div className={`${styles.statCard} ${styles.light}`}>
						<div>
							<div className={styles.statIcon}>📋</div>
							<div className={styles.statTitle}>Không hoạt động</div>
						</div>
						<div className={styles.statNumber}>{inactiveCount}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FormsDashboard;
