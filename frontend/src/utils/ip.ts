import { AppModules, EModuleKey } from '@/services/ant-design-pro/constant';

// const ipRoot = 'https://ais.aisenote.com/'; // ip prod
const ipRoot = 'https://ais.aisenote.com/dev/'; // ip dev

const ip3 = ipRoot + 'tcns'; // ip dev
const ipNotif = ipRoot + 'notification'; // ip dev
const ipGlobal = 'https://ais2.aisenote.com/qldt-internal-api'; // ip dev

const currentRole = EModuleKey.TCNS;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = ipRoot + 'keycloak/realms/vwa';
const resourceServerClientId = 'vwa-auth';
const keycloakTokenEndpoint = ipRoot + 'keycloak/realms/vwa/protocol/openid-connect/token';
const sentryDSN = 'https://ed934e521d476c44a89a42aaa8a6993a@sentry.aisoftech.vn/3';
const oneSignalClient = 'f3857a81-2891-49be-87a7-903a4a1a54be';

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
	oneSignalClient,
};
