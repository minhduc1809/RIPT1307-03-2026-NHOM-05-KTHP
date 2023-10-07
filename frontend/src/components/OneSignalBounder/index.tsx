import { initOneSignal } from '@/services/base/api';
import { oneSignalClient } from '@/utils/ip';
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
			appId: oneSignalClient,
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
