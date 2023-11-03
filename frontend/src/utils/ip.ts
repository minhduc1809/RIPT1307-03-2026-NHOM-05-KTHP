import { AppModules, EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev

const ip3 = ipRoot + 'tcns'; // ip dev
const ipNotif = ipRoot + 'notification'; // ip dev

const currentRole = EModuleKey.TCNS;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = APP_CONFIG_KEYCLOAK_AUTHORITY;
const resourceServerClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}auth`;
const keycloakAuthEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/auth';
const keycloakTokenEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/token';
const keycloakUserInfoEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/userinfo';
const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;

export {
	ip3,
	ipNotif,
	currentRole,
	keycloakClientID,
	resourceServerClientId,
	keycloakAuthEndpoint,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
	keycloakAuthority,
	sentryDSN,
	oneSignalClient,
};
