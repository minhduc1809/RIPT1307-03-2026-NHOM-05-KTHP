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
		clientId: 'ript-connect',
		url: 'https://slink.ript.vn/',
		icon: EModuleKey.CONNECT + '.svg',
	},
	[EModuleKey.CONG_CAN_BO]: {
		title: 'Cổng cán bộ',
		clientId: 'ript-connect',
		url: 'https://canbo.ript.vn/',
		icon: EModuleKey.CONG_CAN_BO + '.svg',
	},
	[EModuleKey.CORE]: {
		title: 'Danh mục chung',
		clientId: 'ript-core',
		url: 'https://core.ript.vn/',
		icon: EModuleKey.CORE + '.svg',
	},
	[EModuleKey.QLDT]: {
		title: 'Quản lý đào tạo',
		clientId: 'ript-qldt',
		url: 'https://daotao.ript.vn/',
		icon: EModuleKey.QLDT + '.svg',
	},
	[EModuleKey.TCNS]: {
		title: 'Tổ chức nhân sự',
		clientId: 'ript-tcns',
		url: 'https://nhansu.ript.vn/',
		icon: EModuleKey.TCNS + '.svg',
	},
	[EModuleKey.CTSV]: {
		title: 'Công tác sinh viên',
		clientId: 'ript-ctsv',
		url: 'https://ctsv.ript.vn/',
		icon: EModuleKey.CTSV + '.svg',
	},
	[EModuleKey.VPS]: {
		title: 'Văn phòng số',
		clientId: 'ript-vps',
		// url: 'https://van-phong-so-vwa-dev.vercel.app/',
		icon: EModuleKey.VPS + '.svg',
	},
	[EModuleKey.QLKH]: {
		title: 'Quản lý khoa học',
		clientId: 'ript-qlkh',
		icon: EModuleKey.QLKH + '.svg',
	},
	[EModuleKey.TC]: {
		title: 'Tài chính',
		clientId: 'ript-tc',
		url: 'https://thanhtoan.ript.vn/',
		icon: EModuleKey.TC + '.svg',
	},
};

/** Đường link landing page */
export const landingUrl = 'https://ript.vn/';

/** Màu sắc chủ đạo */
export const primaryColor = '#CC0D00';

/** Tên trường Học viện */
export const unitName = 'Viện Khoa học kỹ thuật bưu điện';
