import React, { useEffect } from 'react';
import { history, useModel } from 'umi';

const RedirectByRole: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const role = initialState?.currentUser?.role;

	useEffect(() => {
		if (role === 'ADMIN' || role === 'MANAGER') {
			history.replace('/submissions/approval');
		} else {
			history.replace('/submissions/mine');
		}
	}, [role]);

	return null;
};

export default RedirectByRole;
