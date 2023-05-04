import Keycloak from 'keycloak-js';
import { keycloakClientID } from './utils/ip';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
  url: 'keycloakUrl',
  realm: 'vwa',
  clientId: keycloakClientID,
});

export default keycloak;
