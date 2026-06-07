import React, { useCallback, useEffect, useState } from 'react';
import { getPendingSubmissions } from '@/services/Submissions/submissionApi';
import { connectSocket, onSocketEvent, offSocketEvent } from '@/services/socket';

const PendingBadge: React.FC = () => {
	const [count, setCount] = useState(0);

	const fetchCount = useCallback(async () => {
		if (!localStorage.getItem('token')) return;
		try {
			const res = await getPendingSubmissions({ page: 1, limit: 1 });
			const data = (res as any)?.data?.data ?? (res as any)?.data;
			setCount(data?.meta?.total ?? data?.total ?? 0);
		} catch {
			setCount(0);
		}
	}, []);

	useEffect(() => {
		fetchCount();
		connectSocket();
		onSocketEvent('notification', fetchCount);
		return () => offSocketEvent('notification', fetchCount);
	}, [fetchCount]);

	if (!count) return null;
	return <span className='ds-menu-notif-badge'>{count > 99 ? '99+' : count}</span>;
};

export default PendingBadge;
