import { EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev

// Ip Chính => Mặc định dùng trong các useInitModel
const ip3 = ipRoot; // ip dev

// Ip khác
const ipNotif = ipRoot + 'notification'; // ip dev
const ipSlink = ipRoot + 'slink'; // ip dev

const currentRole = EModuleKey.CONNECT;
const oneSignalRole = EModuleKey.CONNECT;


const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;

export {
	ip3,
	ipNotif,
	ipSlink,
	currentRole,
	oneSignalRole,

	sentryDSN,
	oneSignalClient,
};
