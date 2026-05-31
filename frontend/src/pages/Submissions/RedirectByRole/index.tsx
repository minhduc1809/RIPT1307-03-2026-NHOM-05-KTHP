import React, { useEffect } from 'react';
import { history, useModel } from 'umi';

const RedirectByRole: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const role = initialState?.currentUser?.role;

	useEffect(() => {
		const canApprove = role === 'ADMIN' || role === 'MANAGER' || role === 'HR';
		if (canApprove) {
			history.replace('/submissions/pending');
		} else {
			history.replace('/submissions/mine');
		}
	}, [role]);

	return null;
};

export default RedirectByRole;
