import { useAuthActions } from '@/hooks/useAuthActions';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { type ItemType } from 'antd/lib/menu/hooks/useItems';
import React from 'react';
import { useModel } from 'umi';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
	menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
	const { initialState } = useModel('@@initialState');
	const { dangXuat } = useAuthActions();

	if (!initialState || !initialState.currentUser)
		return (
			<span className={`${styles.action} ${styles.account}`}>
				<Spin size='small' style={{ marginLeft: 8, marginRight: 8 }} />
			</span>
		);

	const fullName = initialState.currentUser?.lastName
		? `${initialState.currentUser.lastName} ${initialState.currentUser?.firstName ?? ''}`.trim()
		: initialState.currentUser?.username || '';
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	const items: ItemType[] = [
		{
			key: 'profile',
			icon: <UserOutlined />,
			label: 'Hồ sơ cá nhân',
			onClick: () => window.location.href = '/profile',
		},
		// {
		// 	key: 'password',
		// 	icon: <SwapOutlined />,
		// 	label: 'Đổi mật khẩu',
		// 	onClick: () => {
		// 		const redirect = window.location.href;
		// 		window.location.href = `${keycloakAuthEndpoint}?client_id=${AppModules[currentRole].clientId}&redirect_uri=${redirect}&response_type=code&scope=openid&kc_action=UPDATE_PASSWORD`;
		// 	},
		// },
		{ type: 'divider', key: 'divider' },
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Đăng xuất',
			onClick: dangXuat,
			danger: true,
		},
	];

	if (menu && initialState.currentUser.role !== 'ADMIN') {
		// items.splice(1, 0, {
		//   key: 'center',
		//   icon: <UserOutlined />,
		//   label: 'Trang cá nhân',
		//   onClick: () => history.push('/account/center'),
		// });
	}

	return (
		<>
			<HeaderDropdown overlay={<Menu className={styles.menu} items={items} />}>
				<span className={`${styles.action} ${styles.account}`}>
					<Avatar
						className={styles.avatar}
						src={initialState.currentUser?.picture ? <img src={initialState.currentUser?.picture} /> : undefined}
						icon={!initialState.currentUser?.picture ? lastNameChar ?? <UserOutlined /> : undefined}
						alt='avatar'
					/>
					<span className={`${styles.name}`}>{fullName}</span>
				</span>
			</HeaderDropdown>
		</>
	);
};

export default AvatarDropdown;
