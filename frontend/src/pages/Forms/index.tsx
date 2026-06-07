import {
	DeleteOutlined,
	DownloadOutlined,
	EditOutlined,
	EyeOutlined,
	FileTextOutlined,
	PlusOutlined,
	ReloadOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, message, Modal, Table, Tooltip, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import { deleteForm, getActiveForms, getFormsPage, updateForm } from '@/services/Forms/formApi';
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
	const [deleteTarget, setDeleteTarget] = useState<IForm | null>(null);
	const [deleting, setDeleting] = useState(false);

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
				payload.filters = [{ field: 'name', operator: 'contain', values: [searchText.trim()] }];
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
		setDeleteTarget(record);
	};

	const confirmDelete = async () => {
		if (!deleteTarget) return;
		setDeleting(true);
		try {
			await deleteForm(deleteTarget.id);
			message.success('Đã xóa biểu mẫu thành công');
			setDeleteTarget(null);
			fetchFormsAdmin();
		} catch (error) {
			message.error('Xóa biểu mẫu thất bại');
		} finally {
			setDeleting(false);
		}
	};

	const handleView = (record: IForm) => {
		history.push(`/forms/${record.id}`);
	};

	const handleEdit = (record: IForm) => {
		history.push(`/forms/${record.id}/edit`);
	};

	const handleToggleStatus = useCallback(async (checked: boolean, record: IForm) => {
		try {
			await updateForm(record.id, { isActive: checked });
			message.success(`Đã ${checked ? 'kích hoạt' : 'vô hiệu hóa'} biểu mẫu thành công`);
			fetchFormsAdmin();
		} catch (error) {
			message.error('Cập nhật trạng thái thất bại');
		}
	}, [fetchFormsAdmin]);

	const getFieldCount = (form: IForm): number => {
		return form.schema?.fields?.length ?? 0;
	};

	const columns: ColumnsType<IForm> = useMemo(() => {
		const cols: ColumnsType<IForm> = [
			{
				title: 'Tên biểu mẫu',
				dataIndex: 'name',
				key: 'name',
				render: (_: string, record: IForm) => {
					const iconState = record.deletedAt ? styles.deleted : record.isActive ? styles.active : styles.inactive;
					return (
						<div className={styles.formNameCell}>
							<div className={`${styles.formIcon} ${iconState}`}>
								<FileTextOutlined />
							</div>
							<div>
								<div className={styles.formTitle}>{record.name}</div>
								<div className={styles.formMeta}>
									{getFieldCount(record)} trường
									{record.description ? ` · ${record.description}` : ''}
								</div>
							</div>
						</div>
					);
				},
			},
			{
				title: 'Ngày tạo',
				dataIndex: 'createdAt',
				key: 'createdAt',
				width: 150,
				render: (date: string) => <span className={styles.dateCell}>{moment(date).format('DD/MM/YYYY')}</span>,
			},
			{
				title: 'Trạng thái',
				dataIndex: 'isActive',
				key: 'isActive',
				width: 150,
				render: (isActive: boolean, record: IForm) => {
					if (record.deletedAt) {
						return <span className={`${styles.statusTag} ${styles.deleted}`}>Đã xóa</span>;
					}
					
					if (isAdminOrManager) {
						return (
							<Switch
								checked={isActive}
								onChange={(checked, e) => {
									e.stopPropagation(); // Tránh sự kiện click vào row
									handleToggleStatus(checked, record);
								}}
								checkedChildren="Hoạt động"
								unCheckedChildren="Vô hiệu"
							/>
						);
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
						<Tooltip title='Xem chi tiết'>
							<button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={(e) => { e.stopPropagation(); handleView(record); }}>
								<EyeOutlined style={{ fontSize: 16 }} />
							</button>
						</Tooltip>
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
	}, [isAdminOrManager, userRole, handleToggleStatus]);

	return (
		<div className={styles.formDashboard}>
			{/* Header */}
			<div className={styles.headerSection}>
				<div className={styles.headerTitle}>
					<h1>{isAdminOrManager ? 'Quản lý biểu mẫu' : 'Biểu mẫu đang hoạt động'}</h1>
					<p>
						{isAdminOrManager
							? 'Tạo, chỉnh sửa và quản lý các biểu mẫu của tổ chức'
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
						Tạo biểu mẫu
					</Button>
				)}
			</div>

			{/* Toolbar */}
			<div className={styles.searchFilterBar}>
				<div className={styles.searchInput}>
					<Input
						placeholder='Tìm kiếm biểu mẫu...'
						prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
						onPressEnter={(e) => handleSearch(e.currentTarget.value)}
						onChange={(e) => {
							if (!e.target.value) {
								setSearchText('');
								if (isAdminOrManager) setPage(1);
							}
						}}
						allowClear
					/>
				</div>
				{isAdminOrManager && (
					<>
						<div className={styles.segmented}>
							{(
								[
									{ label: 'Tất cả', value: undefined },
									{ label: 'Đang hoạt động', value: true },
									{ label: 'Đã vô hiệu', value: false },
								] as { label: string; value: boolean | undefined }[]
							).map((opt) => (
								<button
									type='button'
									key={opt.label}
									className={`${styles.segBtn} ${statusFilter === opt.value ? styles.active : ''}`}
									onClick={() => {
										setStatusFilter(opt.value);
										setPage(1);
									}}
								>
									{opt.label}
								</button>
							))}
						</div>
						<div className={styles.toolbarSpacer} />
						<Tooltip title='Xuất danh sách'>
							<button
								type='button'
								className={styles.iconBtn}
								onClick={() => message.info('Tính năng xuất danh sách đang phát triển')}
							>
								<DownloadOutlined />
							</button>
						</Tooltip>
						<Tooltip title='Làm mới'>
							<button type='button' className={styles.iconBtn} onClick={() => fetchFormsAdmin()}>
								<ReloadOutlined />
							</button>
						</Tooltip>
					</>
				)}
			</div>

			{/* Table */}
			<div className={styles.tableWrapper}>
				<Table<IForm>
					columns={columns}
					dataSource={displayedForms}
					loading={loading}
					rowKey='id'
					scroll={{ x: 550 }}
					pagination={
						isAdminOrManager
							? {
									current: page,
									pageSize: limit,
									total,
									showSizeChanger: true,
									showTotal: (t, range) => `Hiển thị ${range[0]}–${range[1]} trên ${t} biểu mẫu`,
									onChange: (p, ps) => {
										setPage(p);
										setLimit(ps ?? 10);
									},
							  }
							: {
									pageSize: 10,
									showTotal: (t, range) => `Hiển thị ${range[0]}–${range[1]} trên ${t} biểu mẫu`,
							  }
					}
					onRow={(record) => ({
						style: { cursor: 'pointer' },
						onClick: () => handleView(record),
					})}
				/>
			</div>

			{/* Modal xác nhận xóa — design: smartadmin.pen frame 17 (confirmModal) */}
			<Modal
				visible={!!deleteTarget}
				onCancel={() => setDeleteTarget(null)}
				footer={null}
				width={400}
				centered
				closable={false}
				className={styles.deleteModal}
			>
				<div className={styles.deleteModalBody}>
					<div className={styles.deleteIconCircle}>
						<DeleteOutlined />
					</div>
					<h3>Xác nhận xóa biểu mẫu?</h3>
					<p>
						Biểu mẫu <strong>“{deleteTarget?.name}”</strong> sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
					</p>
					<div className={styles.deleteModalActions}>
						<button type='button' className={styles.cancelBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>
							Hủy
						</button>
						<button type='button' className={styles.dangerBtn} onClick={confirmDelete} disabled={deleting}>
							<DeleteOutlined /> {deleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default FormsDashboard;
