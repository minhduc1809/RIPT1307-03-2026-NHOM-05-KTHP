declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'bizcharts-plugin-slider';

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

declare const APP_CONFIG_IP_ROOT: string;
declare const APP_CONFIG_IP_GLOBAL: string;
declare const APP_CONFIG_PRIMARY_COLOR: string;
declare const APP_CONFIG_LANDING_URL: string;
declare const APP_CONFIG_TEN_PHAN_HE: string;
declare const APP_CONFIG_ONE_SIGNAL_ID: string;
declare const APP_CONFIG_SENTRY_DSN: string;
declare const APP_CONFIG_KEYCLOAK_AUTHORITY: string;
declare const APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID: string;
declare const APP_CONFIG_KEYCLOAK_TOKEN_ENDPOINT_ID: string;
declare const APP_CONFIG_TEN_TRUONG: string;
declare const APP_CONFIG_TIEN_TO_TRUONG: string;
declare const APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH: string;
declare const APP_CONFIG_VERCEL_TEAM: string;
