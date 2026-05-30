import React, { useEffect } from 'react';
import { history } from 'umi';

const RedirectByRole: React.FC = () => {
	useEffect(() => {
		history.replace('/submissions/mine');
	}, []);

	return null;
};

export default RedirectByRole;

