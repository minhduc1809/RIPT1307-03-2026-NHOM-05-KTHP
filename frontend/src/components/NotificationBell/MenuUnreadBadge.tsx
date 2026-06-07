import React, { useEffect, useState } from 'react';
import { getUnread, subscribeUnread } from './unreadStore';

const MenuUnreadBadge: React.FC = () => {
	const [count, setCount] = useState(getUnread());

	useEffect(() => subscribeUnread(setCount), []);

	if (!count) return null;
	return <span className='ds-menu-notif-badge'>{count > 99 ? '99+' : count}</span>;
};

export default MenuUnreadBadge;
