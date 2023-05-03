import { type Login } from './typings';

export enum EModuleKey {
  CONNECT = 'cong-hoc-vien',
  CONG_CAN_BO = 'cong-can-bo',
  QLDT = 'quan-ly-dao-tao',
  CORE = 'danh-muc-chung',
  TCNS = 'to-chuc-nhan-su',
  CTSV = 'cong-tac-sinh-vien',
}

export const AppModules: Record<string, Login.TModule> = {
  [EModuleKey.CONNECT]: {
    title: 'Cổng học viên',
    url: 'https://vwa-connect.vercel.app/',
    icon: EModuleKey.CONNECT + '.svg',
  },
  [EModuleKey.CONG_CAN_BO]: {
    title: 'Cổng cán bộ',
    url: 'https://vwa-connect.vercel.app/',
    icon: EModuleKey.CONG_CAN_BO + '.svg',
  },
  [EModuleKey.QLDT]: {
    title: 'Quản lý đào tạo',
    url: 'https://qldt-vwa.vercel.app/',
    icon: EModuleKey.QLDT + '.svg',
  },
  [EModuleKey.CORE]: {
    title: 'Danh mục chung',
    url: 'https://core-vwa.vercel.app/',
    icon: EModuleKey.CORE + '.svg',
  },
  [EModuleKey.TCNS]: {
    title: 'Tổ chức nhân sự',
    url: 'https://tcns-vwa.vercel.app/',
    icon: EModuleKey.TCNS + '.svg',
  },
  [EModuleKey.CTSV]: {
    title: 'Công tác sinh viên',
    url: 'https://tcns-vwa.vercel.app/',
    icon: EModuleKey.CTSV + '.svg',
  },
};
