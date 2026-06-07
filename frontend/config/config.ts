// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';
// import proxy from './proxy';
// const { REACT_APP_ENV } = process.env;

const SITE_URL = process.env.APP_CONFIG_SITE_URL || '';
const SITE_TITLE = 'FlowForm — Quản lý biểu mẫu & quy trình phê duyệt';
const SITE_DESC =
	'Nền tảng quản lý biểu mẫu động, tự động hóa quy trình phê duyệt đa cấp, ủy quyền và thông báo thời gian thực cho tổ chức của bạn.';

export default defineConfig({
	devServer: {
		port: 8000,
	},
	hash: true,
	antd: {},
	dva: {
		hmr: true,
	},
	layout: {
		// https://umijs.org/zh-CN/plugins/plugin-layout
		locale: true,
		...defaultSettings,
	},
	// https://umijs.org/zh-CN/plugins/plugin-locale
	locale: {
		// enable: true,
		default: 'vi-VN',
		antd: true,
		// default true, when it is true, will use `navigator.language` overwrite default
		baseNavigator: false,
		// baseSeparator: '_',
	},
	dynamicImport: {
		loading: '@ant-design/pro-layout/es/PageLoading',
	},
	targets: {
		ie: 11,
	},
	routes,
	// Theme for antd: https://ant.design/docs/react/customize-theme-cn
	theme: {
		'primary-color': defaultSettings.primaryColor,
		'border-radius-base': defaultSettings.borderRadiusBase,
	},
	// esbuild is father build tools
	// https://umijs.org/plugins/plugin-esbuild
	esbuild: {},
	title: SITE_TITLE,
	favicon: '/favicon.ico',
	metas: [
		{ name: 'description', content: SITE_DESC },
		{ name: 'keywords', content: 'quản lý biểu mẫu, workflow, phê duyệt, form builder, FlowForm' },
		{ name: 'theme-color', content: '#4f46e5' },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:site_name', content: 'FlowForm' },
		{ property: 'og:title', content: SITE_TITLE },
		{ property: 'og:description', content: SITE_DESC },
		{ property: 'og:image', content: `${SITE_URL}/metadata.png` },
		{ property: 'og:url', content: SITE_URL || '/' },
		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:title', content: SITE_TITLE },
		{ name: 'twitter:description', content: SITE_DESC },
		{ name: 'twitter:image', content: `${SITE_URL}/metadata.png` },
	],
	ignoreMomentLocale: true,
	// proxy: proxy[REACT_APP_ENV || 'dev'],
	manifest: {
		basePath: '/',
	},
	// Fast Refresh 热更新
	fastRefresh: {},

	nodeModulesTransform: {
		type: 'none',
	},
	// mfsu: {},
	webpack5: {},
	exportStatic: {},
	define: Object.entries(process.env).reduce((result, [key, value]) => {
		if (key.startsWith('APP_CONFIG_')) {
			return {
				...result,
				[key]: value,
			};
		}
		return result;
	}, {}),
});
