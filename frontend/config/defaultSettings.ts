import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  primaryColor: '#CC0D00',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Hệ Thống Đào Tạo Trực Tuyến Từ Xa',
  pwa: false,
  logo: '/favicon.ico',
  iconfontUrl: '',
};

export default Settings;
