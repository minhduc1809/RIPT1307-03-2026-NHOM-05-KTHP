import { landingUrl } from '@/services/base/constant';
import { logoutApi } from '@/services/base/api';
import { DownOutlined, FileWordOutlined, GlobalOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { type ItemType } from 'antd/lib/menu/hooks/useItems';
import React from 'react';
import { useModel, history } from 'umi';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
	menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
	const { initialState, setInitialState } = useModel('@@initialState');

	const loginOut = async () => {
		const refreshToken = localStorage.getItem('refreshToken');
		if (refreshToken) {
			try { await logoutApi(refreshToken); } catch { /* best effort */ }
		}
		localStorage.clear();
		sessionStorage.clear();
		await setInitialState((s: any) => ({ ...s, currentUser: undefined }));
		history.replace('/user/login');
	};

	if (!initialState || !initialState.currentUser)
		return (
			<span className={`${styles.action} ${styles.account}`}>
				<Spin size='small' style={{ marginLeft: 8, marginRight: 8 }} />
			</span>
		);

	const fullName = initialState.currentUser?.family_name
		? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
		: initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || '');
	const initials =
		fullName
			.split(' ')
			.filter(Boolean)
			.slice(-2)
			.map((w: string) => w[0]?.toUpperCase())
			.join('') || 'U';

	const ROLE_LABELS: Record<string, string> = {
		ADMIN: 'Quản trị viên',
		MANAGER: 'Quản lý',
		HR: 'Nhân sự',
		USER: 'Nhân viên',
	};
	const roleLabel = ROLE_LABELS[initialState.currentUser?.role] ?? '';

	const items: ItemType[] = [
		{
			key: 'profile',
			icon: <UserOutlined />,
			label: 'Hồ sơ cá nhân',
			onClick: () => window.location.href = '/profile',
		},
		// 		const redirect = window.location.href;
		// 		window.location.href = `${keycloakAuthEndpoint}?client_id=${AppModules[currentRole].clientId}&redirect_uri=${redirect}&response_type=code&scope=openid&kc_action=UPDATE_PASSWORD`;
		{ type: 'divider', key: 'divider' },
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Đăng xuất',
			onClick: loginOut,
			danger: true,
		},
	];

	if (menu && !initialState.currentUser.realm_access?.roles?.includes('QUAN_TRI_VIEN')) {
		//   onClick: () => history.push('/account/center'),
	}

	return (
		<>
			<HeaderDropdown overlay={<Menu className={styles.menu} items={items} />}>
				<span className={`${styles.action} ${styles.account}`}>
					{initialState.currentUser?.picture ? (
						<Avatar className={styles.avatar} src={<img src={initialState.currentUser?.picture} alt='avatar' />} />
					) : (
						<span className={styles.gradAvatar}>{initials}</span>
					)}
					<span className={styles.userCol}>
						<span className={styles.name}>{fullName}</span>
						{roleLabel && <span className={styles.role}>{roleLabel}</span>}
					</span>
					<DownOutlined className={styles.caret} />
				</span>
			</HeaderDropdown>
		</>
	);
};

export default AvatarDropdown;
