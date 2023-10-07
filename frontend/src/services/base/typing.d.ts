import { type EModuleKey } from './constant';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';

declare module Login {
	export interface User {
		createdAt: string; //'2023-04-18T07:59:56.850Z';
		dob: string; // null;
		email: string; // 'admin@administrator.com';
		firstname: string; //null;
		fullname: string; // 'Administrator';
		gender: string; // null;
		lastname: string; // null;
		ssoId: string; // null;
		systemRole: string; // 'Admin';
		updatedAt: string; //'2023-04-18T07:59:56.850Z';
		username: string; // 'admin';
		roles?: string[];
		_id: string; // '643e4dfc013057d9f766d613';
	}

	export type Profile = any;

	export interface IPermission {
		scopes: string[]; //['cong-tac-sinh-vien:ho-so'];
		rsid: string; // '8f2c194a-fdfc-49e2-a3ba-a0af0325ecd4';
		rsname: EModuleKey; // 'cong-tac-sinh-vien';
	}

	export type TModule = {
		title: string;
		clientId: string;
		url?: string;
		icon?: string;
	};
}

export interface IInitialState {
	settings?: Partial<LayoutSettings>;
	currentUser?: Login.User;
	// fetchUserInfo?: () => Promise<Login.User | undefined>;
	authorizedPermissions?: Login.IPermission[];
}
