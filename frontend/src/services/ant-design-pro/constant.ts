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
    clientId: 'vwa-connect',
    url: 'https://vwa-connect.vercel.app/',
    icon: EModuleKey.CONNECT + '.svg',
  },
  [EModuleKey.CONG_CAN_BO]: {
    title: 'Cổng cán bộ',
    clientId: 'vwa-connect',
    url: 'https://cong-can-bo-vwa.vercel.app/',
    icon: EModuleKey.CONG_CAN_BO + '.svg',
  },
  [EModuleKey.CORE]: {
    title: 'Danh mục chung',
    clientId: 'vwa-core',
    url: 'https://core-vwa.vercel.app/',
    icon: EModuleKey.CORE + '.svg',
  },
  [EModuleKey.QLDT]: {
    title: 'Quản lý đào tạo',
    clientId: 'vwa-qldt',
    url: 'https://qldt-vwa.vercel.app/',
    icon: EModuleKey.QLDT + '.svg',
  },
  [EModuleKey.TCNS]: {
    title: 'Tổ chức nhân sự',
    clientId: 'vwa-tcns',
    url: 'https://tcns-vwa.vercel.app/',
    icon: EModuleKey.TCNS + '.svg',
  },
  [EModuleKey.CTSV]: {
    title: 'Công tác sinh viên',
    clientId: 'vwa-ctsv',
    url: 'https://ctsv-vwa.vercel.app/',
    icon: EModuleKey.CTSV + '.svg',
  },
  [EModuleKey.VPS]: {
    title: 'Văn phòng số',
    clientId: 'vwa-vps',
    url: 'https://van-phong-so-vwa.vercel.app/',
    icon: EModuleKey.VPS + '.svg',
  },
  [EModuleKey.QLKH]: {
    title: 'Quản lý khoa học',
    clientId: 'vwa-qlkh',
    icon: EModuleKey.QLKH + '.svg',
  },
  [EModuleKey.TC]: {
    title: 'Tài chính',
    clientId: 'vwa-tc',
    url: 'https://tai-chinh-vwa.vercel.app/',
    icon: EModuleKey.TC + '.svg',
  },
};

export const landingUrl = 'https://landing-vwa-keycloak.vercel.app/';
