import {
	CameraOutlined,
	DeleteOutlined,
	EditOutlined,
	KeyOutlined,
	LoadingOutlined,
	PlusOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Form, Input, message, Modal, Select, Table, Tooltip, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import {
	assignRole,
	createUser,
	deleteUser,
	getMyProfile,
	getUsers,
	updateMyProfile,
	updateUser,
} from '@/services/Users/userApi';
import { uploadAvatar } from '@/services/Files/fileApi';
import { changePassword } from '@/services/base/authApi';
import type { IUser } from '@/services/Users/typings';
import styles from './index.less';

const { Option } = Select;

const ROLE_LABELS: Record<string, string> = {
	ADMIN: 'Quản trị viên',
	MANAGER: 'Quản lý',
	HR: 'Nhân sự',
	USER: 'Nhân viên',
};

const Profile: React.FC = () => {
	const { initialState, setInitialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const isAdmin = currentUser?.role === 'ADMIN';

	const [profileForm] = Form.useForm();
	const [updatingProfile, setUpdatingProfile] = useState(false);
	const [loadingProfile, setLoadingProfile] = useState(true);
	const [myProfile, setMyProfile] = useState<IUser | null>(null);
	const [uploadingAvatar, setUploadingAvatar] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [users, setUsers] = useState<IUser[]>([]);
	const [totalUsers, setTotalUsers] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

	const [isUserModalVisible, setIsUserModalVisible] = useState(false);
	const [editingUser, setEditingUser] = useState<IUser | null>(null);
	const [userForm] = Form.useForm();
	const [submittingUser, setSubmittingUser] = useState(false);

	const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
	const [selectedRoleUser, setSelectedRoleUser] = useState<IUser | null>(null);
	const [roleForm] = Form.useForm();
	const [submittingRole, setSubmittingRole] = useState(false);

	const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
	const [changePwForm] = Form.useForm();
	const [changingPassword, setChangingPassword] = useState(false);


	const fetchMyProfile = useCallback(async () => {
		try {
			const res = await getMyProfile();
			const data = (res as any)?.data?.data || (res as any)?.data;
			setMyProfile(data);
			profileForm.setFieldsValue({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email, // read-only in form
			});
		} catch (error) {
			console.error('Failed to fetch profile', error);
		} finally {
			setLoadingProfile(false);
		}
	}, [profileForm]);

	useEffect(() => {
		fetchMyProfile();
	}, [fetchMyProfile]);

	const handleUpdateProfile = async (values: any) => {
		setUpdatingProfile(true);
		try {
			const res = await updateMyProfile({
				firstName: values.firstName,
				lastName: values.lastName,
				picture: myProfile?.picture || undefined,
			});
			message.success('Cập nhật hồ sơ thành công');
			const updatedProfile = (res as any)?.data?.data || (res as any)?.data;
			setMyProfile(updatedProfile);
			setInitialState((s: any) => ({ ...s, currentUser: { ...s.currentUser, ...updatedProfile } }));
		} catch (error) {
			message.error('Cập nhật hồ sơ thất bại');
		} finally {
			setUpdatingProfile(false);
		}
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
		if (!allowedTypes.includes(file.type)) {
			message.error('Chỉ chấp nhận file ảnh PNG, JPEG, JPG');
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			message.error('Kích thước file không được vượt quá 10MB');
			return;
		}

		setUploadingAvatar(true);
		try {
			const uploadRes = await uploadAvatar(file);
			const uploadData = (uploadRes as any)?.data?.data || (uploadRes as any)?.data;
			const pictureUrl = uploadData?.url;

			if (!pictureUrl) {
				message.error('Upload ảnh thất bại');
				return;
			}

			const updatedProfile = { ...myProfile, picture: pictureUrl };
			setMyProfile(updatedProfile as any);
			setInitialState((s: any) => ({ ...s, currentUser: { ...s.currentUser, picture: pictureUrl } }));
			message.success('Cập nhật ảnh đại diện thành công');
		} catch (error) {
			console.error('Avatar upload failed:', error);
			message.error('Cập nhật ảnh đại diện thất bại');
		} finally {
			setUploadingAvatar(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};


	const fetchUsers = useCallback(async () => {
		if (!isAdmin) return;
		setLoadingUsers(true);
		try {
			const res = await getUsers({ page, limit, role: roleFilter });
			
			const data = (res as any)?.data?.data || (res as any)?.data || res;
			
			const items = data?.items || data?.result || (Array.isArray(data) ? data : []);
			const total = data?.meta?.total || data?.total || items.length;
			
			setUsers(items);
			setTotalUsers(total);
		} catch (error) {
			console.error('Failed to fetch users', error);
		} finally {
			setLoadingUsers(false);
		}
	}, [isAdmin, page, limit, roleFilter]);

	useEffect(() => {
		if (isAdmin) {
			fetchUsers();
		}
	}, [fetchUsers, isAdmin]);

	const handleOpenUserModal = (user?: IUser) => {
		if (user) {
			setEditingUser(user);
			userForm.setFieldsValue({
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
			});
		} else {
			setEditingUser(null);
			userForm.resetFields();
		}
		setIsUserModalVisible(true);
	};

	const handleSubmitUser = async (values: any) => {
		setSubmittingUser(true);
		try {
			if (editingUser) {
				await updateUser(editingUser.id, {
					email: values.email,
					firstName: values.firstName,
					lastName: values.lastName,
					role: values.role,
				});
				message.success('Cập nhật người dùng thành công');
			} else {
				await createUser({
					email: values.email,
					username: values.username,
					password: values.password,
					firstName: values.firstName,
					lastName: values.lastName,
					role: values.role,
				});
				message.success('Tạo người dùng thành công');
			}
			setIsUserModalVisible(false);
			fetchUsers();
		} catch (error: any) {
			const errorMsg = error?.response?.data?.message;
			const displayMsg = Array.isArray(errorMsg) 
				? errorMsg.join(', ')
				: (typeof errorMsg === 'string' ? errorMsg : 'Có lỗi xảy ra');
			message.error(displayMsg);
		} finally {
			setSubmittingUser(false);
		}
	};

	const handleDeleteUser = (user: IUser) => {
		Modal.confirm({
			title: 'Xóa người dùng',
			content: `Bạn có chắc chắn muốn xóa người dùng ${user.email}?`,
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await deleteUser(user.id);
					message.success('Xóa người dùng thành công');
					fetchUsers();
				} catch (error) {
					message.error('Xóa người dùng thất bại');
				}
			},
		});
	};

	const handleOpenRoleModal = (user: IUser) => {
		setSelectedRoleUser(user);
		roleForm.setFieldsValue({ role: user.role });
		setIsRoleModalVisible(true);
	};

	const handleSubmitRole = async (values: any) => {
		if (!selectedRoleUser) return;
		setSubmittingRole(true);
		try {
			await assignRole(selectedRoleUser.id, { role: values.role });
			message.success('Gán vai trò thành công');
			setIsRoleModalVisible(false);
			fetchUsers();
		} catch (error) {
			message.error('Gán vai trò thất bại');
		} finally {
			setSubmittingRole(false);
		}
	};


	const handleChangePassword = async (values: { oldPassword: string; newPassword: string }) => {
		setChangingPassword(true);
		try {
			await changePassword(values.oldPassword, values.newPassword);
			message.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
			setIsChangePasswordVisible(false);
			changePwForm.resetFields();
			setTimeout(() => {
				localStorage.clear();
				window.location.href = '/user/login';
			}, 1000);
		} catch (error: any) {
			const errorMsg = error?.response?.data?.message;
			if (typeof errorMsg === 'string') {
				message.error(errorMsg);
			} else {
				message.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
			}
		} finally {
			setChangingPassword(false);
		}
	};

	const roleBadgeClass = (role?: string) =>
		role === 'ADMIN' ? styles.admin : role === 'MANAGER' ? styles.manager : role === 'HR' ? styles.hr : styles.user;

	const columns: ColumnsType<IUser> = [
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			render: (email: string) => <span className={styles.emailCell}>{email}</span>,
		},
		{
			title: 'Tên',
			key: 'name',
			width: 190,
			render: (_: any, record: IUser) => (
				<span className={styles.nameCell}>
					{record.firstName || record.lastName
						? `${record.lastName || ''} ${record.firstName || ''}`.trim()
						: record.username}
				</span>
			),
		},
		{
			title: 'Vai trò',
			dataIndex: 'role',
			key: 'role',
			width: 150,
			render: (role: string) => (
				<span className={`${styles.roleBadge} ${roleBadgeClass(role)}`}>{ROLE_LABELS[role] || role}</span>
			),
		},
		{
			title: 'Thao tác',
			key: 'actions',
			width: 110,
			render: (_: any, record: IUser) => (
				<div className={styles.actionBtns}>
					<Tooltip title='Cập nhật'>
						<button type='button' className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleOpenUserModal(record)}>
							<EditOutlined />
						</button>
					</Tooltip>
					<Tooltip title='Gán vai trò'>
						<button type='button' className={`${styles.actionBtn} ${styles.roleBtn}`} onClick={() => handleOpenRoleModal(record)}>
							<KeyOutlined />
						</button>
					</Tooltip>
					{record.id !== myProfile?.id && (
						<Tooltip title='Xóa'>
							<button type='button' className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDeleteUser(record)}>
								<DeleteOutlined />
							</button>
						</Tooltip>
					)}
				</div>
			),
		},
	];

	if (loadingProfile) {
		return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Spin size="large" /></div>;
	}

	return (
		<div className={styles.profilePage}>
			<div className={styles.layoutRow}>
				<div className={styles.profileCard}>
					<div className={styles.avatarWrapper}>
						<Avatar className={styles.avatar} src={myProfile?.picture} icon={!myProfile?.picture && <UserOutlined />} />
						{uploadingAvatar && (
							<div className={styles.avatarOverlay}>
								<LoadingOutlined style={{ fontSize: 24, color: '#fff' }} />
							</div>
						)}
						<div className={styles.editAvatarBtn} onClick={handleAvatarClick}>
							<CameraOutlined />
						</div>
						<input
							type='file'
							ref={fileInputRef}
							style={{ display: 'none' }}
							accept='image/png,image/jpeg,image/jpg'
							onChange={handleAvatarChange}
						/>
					</div>
					<div className={styles.userName}>
						{myProfile?.firstName || myProfile?.lastName
							? `${myProfile?.lastName || ''} ${myProfile?.firstName || ''}`.trim()
							: myProfile?.username}
					</div>
					<div className={styles.userEmail}>{myProfile?.email}</div>
					<span className={`${styles.roleBadge} ${roleBadgeClass(myProfile?.role)}`}>
						{ROLE_LABELS[myProfile?.role || ''] || myProfile?.role}
					</span>

					<div className={styles.divider} />

					<Form form={profileForm} layout='vertical' onFinish={handleUpdateProfile} className={styles.profileFields}>
						<Form.Item label='Họ' name='lastName'>
							<Input placeholder='Nhập họ' />
						</Form.Item>
						<Form.Item label='Tên' name='firstName'>
							<Input placeholder='Nhập tên' />
						</Form.Item>
						<div className={styles.btnRow}>
							<button type='button' className={styles.btnSecondary} onClick={() => setIsChangePasswordVisible(true)}>
								<KeyOutlined /> Đổi mật khẩu
							</button>
							<Button type='primary' htmlType='submit' className={styles.btnPrimary} loading={updatingProfile}>
								Lưu thay đổi
							</Button>
						</div>
					</Form>
				</div>

				{isAdmin && (
					<div className={styles.userMgmtCard}>
						<div className={styles.mgmtHeader}>
							<h2>Quản lý người dùng</h2>
							<div className={styles.mgmtActions}>
								<div className={styles.roleFilter}>
									<Select
										placeholder='Tất cả vai trò'
										allowClear
										value={roleFilter}
										style={{ width: 140 }}
										onChange={(val) => { setRoleFilter(val); setPage(1); }}
									>
										<Option value='ADMIN'>Quản trị viên</Option>
										<Option value='MANAGER'>Quản lý</Option>
										<Option value='HR'>Nhân sự</Option>
										<Option value='USER'>Nhân viên</Option>
									</Select>
								</div>
								<Button type='primary' icon={<PlusOutlined />} className={styles.addUserBtn} onClick={() => handleOpenUserModal()}>
									Thêm người dùng
								</Button>
							</div>
						</div>

						<div className={styles.usersTableWrapper}>
							<Table
								columns={columns}
								dataSource={users}
								rowKey='id'
								loading={loadingUsers}
								scroll={{ x: 800 }}
								pagination={{
									current: page,
									pageSize: limit,
									total: totalUsers,
									showSizeChanger: true,
									onChange: (p, s) => { setPage(p); setLimit(s || 10); },
									showTotal: (t, range) => `Hiển thị ${range[0]}–${range[1]} trên ${t} người dùng`,
								}}
							/>
						</div>
					</div>
				)}
			</div>

			<Modal
				title={editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
				visible={isUserModalVisible}
				onCancel={() => setIsUserModalVisible(false)}
				onOk={() => userForm.submit()}
				confirmLoading={submittingUser}
				destroyOnClose
			>
				<Form form={userForm} layout="vertical" onFinish={handleSubmitUser}>
					{!editingUser && (
						<Form.Item name="username" label="Username" rules={[{ required: true, min: 3, message: 'Username phải có ít nhất 3 ký tự' }]}>
							<Input placeholder="Nhập username" />
						</Form.Item>
					)}
					<Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
						<Input placeholder="Nhập email" />
					</Form.Item>
					{!editingUser && (
						<Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }]}>
							<Input.Password placeholder="Nhập mật khẩu" />
						</Form.Item>
					)}
					<Form.Item name="lastName" label="Họ">
						<Input placeholder="Nhập họ" />
					</Form.Item>
					<Form.Item name="firstName" label="Tên">
						<Input placeholder="Nhập tên" />
					</Form.Item>
					<Form.Item name="role" label="Vai trò" initialValue="USER">
						<Select>
							<Option value="ADMIN">Admin</Option>
							<Option value="MANAGER">Manager</Option>
							<Option value="HR">HR</Option>
							<Option value="USER">User</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title="Gán vai trò"
				visible={isRoleModalVisible}
				onCancel={() => setIsRoleModalVisible(false)}
				onOk={() => roleForm.submit()}
				confirmLoading={submittingRole}
				destroyOnClose
			>
				<p>Thay đổi vai trò cho người dùng: <strong>{selectedRoleUser?.email}</strong></p>
				<Form form={roleForm} layout="vertical" onFinish={handleSubmitRole}>
					<Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
						<Select>
							<Option value="ADMIN">Admin</Option>
							<Option value="MANAGER">Manager</Option>
							<Option value="HR">HR</Option>
							<Option value="USER">User</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title="Đổi mật khẩu"
				visible={isChangePasswordVisible}
				onCancel={() => { setIsChangePasswordVisible(false); changePwForm.resetFields(); }}
				footer={null}
				destroyOnClose
				centered
			>
				<Form form={changePwForm} layout="vertical" onFinish={handleChangePassword}>
					<Form.Item
						name="oldPassword"
						label="Mật khẩu hiện tại"
						rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
					>
						<Input.Password placeholder="Nhập mật khẩu hiện tại" />
					</Form.Item>
					<Form.Item
						name="newPassword"
						label="Mật khẩu mới"
						rules={[
							{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
							{ min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
						]}
					>
						<Input.Password placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)" />
					</Form.Item>
					<Form.Item
						name="confirmPassword"
						label="Xác nhận mật khẩu mới"
						dependencies={['newPassword']}
						rules={[
							{ required: true, message: 'Vui lòng xác nhận mật khẩu!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('newPassword') === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
								},
							}),
						]}
					>
						<Input.Password placeholder="Nhập lại mật khẩu mới" />
					</Form.Item>
					<div style={{ textAlign: 'right', marginTop: 8 }}>
						<Button onClick={() => { setIsChangePasswordVisible(false); changePwForm.resetFields(); }} style={{ marginRight: 8 }}>
							Hủy
						</Button>
						<Button type="primary" htmlType="submit" loading={changingPassword}>
							Đổi mật khẩu
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default Profile;
