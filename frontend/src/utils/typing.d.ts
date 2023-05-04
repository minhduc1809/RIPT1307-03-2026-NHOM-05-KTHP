import { type Login } from '@/services/ant-design-pro/typings';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';

export interface IInitialState {
  settings?: Partial<LayoutSettings>;
  currentUser?: Login.User;
  // fetchUserInfo?: () => Promise<Login.User | undefined>;
  authorizedPermissions?: Login.IPermission[];
}
