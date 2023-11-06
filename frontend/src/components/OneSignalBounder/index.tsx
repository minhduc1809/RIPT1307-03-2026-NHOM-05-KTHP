import { initOneSignal } from '@/services/base/api';
import { AppModules } from '@/services/base/constant';
import { currentRole, oneSignalClient, oneSignalRole } from '@/utils/ip';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import OneSignal from 'react-onesignal';

const OneSignalBounder = (props: { children: React.ReactNode }) => {
	const [oneSignalId, setOneSignalId] = useState<string | null | undefined>();
	const auth = useAuth();
	const iframeSource = AppModules[oneSignalRole].url;
	let iframe: HTMLIFrameElement | null = null;

	const getUserIdOnesignal = async () => {
		OneSignal.init({
			appId: oneSignalClient,
		});
		const id = await OneSignal.getUserId();
		setOneSignalId(id);
	};

	/** Gửi message đến trang chính sau khi handle OneSignal */
	const sendMessage = (isEnable: boolean) => {
		// console.log(`2 Mainsite is Sending Message to subdomain.site ${isEnable}`);
		const parsed = queryString.parse(window.location.search);
		// postMessage: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
		// && Object.values(AppModules).some((role) => role.url === parsed.source)
		if (parsed.source) window.parent.postMessage(isEnable, parsed.source.toString());
	};

	/** Nhận message từ trang handle OneSignal */
	const receiveMessage = (e: any) => {
		// console.log(`received message: ${e.data} from ${iframeSource}`);
		if (e.origin === iframeSource) {
			if (e.data === false) {
				// console.log('user not subscribed to mainsite, lets prompt');
				// TODO: Update UI
				window.open(`${iframeSource}notification/subscribe`, '_blank', 'width=400,height=400');
			}
		}
		if (iframe) iframe.remove();
	};

	useEffect(() => {
		// Nếu đây là trang handle OneSignal
		if (oneSignalRole.valueOf() === currentRole.valueOf()) getUserIdOnesignal();
		else if (iframeSource) {
			window.addEventListener('message', receiveMessage, false);
			iframe = document.createElement('iframe');
			iframe.setAttribute('src', `${iframeSource}notification/check?source=${window.location.origin}`);
			iframe.style.display = 'none';
			document.body.appendChild(iframe);
		}
	}, []);

	/**
	 * Init OneSignal playerId with auth User
	 * and Send message to request domain
	 */
	useEffect(() => {
		if (oneSignalId && auth.user?.access_token)
			initOneSignal({ playerId: oneSignalId }).then(() => {
				OneSignal.isPushNotificationsEnabled(sendMessage);
			});
	}, [oneSignalId, auth.user?.access_token]);

	return <>{props.children}</>;
};

export default OneSignalBounder;
