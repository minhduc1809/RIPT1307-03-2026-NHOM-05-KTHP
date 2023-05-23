import { AppModules, EModuleKey } from '@/services/ant-design-pro/constant';

// const ip3 = 'https://dhs.ptit.edu.vn/odoo-user-service'; // ip prod
// const ip = 'https://dhs.ptit.edu.vn'; // ip prod

const ip3 = 'https://ais.aisenote.com/tcns'; // ip dev
const ipGlobal = 'https://ais2.aisenote.com/qldt-internal-api'; // ip dev

const currentRole = EModuleKey.TCNS;

const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = 'https://ais.aisenote.com/keycloak/realms/vwa';
const resourceServerClientId = 'vwa-auth';
const keycloakTokenEndpoint =
  'https://ais.aisenote.com/keycloak/realms/vwa/protocol/openid-connect/token';

export {
  ip3,
  ipGlobal,
  currentRole,
  keycloakClientID,
  resourceServerClientId,
  keycloakTokenEndpoint,
  keycloakAuthority,
};
