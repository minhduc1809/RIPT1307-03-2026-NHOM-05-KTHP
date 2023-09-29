import { type Login } from './typings';

export enum EModuleKey {
	CONNECT = 'cong-hoc-vien',
	CONG_CAN_BO = 'cong-can-bo',
	QLDT = 'quan-ly-dao-tao',
	CORE = 'danh-muc-chung',
	TCNS = 'to-chuc-nhan-su',
	CTSV = 'cong-tac-sinh-vien',
	VPS = 'van-phong-so',
	TC = 'tai-chinh',
	QLKH = 'quan-ly-khoa-hoc',
}

export const AppModules: Record<EModuleKey, Login.TModule> = {
	[EModuleKey.CONNECT]: {
		title: 'Cổng người học',
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}connect`,
		url: `https://connect-${APP_CONFIG_VERCEL_TEAM}.vercel.app/`,
		icon: EModuleKey.CONNECT + '.svg',
	},
	[EModuleKey.CONG_CAN_BO]: {
		title: 'Cổng cán bộ',
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}connect`,
		url: `https://cong-can-bo-${APP_CONFIG_VERCEL_TEAM}.vercel.app/`,
		icon: EModuleKey.CONG_CAN_BO + '.svg',
	},
	[EModuleKey.CORE]: {
		title: 'Danh mục chung',
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}core`,
		url: `https://core-${APP_CONFIG_VERCEL_TEAM}.vercel.app/`,
		icon: EModuleKey.CORE + '.svg',
	},
	[EModuleKey.QLDT]: {
		title: 'Quản lý đào tạo',
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qldt`,
		url: `https://qldt-${APP_CONFIG_VERCEL_TEAM}.vercel.app/`,
		icon: EModuleKey.QLDT + '.svg',
	},
	[EModuleKey.TCNS]: {
		title: 'Tổ chức nhân sự',
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}tcns`,
		url: `https://tcns-${APP_CONFIG_VERCEL_TEAM}.vercel.app/`,
		icon: EModuleKey.TCNS + '.svg',
	},
	[EModuleKey.CTSV]: {
		title: 'Công tác sinh viên',
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}ctsv`,
		url: `https://ctsv-${APP_CONFIG_VERCEL_TEAM}.vercel.app/`,
		icon: EModuleKey.CTSV + '.svg',
	},
	[EModuleKey.VPS]: {
		title: 'Văn phòng số',
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}vps`,
		url: `https://van-phong-so-${APP_CONFIG_VERCEL_TEAM}.vercel.app/`,
		icon: EModuleKey.VPS + '.svg',
	},
	[EModuleKey.QLKH]: {
		title: 'Quản lý khoa học',
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qlkh`,
		icon: EModuleKey.QLKH + '.svg',
	},
	[EModuleKey.TC]: {
		title: 'Tài chính',
		clientId: `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}tc`,
		url: `https://tai-chinh-${APP_CONFIG_VERCEL_TEAM}.vercel.app/`,
		icon: EModuleKey.TC + '.svg',
	},
};

/** Đường link landing page */
export const landingUrl = APP_CONFIG_LANDING_URL;

/** Màu sắc chủ đạo */
export const primaryColor = APP_CONFIG_PRIMARY_COLOR;

/** Tên trường Học viện */
export const unitName = APP_CONFIG_TEN_TRUONG;

/** Trường / Học viện */
export const unitPrefix = APP_CONFIG_TIEN_TO_TRUONG;

/** Tên tiếng anh của trường */
export const tenTruongVietTatTiengAnh = APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH;
