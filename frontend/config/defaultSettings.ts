import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
	pwa?: boolean;
	logo?: string;
	borderRadiusBase: string;
	siderWidth: number;
} = {
	navTheme: 'dark',
	primaryColor: '#007EB9',
	borderRadiusBase: '2px',
	layout: 'mix',
	contentWidth: 'Fluid',
	fixedHeader: false,
	fixSiderbar: true,
	colorWeak: false,
	title: 'Tổ chức nhân sự',
	pwa: false,
	logo: '/logo.png',
	iconfontUrl: '',
	headerTheme: 'dark',
	headerHeight: 60,
	siderWidth: 220,
};

export default Settings;
