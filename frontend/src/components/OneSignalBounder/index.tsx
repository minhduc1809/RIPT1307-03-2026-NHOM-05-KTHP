import { initOneSignal } from '@/services/ant-design-pro/api';
import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';

const OneSignalBounder = (props: { children: React.ReactNode }) => {
	const [oneSignalId, setOneSignalId] = useState<string | null | undefined>();

	const getUserIdOnesignal = async () => {
		const id = await OneSignal.getUserId();
		setOneSignalId(id);
	};

	useEffect(() => {
		OneSignal.init({
			appId: 'f3857a81-2891-49be-87a7-903a4a1a54be',
		});

		getUserIdOnesignal();
	}, []);

	/**
	 * Handle OneSignal
	 */
	useEffect(() => {
		if (oneSignalId) initOneSignal({ playerId: oneSignalId });
	}, [oneSignalId]);

	return <>{props.children}</>;
};

export default OneSignalBounder;
