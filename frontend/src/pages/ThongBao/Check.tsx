import { useEffect, useState } from 'react';
import OneSignalReact from 'react-onesignal';

const CheckOneSignalSubscription = () => {
	const [oneSignalId, setOneSignalId] = useState<string | null | undefined>();

	useEffect(() => {
		OneSignalReact.getUserId().then((id) => {
			setOneSignalId(id);
		});
	}, []);

	return <>Hello {oneSignalId}</>;
};

export default CheckOneSignalSubscription;
