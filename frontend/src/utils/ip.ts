import { AppModules, EModuleKey } from '@/services/ant-design-pro/constant';

// const ipRoot = 'https://ais.aisenote.com/'; // ip prod
const ipRoot = 'https://ais.aisenote.com/dev/'; // ip dev

const ip3 = ipRoot + 'tcns'; // ip dev
const ipNotif = ipRoot + 'notification'; // ip dev
const ipGlobal = 'https://ais2.aisenote.com/qldt-internal-api'; // ip dev

const currentRole = EModuleKey.TCNS;

const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = 'https://ais.aisenote.com/keycloak/realms/vwa';
const resourceServerClientId = 'vwa-auth';
const keycloakTokenEndpoint =
  'https://ais.aisenote.com/keycloak/realms/vwa/protocol/openid-connect/token';

export {
  ip3,
  ipNotif,
  ipGlobal,
  currentRole,
  keycloakClientID,
  resourceServerClientId,
  keycloakTokenEndpoint,
  keycloakAuthority,
};
