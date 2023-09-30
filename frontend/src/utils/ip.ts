import { AppModules, EModuleKey } from '@/services/ant-design-pro/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev

const ip3 = ipRoot + 'tcns'; // ip dev
const ipNotif = ipRoot + 'notification'; // ip dev
const ipGlobal = 'https://ais2.aisenote.com/qldt-internal-api'; // ip dev

const currentRole = EModuleKey.TCNS;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = APP_CONFIG_KEYCLOAK_AUTHORITY;
const resourceServerClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}auth`;
const keycloakTokenEndpoint = APP_CONFIG_KEYCLOAK_TOKEN_ENDPOINT_ID;
const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;

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
