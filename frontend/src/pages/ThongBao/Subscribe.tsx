import { initOneSignal } from '@/services/base/api';
import { unitName } from '@/services/base/constant';
import { useEffect } from 'react';

import OneSignal from 'react-onesignal';

const SubscribeOneSignal = () => {


	useEffect(() => {
		document.title = `Đăng ký nhận thông báo | ${unitName.toUpperCase()}`;
	}, []);

	/**
	 * Init OneSignal playerId with auth User
	 */
	useEffect(() => {
		if (localStorage.getItem('token'))
			OneSignal.getUserId().then((playerId) => {
				// Init playerId to Back-end and Close popup window
				if (playerId)
					initOneSignal({ playerId }).then(() => {
						window.opener = null;
						window.open('', '_self');
						window.close();
					});
			});
	}, []);

	// TODO: Update UI
	return <div>SubscribeOneSignal</div>;
};

export default SubscribeOneSignal;
