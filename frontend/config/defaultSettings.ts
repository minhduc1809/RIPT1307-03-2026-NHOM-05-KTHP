import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  borderRadiusBase: string;
  siderWidth: number;
} = {
  navTheme: 'light',
  primaryColor: '#007EB9',
  borderRadiusBase: '8px',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Tổ chức nhân sự VWA',
  pwa: false,
  logo: '/logo-full-white.svg',
  iconfontUrl: '',
  headerTheme: 'dark',
  headerHeight: 60,
  siderWidth: 220,
};

export default Settings;
