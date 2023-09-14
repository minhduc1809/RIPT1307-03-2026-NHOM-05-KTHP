import { AppModules, EModuleKey } from '@/services/ant-design-pro/constant';

const ipRoot = 'https://gw.ript.vn/'; // ip prod
// const ipRoot = 'https://ais.aisenote.com/dev/'; // ip dev

const ip3 = ipRoot + 'tcns'; // ip dev
const ipNotif = ipRoot + 'notification'; // ip dev
const ipGlobal = 'https://ais2.aisenote.com/qldt-internal-api'; // ip dev

const currentRole = EModuleKey.TCNS;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = 'https://sso.ript.vn/realms/ript';
const resourceServerClientId = 'ript-auth';
const keycloakTokenEndpoint = 'https://sso.ript.vn/realms/ript/protocol/openid-connect/token';
const sentryDSN = 'https://75869bc5882ff3efdc90da60fc2e9e10@sentry.aisoftech.vn/7';

export {
	ip3,
	ipNotif,
	ipGlobal,
	currentRole,
	keycloakClientID,
	resourceServerClientId,
	keycloakTokenEndpoint,
	keycloakAuthority,
	sentryDSN,
};
