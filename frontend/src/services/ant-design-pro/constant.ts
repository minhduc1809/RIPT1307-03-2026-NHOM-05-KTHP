import { type Login } from './typings';

export enum EModuleKey {
  CONNECT = 'cong-hoc-vien',
  CONG_CAN_BO = 'cong-can-bo',
  QLDT = 'quan-ly-dao-tao',
  CORE = 'danh-muc-chung',
  TCNS = 'to-chuc-nhan-su',
  CTSV = 'cong-tac-sinh-vien',
}

export const Modules: Record<string, Login.TModule> = {
  [EModuleKey.QLDT]: { title: 'Quản lý đào tạo', url: 'https://qldt-vwa.vercel.app/' },
  [EModuleKey.TCNS]: { title: 'Tổ chức nhân sự', url: 'https://tcns-vwa.vercel.app/' },
  [EModuleKey.CORE]: { title: 'Danh mục chung', url: 'https://core-vwa.vercel.app/' },
  [EModuleKey.CONNECT]: { title: 'Cổng học viên', url: 'https://vwa-connect.vercel.app/' },
};
