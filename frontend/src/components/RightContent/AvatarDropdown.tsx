import logo from '@/assets/logo.png';
import { landingUrl } from '@/services/ant-design-pro/constant';
import { GlobalOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { type ItemType } from 'antd/lib/menu/hooks/useItems';
import React from 'react';
import { useModel } from 'umi';
import { OIDCBounder } from '../OIDCBounder';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
	menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
	const { initialState } = useModel('@@initialState');

	const loginOut = () => OIDCBounder.getActions()?.dangXuat();

	if (!initialState || !initialState.currentUser)
		return (
			<span className={`${styles.action} ${styles.account}`}>
				<Spin
					size='small'
					style={{
						marginLeft: 8,
						marginRight: 8,
					}}
				/>
			</span>
		);

	const items: ItemType[] = [
		{
			key: 'portal',
			icon: <GlobalOutlined />,
			label: 'Cổng thông tin',
			onClick: () => window.open(landingUrl),
		},
		{ type: 'divider', key: 'divider' },
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Đăng xuất',
			onClick: loginOut,
			danger: true,
		},
	];
	if (menu && initialState.currentUser.systemRole !== 'Admin') {
		// items.splice(1, 0, {
		//   key: 'password',
		//   icon: <LockOutlined />,
		//   label: 'Đổi mật khẩu',
		//   onClick: () =>
		//     window.open(
		//       keycloakAuthority +
		//         '/login-actions/required-action?execution=UPDATE_PASSWORD&client_id=' +
		//         keycloakClientID,
		//     ),
		// });
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
						src={
							<img
								// style={currentUser?.avatar_path ? {} : { objectFit: 'cover' }}
								src={logo}
							/>
						}
						alt='avatar'
					/>
					<span className={`${styles.name}`}>
						{initialState.currentUser?.fullname
							? initialState.currentUser.fullname
							: initialState.currentUser?.firstname
							? `${initialState.currentUser.firstname} ${initialState.currentUser?.lastname ?? ''}`
							: initialState.currentUser?.username || ''}
					</span>
				</span>
			</HeaderDropdown>
		</>
	);
};

export default AvatarDropdown;
