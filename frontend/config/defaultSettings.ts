import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
	pwa?: boolean;
	logo?: string;
	borderRadiusBase: string;
	siderWidth: number;
} = {
	navTheme: 'light',
	primaryColor: process.env.APP_CONFIG_PRIMARY_COLOR || '#4f46e5',
	borderRadiusBase: '8px',
	layout: 'side',
	contentWidth: 'Fluid',
	fixedHeader: false,
	fixSiderbar: true,
	colorWeak: false,
	title: 'FLOWFORM',
	pwa: false,
	logo: '/logo.png',
	iconfontUrl: '',
	headerTheme: 'light',
	headerHeight: 60,
	siderWidth: 220,
};

export default Settings;
