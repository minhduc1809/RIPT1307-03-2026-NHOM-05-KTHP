import React from 'react';
import { useModel } from 'umi';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
	const { initialState } = useModel('@@initialState');

	if (!initialState || !initialState.currentUser) {
		return null;
	}

	return (
		<div className={styles.right}>
			<AvatarDropdown menu />
		</div>
	);
};

export default GlobalHeaderRight;
