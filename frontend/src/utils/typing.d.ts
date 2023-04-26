import type { Settings as LayoutSettings } from '@ant-design/pro-layout';

export interface IInitialState {
  settings?: Partial<LayoutSettings>;
  currentUser?: Login.User | any;
  fetchUserInfo?: () => Promise<Login.User | undefined>;
  authorizedRoles?: any[];
}
