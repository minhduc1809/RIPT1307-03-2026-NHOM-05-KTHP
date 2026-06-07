import React from 'react';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import styles from './index.less';

/**
 * Nút hamburger floating — chỉ hiện trên mobile (≤768px via CSS).
 * Click để show/hide sidebar bằng cách cập nhật initialState.sidebarCollapsed.
 */
const MobileSidebarToggle: React.FC = () => {
	const { initialState, setInitialState } = useModel('@@initialState');
	const collapsed = (initialState as any)?.sidebarCollapsed ?? true;

	const toggle = () => {
		setInitialState((prev: any) => ({ ...prev, sidebarCollapsed: !collapsed }));
	};

	return (
		<button
			type='button'
			className={styles.toggleBtn}
			onClick={toggle}
			aria-label={collapsed ? 'Mở menu' : 'Đóng menu'}
		>
			{collapsed ? <MenuOutlined /> : <CloseOutlined />}
		</button>
	);
};

export default MobileSidebarToggle;
